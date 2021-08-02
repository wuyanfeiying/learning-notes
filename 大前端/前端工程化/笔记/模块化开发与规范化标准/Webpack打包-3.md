<!--
 * @Date: 2021-08-01 21:00:45
 * @LastEditors: chuhongguang
-->
[TOC]
#### Webpack Loader 的工作原理
- 任务：开发一个 markdown-loader，加载mardown文件。
  - markdown文件是转换为html后，呈现在页面中的
1. 新建一个 `markdown-loader.js` 的文件
```js
// 输入： 加载到的资源文件的内容
// 输出：加工后的结果
  module.exports = source =>{
    return 'hello'
  }
```
2. 在 webpack.config.js 中配置
```js
module: {
  rules:[
    {
      test: /.md$/,
      use: './markdown-loader.js'
    }
  ]
}
```
##### 使用报错
webpack加载的过程，有点类似于工作的管道，可以一次使用多个loader,但是最终的结果，**必需是一段JavaScript代码**。
##### 解决方案
1. 将返回的结果改为JS代码；
2. 或者使用其他的Loader处理。

webpack会将结果拼接到最终输出的 bundle中，如果不是JS代码，会语法错误。

- 方案1：
```js
  module.exports = source =>{
    return console.log('hello')
  }
```
- 方案2：
安装 markdown解析的模块：`yarn add marked --dev`

```js
const marked = require('marked')
  module.exports = source =>{
    const html = marked(source)
    // 防止转义的字符串符号
    return `module.exports = ${JSON.strigify(html)}`
    return `export default = ${JSON.strigify(html)}`
  }
```
- 方案2升级版：
返回一个 html 字符串，交给下一个 loader处理。
安装 html解析的模块： `html-loader`

```js
const marked = require('marked')
  module.exports = source =>{
    const html = marked(source)
    return html
  }
```
在 webpack.config.js 中配置
```js
module: {
  rules:[
    {
      test: /.md$/,
      use: [
        'html-loader',
        './markdown-loader.js'
      ]
    }
  ]
}
```
##### 对Loader的小结：
1. Loader 负责资源文件从输入到输出的转换
2. 对于同一个资源可以一次使用多个 Loader（管道）