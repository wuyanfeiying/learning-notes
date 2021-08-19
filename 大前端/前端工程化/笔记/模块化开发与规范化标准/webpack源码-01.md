<!--
 * @Date: 2021-08-19 20:54:31
 * @LastEditors: chuhongguang
-->
#### 打包后文件分析
> webpack 本质上就是一个模块打包器，Loader和plugin更像是打包过程中需要额外完成的一些事情。

新建一个项目，简单的配置后，进行打包
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'none',
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: path.resolve('dist') // 会自动拼接根目录
  },
  // 配置插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
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
-  05 这个函数在将来某个时间点上会被调用，同时会接收到一定的参数，利用这些参数就可以实现模块的加载操作。
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
