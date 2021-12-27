// !! ver2에서 만들었던 클래스를 믹스인 기법으로 전환해보자

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

// TODO 전역 변수 =============================================================================

const container: HTMLElement | null = document.getElementById("root");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store: Store = {
  currentPage: 1,
  feeds: [],
};

// TODO 헬퍼 함수 =========================================================================

/*
  ver2에서 만들었던 클래스를 믹스인 기법으로 전환해보자.
  믹스인은 클래스를 이용해서 상속을 구현하지만,
  * extends 기능을 이용하지 않고 클래스를 마치 함수처럼, 혹은 단독의 객체처럼 바라보면서
  * 필요한 경우마다 클래스를 합성해서 새로운 기능으로 확장해나가는 기법이다.
  그러니까 믹스인 기법은 클래스를 훨씬 더 독립적인 주체로 바라보는 것이다.
  그런 독립성 덕분에 코드 자체적으로는 클래스 간의 상하위 관계가 묘사되지 않는다.
*/

/* 
  믹스인은 class의 extends같이 언어 자체적으로 제공하는 
  키워드 같은 것이 아니라 코드 테크닉으로 전개되는 기법이다.
  * 클래스를 합성하기 위해 extends 같은 기능을 하는 함수를 아래와 같이 하나 만들어서 쓴다.
*/

function applyApiMixins(targetClass: any, baseClasses: any[]): void {
  /*
    applyApiMixins 함수는 두 번쨰 인자로 받는 클래스의 내용을 첫 번째 인자로 옮겨주는
    역할을 할 것이다. 
    말하자면 클래스의 extends가 문법적으로 해줬던 역할을 이 함수가 대신하게 되는 것이다.
    아니 언어가 문법으로 확장 기능을 제공해주고 있는데 굳이 왜?? 직접 만들어서 쓰는걸까??

    그 이유는 두 가지 정도 있는데, 
    
    1. 
      * 기존의 extends 방식은 누가 누구를 상속받을지 코드에 적시해야 하므로 
      * 어떨 땐 a와 b가 엮이고, 어떨 땐 a와 c가 엮여서 돌아가게 하고 싶은 경우에는
      * 코드를 새로 바꾸지 않는 이상 불가능하기 때문이다.
      * 즉, 상속 관계를 유연하게 바꿔가며 사용해야하는 경우에 믹스인 기법을 사용한다.
    
    2. 
      * JS와 TS의 class extends는 다중 상속을 지원하지 않기 때문이다.
      * 다중 상속이란 하나의 클래스가 여러개의 클래스를 상속받는 것을 말한다.
      * 그러니까 NewsFeedApi가 Api뿐만 아니라 다른 클래스도 상속받아야 되면 
      * extends로는 그렇게 할 수 없으므로 믹스인 기법을 사용한다.
  */

  /*
    믹스인 코드를 구현하는 방법은 여러가지가 있는데 
    아래 코드는 그 중에 한가지로, 타입스크립트의 공식 문서에도 소개되어있는 코드다.
  */

  baseClasses.forEach((baseClass) => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        baseClass.prototype,
        name
      );

      if (descriptor) {
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    });
  });
}

class Api {
  getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    ajax.send();

    return JSON.parse(ajax.response);
  }
}

class NewsFeedApi {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(NEWS_URL);
  }
}

class NewsDetailApi {
  getData(id: string): NewsDetail {
    return this.getRequest<NewsDetail>(CONTENT_URL.replace("@id", id));
  }
}

/* 
  * applyApiMixins 함수만 호출하면 NewsFeedApi, NewsDetailApi 둘 다 Api를 상속받지만
  
  * 코드 상으로는 둘 다 Api 클래스랑 아무 연관 관계가 없다보니까 
  * 믹스인 함수를 통해서 기능이 합성된다는 것까지는 TS 컴파일러가 추적하지 못해서 
  
  Api 클래스의 getRequest를 this.getRequest로 호출하는 것을 용납하지 못하고 
  빨간 밑줄을 그어버리기 떄문에 아래 두 줄을 추가해서 달래준다.  
*/

interface NewsFeedApi extends Api {}
interface NewsDetailApi extends Api {}

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

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
  const api = new NewsFeedApi();
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
  const api = new NewsDetailApi();
  const newsContent = api.getData(id);

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
