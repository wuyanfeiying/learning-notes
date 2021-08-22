<!--
 * @Date: 2021-08-21 16:24:40
 * @LastEditors: chuhongguang
-->

[TOC]

#### 懒加载实现流程梳理

1. import() 可以实现指定模块的懒加载操作
2. 当前懒加载的核心原理就是 jsonp
3. t 方法可以针对于内容进行不同处理(处理方式取决于传入的数值 8 6 7 3 2 1)

#### t 方法分析及实现

1. 接口两个参数, 一个是 value 一般用于表示被加载的模块 id, 第二个值 mode 是一个二进制的数值
2. t 方法内部做的第一件事情, 就是调用 自定义的 require 方法加载 value 对应的模块导出,重新赋值给 value
3. 当获取到了 value 值之后, 余下的 8 4 2 ,都是对当前的内容进行加工处理, 然后返回使用
4. 当 mode & 8 成立时, 直接将 value 返回 (相当于加载了 CommonJs 规范导出的内容)
5. 当 mode & 4 成立时, 直接将 value 返回 (相当于加载了 ESModule 规范导出的内容)
6. 如果上述条件都不成立,还是要继续处理 value, 定义一个 ns { }
   6.1 如果拿到的 value 是一个可以直接使用的内容, 例如是一个字符串, 将它挂载到 ns 的 default 属性上
   6.2 根据二进制和定义好的数值,取余,进行条件判断

```js
let mode = 0b1001; // 二进制

if (mode & 1) {
  // 1001
  console.log("第四位上是1");
}
if (mode & 8) {
  // 1001
  console.log("第1位上是1");
}
```

- 定义 t 方法, 用于加载指定的 value 的模块内容, 之后对内容进行处理再返回

```js
// 11 定义 t 方法, 用于加载指定的 value 的模块内容, 之后对内容进行处理再返回
__webpack_require__.t = function (value, mode) {
  // 01 加载 value 对应的模块内容( value 一般就是模块 id)
  // 加载之后的内容, 又重新赋值给 value 变量
  if (mode & 1) {
    value = __webpack_require__(value);
  }

  if (mode & 8) {
    // 加载了可以直接返回使用的内容
    // CommonJS 规范
    return value;
  }

  if (mode & 4 && typeof value === "object" && value.__esModule) {
    // ESModule 规范
    return value;
  }

  // 如果 8 和 4 都没有成立, 则需要自定义 ns 来通过 default 属性返回内容
  let ns = Object.create(null);
  __webpack_require__.r(ns);

  Object.defineProperty(ns, "default", { enumerable: true, value: value });
  if (mode & 2 && typeof value !== "string") {
    for (var key in value) {
      __webpack_require__.d(
        ns,
        ket,
        function (key) {
          return value[key];
        }.bind(null, key)
      );
    }
  }
  return ns;
};
```

#### 单文件懒加载源码分析 1

如何通过 import 动态的实现模块的懒加载:

```js
let oBtn = document.getElementById("btn");

oBtn.addEventListener("click", function () {
  import(/*webpackChunkName: "login"*/ "./login.js").then((login) => {
    console.log(login);
  });
});

console.log("index.js 执行了");
```

打包过程中, 打包文件里面比之前多了一下内容:

- `webpackJsonpCallback`

```js
// 合并模块
// 改变,让promise变为成功态
function webpackJsonpCallback(data) {}
```

- `__webpack_require__.e`

```js
__webpack_require__.e = function requireEnsure(chunkId) {};
```

- `jsonpArray`
  会重新原生的 push 方法

#### 单文件懒加载源码分析 2

进行懒加载,首先调用

```js
__webpack_require__.e(/*! import() | login */ "login");
```

内部核心, `jsonp` 创建一个 `script` 标签 指定 `src`, 通过 `Promise.all` 往下执行, 在执行过程中, 会动态的加载 需要的被导入的模块内容, 会调用 修改后的 `push` 方法

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["login"],
  {
    "./src/login.js": function (module, exports) {
      // 01 采用 CMS 导出模块内容
      module.exports = "懒加载导出内容";
    },
  },
]);
```

因为通过原型改变了, `push` 方法,所以会调取 `webpackJsonpCallback` 方法,
在 `webpackJsonpCallback` 方法中, 因为前面有吧 `promise` 状态变为 成功的, 在方法中,会在执行 `resolve` 方法, 紧接着会走到 then 方法中, 接着会对内容做一些处理, 使用 `__webpack_require__.t` 方法会到处 `login.js` 中的内容

```js
.then(
            __webpack_require__.t.bind(
              null,
              /*! ./login.js */ "./src/login.js",
              7
            )
          )
```

最终在 `then` 中输入打印结果
