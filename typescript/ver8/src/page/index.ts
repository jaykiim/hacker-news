export { default as NewsFeedView } from "./news-feed-view";
export { default as NewsDetailView } from "./news-detail-view";

/*
  페이지는 나중에 훨씬 더 많아질 수 있는데 각각 개별 파일 안에서 export를 하면 
  사용하는 측에서 import구문을 페이지 파일 갯수만큼 써서 불러와야 하기도 하고 
  만약 page 폴더안에 세부 디렉토리를 만들어서 경로가 바뀌기라도 하면  
  사용하는 측에선 해당 파일을 import 하는 구문마다 쫓아가서 경로를 변경해줘야한다.

  그래서 이렇게 index.ts 파일을 만들어서 한군데에서 export 해주면
  파일명이 index이므로 가져다 쓰는 쪽에서는 /page 이하의 패스를 쓰지 않아도 되고
  현재 폴더에서 하위 디렉토리가 생기든 말든 경로 수정해줄 필요가 없어진다.    
*/
