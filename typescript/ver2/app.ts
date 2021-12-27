// !! ver1의 getData 함수를 클래스 범위로 확장해보자 (feat. 상속 메커니즘)

/*

앞서, 중복된 코드들은 함수로 묶어서 하나로 만든 다음에 필요할 때마다 
그 함수를 호출해서 재사용하는 식으로 중복을 제거하는 기법을 배웠다.
하지만 코드베이스가 점점 커지고 앱 규모가 커지다보면 중복된 코드는 계속 발견될 수 있고
그것을 단순한 함수로만 묶어서는 온전히 다 제거하기 쉽지 않다. 
함수 자체가 무한정으로 늘어날 수도 있고, 
그렇게 많은 함수들에 이름을 붙여주는 것도 보통 일이 아니다.

우리가 일상에서 물건을 정리할 때 샤프 따로 연필 따로 볼펜 따로 
모든 물건을 독립적인 것으로 보는 것이 아니라 
하나의 범주로 묶어서 비슷한 성질을 가진 것끼리 모아놓듯이 
코드를 작성함에 있어서도 비슷한 것을 모아놓을 수 있는 클래스라는 범주가 있다. 
클래스는 코드에 훨씬 더 의미를 잘 부여하고 중복을 제거할 수 있도록 하는 여러가지 기능들을 제공한다.

그런 의미에서 우선 getData 함수부터 클래스 범위로 확장해보자.

*/

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

type NewsFeed = News & {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean;
};

type NewsDetail = News & {
  readonly comments: NewsComment[];
};

type NewsComment = News & {
  readonly comments: NewsComment[];
  readonly level: number;
};

const container: HTMLElement | null = document.getElementById("root");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store: Store = {
  currentPage: 1,
  feeds: [],
};

// TODO API 클래스 =========================================================================

/*

  기존의 getData 함수를 클래스 범위로 확장하면서, 상속이라는 컨셉을 익혀보자.
  상속은 공통 요소를 만들어놓고 그것을 확장할 수 있는 세부 요소를 만드는 식의 
  코드를 전개할 때 사용하는 문법이다.

  상속을 구현하는 방법은 크게 두 가지가 있는데, 
  첫 번쨰는 extends 문법을 사용하는 방법, 두 번째는 믹스인 함수를 사용하는 방법이 있다.

  그 중에서 먼저 extends를 사용한 상속 컨셉으로 API 클래스를 구현해보자.
 
  그럼 지금 필요한 세부 클래스는 뭐가 있을까? 
  세부 클래스부터 생각해봐야 거기서 뭘 공통으로 뽑아낼 수 있는지도 생각할 수 있을 것이다. 
  
  현재 데이터 통신을 통해서 받아오는 데이터의 종류가 두 가지다. 
  하나는 뉴스 목록 데이터, 하나는 뉴스 상세 데이터이므로 
  NewsFeedApi, NewsDetailApi 클래스를 세부 클래스로 하면 될 것이고
  그럼 이 두 클래스에서 공통되는 요소를 뽑아서 Api 클래스를 만들면 될 것이다.
  
*/

class Api {
  url: string;
  ajax: XMLHttpRequest;

  // 인스턴스 객체의 초기값
  constructor(url: string) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  protected getRequest<AjaxResponse>(): AjaxResponse {
    this.ajax.open("GET", this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }

  /*
    getRequest 메소드는 리턴값을 미지의 타입으로 두고, 
    하위 클래스에서 getRequest 메소드를 호출할 때 리턴값의 타입을 지정해줄 것이기 때문에 외부에서는 사용되면 안된다. 
    그러니까 하위 클래스를 사용하는 측에서 
    const api = new NewsFeedApi(NEWS_URL);
    api.getRequest(); 
    이런 식으로 이 메소드에 접근할 수 없도록 막아야 한다.
    이렇게 인스턴스에 노출시키고 싶지 않은 속성이나 메소드가 있으면 앞에 protected 키워드를 붙여준다.
  */
}

class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>();
  }
}

class NewsDetailApi extends Api {
  getData(): NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}

/*
  여기까지만 보면 기존엔 함수 하나여서 깔끔했는데 클래스로 나눠지니까 훨씬 번잡스러워보일 수 있다. 
  어떤 경우엔 중복 코드를 제거하고나서 코드가 더 무거워지기도 한다. 
  보통 코드 자체가 하는 일이 되게 작을 때 더 그렇다.
  기존에 단순 함수였던 코드를 이렇게 class 형태로 바꾼다는 것은 어떤 구조를 갖는다는 것이다.
  함수는 구조가 없다. 단독 함수일 뿐이니까 말이다. 
  그런데 클래스는 어떠한 목적을 가진 구조, 형식을 갖게 된다. 
  그럼 무슨 이득이 있을까?
  이 코드가 나중에 더 많은 기능을 갖게 되어도 초기의 복잡도가 그대로 유지되고, 
  바깥쪽에서 사용할 때는 그 단순함을 꾸준히 계속 유지할 수 있다는 장점이 생긴다.
  코드 베이스가 작을때는 변경된 코드가 너무 복잡해져서 더 어려워지기만 한 것 같고 굳이 이렇게까지 해야하나 싶지만 
  코드가 점점 커지면 이런 방식의 코드의 장점을 확실히 느낄 수 있다.
*/

// TODO 뉴스 목록 =========================================================================

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

function newsFeed(): void {
  const api = new NewsFeedApi(NEWS_URL);
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
    newsFeed = store.feeds = makeFeeds(api.getData());
    // 기존 getData 함수를 NewsFeedApi 클래스의 메소드로 대체했는데,
    // 정의하는 쪽 코드는 조금 늘어났지만 여기, 사용하는 쪽 코드는 아주 단순하고 간결해졌다.
    // 제네릭 타입을 명시해주지 않아도 되고 url도 넘겨주지 않아도 되기 떄문에
    // API 호출이 반복된다면 이렇게 한번만 위에서 디테일하게 정의해놓으면 이후의 코드가 훨씬 깔끔해진다.
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
  const api = new NewsDetailApi(CONTENT_URL.replace("@id", id));
  const newsContent = api.getData();

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
