<!--
 * @Date: 2021-08-01 14:15:05
 * @LastEditors: chuhongguang
-->
[TOC]
#### Webpack 常用加载器分类
类似于生活中，工厂里面的生产车间。处理和加工打包过程中的资源文件。
1. 编译转换类
  - 加载到的资源模块，转换为 JavaScript 代码。
  - 例如：css-loader, 将css代码，转换为了bundle.js中的css模块，从而实现通过JS允许css代码文件。

2. 文件操作类
  - 加载到的资源模块，拷贝到输出的目录中，同时将文件的访问路径向外部导出。

3. 代码检查类
  - 目的是为了统一代码风格，从而提高代码质量。
  - 例如：eslint-loader ...

#### Webpack 与 ES2015
- 在 webpack中，可以直接使用ES Modules规范，例如： import和export的使用。
  - 其实并不是它支持，而是因为模块打包的需要，webpakck 特殊处理了 `import` 和 `export`。
- ES 6中的新特性并不会特殊处理，例如箭头函数等。
  - 可以通过 `babel-loader` 进行处理，注意：需要安装依赖的模块： `@babel/core` 和 `@babel/preset-env`
在配置文件`webpack.config.js`中，进行如下配置：
```js
module:{
  rules:[
    {
      test: /.js$/,
      use: {
        loader: 'babel-loader',
        // babel只是个转换平台，需要配置对应的插件才能完成一些需要的转换功能
        options:{
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
```
1. Webpacl 只是打包工具
2. 加载器可以用来编译转换代码

#### Webpack 模块加载方式
##### JS的加载
1. 遵循 ES Modules 标准的 import 声明
2. 遵循 CommonJS 标准的 require 函数
注意：通过 require载入ES Modules的文件，对于ESM的默认导出，需要通过 require函数导入结果的 default 属性 来获取。
```js
const a = require('./a.js').default
```
3. 遵循 AMD 标准的 define函数 和 require 函数

##### 非JS的加载
- Loader加载的非 JavaScript 也会触发资源加载
例如：
1. `css-loader` 加载的 `css` 文件， 样式代码中的 `@import` 指令和 `url`函数
2. HTML代码中图片标签的src属性

webpack.config.js
```js
rules:[
  {
    test: /.html$/,
    use: {
      loader: 'html-loader',
      // 针对 html 标签中的属性，需要单独配置
      options:{
        attrs: ['img:src','a:href']
      }
    }
  }
]
```

#### Webpack 核心工作原理
在项目中会散落着各种各样的资源文件，例如：
```
.js .html .css .png .json .png .css .scss
```
1. webpack会根据我们的配置，找到其中的入口文件（`XX.js`）,一般默认入口文件是一个JS文件。
2. 顺着入口文件之中的代码，根据代码中出现 `import` `require` 之类的语句，解析推断出来这个文件依赖的资源模块。
3. 分别去解析每个模块对应的依赖，形成依赖树。
4. 递归依赖树，找到每个节点所对应的资源文件。
5. 根据配置文件中的`rules`属性，找到模块所对应的加载器 `loader` ,交给对应的加载器去加载对应的模块。
6. 将加载后的结果，放置到 `bundle.js`中，从而去实现整个项目的打包。

> 整个过程中，Loader 机制是Webpack的核心，如果没有就没法去实现各种资源文件的加载