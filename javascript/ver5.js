/*
  글 목록에 페이징을 구현해보자.
  글 목록을 생성하는 함수 newsFeed 내에서 currentPage라는 변수를 선언하면, 
  사용자가 예컨데 2페이지에서 어떤 글을 보고 목록으로 라는 버튼을 클릭해서 
  다시 글 목록으로 돌아왔을 때 newsFeed함수가 실행될테니까  
  사용자가 보게 될 페이지는 항상 currentPage 변수 초기값일 것이다.
  그러므로 currentPage는 함수 바깥에서 선언하도록 하자.
*/

const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store = {
  currentPage: 1,
};

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
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <li>
        <a href="#/show/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `);
  }
  newsList.push("</ul>");
  newsList.push(`
    <div>
      <a href="#/page/${
        store.currentPage > 1 ? store.currentPage - 1 : 1
      }">이전 페이지</a>
      <a href="#/page/${
        store.currentPage * 10 < newsFeed.length
          ? store.currentPage + 1
          : store.currentPage
      }">다음 페이지</a>
    </div>
  `);
  container.innerHTML = newsList.join("");
}

// 컨텐츠도 마찬가지
function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
}

// 라우터 만들기
function router() {
  const routePath = location.hash; // hash 에 #만 들어있으면 빈 값을 반환함

  if (routePath === "") {
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = +routePath.substring(7);
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router);

router();
