/*
  이전 코드에선 글 목록을 생성하는 코드셋이 묶여있지 않았고 
  제목 클릭 시 컨텐츠를 불러오는 코드셋도 이벤트 핸들러의 콜백으로 들어가있어서
  재사용할 수 없는 구조였다.  
  라우터를 쓰려면 글 목록 생성 및 컨텐츠 불러오는 코드를 재사용해야하기 때문에 
  이들을 함수로 만들어줄 필요가 있다.
*/

const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

// 글 목록을 생성하는 것을 함수로 만들어서 라우터에서 호출할 수 있도록 변형
function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  newsList.push("<ul>");
  for (let i = 0; i < newsFeed.length; i++) {
    newsList.push(`
      <li>
        <a href="#${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `);
  }
  newsList.push("</ul>");

  container.innerHTML = newsList.join("");
}

// 컨텐츠도 마찬가지
function newsDetail() {
  const id = location.hash.substr(1);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
      <a href="#">목록으로</a>
    </div>
  `;
}

// 라우터 만들기
function router() {
  const routePath = location.hash; // hash 에 #만 들어있으면 빈 값을 반환함

  if (routePath === "") {
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router);

router();
