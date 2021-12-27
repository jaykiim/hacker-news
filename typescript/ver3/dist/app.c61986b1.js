// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"app.ts":[function(require,module,exports) {
"use strict"; // !! ver2에서 만들었던 클래스를 믹스인 기법으로 전환해보자
// TODO 전역 변수 =============================================================================

var container = document.getElementById("root");
var NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
var CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
var store = {
  currentPage: 1,
  feeds: []
}; // TODO 헬퍼 함수 =========================================================================

/*
  ver2에서 만들었던 클래스를 믹스인 기법으로 전환해보자.
  믹스인은 클래스를 이용해서 상속을 구현하지만,
  * extends 기능을 이용하지 않고 클래스를 마치 함수처럼, 혹은 단독의 객체처럼 바라보면서
  * 필요한 경우마다 클래스를 합성해서 새로운 기능으로 확장해나가는 기법이다.
  그러니까 믹스인 기법은 클래스를 훨씬 더 독립적인 주체로 바라보는 것이다.
  그런 독립성 덕분에 코드 자체적으로는 클래스 간의 상하위 관계가 묘사되지 않는다.
*/

/*
  믹스인은 class의 extends같이 언어 자체적으로 제공하는
  키워드 같은 것이 아니라 코드 테크닉으로 전개되는 기법이다.
  * 클래스를 합성하기 위해 extends 같은 기능을 하는 함수를 아래와 같이 하나 만들어서 쓴다.
*/

function applyApiMixins(targetClass, baseClasses) {
  /*
    applyApiMixins 함수는 두 번쨰 인자로 받는 클래스의 내용을 첫 번째 인자로 옮겨주는
    역할을 할 것이다.
    말하자면 클래스의 extends가 문법적으로 해줬던 역할을 이 함수가 대신하게 되는 것이다.
    아니 언어가 문법으로 확장 기능을 제공해주고 있는데 굳이 왜?? 직접 만들어서 쓰는걸까??
        그 이유는 두 가지 정도 있는데,
    
    1.
      * 기존의 extends 방식은 누가 누구를 상속받을지 코드에 적시해야 하므로
      * 어떨 땐 a와 b가 엮이고, 어떨 땐 a와 c가 엮여서 돌아가게 하고 싶은 경우에는
      * 코드를 새로 바꾸지 않는 이상 불가능하기 때문이다.
      * 즉, 상속 관계를 유연하게 바꿔가며 사용해야하는 경우에 믹스인 기법을 사용한다.
    
    2.
      * JS와 TS의 class extends는 다중 상속을 지원하지 않기 때문이다.
      * 다중 상속이란 하나의 클래스가 여러개의 클래스를 상속받는 것을 말한다.
      * 그러니까 NewsFeedApi가 Api뿐만 아니라 다른 클래스도 상속받아야 되면
      * extends로는 그렇게 할 수 없으므로 믹스인 기법을 사용한다.
  */

  /*
    믹스인 코드를 구현하는 방법은 여러가지가 있는데
    아래 코드는 그 중에 한가지로, 타입스크립트의 공식 문서에도 소개되어있는 코드다.
  */
  baseClasses.forEach(function (baseClass) {
    Object.getOwnPropertyNames(baseClass.prototype).forEach(function (name) {
      var descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);

      if (descriptor) {
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    });
  });
}

var Api =
/** @class */
function () {
  function Api() {}

  Api.prototype.getRequest = function (url) {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    ajax.send();
    return JSON.parse(ajax.response);
  };

  return Api;
}();

var NewsFeedApi =
/** @class */
function () {
  function NewsFeedApi() {}

  NewsFeedApi.prototype.getData = function () {
    return this.getRequest(NEWS_URL);
  };

  return NewsFeedApi;
}();

var NewsDetailApi =
/** @class */
function () {
  function NewsDetailApi() {}

  NewsDetailApi.prototype.getData = function (id) {
    return this.getRequest(CONTENT_URL.replace("@id", id));
  };

  return NewsDetailApi;
}();

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

