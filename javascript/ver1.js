/* DOM API 버전 */

const ajax = new XMLHttpRequest();

// 코드 내에서 반복적으로 쓰일 수 있고, 수정의 가능성이 있는 것은 변수로 만들어둔다
const container = document.getElementById("root");
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

ajax.open("GET", NEWS_URL, false); // 세번째 인자를 false로 주면 동기적 처리
ajax.send(); // open 이후 send를 해야 데이터를 가져옴

const newsFeed = JSON.parse(ajax.response);
const ul = document.createElement("ul");

window.addEventListener("hashchange", function () {
  const id = location.hash.substr(1);

  ajax.open("GET", CONTENT_URL.replace("@id", id), false);
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  const title = document.createElement("h1");

  title.innerHTML = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");

  a.href = `#${newsFeed[i].id}`;
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

  li.appendChild(a);
  ul.appendChild(li);
}

/* 
  
  아래와 같이 동일한 내용이 반복되는 코드는 수정이나 유지보수 시에 매우 좋지 않다
  
  document.getElementById("root").appendChild(ul);
  document.getElementById("root").appendChild(content);

  예를 들어 root를 home으로 바꿀 경우 일일이 고쳐줘야하므로 
  수정 과정에서 실수가 발생하여 의도치 않은 버그를 만들 가능성을 높이기 때문이다.

*/

container.appendChild(ul);
container.appendChild(content);
