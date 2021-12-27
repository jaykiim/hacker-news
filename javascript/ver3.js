/*
  ver1처럼 일일이 DOM API를 조작하는 방식의 코드를 계속해서 전개해간다면 
  규모가 조금만 커져도 코드만 봐서는 마크업 구조를 파악하기가 거의 불가능해진다. 

  가독성을 높이기 위해서 DOM API를 최소한으로만 사용하고 
  대신 문자열을 이용해서 마크업 구조를 직접 표현하는 방식으로 개선해보자.

  문자열로 표현한 HTML은 innerHTML을 통해 실제 태그로 변환할 수 있다.
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

const newsFeed = getData(NEWS_URL);

window.addEventListener("hashchange", function () {
  /* 
    ver2에선 제목을 클릭할 때마다 컨텐츠가 글 목록과 같은 화면에 누적되는 
    버그가 있었고, 또한 DOM API를 최소화하고 문자열로 마크업 구조를 직접 표현하는 
    방식으로의 리팩토링도 진행했었는데 여전히 DOM API를 사용하는 부분이 꽤 남아있다.
    이 부분들을 모두 개선해보자.
  */
  const id = location.hash.substr(1);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
      <a href="#">목록으로</a>
    </div>
  `;
});

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
