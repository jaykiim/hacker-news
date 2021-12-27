/* 해커뉴스 앱을 타입스크립트로 포팅 (A언어에서 B언어로 전환) 해보자 */

// TODO 타입 정의 (타입 앨리어스 방식) ==============================================================

type Store = {
  currentPage: number;
  feeds: NewsFeed[];
};

type News = {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
};

// readonly 를 붙인 프로퍼티는 코드상에서 수정 불가하다.
// 예를 들어서 const newsFeed = getData(NEWS_URL) 로 뉴스 데이터를 받아온 후
// newsFeed.title = '안녕하세요' 라고 하면 바로 빨간 밑줄이 그어진다.

type NewsFeed = News & {
  // News 타입 상속
  readonly comments_count: number;
  readonly points: number;
  read?: boolean; // 이 속성이 있을 때도 있고 없을 때도 있다면 속성명 뒤에 물음표를 붙여준다
};

type NewsDetail = News & {
  readonly comments: NewsComment[];
};

type NewsComment = News & {
  readonly comments: NewsComment[];
  readonly level: number;
};

const container: HTMLElement | null = document.getElementById("root");
const ajax: XMLHttpRequest = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store: Store = {
  currentPage: 1,
  feeds: [],
};

// TODO 헬퍼 함수 =========================================================================

// GUIDE region < 인터페이스 방식으로 타입 정의하기 >
/* 

  interface Store {
    readonly currentPage: number;
    readonly feeds: NewsFeed[];
  };

  interface NewsDetail extends News {
    readonly comments: NewsComment[];
  };

  ? 타입 앨리어스와 차이점 ? 
  인터페이스 방식은 타입 두 개를 합치거나 유니온 타입 (A | B) 을 만들거나 
  인터섹션 타입을 만드는 것을 지원하지 않는다.

*/
// endregion

// GUIDE region < 제네릭 >
/* 
  // GUIDE 제네릭 
  
  * getData는 "뉴스 목록" (type: NewsFeed) or "뉴스 상세" (type: NewsDetail) 를 리턴하는데
  getData 함수를 사용하는 측의 코드 중에서 뉴스 목록을 받아오는 newsFeed 함수 내부의 코드를 보면 
  * NewsFeed[] 타입의 newsFeed 변수에 getData의 리턴값을 할당하고 있다. 

  근데 getData의 리턴값은 NewsFeed 일수도 있지만 NewsDetail 타입일수도 있다.
  그러면 조건문을 써서 getData의 타입이 NewsFeed 일때만 newsFeed 변수에 할당하도록 코드를 작성하면 될까?
  하지만 데이터 요청의 종류가 늘어나서 getData가 만약 30가지 타입을 리턴할수도 있다면?
  
  * 단일 타입의 변수에 -> 여러가지 타입을 리턴하는 함수의 리턴값을 할당해야하는 경우  
  * 함수를 사용하는 측에서 리턴값의 타입을 지정해주는 방법이 있다. 
  ? getData<NewsFeed>(props); --> getData의 리턴값은 NewsFeed 타입이어야 한다
  
  그럼 getData 함수에서 JSON.parse(ajax.response) 의 결과가 NewsFeed 타입이 맞는지 체크해준다.  
  이렇게 되려면 함수를 정의할때 다음과 같이 써줘야한다. 
  ? function getData<T>: T --> 리턴값의 타입은 사용하는 측으로부터 받겠다 

  이런 용법을 "제네릭" 이라고 한다.
  이건 제네릭의 가장 단순한 활용법이고, 훨씬 더 복잡하고 고난도의 표현법들도 많다.
*/
// endregion

function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function makeFeeds(feeds: NewsFeed[]): NewsFeed[] {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
}

// DO :: 타입 가드
function updateView(html: string): void {
  // 돔에서 root를 찾지 못할 경우 container는 null이 될 수도 있으므로
  // container가 존재할 때만 innerHTML 속성을 사용하도록 "타입 가드" 코드를 꼭 작성하기
  if (container) {
    container.innerHTML = html;
  } else {
    console.error(
      "최상위 컨테이너가 존재하지 않으므로 UI 생성에 실패하였습니다."
    );
  }

  // 리턴값이 없을 땐 리턴값의 타입 정의를 void라고 해주면 된다
}

// TODO 뉴스 목록 =========================================================================

function newsFeed(): void {
  let newsFeed: NewsFeed[] = store.feeds;
  const newsList = [];

  // HACK HTML (nav)

  let template = /*html*/ `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>(NEWS_URL));
  }

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // HACK HTML (list)

    newsList.push(/*html*/ `
      <div class="p-6 ${
        newsFeed[i].read ? "bg-gray-500" : "bg-white"
      } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
      <div class="flex">
        <div class="flex-auto">
          <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
        </div>
        <div class="text-center text-sm">
          <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
            newsFeed[i].comments_count
          }</div>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="grid grid-cols-3 text-sm text-gray-500">
          <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
          <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
          <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
        </div>  
      </div>
    </div>    
    `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));

  template = template.replace(
    "{{__prev_page__}}",
    String(store.currentPage > 1 ? store.currentPage - 1 : 1)
  );

  template = template.replace(
    "{{__next_page__}}",
    String(
      store.currentPage * 10 < newsFeed.length
        ? store.currentPage + 1
        : store.currentPage
    )
  );

  updateView(template);
}

// TODO 뉴스 내용 ====================================================================================================

function newsDetail(): void {
  const id = location.hash.substring(7);
  const newsContent = getData<NewsDetail>(CONTENT_URL.replace("@id", id));

  // HACK HTML (내용)

  const template = /* html */ `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;

  // 현재 글 읽음 처리
  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === +id) {
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(
    template.replace("{{__comments__}}", makeComment(newsContent.comments))
  );
}

// TODO 뉴스 내용 댓글 및 대대대대댓글 ==============================================================

function makeComment(comments: NewsComment[]): string {
  const commentString = [];

  for (let i = 0; i < comments.length; i++) {
    const comment: NewsComment = comments[i];

    // HACK HTML (댓글)

    commentString.push(/* html */ `
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>     
    `);

    if (comment.comments.length) {
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join("");
}

// TODO 라우터 ==========================================================================

function router(): void {
  const routePath = location.hash; // hash 에 #만 들어있으면 빈 값을 반환함

  if (routePath === "") {
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = +routePath.substring(7);
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router);

router();
