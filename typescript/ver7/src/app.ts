/*

  ! 동기 -> 비동기 

  기존에 ajax.open() 의 세번째 인자로 false를 줘서 동기적으로 받던 데이터를 비동기로 바꾸었다.
  그에 따라 core/api.ts 코드 및 응답 데이터를 사용하는 쪽, 
  즉 NewsFeedView 와 NewsDetailView 코드도 수정되었다.
  
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
