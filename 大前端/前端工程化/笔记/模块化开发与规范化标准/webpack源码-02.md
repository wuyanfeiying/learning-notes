<!--
 * @Date: 2021-08-21 10:20:17
 * @LastEditors: chuhongguang
-->
[TOC]
#### CommonJS模块打包
- 情况1:
通过 `require()`加载 `CommonJS` 规范的模块,`webpack` 默认支持
- 情况2:
采用 `ESModule` 规范导出, 在 `webpack` 打包中,首先调用 `__webpack_require__.r `方法, 先标识 ESM, 然后通过调用 `__webpack_require__.d` 方法, 往对象身上添加 导出时的属性, 提供 `getter`(做了一个 `return` 操作)

####  esModule模块打包
- 对于webpack打包来说,在主入口中可以 采用 `CommonJS` 规范 或者 `ESModule` 规范.
- 加载模块和被加载模块,导出的内容同样可以 采用 `CommonJS` 规范 或者 `ESModule` 规范.
- 对于webpack源码内部来说, 采用 `CommonJS` 规范 加载和导出,执行的代码内容是最少的.

#### 功能函数手写实现01

```js
(function (modules) {
  // 01 定义对象用于将来被缓存加载过的模块
  let installedModules = {};

  // 02 定义一个 __webpack_require__ 方法来替换 import require 加载操作
  function __webpack_require__(moduleId) {}

  // 03 定义 m 属性, 用于保存 modules
  __webpack_require__.m = modules;

  // 04 定义 c 属性, 用户保存 cache
  __webpack_require__.c = installedModules;

  // 05 定义 o 方法, 用于判断对象的身上是否存在指定的属性
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty(object, property);
  };

  // 06 定义 d 方法, 用于在对象的身上添加指定的属性, 同时给该属性提供一个 getter
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // 07 定义 r 方法, 用于标识当前模块是 ES6+ 类型(esModule 规范)
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };

  // 08 定义 n 方法,用于设置具体的 getter
  __webpack_require__.n = function (module) {
    let getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };

    __webpack_require__.d(getter, "a", getter);
    return getter;
  };

  // 09. 定义 p 属性, 用于保存资源访问路径
  __webpack_require__.p = "";

  // 10. 调用 __webpack_require__ 方法, 执行模块导入加载操作
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/index.js": function (module, exports, __webpack_require__) {
    let name = __webpack_require__(/*! ./login.js */ "./src/login.js");

    console.log("index.js 内容加载了");

    console.log(name);
  },

  "./src/login.js": function (module, exports) {
    module.exports = "chg";
  },
});

```

#### 功能函数手写实现02

`__webpack_require__`

```js
 // 02 定义一个 __webpack_require__ 方法来替换 import require 加载操作
  function __webpack_require__(moduleId) {
    // 2-1 判断当前缓存中是否存在要被加载的模块内容, 如果存在, 则直接返回
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }

    // 2-2 如果当前缓存中不存在则需要我们自己定义 {} , 执行被导入的模块内容加载
    let module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    }

    // 2-3 调用当前 moduleId 对应的函数, 然后完成内容的加载
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

    // 2-4 当上述的方法调用完成之后, 我们就可以修改 l 的值, 用于表示当前模块内容已经加载完成了
    module.l = true

    // 2-5 加载工作完成之后, 要将拿回来的内容返回值调用的位置
    return module.exports
  }
```