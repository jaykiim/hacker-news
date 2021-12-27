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
    /*
      fetch API는 프로미스 객체를 리턴하고, 
      그 프로미스 객체가 제공하는 then 메소드에 비동기 함수들을 계속 연결해서 붙여넣으면 
      * 기존의 XHR의 문제점이었던, 계속 뎁스가 깊어지는 콜백 헬을 일자로 쭉 펼쳐진 구조로 만들 수 있다. 
      * 프로미스도 기본적으로 콜백 구조이긴 하지만 콜백의 뎁스가 여러 깊이로 만들어지지 않고 
      * 보기에 일자로 쭉 펼쳐질 수 있는 구조를 제공하는 것이다. 
    */

    /*
      또 fetch의 다른 점이 있다면 응답 데이터가 JSON으로 왔을 때 기존 XHR 을 사용할 땐 
      * JSON.parse를 써서 직접 바꿔줬지만 그것의 단점은 동기적으로 작동한다는 것이다. 
      * 그러니까 JSON의 데이터가 굉장히 크면 다음 코드가 블로킹되는데 fetch가 나오면서 그 문제점도 
      * JSON을 비동기적으로 바꾸는 기능(.json()) 을 제공함으로써 해결을 하고 있다.  
    */

    fetch(this.url)
      .then((response) => response.json())
      .then(cb)
      .catch(() => {
        console.error("데이터를 불러오는 것에 실패하였습니다.");
      });
  }
}

export class NewsFeedApi extends Api {
  getData(cb: (data: NewsFeed[]) => void): void {
    this.getRequest<NewsFeed[]>(cb);
  }
}

export class NewsDetailApi extends Api {
  getData(cb: (data: NewsDetail) => void): void {
    this.getRequest<NewsDetail>(cb);
  }
}
