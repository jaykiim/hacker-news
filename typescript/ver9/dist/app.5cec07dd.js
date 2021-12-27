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

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewsDetailApi = exports.NewsFeedApi = exports.Api = void 0;

var Api =
/** @class */
function () {
  function Api(url) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  Api.prototype.getRequest = function () {
    return __awaiter(this, void 0, Promise, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , fetch(this.url)];

          case 1:
            response = _a.sent();
            return [4
            /*yield*/
            , response.json()];

          case 2:
            return [2
            /*return*/
            , _a.sent()];
        }
      });
    });
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
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        return [2
        /*return*/
        , this.getRequest()];
      });
    });
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
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        return [2
        /*return*/
        , this.getRequest()];
      });
    });
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

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

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

  function NewsFeedView(containerId, store) {
    var _this = _super.call(this, containerId, template) || this;

    _this.store = store;
    _this.api = new api_1.NewsFeedApi(config_1.NEWS_URL);
    return _this;
  }

  NewsFeedView.prototype.render = function () {
    return __awaiter(this, void 0, Promise, function () {
      var _a, _b, i, _c, id, title, comments_count, user, points, time_ago, read;

      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            this.store.currentPage = Number(location.hash.substring(7) || 1);
            if (!!this.store.hasFeeds) return [3
            /*break*/
            , 2];
            _b = (_a = this.store).setFeeds;
            return [4
            /*yield*/
            , this.api.getData()];

          case 1:
            _b.apply(_a, [_d.sent()]);

            _d.label = 2;

          case 2:
            for (i = (this.store.currentPage - 1) * 10; i < this.store.currentPage * 10; i++) {
              _c = this.store.getFeed(i), id = _c.id, title = _c.title, comments_count = _c.comments_count, user = _c.user, points = _c.points, time_ago = _c.time_ago, read = _c.read;
              this.addHtml(
              /*html*/
              "\n        <div class=\"p-6 ".concat(read ? "bg-gray-500" : "bg-white", " mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100\">\n          <div class=\"flex\">\n            <div class=\"flex-auto\">\n              <a href=\"#/show/").concat(id, "\">").concat(title, "</a>  \n            </div>\n            <div class=\"text-center text-sm\">\n              <div class=\"w-10 text-white bg-green-300 rounded-lg px-0 py-2\">").concat(comments_count, "</div>\n            </div>\n          </div>\n          <div class=\"flex mt-3\">\n            <div class=\"grid grid-cols-3 text-sm text-gray-500\">\n              <div><i class=\"fas fa-user mr-1\"></i>").concat(user, "</div>\n              <div><i class=\"fas fa-heart mr-1\"></i>").concat(points, "</div>\n              <div><i class=\"far fa-clock mr-1\"></i>").concat(time_ago, "</div>\n            </div>  \n          </div>\n        </div>    \n      "));
            }

            this.setTemplateData("news_feed", this.getHtml());
            this.setTemplateData("prev_page", String(this.store.prevPage));
            this.setTemplateData("next_page", String(this.store.nextPage));
            this.updateView();
            return [2
            /*return*/
            ];
        }
      });
    });
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

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

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
"\n  <div class=\"bg-gray-600 min-h-screen pb-8\">\n    <div class=\"bg-white text-xl\">\n      <div class=\"mx-auto px-4\">\n        <div class=\"flex justify-between items-center py-6\">\n          <div class=\"flex justify-start\">\n            <h1 class=\"font-extrabold\">Hacker News</h1>\n          </div>\n          <div class=\"items-center justify-end\">\n            <a href=\"#/page/{{__currentPage__}}\" class=\"text-gray-500\">\n              <i class=\"fa fa-times\"></i>\n            </a>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"h-full border rounded-xl bg-white m-6 p-4 \">\n      <h2>{{__title__}}</h2>\n      <div class=\"text-gray-400 h-20\">{{__content__}}</div>\n\n      {{__comments__}}\n\n    </div>\n  </div>\n";

