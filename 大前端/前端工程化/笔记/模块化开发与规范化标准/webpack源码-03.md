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
#### 单文件懒加载源码分析1