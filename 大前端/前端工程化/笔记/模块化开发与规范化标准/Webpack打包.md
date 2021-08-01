<!--
 * @Date: 2021-07-30 22:26:35
 * @LastEditors: chuhongguang
-->
[TOC]
### 模块打包工具的由来
> 模块化解决了我们在开发过程中复杂应用的代码组织问题。

#### 新问题
随着引用了模块化，应用也会随之产生新的问题
1. ES modules 存在环境兼容问题；
    - 主流浏览器支持ESM ，一些浏览器不支持，无法得知用户的使用情况。
2. 模块文件过多，网络请求频繁；
3. 所有前端资源都需要模块化；

#### 前端模块化打包工具可以解决
1. 新特性代码编译；
2. 模块化JavaScript打包；
3. 支持不同类型的资源模块；

### 模块打包工具概要
> 打包工具解决的是前端整体的模块化，并不单指 JavaScript 模块化
#### 主流模块打包工具
`webpack`、`rollup`、`Browserify`
#### webpack 特性
1. 模块打包器（Module bundler）
    - 将零散的代码，放到一个文件当中
2. 模块加载器（Loader）
    - 代码中有环境兼容问题的代码，可以再打包的过程中通过 `模块加载器 Loader`,对其进行编译转换。
3. 代码拆分（COde Splitting)
    - 可以按照自己的想法去拆分代码进行打包，避免文件太碎或者文件太大的问题。
4. 资源模块（Asset Module）
    - 可以载入任意资源的模块，例如：可以通过 `import` 加载 `css` 文件
#### webpack 配置文件
webpack 4 之后的版本，支持零配置，可以直接进行打包。按照约定将 `src/index.js` 中的文件打包为 `dist/main.js`。
在项目的根目录下，添加 `webpack.config.js` 的文件, 该文件运行在 node环境中，所以遵循CommonJS规范。
`webpack.config.js`
```js
const path = require('path')

module.exports = {
    // 入口配置，注意：如果是相对路径，./ 不可以省略
    entry: './src/main.js',
    // 出口配置
    output: {
        // 输出文件的名称
        filename: 'bundle.js',
        // 指定输出文件的目录，必须是绝对路径
        path: path.join(__dirname,'output')
    }
}
```

#### webpack 工作模式
简化了配置的程序，可以理解为，新增了几组预设的配置。
##### --mode
1. production 模式
   -  默认是 production, 会优化打包的结果
2. development 模式
   -  yarn webpack --mode development
   -  会自动优化打包速度, 方便调试代码
3. none 模式
    - yarn webpack --mode none
    - 运行最原始状态的打包，不会去做任何额外的处理
`webpack.config.js`
```js
module.exports = {
    mode: 'development',
}
```

#### webpack 资源模块加载
> webpack 内部默认的 Loader 是解析JS的文件，遇到其他类型的文件会打包失败。

例如：打包一个CSS文件
1. 先安装 `css-Loader`
```
yarn add css-loader --dev
```
2. 使用 `css-loader`
  `webpack.config.js`
```js
module.exports = {
    module:{
	    rules: [
            test: /.css$/,
            use: 'css-loader'
        ]
	}
}
```
只是引入 css-loader 的作用是将 css文件转化为 css模块，并不能使用它。
3. 安装 `style-loader`
将 css-loader 转换后的文件，以 style标签的形式，追加到页面上。
**注意：** 如果配置了多了 loader,执行时候，从后往前执行。
```js
module.exports = {
    module:{
	    rules: [
            test: /.css$/,
            use: [
                'style-loader',
                'css-loader',
            ]
        ]
	}
}
```

*loader是Webpack的核心，借助于Loader 就可以加载任何类型的资源。*

#### webpack 导入资源模块
一般webpack打包入口都是JS文件，其他类型的文件都是通过 import导入的。
**webpack 建议：**
根据代码的需要，动态的导入资源。
因为需要资源的不是应用，而是你此时编写的代码。
- 逻辑合理，JS 确实需要这些资源文件
- 确保线上资源不缺失，都是必要的

#### webpack 文件资源加载器
项目中，例如 `文件，字体，图片`，是没法用JS的方式去表示的。对于这些 `资源文件` ，需要用到 `文件资源加载器` 去处理。

1. 文件：main.js 中，引入图片，并添加到DOM中
```js
import icon from './icon.png'

const img = new Image()
img.src = icon

document.body.append(img)
```
2. 安装加载器 `file-loader`
3. 文件 webpack.config.js 中
添加loader
```js
module:{
    rules:[
        {
            test:/.png$/,
            use: 'file-loader'
        }
    ]
}
```
此时，dist目录下，会出现转换后的图片，但是文件名 变了。

- 问题：构建后，文件图片，不显示
- 原因：打包后，文件路径不对，构建后的文件路径，是根目录下面的，而我们是把图片打包到了 dist目录下

webpack 会默认，所有的文件，打包后，都放置在网站的根目录中。
- 解决方案：通过配置项，指定打包后的文件的位置。
文件 webpack.config.js 中
```js
output:{
    // publicPath:''， // 默认，网站的根目录
    publicPath:'dist/' // 指定目录，注意 / 不能省略
}
```
##### 文件加载器（以图片资源打包为例）整体打包过程
webpack在打包时，遇到了图片文件，
然后根据配置文件中的配置，匹配到对应的文件加载器，
此时，文件加载器开始工作，
先是将 导入的文件拷贝到输出的目录中，
然后将 上一步拷贝的输出目录的路径，作为当前模块的返回值返回，
对于应用来说，所需要的资源就被发布出来了，
后续可以通过模块的导出成员，拿到这个资源访问路径。

#### Data URLs
一种特殊的URL协议，可以直接用来表示一个文件。
- 传统的URL要求，服务器上面有一个对应的文件，通过请求服务器的地址，得到请求后的文件。
- Data Urls, 是一种当前URL就可以直接表示文件内容的方式。这种URL当中的文本就已经包含了文件的内容，在使用中，不需要发送任何的http请求。

html文件：
```html
data:text/html;charset=UTF-8,<h1>html content<h1>
```
二进制文件（图片，字体）：
png-> base64编码后进行表示
```
data:image/png;base64,iVBOW...........SUBMCC
```

#### 加载器 url-loader
添加loader, 在文件打包时，遇到配置格式的文件，会将其转换为 Data URls的形式
```js
module:{
    rules:[
        {
            test:/.png$/,
            use: 'url-loader'
        }
    ]
}
```
注意：
- 项目中的小文件使用 Data URLs, 减少请求次数 - 'url-loader'
- 大文件，单独提取存放，提高加载速度 - 'file-loader'
可以如下修改配置：
```js
module:{
    rules:[
        {
            test:/.png$/,
            use: {
                loader: 'url-loader',
                // 只将 10KB 以下 的文件进行转换为 Data URL
                options: {
                    limit: 10 * 1024 // 10 KB
                }
            }
        }
    ]
}
```
注意： 这里配置了 url-loader, 因为做了配置，所以文件在10KB以上会进行 file-loader 的处理，所以，需要记得安装好 file-loader.