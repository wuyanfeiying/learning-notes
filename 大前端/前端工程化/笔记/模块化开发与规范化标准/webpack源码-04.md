<!--
 * @Date: 2021-08-22 19:31:55
 * @LastEditors: chuhongguang
-->

#### 单文件懒加载手写实现

`maybuilt.js`

1. 定义变量存放数组

```js
// 12 定义变量存放数组
let jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
```

2. 保存原生的 `push` 方法

```js
// 13. 保存原生的 push 方法
let oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
```

3. 重写原生的 `push` 方法

```js
// 14 重写原生的 push 方法
jsonpArray.push = webpackJsonpCallback;
```

4. 定义 `webpackJsonpCallback` 实现: 合并模块定义, 改变 `promise` 状态, 执行后续行为

```js
function webpackJsonpCallback(data) {
  // 01 获取需要被动态加载的模块 id
  let chunkIds = data[0];
  // 02 获取需要被动态加载模块依赖关系对象
  let moreModules = data[1];
  let chunkId,
    resolves = [];
  // 03 循环判断 chunkIds 里对应的模块内容是否已经完成了加载
  for (let i = 0; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if (
      Object.prototype.hasOwnProperty.call(installedChunks, chunkId) &&
      installedChunks[chunkId]
    ) {
      resolves.push(installedChunks[chunkId][0]);
    }
    // 更新当前的 chunk 状态
    installedChunks[chunkId] = 0;
  }

  for (moduleId in moreModules) {
    if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
      modules[moduleId] = moreModules[moduleId];
    }
  }

  while (resolves.length) {
    resolves.shift()();
  }
}
```

5. 定义 installedChunks 用于标识某个 chunkId 对应的 chunk 是否完成了 加载

```js
let installedChunks = {
  main: 0,
};
```

6. 定义 e 方法, 用于实现: 实现 jsonp 来加载内容, 利用 promise 来实现异步操作

```js
// 17 定义 e 方法, 用于实现: 实现 jsonp来加载内容, 利用 promise 来实现异步操作
__webpack_require__.e = function (chunkId) {
  // 01 定义一个数组用于存放 promise
  let promises = [];
  // 02 获取 chunkId 对应的 chunk 是否已经完成了加载
  let installedChunkData = installedChunks[chunkId];

  // 03 依据当前是否已完成的状态来执行后续的逻辑
  if (installedChunkData !== 0) {
    if (installedChunkData) {
      promises.push();
    } else {
      let promise = new Promise((resolve, reject) => {
        installedChunkData = installedChunks[chunkId] = [resolve, reject];
      });
      promises.push((installedChunkData[2] = promise));
      // 创建标签
      let script = document.createElement("script");

      // 设置 src
      script.src = jsonpScriptSrc(chunkId);

      // 写入 script 标签
      document.head.append(script);
    }
  }

  // 执行 Promise
  return Promise.all(promises);
};
```

7. 定义 jsonpScriptSrc 实现 src 的处理

```js
// 18 定义 jsonpScriptSrc 实现 src 的处理
function jsonpScriptSrc(chunkId) {
  return __webpack_require__.p + "" + chunkId + ".built.js";
}
```
