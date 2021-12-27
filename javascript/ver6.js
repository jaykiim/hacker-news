/*
  현재는 코드 상에서 마크업을 다루고 있는데, 앞으로 디자인을 입히게 되면 
  마크업의 구조가 복잡해짐에따라 코드의 복잡성도 증가할 것이다.
  하지만 코드의 양이 늘어난다고 해서 복잡성이 증가하게 만드는 것은 매우 좋지 않다.
  양이 늘어나면 양만 늘어나지 복잡성은 증가하지 않는 코드를 구사할 수 있어야 한다.
  그렇기 때문에 디자인을 입히기에 앞서 "템플릿"을 준비해보자.
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

// TODO 뉴스 목록

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  // GUIDE HTML (nav) =================================================================

  let template = /*html*/ `
    <div class="bg-gray-600 min-h-screen">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/{{__prev_page__}}" class="text-gray-500">
              Previous
            </a>
            <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
              Next
            </a>
          </div>
        </div> 
      </div>
    </div>
    <div class="p-4 text-2xl text-gray-700">
      {{__news_feed__}}        
    </div>
  </div>
  `;

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // GUIDE HTML (list)================================================================================

    newsList.push(/*html*/ `
      <div class="p-6 ${
        newsFeed[i].read ? "bg-red-500" : "bg-white"
      } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
      <div class="flex">
        <div class="flex-auto">
          <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
        </div>
        <div class="text-center text-sm">
          <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
            newsFeed[i].comments_count
          }</div>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="grid grid-cols-3 text-sm text-gray-500">
          <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
          <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
          <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
        </div>  
      </div>
    </div>    
    `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));

  template = template.replace(
    "{{__prev_page__}}",
    store.currentPage > 1 ? store.currentPage - 1 : 1
  );

  template = template.replace(
    "{{__next_page__}}",
    store.currentPage * 10 < newsFeed.length
      ? store.currentPage + 1
      : store.currentPage
  );

  container.innerHTML = template;
}

// TODO 뉴스 내용

function newsDetail() {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  // GUIDE HTML (내용) =======================================================================

  const template = /* html */ `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;

  function makeComment(comments, called = 0) {
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
      // GUIDE HTML (댓글) =======================================================================

      commentString.push(/* html */ `
        <div style="padding-left: ${called * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>     
      `);

      if (comments[i].comments.length) {
        commentString.push(makeComment(comments[i].comments, called + 1));
      }
    }

    return commentString.join("");
  }

  container.innerHTML = template.replace(
    "{{__comments__}}",
    makeComment(newsContent.comments)
  );
}

// TODO 라우터

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
