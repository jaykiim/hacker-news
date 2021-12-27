// TODO Api 클래스 =======================================================================================

import { NewsFeed, NewsDetail } from "../types";

export class Api {
  url: string;
  ajax: XMLHttpRequest;

  constructor(url: string) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  protected async getRequest<AjaxResponse>(): Promise<AjaxResponse> {
    /*
      async/await 는 분명히 내부적인 메커니즘은 콜백처럼 작동하는 비동기 코드임에도 불구하고, 
      코드 상으로는 완전한 동기 코드처럼 보이게 작성할 수 있는 문법 체계다.
    */

    /* 마치 fetchAPI가 데이터를 리턴하는 것 같지만 내부적으론 기존과 똑같이 promise base로 작동한다 */
    const response = await fetch(this.url);
    return (await response.json()) as AjaxResponse;
  }
}

export class NewsFeedApi extends Api {
  async getData(): Promise<NewsFeed[]> {
    return this.getRequest<NewsFeed[]>();
  }
}

export class NewsDetailApi extends Api {
  async getData(): Promise<NewsDetail> {
    return this.getRequest<NewsDetail>();
  }
}
