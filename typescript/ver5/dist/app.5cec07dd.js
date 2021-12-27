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
})({"src/core/router.ts":[function(require,module,exports) {
"use strict";

var __values = this && this.__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function next() {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Router =
/** @class */
function () {
  function Router() {
    window.addEventListener("hashchange", this.route.bind(this));
    this.routeTable = [];
    this.defaultRoute = null;
  }

  Router.prototype.setDefaultPage = function (page) {
    this.defaultRoute = {
      path: "",
      page: page
    };
  };

  Router.prototype.addRoutePath = function (path, page) {
    this.routeTable.push({
      path: path,
      page: page
    });
  };

  Router.prototype.route = function () {
    var e_1, _a;

    var routePath = location.hash;

    if (routePath === "" && this.defaultRoute) {
      this.defaultRoute.page.render();
    }

    try {
      for (var _b = __values(this.routeTable), _c = _b.next(); !_c.done; _c = _b.next()) {
        var routeInfo = _c.value;

        if (routePath.indexOf(routeInfo.path) >= 0) {
          routeInfo.page.render();
          break;
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  return Router;
}();

exports.default = Router;
},{}],"src/core/view.ts":[function(require,module,exports) {
"use strict"; // TODO VIEW 클래스: 공통 =========================================================================

Object.defineProperty(exports, "__esModule", {
  value: true
});

var View =
/** @class */
function () {
  function View(containerId, template) {
    var containerElement = document.getElementById(containerId); // ID가 containerId인 엘리먼트가 존재하지 않는다면 앱을 실행할 수 없으므로 종료시킨다

    if (!containerElement) throw "최상위 컨테이너가 존재하지 않으므로 UI 생성에 실패하였습니다.";
    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  View.prototype.updateView = function () {
    // 기존엔 container가 null인지 아닌지 체크했지만 여기선 생성자에서 이미 했으므로
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  };

  View.prototype.addHtml = function (htmlString) {
    this.htmlList.push(htmlString);
  };

  View.prototype.getHtml = function () {
    var snapshot = this.htmlList.join("");
    this.clearHtmlList();
    return snapshot;
  };

  View.prototype.setTemplateData = function (key, value) {
    this.renderTemplate = this.renderTemplate.replace("{{__".concat(key, "__}}"), value);
  };

  View.prototype.clearHtmlList = function () {
    this.htmlList = [];
  };

  return View;
}();

exports.default = View;
},{}],"src/core/api.ts":[function(require,module,exports) {
"use strict"; // TODO Api 클래스 =======================================================================================

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewsDetailApi = exports.NewsFeedApi = exports.Api = void 0;

var Api =
/** @class */
function () {
  // 인스턴스 객체의 초기값
  function Api(url) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  Api.prototype.getRequest = function () {
    this.ajax.open("GET", this.url, false);
    this.ajax.send();
    return JSON.parse(this.ajax.response);
  };

  return Api;
}();

exports.Api = Api;

var NewsFeedApi =
/** @class */
function (_super) {
  __extends(NewsFeedApi, _super);

  function NewsFeedApi() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  NewsFeedApi.prototype.getData = function () {
    return this.getRequest();
  };

  return NewsFeedApi;
}(Api);

exports.NewsFeedApi = NewsFeedApi;

var NewsDetailApi =
/** @class */
function (_super) {
  __extends(NewsDetailApi, _super);

  function NewsDetailApi() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  NewsDetailApi.prototype.getData = function () {
    return this.getRequest();
  };

  return NewsDetailApi;
}(Api);

exports.NewsDetailApi = NewsDetailApi;
},{}],"src/config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONTENT_URL = exports.NEWS_URL = void 0;
exports.NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
exports.CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
},{}],"src/page/news-feed-view.ts":[function(require,module,exports) {
"use strict"; // TODO VIEW 클래스: 뉴스 목록 =========================================================================

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var view_1 = __importDefault(require("../core/view"));

var api_1 = require("../core/api");

var config_1 = require("../config");

var template = "\n  <div class=\"bg-gray-600 min-h-screen\">\n    <div class=\"bg-white text-xl\">\n      <div class=\"mx-auto px-4\">\n        <div class=\"flex justify-between items-center py-6\">\n          <div class=\"flex justify-start\">\n            <h1 class=\"font-extrabold\">Hacker News</h1>\n          </div>\n          <div class=\"items-center justify-end\">\n            <a href=\"#/page/{{__prev_page__}}\" class=\"text-gray-500\">\n              Previous\n            </a>\n            <a href=\"#/page/{{__next_page__}}\" class=\"text-gray-500 ml-4\">\n              Next\n            </a>\n          </div>\n        </div> \n      </div>\n    </div>\n    <div class=\"p-4 text-2xl text-gray-700\">\n      {{__news_feed__}}        \n    </div>\n  </div>\n";

var NewsFeedView =
/** @class */
function (_super) {
  __extends(NewsFeedView, _super);

  function NewsFeedView(containerId) {
    // 생성자 함수에는 인스턴스 객체에서 필요한 속성 정의 및 재호출될 필요없는 코드들을 넣는다.
    var _this = // 일단 기존 NewsFeed 함수에서 모든 코드를 가져온 뒤
    // 생성자 함수가 갖고 있지 않아도 될 코드들은 해당하는 목적의 메소드들로 분류해둔다
    // 파생 클래스의 생성자는 반드시 super를 호출해줘야 한다
    // super의 인자는 상위 클래스 생성자의 파라미터로 넘어간다
    _super.call(this, containerId, template) || this;

    _this.api = new api_1.NewsFeedApi(config_1.NEWS_URL);
    _this.feeds = window.store.feeds;

    if (_this.feeds.length === 0) {
      _this.feeds = window.store.feeds = _this.api.getData();

      _this.makeFeeds();
    }

    return _this;
  }

  NewsFeedView.prototype.render = function () {
    // prev, next 버튼이 눌림에 따라서 라우터에 의해 재실행될 부분만 여기에 두면 된다.
    window.store.currentPage = Number(location.hash.substring(7) || 1);

    for (var i = (window.store.currentPage - 1) * 10; i < window.store.currentPage * 10; i++) {
      var _a = this.feeds[i],
          id = _a.id,
          title = _a.title,
          comments_count = _a.comments_count,
          user = _a.user,
          points = _a.points,
          time_ago = _a.time_ago,
          read = _a.read;
      this.addHtml(
      /*html*/
      "\n        <div class=\"p-6 ".concat(read ? "bg-gray-500" : "bg-white", " mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100\">\n        <div class=\"flex\">\n          <div class=\"flex-auto\">\n            <a href=\"#/show/").concat(id, "\">").concat(title, "</a>  \n          </div>\n          <div class=\"text-center text-sm\">\n            <div class=\"w-10 text-white bg-green-300 rounded-lg px-0 py-2\">").concat(comments_count, "</div>\n          </div>\n        </div>\n        <div class=\"flex mt-3\">\n          <div class=\"grid grid-cols-3 text-sm text-gray-500\">\n            <div><i class=\"fas fa-user mr-1\"></i>").concat(user, "</div>\n            <div><i class=\"fas fa-heart mr-1\"></i>").concat(points, "</div>\n            <div><i class=\"far fa-clock mr-1\"></i>").concat(time_ago, "</div>\n          </div>  \n        </div>\n      </div>    \n      "));
    }

    this.setTemplateData("news_feed", this.getHtml());
    this.setTemplateData("prev_page", String(window.store.currentPage > 1 ? window.store.currentPage - 1 : 1));
    this.setTemplateData("next_page", String(window.store.currentPage * 10 < this.feeds.length ? window.store.currentPage + 1 : window.store.currentPage));
    this.updateView();
  };

  NewsFeedView.prototype.makeFeeds = function () {
    for (var i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  };

  return NewsFeedView;
}(view_1.default);

exports.default = NewsFeedView;
},{"../core/view":"src/core/view.ts","../core/api":"src/core/api.ts","../config":"src/config.ts"}],"src/page/news-detail-view.ts":[function(require,module,exports) {
"use strict"; // TODO VIEW 클래스: 뉴스 상세 =========================================================================

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var view_1 = __importDefault(require("../core/view"));

var api_1 = require("../core/api");

var config_1 = require("../config");

var template =
/* html */
"\n  <div class=\"bg-gray-600 min-h-screen pb-8\">\n    <div class=\"bg-white text-xl\">\n      <div class=\"mx-auto px-4\">\n        <div class=\"flex justify-between items-center py-6\">\u3134\n          <div class=\"flex justify-start\">\n            <h1 class=\"font-extrabold\">Hacker News</h1>\n          </div>\n          <div class=\"items-center justify-end\">\n            <a href=\"#/page/{{__currentPage__}}\" class=\"text-gray-500\">\n              <i class=\"fa fa-times\"></i>\n            </a>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"h-full border rounded-xl bg-white m-6 p-4 \">\n      <h2>{{__title__}}</h2>\n      <div class=\"text-gray-400 h-20\">{{__content__}}</div>\n\n      {{__comments__}}\n\n    </div>\n  </div>\n";

var NewsDetailView =
/** @class */
function (_super) {
  __extends(NewsDetailView, _super);

  function NewsDetailView(containerId) {
    return _super.call(this, containerId, template) || this;
  }

  NewsDetailView.prototype.render = function () {
    var id = location.hash.substring(7);
    var api = new api_1.NewsDetailApi(config_1.CONTENT_URL.replace("@id", id));
    var newsDetail = api.getData(); // 현재 글 읽음 처리

    for (var i = 0; i < window.store.feeds.length; i++) {
      if (window.store.feeds[i].id === +id) {
        window.store.feeds[i].read = true;
        break;
      }
    }

    this.setTemplateData("comments", this.makeComment(newsDetail.comments));
    this.setTemplateData("currentPage", String(window.store.currentPage));
    this.setTemplateData("title", newsDetail.title);
    this.setTemplateData("content", newsDetail.content);
    this.updateView();
  };

  NewsDetailView.prototype.makeComment = function (comments) {
    for (var i = 0; i < comments.length; i++) {
      var comment = comments[i];
      this.addHtml(
      /* html */
      "\n        <div style=\"padding-left: ".concat(comment.level * 40, "px;\" class=\"mt-4\">\n          <div class=\"text-gray-400\">\n            <i class=\"fa fa-sort-up mr-2\"></i>\n            <strong>").concat(comment.user, "</strong> ").concat(comment.time_ago, "\n          </div>\n          <p class=\"text-gray-700\">").concat(comment.content, "</p>\n        </div>     \n      "));

      if (comment.comments.length) {
        this.addHtml(this.makeComment(comment.comments));
      }
    }

    return this.getHtml();
  };

  return NewsDetailView;
}(view_1.default);

exports.default = NewsDetailView;
},{"../core/view":"src/core/view.ts","../core/api":"src/core/api.ts","../config":"src/config.ts"}],"src/page/index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewsDetailView = exports.NewsFeedView = void 0;

var news_feed_view_1 = require("./news-feed-view");

Object.defineProperty(exports, "NewsFeedView", {
  enumerable: true,
  get: function get() {
    return __importDefault(news_feed_view_1).default;
  }
});

var news_detail_view_1 = require("./news-detail-view");

Object.defineProperty(exports, "NewsDetailView", {
  enumerable: true,
  get: function get() {
    return __importDefault(news_detail_view_1).default;
  }
});
/*
  페이지는 나중에 훨씬 더 많아질 수 있는데 각각 개별 파일 안에서 export를 하면
  사용하는 측에서 import구문을 페이지 파일 갯수만큼 써서 불러와야 하기도 하고
  만약 page 폴더안에 세부 디렉토리를 만들어서 경로가 바뀌기라도 하면
  사용하는 측에선 해당 파일을 import 하는 구문마다 쫓아가서 경로를 변경해줘야한다.

  그래서 이렇게 index.ts 파일을 만들어서 한군데에서 export 해주면
  파일명이 index이므로 가져다 쓰는 쪽에서는 /page 이하의 패스를 쓰지 않아도 되고
  현재 폴더에서 하위 디렉토리가 생기든 말든 경로 수정해줄 필요가 없어진다.
*/
},{"./news-feed-view":"src/page/news-feed-view.ts","./news-detail-view":"src/page/news-detail-view.ts"}],"src/app.ts":[function(require,module,exports) {
"use strict"; // ! 파일을 분리해보자

/*
  현재까진 코드가 300라인 안팎으로 그리 많지는 않지만 앞으로 기능을 더 추가하고 프로젝트를 발전시켜나간다면
  app.ts 파일 하나만 가지고 계속 코드를 수정하고 추가하고 하기엔 분명히 한계가 있다.
  코드도 그렇게 아름답지 않고 간단한 코드를 찾기 위해서 스크롤을 한참 위아래로 내려야하는 측면도 있기 때문에
  코드를 분리해서 훨씬 더 깔끔하고 관리하기 쉬운 형태의 프로젝트를 만들어보자.
*/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var router_1 = __importDefault(require("./core/router"));

var page_1 = require("./page"); // 전역 객체를 app파일에서 선언해줘야하는데 그럼 다른 파일에서 접근이 안된다.
// 아주 좋은 방법은 아니지만 일단 간편하게 브라우저의 window 객체에 속성으로 저장해놓고,
// 이후에 개선해보자.
// 하는 방법은, JS에서는 매우 간단하다. window.store = 하고 스토어를 밀어넣어버리기만 하면 되는데
// TS에서는 그렇게 할 수 없다.
// 먼저 window에 추가할 속성의 타입을 정의해야하는데 그 방법이 조금 까다롭다.


var store = {
  currentPage: 1,
  feeds: []
};
window.store = store;
var router = new router_1.default();
var newsFeedView = new page_1.NewsFeedView("root");
var newsDetailView = new page_1.NewsDetailView("root");
router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);
router.route();
},{"./core/router":"src/core/router.ts","./page":"src/page/index.ts"}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "3221" + '/');

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
},{}]},{},["../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/app.ts"], null)
//# sourceMappingURL=/app.5cec07dd.js.map