function makeFeeds(feeds) {
  for (var i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
} // DO :: 타입 가드


function updateView(html) {
  // 돔에서 root를 찾지 못할 경우 container는 null이 될 수도 있으므로
  // container가 존재할 때만 innerHTML 속성을 사용하도록 "타입 가드" 코드를 꼭 작성하기
  if (container) {
    container.innerHTML = html;
  } else {
    console.error("최상위 컨테이너가 존재하지 않으므로 UI 생성에 실패하였습니다.");
  } // 리턴값이 없을 땐 리턴값의 타입 정의를 void라고 해주면 된다

} // TODO 뉴스 목록 =========================================================================


function newsFeed() {
  var api = new NewsFeedApi();
  var newsFeed = store.feeds;
  var newsList = []; // HACK HTML (nav)

  var template =
  /*html*/
  "\n    <div class=\"bg-gray-600 min-h-screen\">\n    <div class=\"bg-white text-xl\">\n      <div class=\"mx-auto px-4\">\n        <div class=\"flex justify-between items-center py-6\">\n          <div class=\"flex justify-start\">\n            <h1 class=\"font-extrabold\">Hacker News</h1>\n          </div>\n          <div class=\"items-center justify-end\">\n            <a href=\"#/page/{{__prev_page__}}\" class=\"text-gray-500\">\n              Previous\n            </a>\n            <a href=\"#/page/{{__next_page__}}\" class=\"text-gray-500 ml-4\">\n              Next\n            </a>\n          </div>\n        </div> \n      </div>\n    </div>\n    <div class=\"p-4 text-2xl text-gray-700\">\n      {{__news_feed__}}        \n    </div>\n  </div>\n  ";

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(api.getData()); // 기존 getData 함수를 NewsFeedApi 클래스의 메소드로 대체했는데,
    // 정의하는 쪽 코드는 조금 늘어났지만 여기, 사용하는 쪽 코드는 아주 단순하고 간결해졌다.
    // 제네릭 타입을 명시해주지 않아도 되고 url도 넘겨주지 않아도 되기 떄문에
    // API 호출이 반복된다면 이렇게 한번만 위에서 디테일하게 정의해놓으면 이후의 코드가 훨씬 깔끔해진다.
  }

  for (var i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // HACK HTML (list)
    newsList.push(
    /*html*/
    "\n      <div class=\"p-6 ".concat(newsFeed[i].read ? "bg-gray-500" : "bg-white", " mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100\">\n      <div class=\"flex\">\n        <div class=\"flex-auto\">\n          <a href=\"#/show/").concat(newsFeed[i].id, "\">").concat(newsFeed[i].title, "</a>  \n        </div>\n        <div class=\"text-center text-sm\">\n          <div class=\"w-10 text-white bg-green-300 rounded-lg px-0 py-2\">").concat(newsFeed[i].comments_count, "</div>\n        </div>\n      </div>\n      <div class=\"flex mt-3\">\n        <div class=\"grid grid-cols-3 text-sm text-gray-500\">\n          <div><i class=\"fas fa-user mr-1\"></i>").concat(newsFeed[i].user, "</div>\n          <div><i class=\"fas fa-heart mr-1\"></i>").concat(newsFeed[i].points, "</div>\n          <div><i class=\"far fa-clock mr-1\"></i>").concat(newsFeed[i].time_ago, "</div>\n        </div>  \n      </div>\n    </div>    \n    "));
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace("{{__prev_page__}}", String(store.currentPage > 1 ? store.currentPage - 1 : 1));
  template = template.replace("{{__next_page__}}", String(store.currentPage * 10 < newsFeed.length ? store.currentPage + 1 : store.currentPage));
  updateView(template);
} // TODO 뉴스 내용 ====================================================================================================


function newsDetail() {
  var id = location.hash.substring(7);
  var api = new NewsDetailApi();
  var newsContent = api.getData(id); // HACK HTML (내용)

  var template =
  /* html */
  "\n    <div class=\"bg-gray-600 min-h-screen pb-8\">\n      <div class=\"bg-white text-xl\">\n        <div class=\"mx-auto px-4\">\n          <div class=\"flex justify-between items-center py-6\">\n            <div class=\"flex justify-start\">\n              <h1 class=\"font-extrabold\">Hacker News</h1>\n            </div>\n            <div class=\"items-center justify-end\">\n              <a href=\"#/page/".concat(store.currentPage, "\" class=\"text-gray-500\">\n                <i class=\"fa fa-times\"></i>\n              </a>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"h-full border rounded-xl bg-white m-6 p-4 \">\n        <h2>").concat(newsContent.title, "</h2>\n        <div class=\"text-gray-400 h-20\">\n          ").concat(newsContent.content, "\n        </div>\n\n        {{__comments__}}\n\n      </div>\n    </div>\n  "); // 현재 글 읽음 처리

  for (var i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === +id) {
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace("{{__comments__}}", makeComment(newsContent.comments)));
} // TODO 뉴스 내용 댓글 및 대대대대댓글 ==============================================================


function makeComment(comments) {
  var commentString = [];

  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i]; // HACK HTML (댓글)

    commentString.push(
    /* html */
    "\n      <div style=\"padding-left: ".concat(comment.level * 40, "px;\" class=\"mt-4\">\n        <div class=\"text-gray-400\">\n          <i class=\"fa fa-sort-up mr-2\"></i>\n          <strong>").concat(comment.user, "</strong> ").concat(comment.time_ago, "\n        </div>\n        <p class=\"text-gray-700\">").concat(comment.content, "</p>\n      </div>     \n    "));

    if (comment.comments.length) {
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join("");
} // TODO 라우터 ==========================================================================


function router() {
  var routePath = location.hash; // hash 에 #만 들어있으면 빈 값을 반환함

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
},{}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "1302" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.ts"], null)
//# sourceMappingURL=/app.c61986b1.js.map