var NewsDetailView =
/** @class */
function (_super) {
  __extends(NewsDetailView, _super);

  function NewsDetailView(containerId, store) {
    var _this = _super.call(this, containerId, template) || this;

    _this.store = store;
    return _this;
  }

  NewsDetailView.prototype.render = function () {
    return __awaiter(this, void 0, Promise, function () {
      var id, api, _a, title, content, comments;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            id = location.hash.substring(7);
            api = new api_1.NewsDetailApi(config_1.CONTENT_URL.replace("@id", id));
            return [4
            /*yield*/
            , api.getData()];

          case 1:
            _a = _b.sent(), title = _a.title, content = _a.content, comments = _a.comments;
            this.store.makeRead(Number(id)); // 현재 글 읽음 처리

            this.setTemplateData("comments", this.makeComment(comments));
            this.setTemplateData("currentPage", String(this.store.currentPage));
            this.setTemplateData("title", title);
            this.setTemplateData("content", content);
            this.updateView();
            return [2
            /*return*/
            ];
        }
      });
    });
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
},{"./news-feed-view":"src/page/news-feed-view.ts","./news-detail-view":"src/page/news-detail-view.ts"}],"src/store.ts":[function(require,module,exports) {
"use strict";
/*

  ! 스토어 클래스를 안전하게 만들고, 필요한 클래스에 인스턴스로 제공해보자.
  기존 스토어에서 관리했던 상태는 currentPage와 feeds인데, 이것을 여기서 속성으로 가지고 있으면 될 것 같다.
  그런데 currentPage와 feeds에 직접적으로 접근해서 아무렇게나 수정할 수 있도록 하면
  실수로 잘못된 값을 넣었을 때 앱이 동작하지 않을수도 있으므로
  중요한 정보가 잘못 세팅되는 것을 원천적으로 방어해보자.
   
  ! private을 써서 feeds 및 currentPage에 직접적인 접근은 불가하게 하고,
  ! 대신에 관련해서 필요한 기능들은 여기서 만들어서 제공해주면 된다.
  
  그럼 어떤 기능을 제공해줘야할까?

  우선 NewsFeedView에서 prev, current 버튼을 눌렀을 때 페이지가 이동되려면
  현재 몇 페이지에 있어야 하는지 알아야 하므로 페이지 번호를 볼 수 있어야 한다.

  ! 외부에서 값을 읽을 땐 속성에 직접 접근하는 것이 아니라 그저 메소드가 리턴한 값을 보게 하면 된다.

  근데 이 기능을 메소드로 제공하면 사용하는 측에선 고작 숫자값 하나 받으려고 매번 getCurrentPage() 이런 식으로
  호출을 해야하니까 사용하기가 너무 불편할 것이다.

  ! 이럴 때 getter를 쓰면 사용하는 측에선 그냥 속성에 접근하듯 store.currentPage로 getter의 리턴값을 얻는다.
  만들 땐 그냥 메소드 만들듯 만들고 이름 앞에 get 키워드만 붙이면 된다. get currentPage() {}
  근데 내부 속성명과 이름이 겹치니까 내부 속성명 앞에 언더바를 붙여준다. (어차피 밖에서 안쓸 값이니까)

  또 어떤 기능을 제공해야할까.
  ! 내부의 _currentPage를 수정시키는 기능도 제공해야한다.
  
  ! 이걸 setter로 제공하면 사용하는 측에선 store.currentPage = 처럼 대입문으로 속성값 수정 가능하다.
  ! 하지만 저렇게 대입해도 사실은 밑에 보이는 setter 함수를 동작시키는거라서
  엣지케이스나 숫자가 아닌 타입의 인자가 들어오는 것에 대한 방어 처리가 일어난다.

*/

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Store =
/** @class */
function () {
  function Store() {
    this.feeds = [];
    this._currentPage = 1;
  }

  Object.defineProperty(Store.prototype, "currentPage", {
    get: function get() {
      return this._currentPage;
    },
    set: function set(page) {
      /*
        숫자가 들어와도 음수면 안되는 경우? if (prage < = 0) return;
        이렇게 엣지케이스에 대한 방어도 가능하다
      */
      this._currentPage = page;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Store.prototype, "prevPage", {
    /*
      어차피 페이지 번호를 여기서 관리하고 있으니까, 그 김에
      다음 페이지 번호와 이전 페이지 번호를 리턴하는 함수도 제공해주면 편리할 것이다
    */
    get: function get() {
      return this._currentPage > 1 ? this._currentPage - 1 : 1;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Store.prototype, "nextPage", {
    get: function get() {
      return this._currentPage * 10 < this.feeds.length ? this._currentPage + 1 : this._currentPage;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Store.prototype, "feedsLen", {
    /*
      feeds.length로 반복문을 돈다거나 하는 코드가 있었는데
      이제 feeds 속성에 접근이 불가하므로 feeds의 길이를 리턴해주는 getter도 만들자.
    */
    get: function get() {
      return this.feeds.length;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Store.prototype, "hasFeeds", {
    /*
      피드 길이가 0이면 데이터를 받아오는 코드가 있었는데,
      이것도 그냥 피드가 비었는지 아닌지 체크해주는 getter를 제공해주자
    */
    get: function get() {
      return this.feeds.length > 0;
    },
    enumerable: false,
    configurable: true
  });
  /* 전체 피드를 내보내주는 것은 메소드로 만들어주자 */

  Store.prototype.getAllFeeds = function () {
    return this.feeds;
  };
  /* feeds 배열에서 특정 인덱스의 피드에 접근하는 코드도 있었으므로 */


  Store.prototype.getFeed = function (index) {
    return this.feeds[index];
  };
  /* API로 받아온 뉴스 목록 데이터에 read 속성을 추가해서 feeds에 저장해주는 것도 메소드로 제공하자 */


  Store.prototype.setFeeds = function (feeds) {
    this.feeds = feeds.map(function (feed) {
      return __assign(__assign({}, feed), {
        read: false
      });
    });
  };
  /*
    읽은 글의 read 속성값을 바꿔주는 코드도 있었는데,
    이것도 이젠 외부에서 feeds에 접근이 안되기 때문에 메소드로 제공해주자
  */


  Store.prototype.makeRead = function (id) {
    var feed = this.feeds.find(function (feed) {
      return feed.id === id;
    });

    if (feed) {
      feed.read = true;
    }
  };

  return Store;
}();

exports.default = Store;
},{}],"src/app.ts":[function(require,module,exports) {
"use strict";
/*

  ! Fetch & Promise -> async/await
  
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

var page_1 = require("./page");

var store_1 = __importDefault(require("./store"));

var store = new store_1.default();
var router = new router_1.default();
var newsFeedView = new page_1.NewsFeedView("root", store);
var newsDetailView = new page_1.NewsDetailView("root", store);
router.setDefaultPage(newsFeedView);
router.addRoutePath("/page/", newsFeedView);
router.addRoutePath("/show/", newsDetailView);
router.route();
},{"./core/router":"src/core/router.ts","./page":"src/page/index.ts","./store":"src/store.ts"}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "14975" + '/');

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