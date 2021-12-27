/*
  ver1처럼 일일이 DOM API를 조작하는 방식의 코드를 계속해서 전개해간다면 
  규모가 조금만 커져도 코드만 봐서는 마크업 구조를 파악하기가 거의 불가능해진다. 

  가독성을 높이기 위해서 DOM API를 최소한으로만 사용하고 
  대신 문자열을 이용해서 마크업 구조를 직접 표현하는 방식으로 개선해보자.

  문자열로 표현한 HTML은 innerHTML을 통해 실제 태그로 변환할 수 있다.
*/

const container = document.getElementById("root");

const ajax = new XMLHttpRequest();
const content = document.createElement("div");

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

/*
  이전 코드에선 데이터를 가져올 때마다
  ajax.open, ajax.send, JSON.parse 이 세 가지 코드셋이 반복되었으므로
  반복되는 코드셋은 함수로 바꿔주면 
  데이터 요청이 아무리 많아져도 코드의 복잡도를 증가시키지 않을 수 있다.  
*/
function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);
const ul = document.createElement("ul");

window.addEventListener("hashchange", function () {
  const id = location.hash.substr(1);

  const newsContent = getData(CONTENT_URL.replace("@id", id));
  const title = document.createElement("h1");

  title.innerHTML = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < newsFeed.length; i++) {
  // 문자열 HTML이 실제 태그로 변환되려면 innerHTML을 써야하는데,
  // innerHTML을 쓰려면 태그가 필요하므로 임시로 쓰고 버릴 태그를 만든다.
  const div = document.createElement("div");

  div.innerHTML = `
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
  `;

  ul.appendChild(div.firstElementChild);
}

container.appendChild(ul);
container.appendChild(content);
