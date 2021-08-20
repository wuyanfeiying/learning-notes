<!--
 * @Date: 2021-08-19 20:54:31
 * @LastEditors: chuhongguang
-->

#### 打包后文件分析

> webpack 本质上就是一个模块打包器，Loader 和 plugin 更像是打包过程中需要额外完成的一些事情。

新建一个项目，简单的配置后，进行打包

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "none",
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "built.js",
    path: path.resolve("dist"), // 会自动拼接根目录
  },
  // 配置插件
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
```

##### 分析打包后的文件

一个匿名函数，进行自调用，参数是一个对象，键值对，键：入口文件路径；值：一个函数的定义(模块的定义）。

```js
(function (modules) {...})({
      "./src/index.js":
      /*! no static exports found */
      function (module, exports) {
        console.log("index.js 内容");
        module.exports = "入口文件导出内容";
      },
})
```

- 01 打包后的文件就是一个函数自调用，当前函数调用时传入一个对象。
- 02 这个对象我们为了方便将之称之为是**模块定义**，它是一个*键值对*
- 03 这个键名就是当前被夹在模块的文件名与某个目录的拼接
- 04 这个键值就是一个函数， 和 `node.js` 里的模块加载有一些类似，会将被加载模块中的内容包裹于一个函数中。
- 05 这个函数在将来某个时间点上会被调用，同时会接收到一定的参数，利用这些参数就可以实现模块的加载操作。
- 06 针对于上述代码就相当于将 `{} (模块定义)`传递给了 `modules`

```js
(function (modules) {
  // 定义一个空对象，缓存被加载的模块
  var installedModules = {};
  // webpack自定义函数，核心作用是返回模块的 exports
  function __webpack_require__(moduleId)({...})
  ...
  // 传入了主入口的路径
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})(...)
```

##### 单文件打包后源码调试

1. 自调用函数，传入模块定义

```js
(function (modules) {})({
  "./src/index.js":
    /*! no static exports found */
    function (module, exports) {
      console.log("index.js 内容");
      module.exports = "入口文件导出内容";
    },
});
```

2. 模块定义，最终会在函数调用的过程中传给函数参数 modules
3. 紧接着函数调用 `__webpack_require__(moduleId)`，主入口（模块 ID）传入进来
4. 找到 `moduleId` 所对应的函数值进行调用

```js
modules[moduleId].call(
  module.exports,
  module,
  module.exports,
  __webpack_require__
);
```

5. 在调用的过程中，依据 index.js 所映射的语法，将内容进行导出
6. 导出的内容放在了 module.exports 上
7. 最终拿到打包后的导出结果

```js
return __webpack_require__((__webpack_require__.s = "./src/index.js"));
```

##### 功能函数说明

1. 定义对象存放缓存已加载过的模块

```js
var installedModules = {};
```

2. webpack 自定义的一个加载方法，核心功能就是返回被加载模块中导出的内容

```js
function __webpack_require__(moduleId) {}
```

3. 将模块定义保存一份，通过 m 属性挂载到自定义方法身上

```js
__webpack_require__.m = modules;
```

4. 绑定缓存到 c 属性上

```js
__webpack_require__.c = installedModules;
```

5. 判断传入的对象是否有符合指定的属性， 有返回 true， 反之

```js
__webpack_require__.o = function (object, property) {};
```

6. 判断有没有某个属性,有的话就加上,同时提供一个房问题

```js
__webpack_require__.d = function (exports, name, getter) {
  //  如果当前 exports 身上不具备 name 属性, 则条件成立
  if (!__webpack_require__.o(exports, name)) {
    Object.defineProperty(exports, name, {
      enumerable: true,
      get: getter,
    });
  }
};
```

7. 给对象身上强制加一个标记, 来区分是 esModule 还是 非 esModule

```js
__webpack_require__.r = function (exports) {
  // 下面的条件成立就说明是一个 esModule
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    // Object.prototype.toString.call(exports) 会返回一个 module
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module",
    });
  }
  // 如果条件不成立,直接在 exports 对象身上 添加一个 __esModule 属性, 值为 true
  Object.defineProperty(exports, "__esModule", {
    value: true,
  });
};
```

8. 懒加载调用

```js
__webpack_require__.t = function (value, mode) {
  // 调用 t 方法之后,拿到被加载模块中的内容 value
  // 对于 value 可能直接返回, 也可能会处理之后再返回
  if (mode & 1) value = __webpack_require__(value);
  if (mode & 8) return value;
  if (mode & 4 && typeof value === "object" && value && value.__esModule)
    return value;
  var ns = Object.create(null);
  __webpack_require__.r(ns);
  Object.defineProperty(ns, "default", {
    enumerable: true,
    value: value,
  });
  if (mode & 2 && typeof value != "string")
    for (var key in value)
      __webpack_require__.d(
        ns,
        key,
        function (key) {
          return value[key];
        }.bind(null, key)
      );
  return ns;
};
```

9. 返回 default 属性 和 非default属性 的方法

```js
  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  }
```

10. webpack 配置项中的 public 属性的值

```js
 __webpack_require__.p = "";
```
11. 缓存模块id

```js
  __webpack_require__.s = "./src/index.js"
```
