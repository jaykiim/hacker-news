// TODO VIEW 클래스: 뉴스 목록 =========================================================================

import View from "../core/view";
import { NewsFeedApi } from "../core/api";
import { NewsStore, NewsFeed } from "../types";
import { NEWS_URL } from "../config";

const template: string = /*html*/ `
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

export default class NewsFeedView extends View {
  private api: NewsFeedApi;
  private store: NewsStore;

  constructor(containerId: string, store: NewsStore) {
    super(containerId, template);

    this.store = store;
    this.api = new NewsFeedApi(NEWS_URL);
  }

  render() {
    this.store.currentPage = Number(location.hash.substring(7) || 1);

    /*
      기존엔 API 호출하는 코드가 constructor에 있었는데, 데이터 통신을 비동기로 하게되면 
      라우터에서 render함수를 호출했을 때 생성자에서 호출했던 데이터의 응답이 왔을지 안왔을지 보장이 안되므로
      API 호출을 렌더 쪽으로 옮겨와야한다. 
    */

    if (!this.store.hasFeeds) {
      this.api.getData((feeds: NewsFeed[]) => {
        this.store.setFeeds(feeds);

        /* 
          근데 기존의 for문 이하의 코드들을 여기로 다 옮겨버리면, 
          페이지 이동 시 재실행되야 할 코드들이 실행되지 못하기 때문에  
          UI를 업데이트하는 코드를 함수로 분리해서 여기서도 실행시키고 요 밑에서도 실행시켜줘야한다. 
        */

        this.renderView();
      });
    }

    this.renderView();
  }

  renderView = () => {
    for (
      let i = (this.store.currentPage - 1) * 10;
      i < this.store.currentPage * 10;
      i++
    ) {
      const { id, title, comments_count, user, points, time_ago, read } =
        this.store.getFeed(i);

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
    this.setTemplateData("prev_page", String(this.store.prevPage));
    this.setTemplateData("next_page", String(this.store.nextPage));

    this.updateView();
  };
}
