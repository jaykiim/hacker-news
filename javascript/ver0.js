const ajax = new XMLHttpRequest();

// 코드 내에서 반복적으로 쓰일 수 있고, 수정의 가능성이 있는 것은 변수로 만들어둔다
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

ajax.open("GET", NEWS_URL, false);
ajax.send();

// 목록 화면을 만드는 것과 관계된 코드
const newsFeeds = JSON.parse(ajax.response);
const ul = document.createElement("ul");

for (let i = 0; i < newsFeeds.length; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");

  a.href = "#";
  a.innerHTML = newsFeeds[i].title;

  // 컨텐츠 화면을 만드는 것과 관계된 코드
  a.addEventListener("click", function () {
    ajax.open("GET", CONTENT_URL.replace("@id", newsFeeds[i].id), false);
    ajax.send();

    const newsContents = JSON.parse(ajax.response);
    document.getElementById("root").innerHTML = `
      <h1>${newsContents.title}</h1>
      <div>
        <a href="http://localhost:9013">목록으로</a>
      </div>`;
  });

  // 목록 화면을 만드는 것과 관계된 코드
  li.appendChild(a);
  ul.appendChild(li);
}

document.getElementById("root").appendChild(ul);

/*
  문제점 

  1. 코드만 보고 마크업 구조를 파악하기 어렵다 
  2. 개별적인 화면을 만드는 코드가 서로 뒤섞여있다
  3. "목록으로" 버튼은 html 파일을 새로 받아오는 식으로 동작하므로 SPA가 아니다
  4. 개별 기사 데이터를 요청하기 위해서 이벤트 리스너를 사용하고 있는데, 
     기사 목록이 많아지면 이벤트 리스너가 너무 많이 생성된다

*/

/*

<div>
  <ul>
    <li>
      <a>기사1</a>
    </li>
    <li>
      <a>기사2</a>
    </li>
    <li>
      <a>기사3</a>
    </li>
    <li>
      <a>기사4</a>
    </li>
    <li>
      <a>기사5</a>
    </li>
    ...
  </ul>
</div>

*/
