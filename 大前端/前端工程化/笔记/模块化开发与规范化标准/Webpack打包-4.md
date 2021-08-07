<!--
 * @Date: 2021-08-07 11:43:18
 * @LastEditors: chuhongguang
-->
[TOC]

#### Webpack 插件机制的工作原理
相比于 Loader, Plugin拥有更宽的能力范围，Loader只是在加载模块的环境工作，而plugin几乎可以触及到webpack的每一个环节。

- 插件机制是如何实现的：
Plugin 通过钩子机制实现

- 如何在webpack中使用钩子：
必需是一个函数或者是一个包含apply方法的对象。

##### demo: 开发一个清除webpack打包后bundle.js中的无效注释
- 确认钩子：`emit`

webpack.config.js
```js
class MyPlugin {
  apply (compiler) {
    // 注册钩子函数
    compiler.hooks.emit.top('MyPlugin', compliation => {
      // compilation => 可以理解为此次打包的上下文

      // 获取即将写入目录的资源文件信息
      for ( name in compilation.assets) {
        // 拿到文件名称
        console.log(name)
        // 拿到文件对应的内容
        console.log(compilation.assets[name].source())

        // 判断文件名是否以 .js 结尾
        if(name.endWith('.js')) {
          const contents = compilation.assets[name].source()
          // 正则替换掉注释
          const withoutComments = contents.replace(/\/\*\*+\*\//g,'')

          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }

        }
      }
    })
  }
}
```
- 总结：
插件机制其实就是通过在webpack生命周期的钩子中挂载函数实现扩展

#### Webpack 开发体验的设想
- 目前的开发方式过于原始，效率低下
编写源代码-webpack打包-运行应用-刷新浏览器
- 设想
1. 以HTTP Server 运行
2. 自动编译 + 自动刷新
3. 提供 source-map 支持

#### 如何增强 webpack 的开发体验
##### 实现自动编译
- watch 工作模式：
监听文件变化，自动重新打包。
```
yarn webpack --watch
```
##### 实现自动刷新浏览器
`Webpack Dev Server`

webpack 官方提供的第三方工具，提供用于开发的 Http Server, 集成 自动编译 和 自动刷新浏览器 等功能。

安装
```
yarn webpack-dev-serve --dev
```
使用
```
yarn webpack-dev-serve --dev
```
原理：
为了提高工作效率，`webpack-dev-serve`并没有将打包结果写入磁盘当中，将打包结果暂时存放在了内存之中，内部的 http server 也是在内存中读取打包结果，然后发送给浏览器