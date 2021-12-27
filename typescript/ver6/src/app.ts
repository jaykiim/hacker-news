/*

  ! 안전한 전역 상태 관리

  store 처럼 모든 클래스에서 접근해야하는 데이터가 있으면 어디에 놓는게 좋을까?
  window 같은 전역 공간에 놓으면 가장 편리하지만, 그 편리하다는 점 때문에 가장 불안한 공간이기도 하다. 
  혹시라도 어떤 코드에서 실수로 잘못된 데이터를 세팅하거나 다른 류의 데이터로 오버라이트되면 
  심각한 문제가 발생할 수 있는데 어플리케이션의 규모가 크면 그런 류의 문제가 발생했을 때 
  그 버그가 어디서 발생했는지 찾는 것 조차도 쉽지 않기 때문이다.  
  그래서 모두가 접근 가능한 전역 공간은 가능하면 쓰지 않는게 가장 좋다.

  * src 폴더 하위에 store.ts를 만들어서 스토어를 클래스로 안전하게 구현하고, 
  * app.ts에서 인스턴스 객체를 만들어서 필요한 클래스에 전달해주도록 하자.

  * 그럼 생성자를 통해 전역 상태 객체를 전달받은 클래스들은 constructor(containerId: string, store: ?)
  * 즉, store의 타입도 types/index.ts 에서 정의해줘야한다.
  
  ( store의 타입을 그냥 Store 클래스 자체로 하면 안되는 이유? )

  그럼 실제 Store 클래스는 store 타입 정의랑 어떻게 연결시킬까? store.ts 파일에서 확인해보도록.  
  
*/

import Router from "./core/router";
import { NewsFeedView, NewsDetailView } from "./page";
import Store from "./store";

const store = new Store();
const router: Router = new Router();
const newsFeedView = new NewsFeedView("root", store);
const newsDetailView = new NewsDetailView("root", store);

router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);

router.route();
