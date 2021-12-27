// TODO Api 클래스 =======================================================================================

import { NewsFeed, NewsDetail } from "../types";

export class Api {
  url: string;
  ajax: XMLHttpRequest;

  constructor(url: string) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  protected getRequest<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
    /* 요청을 비동기로 생성하고 */
    this.ajax.open("GET", this.url);

    /*
      데이터가 도착했을 때 실행할 콜백은 이벤트 리스너로 등록한다. 
      데이터가 도착했음을 감지하는 이벤트 명은 'load'
    */

    this.ajax.addEventListener("load", () => {
      /* 
        기존에는 메소드에서 응답 데이터를 리턴했는데 이제는 
        * 콜백으로 데이터를 받기 때문에, 여기서 리턴해봤자 받을 대상이 없으므로 
        * getRequest 메소드를 사용하는 측 (NewsFeedApi, NewsDetailApi) 에서 넘겨준 콜백으로 데이터를 넘긴다. 
      */
      cb(JSON.parse(this.ajax.response));
    });

    this.ajax.send();
  }
}

export class NewsFeedApi extends Api {
  /*
    getRequest로 콜백을 넘기면 -> getRequest에서 요청을 보내고 -> 데이터가 도착 -> 콜백에 데이터를 넘김
    콜백이 실행되면 그 안에서 인자 (데이터) 를 써서 원하는 처리를 하던가 밖으로 리턴하던가 하면 되는데
    그 내용을 정의할 장소가 여기가 아니라 View 쪽이다. 그러니까 
    
    * 데이터가 도착하면 할 작업을 담은 콜백이 View 에서 -> getData 를 거쳐 -> getRequest로 전달됨
    * 데이터가 도착 -> getRequest에서 콜백으로 데이터 전달 -> View 에서 실행
  */

  getData(cb: (data: NewsFeed[]) => void): void {
    this.getRequest<NewsFeed[]>(cb);
  }
}

export class NewsDetailApi extends Api {
  getData(cb: (data: NewsDetail) => void): void {
    this.getRequest<NewsDetail>(cb);
  }
}
