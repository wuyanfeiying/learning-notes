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

#### Webpack 插件机制
- 目的：
增强 Webpack 自动化能力

- 和Loader的区别：
Loader专注实现资源模块加载，从而去实现整体项目的打包。

- 意义：
Plugin 解决其他自动化工作。

- 举例：
  1. 清除dist目录
  2. 拷贝不需要打包的资源文件至输出目录
  3. 压缩输出代码

Wepack + Plugin ， 可以实现大多前端工程化工作

#### Webpack 常用插件-自动清除输出目录
`clean-webpack-plugin`
##### 问题
打包之后，dist目录下的文件并不会清除，每次打包只会覆盖掉同名称的文件。对于其他已经移除的文件，就会积累在里面。

##### 解决方案
`yarn add clean-webpack-plugin --dev`
文件：webpack.config.js
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  ...
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```
#### Webpack 常用插件-自动生成HTML插件
##### 问题
HTML都是通过硬编码的方式单独去存放在项目的根目录下，有如下问题：
1. 项目发布时，需要发布 根目录下的html文件和 dist目录下的打包结果。上线后需要确保，Html中的路径引用都是正确的。
2. 输出的目录或文件名（打包结果的配置），发生了变化，那么，index.html中的引用的脚本需要手动的修改
```js
<script src="dist/bundle.js"></script>
```

##### 解决方案
通过 Webpack 输出 HTML文件, 让HTML也参与构建过程。Webpack在构建过程中可以知道添加了多少个 bundle.js, 进而可以自动添加到 HTML 代码中。
- 安装 `html-webpack-plugin`
文件：webpack.config.js
```js
...
// HTMLWebpackPlugin 默认导出的是一个插件类型，不需要解构内部的成员
const HTMLWebpackPlugin  = require('html-webpack-plugin')

module.exports = {
  output:{
    // publicPath: 'dist/'
  },
  ...
  plugins: [
    new CleanWebpackPlugin()，
    new HTMLWebpackPlugin()
  ]
}
```
##### `html-webpack-plugin` 选项
文件：webpack.config.js
```js
...
module.exports = {
  ...
  plugins: [
    new HTMLWebpackPlugin({
      title: '', // 设置页面标题
      // 设置页面的标签
      meta: {
        viewport: "width=device-width"
      }
    })
  ]
}
```
- 使用插件自带的默认模版引擎 `EJS`
新建文件 `src/index.html`
```html
<h1><%= htmlWebpackPlugin.options.title %></h1>
```
在配置文件中配置
```js
...
module.exports = {
  ...
  plugins: [
    new HTMLWebpackPlugin({
      title: '', // 设置页面标题
      // 设置页面的标签
      meta: {
        viewport: "width=device-width"
      }，
      template: './src/index.html'
    })
  ]
}
```

##### 同时输出多个页面文件
在配置文件中配置加入多个 `html-webpack-plugin` 的实例对象即可
```js
...
module.exports = {
  ...
  plugins: [
    // 用于生成 index.html
    new HTMLWebpackPlugin({
      title: '', // 设置页面标题
      // 设置页面的标签
      meta: {
        viewport: "width=device-width"
      }，
      template: './src/index.html'
    }),
    // 用户生成 b.html
    new HTMLWebpackPlugin({
      filename: 'b.html'
    }),
    ...
  ]
}
```

#### Webpack 常用插件-处理静态文件
静态文件最终也要发布到线上，例如`favicon.ico`一般都会统一放到项目根目录下面的 `public` 目录下。
可以借助于 `copy-webpack-plugin`

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')
...
module.exports = {
  ...
  plugins: [
    new CopyWebpackPlugin([
      // 打包时会将 public 目录下的文件，全部拷贝到输出目录
      'public'
    ])
    ...
  ]
}