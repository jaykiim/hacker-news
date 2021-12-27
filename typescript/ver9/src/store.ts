/*

  ! 스토어 클래스를 안전하게 만들고, 필요한 클래스에 인스턴스로 제공해보자.
  기존 스토어에서 관리했던 상태는 currentPage와 feeds인데, 이것을 여기서 속성으로 가지고 있으면 될 것 같다.
  그런데 currentPage와 feeds에 직접적으로 접근해서 아무렇게나 수정할 수 있도록 하면 
  실수로 잘못된 값을 넣었을 때 앱이 동작하지 않을수도 있으므로 
  중요한 정보가 잘못 세팅되는 것을 원천적으로 방어해보자. 
   
  ! private을 써서 feeds 및 currentPage에 직접적인 접근은 불가하게 하고, 
  ! 대신에 관련해서 필요한 기능들은 여기서 만들어서 제공해주면 된다.
  
  그럼 어떤 기능을 제공해줘야할까? 

  우선 NewsFeedView에서 prev, current 버튼을 눌렀을 때 페이지가 이동되려면  
  현재 몇 페이지에 있어야 하는지 알아야 하므로 페이지 번호를 볼 수 있어야 한다. 

  ! 외부에서 값을 읽을 땐 속성에 직접 접근하는 것이 아니라 그저 메소드가 리턴한 값을 보게 하면 된다. 

  근데 이 기능을 메소드로 제공하면 사용하는 측에선 고작 숫자값 하나 받으려고 매번 getCurrentPage() 이런 식으로
  호출을 해야하니까 사용하기가 너무 불편할 것이다. 

  ! 이럴 때 getter를 쓰면 사용하는 측에선 그냥 속성에 접근하듯 store.currentPage로 getter의 리턴값을 얻는다.
  만들 땐 그냥 메소드 만들듯 만들고 이름 앞에 get 키워드만 붙이면 된다. get currentPage() {}
  근데 내부 속성명과 이름이 겹치니까 내부 속성명 앞에 언더바를 붙여준다. (어차피 밖에서 안쓸 값이니까)

  또 어떤 기능을 제공해야할까.
  ! 내부의 _currentPage를 수정시키는 기능도 제공해야한다.
  
  ! 이걸 setter로 제공하면 사용하는 측에선 store.currentPage = 처럼 대입문으로 속성값 수정 가능하다.
  ! 하지만 저렇게 대입해도 사실은 밑에 보이는 setter 함수를 동작시키는거라서 
  엣지케이스나 숫자가 아닌 타입의 인자가 들어오는 것에 대한 방어 처리가 일어난다.    

*/

import { NewsFeed, NewsStore } from "./types";

export default class Store implements NewsStore {
  private feeds: NewsFeed[];
  private _currentPage: number;

  constructor() {
    this.feeds = [];
    this._currentPage = 1;
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(page: number) {
    /* 
      숫자가 들어와도 음수면 안되는 경우? if (prage < = 0) return; 
      이렇게 엣지케이스에 대한 방어도 가능하다 
    */
    this._currentPage = page;
  }

  /* 
    어차피 페이지 번호를 여기서 관리하고 있으니까, 그 김에 
    다음 페이지 번호와 이전 페이지 번호를 리턴하는 함수도 제공해주면 편리할 것이다 
  */

  get prevPage() {
    return this._currentPage > 1 ? this._currentPage - 1 : 1;
  }

  get nextPage() {
    return this._currentPage * 10 < this.feeds.length
      ? this._currentPage + 1
      : this._currentPage;
  }

  /* 
    feeds.length로 반복문을 돈다거나 하는 코드가 있었는데 
    이제 feeds 속성에 접근이 불가하므로 feeds의 길이를 리턴해주는 getter도 만들자.
  */

  get feedsLen(): number {
    return this.feeds.length;
  }

  /*
    피드 길이가 0이면 데이터를 받아오는 코드가 있었는데, 
    이것도 그냥 피드가 비었는지 아닌지 체크해주는 getter를 제공해주자
  */

  get hasFeeds(): boolean {
    return this.feeds.length > 0;
  }

  /* 전체 피드를 내보내주는 것은 메소드로 만들어주자 */
  getAllFeeds(): NewsFeed[] {
    return this.feeds;
  }

  /* feeds 배열에서 특정 인덱스의 피드에 접근하는 코드도 있었으므로 */
  getFeed(index: number): NewsFeed {
    return this.feeds[index];
  }

  /* API로 받아온 뉴스 목록 데이터에 read 속성을 추가해서 feeds에 저장해주는 것도 메소드로 제공하자 */
  setFeeds(feeds: NewsFeed[]): void {
    this.feeds = feeds.map((feed) => ({
      ...feed,
      read: false,
    }));
  }

  /* 
    읽은 글의 read 속성값을 바꿔주는 코드도 있었는데, 
    이것도 이젠 외부에서 feeds에 접근이 안되기 때문에 메소드로 제공해주자 
  */
  makeRead(id: number): void {
    const feed = this.feeds.find((feed: NewsFeed) => feed.id === id);

    if (feed) {
      feed.read = true;
    }
  }
}
