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
1. 先安装 css-Loader
```
yarn add css-loader --dev
```