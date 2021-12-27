// ! 파일을 분리해보자
/*
  현재까진 코드가 300라인 안팎으로 그리 많지는 않지만 앞으로 기능을 더 추가하고 프로젝트를 발전시켜나간다면 
  app.ts 파일 하나만 가지고 계속 코드를 수정하고 추가하고 하기엔 분명히 한계가 있다.
  코드도 그렇게 아름답지 않고 간단한 코드를 찾기 위해서 스크롤을 한참 위아래로 내려야하는 측면도 있기 때문에
  코드를 분리해서 훨씬 더 깔끔하고 관리하기 쉬운 형태의 프로젝트를 만들어보자. 
*/

import Router from "./core/router";
import { NewsFeedView, NewsDetailView } from "./page";
import { Store } from "./types";

// 전역 객체를 app파일에서 선언해줘야하는데 그럼 다른 파일에서 접근이 안된다.
// 아주 좋은 방법은 아니지만 일단 간편하게 브라우저의 window 객체에 속성으로 저장해놓고,
// 이후에 개선해보자.

// 하는 방법은, JS에서는 매우 간단하다. window.store = 하고 스토어를 밀어넣어버리기만 하면 되는데
// TS에서는 그렇게 할 수 없다.
// 먼저 window에 추가할 속성의 타입을 정의해야하는데 그 방법이 조금 까다롭다.

const store: Store = {
  currentPage: 1,
  feeds: [],
};

declare global {
  interface Window {
    store: Store;
  }
}

window.store = store;

const router: Router = new Router();
const newsFeedView = new NewsFeedView("root");
const newsDetailView = new NewsDetailView("root");

router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);

router.route();
