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
yarn webpack-dev-server --dev
```
使用
```
yarn webpack-dev-server --dev
```
原理：
为了提高工作效率，`webpack-dev-server`并没有将打包结果写入磁盘当中，将打包结果暂时存放在了内存之中，内部的 http server 也是在内存中读取打包结果，然后发送给浏览器

##### `webpack-dev-server`静态资源访问
`Dev Server` 默认只会 `server` 打包输出文件，只要是通过 `webpack` 打包能够输出的文件，都可以正常被访问。
**但是**，一些其他的静态资源也需要 `server`,也需要作为开发服务器的资源被访问的话，就需要额外的去告诉`webpack-dev-server`。
- 解决方法
`webpack.config.js`
```js
module.exports = {
  devServer: {
    // 配置格外的静态资源路径
    contentBase: './public'
  }
}
```

##### `webpack-dev-server` 代理 API
由于开发服务器的缘故，一般项目都会运行在 localhost的一个端口上面：
```
http://loacalhost:8080
```
上线后，应用一般都会和API部署到同源地址上面：
```
https://www.example.com
```
##### 会遇到的问题：
实际上线后，可以去直接访问API
```
https://www.example.com/index.html
https://www.example.com/api/users
```
在开发环境，会产生**跨域**请求问题：
```
http://loacalhost:8080/index.html
https://www.example.com/api/users
```
##### 解决方案-跨域资源共享(CORS)
使用CORS的前提是API必需支持。
并不是任何情况下API都应该支持。
前后端如果同源部署（域名、协议、端口 都一致），这种情况下后端没必须要开启CORS。

##### 解决方案-配置代理服务
在开发服务器中配置代理服务，把接口服务代理到本地的开发服务地址。
##### `webpack-dev-server` 代理 API
demo:
目标：将 Github API 代理到开发服务器
```js
module.exports = {
  devServer: {
    // 配置代理服务
    proxy: {
      // 请求以哪个地址开始
      '/api':{
        // http://localhost:8080/api/users --> https://api.github.com/api/users
        target: 'https://api.github.com',
        // 代理路径的重写
        // http://localhost:8080/api/users --> https://api.github.com/users
        pathRewrite: {
          // 将以 、/api 的替换为 空
          '^/api':''
        },
        // 不能使用 localhost:8080 作为请求 github 的主机名
        changeOrigin: true
      }
    }
  }
}
```

#### Source MAP
运行代码与源代码存在差异，如果需要调试应用，或者运行的应用出现了无法意料的错误，无法定位。
调试和报错都是基于运行代码。

source-map就是映射转换后的代码和源代码之间的关系，通过 source-map 逆向解析。

###### 引用 source map 的注释
会根据注释找到文件，逆向解析对应的文件。
例如：jquery-3.4.1.min.js
```
//# sourceMappingURL=jquery-3.4.1.min.map
```
##### 配置 source map
webpack.config.js
```js
module.exports = {
  devtool: 'source-map'
}
```
##### 不同模式
webpack支持12中source map的配置方式，每种方式的效率和效果各不相同。
1. eval 模式
eval是JS中的一个函数，可以用来运行JS中的代码。
```js
eval('console.log(123)')
```
解析后的代码会运行在虚拟机之中

指定运行环境
```js
eval('console.log(123) //# sourceURL=./foo/bar.js')
```
在配置文件中配置后，会在打包后的文件末尾处添加 sourceURL和指定的文件路径。
eval解析后的代码在虚拟机之中，并不会生成.map的文件，
应用报错时，会找到源代码的名称，并不会定位到具体的行列信息。