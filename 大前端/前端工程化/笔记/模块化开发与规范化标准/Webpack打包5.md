<!--
 * @Date: 2021-08-15 10:17:28
 * @LastEditors: chuhongguang
-->
[TOC]
#### Webpack 自动刷新问题
>  Webpack dev server 提供对开发者友好的开发服务器

##### 问题：自动刷新导致的页面状态丢失
每次修改完代码，webpack 会自动监视打包，会自动刷新浏览器，页面中的内容（任何操作状态）会丢失。
- 办法1：代码中写死编辑器的内容
- 办法2：额外代码实现刷新前保存，刷新后读取。

##### 期望：页面不刷新的前提下，模块也可以及时更新

#### HMR
Hot Module Replacement/模块热替换

##### 热拔插
在一个正在运行的机器上随时插拔设备，机器的运行状态不会受插拔设备的影响，插上的设备可以立即开始工作。
##### 模块热替换
应用运行过程中实时替换某个模块，应用运行状态不受影响。热替换只将修改的模块实时替换至应用中。

##### 开启HMR
集成在了 webpack-dev-server 之中
- 命令行中开启
`webpack-dev-server --hot`
- 通过配置文件开启
webpack.config.js
```js
const webpack = require('webpack')
...
devServer: {
  hot: true
},
...
plugins: [
  new webpack.HotModuleReplacementPlugin()
]
```
##### HMR 的疑问
自己配置的HMR修改JS文件，页面还是存在刷新。
- 原因：
webpack 中的HMR并不可以开箱即用， 需要手动处理模块热替换逻辑。
通过脚手架创建的项目内部都集成了 HMR 方案。

##### HMR APIS
`webpack.HotModuleReplacementPlugin() `提供了 HMR的一些API
- 找到需要更新的 js 文件

以下只是demo,不是通用的模式
```js
...
// 注册 HMR的事件
module.hot.accept('./editor', ()=> {
  // 暂存之前的内容
  const value = lastEditor.innerHTML
  // 移除原来的元素
  document.body.removeChild(editor)
  // 重新创建
  const newEditor = createEditor()
  newEditor.innerHTML = value
  // 添加到 DOM 中
  document.body.appendChild(newEditor)
})
```

##### webpack 处理图片模块热替换
```js
...
// 注册 HMR的事件
module.hot.accept('./better', ()=> {
  img.src  = background
})
```

##### Webpack HMR 注意事项
1. 处理 HMR 的代码报错会导致自动刷新。
页面中的错误信息会被清除
解决方案：
webpack.config.js
```js
...
devServer: {
  // hot: true
  hotOngly: true
}
```
2. 没启动HMR的情况下， HMR API 报错
// 兼容处理，有的情况下，再处理
```js
if(module.hot){
  ...
}
```

3. 代码中多了一些与业务功能无关的代码
打包时，会被移除掉的。

#### webpack 生产环境优化
生产环境注重运行效率，开发环境注重开发效率。
#### webpack 模式（mode）
为不同的工作环境创建不同的配置。
#### webpack 不同环境下的配置
1. 配置文件根据环境不同导出不同配置；
2. 一个环境对应一个配置文件

- 配置文件根据环境不同导出不同配置
webpack.config.js
```js
module.exports = (env,argv)=>{
  const conifg = { ... }

  if(env === 'production') {
    config.mode = 'production'
    config.devtool = false
    config.plugins = [
      ...config.plugins,
      ...
    ]
  }

  return config
}
```

- 多配置文件
不同环境对应不同配置文件
// 公共配置
`webpack.common.js`
// 开发环境
`webpack.dev.js`
// 正式环境
`webpack.prod.js`

- 正式环境
安装 `webpack-merge` 模块
`yarn add webpack-merge --dev`
webpack.prod.js
```js
const common = require('/webpack.common')
const merge = require('/webpack-merge')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    ...
  ]
})
```

#### webpack DefinePlugin
为代码注入全局成员，正式环境默认注入 `process.env.NODE_ENV`
webpack.config.js
```js
const webpack = require('webpack')

module.exports = {
  ...,
  plugins: [
    new webpack.DefinePlugin({
      // APi 基础服务地址
      API_BASE_URL: '"https://api.examplu.com"'
    })
  ]
}
```

#### webpack Tree Shaking
生产模式下，自动开启。
'摇掉'代码中未引用部分 -- 未引用代码（dead-code）
webpack.config.js
```js
module.exports = {
  mode: 'none',
  ...,
  optimization: {
    usedExports: true, // 外部使用了才引入----负责标记[枯树叶]
    minimize: true // 压缩开启---- 负责[摇掉]它们
  }
}
```
#### webpack 合并模块
`concatenatedModules`, 尽可能将所有模块合并输出到一个函数中。

webpack.config.js
```js
module.exports = {
  mode: 'none',
  ...,
  optimization: {
    ...,
    concatenatedModules: true
  }
}
```

####  Webpack Tree Shaking 与 Babel
如果使用了 babel loader会导致 tree shaking 失效。
- Tree Shaking 的前提是 ES Modules, 由Webpack 打包的代码必须使用ESM。
为了转换代码中的 ECMAScript 新特性，很多时候都会选择 `babel-loader` 处理。而在 `babel` 转换代码时，有可能将 `ESM` 转换为 `CommonJS`, 导致 `Tree Shaking` 失效。

#### Webpack sideEffects
通过配置的方式，标识代码是否有 副作用。
- 副作用
模块执行时，除了导出成员之外所作的事情。
- `sideEffects` 一般用于 `npm` 包标记是否有副作用
- 生产模式会自动开启
webpack.config.js
```js
module.exports = {
  mode: 'none',
  ...,
  optimization: {
    ...,
    sideEffects: true
  }
}
```
##### Webpack sideEffects 注意
有副作用的模块，但是不想忽略掉。

1. 原型上面新增了方法，配置时又声明没有副作用。
2. css代码

package.json
```json
{
  ...,
  "sideEffects": [
    "XX.js",
    "*.css"
  ]
}
```

#### Webpack 代码分割
使用 webpack 项目中所有的代码最终都被打包一起。
bundle体积过大，并不是每个模块在启动时都是必要的。

- 分包，按需加载
Code Splitting (代码分包/代码分割)

##### 多入口打包
一个页面对应一个打包入口，公共部分单独提取
webpack.config.js
```js
module.exports = {
  ...,
  // 入口
  entry:{
    index: './src/index.js',
    album: './src/album.js',
  },
  // 打包输出的文件
  output:{
    filename: '[name].bundle.js'
  },
  // html插件也需要指定
  plugins: [
    new HtmlWebpackPlugin({
      ...,
      chunks: ['index']
    })
  ]
}
```
##### Webpack 动态导入
需要用到某个模块时，再加载这个模块。
webpack支持动态导入加载模块，动态导入的模块会被自动分包。
- 打包的文件，动态导入处理
```js
...
if(XXX){
  import('./posts/posts').then(({default:posts})=>{
    mainElement.appendChild(posts())
  })
}
```