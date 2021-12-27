// !! NewsFeed, NewsDetail, router 를 모두 클래스로 바꿔보자

/*
  * 현재까지 함수가 몇 개 있었는데, 함수는 독립적이고 개별적으로 존재하는 코드셋이다.
  근데 보면 newsFeed나 newsDetail 같은 함수는 목적이 같다. 
  둘 다 UI를 렌더해주기 위해서 존재하는 함수다.
  그런데 newsFeed를 보조해주기 위해서 makeFeeds 함수가 있고, 
  newsDetail을 보조해주기 위해서 makeComment 함수가 있었고, 
  둘 모두를 보조해주기 위해서 updateView 함수가 있었다.
  지금은 앱의 규모가 아주 작기 떄문에 이렇게 함수로만 만들어도 크게 지저분해보이지 않을 수 있지만 
  * 앞으로 앱의 규모가 확장되서 보여줘야할 페이지가 수십가지로 늘어난다면 
  * 각 페이지를 렌더하는 함수, 그 함수를 보조해주는 함수를 모두 개별적이고 독립적으로 늘어뜨리는 방식만으로는 
  무엇이 어떤 기능을 하는 함수인지 알아보기도 힘들고, 굉장히 지저분하고 정돈되보이지 않는 순간이 올 것이다. 
  * 이런 이유에서 앞서 만든 ver3에서 조금 더 나아가서, 비슷한 목적을 가진 함수들끼리 모아서 클래스로 구현해보자. 
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

type RouteInfo = {
  path: string;
  page: View;
};

// TODO 전역 변수 =============================================================================

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store: Store = {
  currentPage: 1,
  feeds: [],
};

// TODO API 클래스 =========================================================================

// 믹스인 함수
function applyApiMixins(targetClass: any, baseClasses: any[]): void {
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

interface NewsFeedApi extends Api {}
interface NewsDetailApi extends Api {}

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

// TODO VIEW 클래스: 공통 =========================================================================

abstract class View {
  private template: string;
  private renderTemplate: string;
  private container: HTMLElement;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const containerElement = document.getElementById(containerId);

    // ID가 containerId인 엘리먼트가 존재하지 않는다면 앱을 실행할 수 없으므로 종료시킨다
    if (!containerElement)
      throw "최상위 컨테이너가 존재하지 않으므로 UI 생성에 실패하였습니다.";

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected updateView(): void {
    // 기존엔 container가 null인지 아닌지 체크했지만 여기선 생성자에서 이미 했으므로
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }

  protected getHtml(): string {
    const snapshot = this.htmlList.join("");
    this.clearHtmlList();
    return snapshot;
  }

  protected setTemplateData(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  private clearHtmlList(): void {
    this.htmlList = [];
  }

  abstract render(): void;
  // 반드시 이런 규격의 메소드를 자식 메소드가 구현하도록 강제하는 타입스크립트 문법으로,
  // 이 문법을 구사하고자 하는 클래스는 class 키워드 앞에 abstract를 붙여주어야함.
}

// TODO VIEW 클래스: 뉴스 목록 =========================================================================

class NewsFeedView extends View {
  private api: NewsFeedApi;
  private feeds: NewsFeed[];

  constructor(containerId: string) {
    // 생성자 함수에는 인스턴스 객체에서 필요한 속성 정의 및 재호출될 필요없는 코드들을 넣는다.

    // 일단 기존 NewsFeed 함수에서 모든 코드를 가져온 뒤
    // 생성자 함수가 갖고 있지 않아도 될 코드들은 해당하는 목적의 메소드들로 분류해둔다

    let template: string = /*html*/ `
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

    // 파생 클래스의 생성자는 반드시 super를 호출해줘야 한다
    // super의 인자는 상위 클래스 생성자의 파라미터로 넘어간다
    super(containerId, template);

    this.api = new NewsFeedApi();
    this.feeds = store.feeds;

    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData();
      this.makeFeeds();
    }
  }

  render() {
    // prev, next 버튼이 눌림에 따라서 라우터에 의해 재실행될 부분만 여기에 두면 된다.
    store.currentPage = Number(location.hash.substring(7) || 1);
    for (
      let i = (store.currentPage - 1) * 10;
      i < store.currentPage * 10;
      i++
    ) {
      const { id, title, comments_count, user, points, time_ago, read } =
        this.feeds[i];

      this.addHtml(/*html*/ `
        <div class="p-6 ${
          read ? "bg-gray-500" : "bg-white"
        } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${id}">${title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${user}</div>
            <div><i class="fas fa-heart mr-1"></i>${points}</div>
            <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
          </div>  
        </div>
      </div>    
      `);
    }

    this.setTemplateData("news_feed", this.getHtml());

    this.setTemplateData(
      "prev_page",
      String(store.currentPage > 1 ? store.currentPage - 1 : 1)
    );

    this.setTemplateData(
      "next_page",
      String(
        store.currentPage * 10 < this.feeds.length
          ? store.currentPage + 1
          : store.currentPage
      )
    );

    this.updateView();
  }

  private makeFeeds(): void {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }
}

// TODO VIEW 클래스: 뉴스 상세 =========================================================================

class NewsDetailView extends View {
  constructor(containerId: string) {
    // 뉴스 상세 페이지는 id가 결정되어야만 api호출도 하고 UI를 그릴 수 있다
    // 그러니까 템플릿을 제외한 나머지는 라우터에 의해서 재호출될 때마다 갱신되야하므로
    // 인스턴스가 생성되는 시점에서 가지고 있을 필요가 없다.

    const template = /* html */ `
      <div class="bg-gray-600 min-h-screen pb-8">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">ㄴ
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                  <i class="fa fa-times"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="h-full border rounded-xl bg-white m-6 p-4 ">
          <h2>{{__title__}}</h2>
          <div class="text-gray-400 h-20">{{__content__}}</div>

          {{__comments__}}

        </div>
      </div>
    `;

    super(containerId, template);
  }

  render() {
    const id = location.hash.substring(7);
    const api = new NewsDetailApi();
    const newsDetail: NewsDetail = api.getData(id);

    // 현재 글 읽음 처리
    for (let i = 0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === +id) {
        store.feeds[i].read = true;
        break;
      }
    }

    this.setTemplateData("comments", this.makeComment(newsDetail.comments));
    this.setTemplateData("currentPage", String(store.currentPage));
    this.setTemplateData("title", newsDetail.title);
    this.setTemplateData("content", newsDetail.content);

    this.updateView();
  }

  private makeComment(comments: NewsComment[]): string {
    for (let i = 0; i < comments.length; i++) {
      const comment: NewsComment = comments[i];

      this.addHtml(/* html */ `
        <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>     
      `);

      if (comment.comments.length) {
        this.addHtml(this.makeComment(comment.comments));
      }
    }

    return this.getHtml();
  }
}

// TODO ROUTER 클래스 ==========================================================================

class Router {
  routeTable: RouteInfo[];
  defaultRoute: RouteInfo | null;

  constructor() {
    window.addEventListener("hashchange", this.route.bind(this));

    this.routeTable = [];
    this.defaultRoute = null;
  }

  setDefaultPage(page: View): void {
    this.defaultRoute = { path: "", page };
  }

  addRoutePath(path: string, page: View): void {
    this.routeTable.push({ path, page });
  }

  route() {
    const routePath = location.hash;

    if (routePath === "" && this.defaultRoute) {
      this.defaultRoute.page.render();
    }

    for (const routeInfo of this.routeTable) {
      if (routePath.indexOf(routeInfo.path) >= 0) {
        routeInfo.page.render();
        break;
      }
    }
  }
}

const router: Router = new Router();
const newsFeedView = new NewsFeedView("root");
const newsDetailView = new NewsDetailView("root");

router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);

router.route();
