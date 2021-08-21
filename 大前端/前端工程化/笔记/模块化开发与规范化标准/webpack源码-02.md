<!--
 * @Date: 2021-08-21 10:20:17
 * @LastEditors: chuhongguang
-->
#### CommonJS模块打包
- 情况1:
通过 `require()`加载 `CommonJS` 规范的模块,`webpack` 默认支持
- 情况2:
采用 `ESModule` 规范导出, 在 `webpack` 打包中,首先调用 `__webpack_require__.r `方法, 先标识 ESM, 然后通过调用 `__webpack_require__.d` 方法, 往对象身上添加 导出时的属性, 提供 `getter`(做了一个 `return` 操作)

####  esModule模块打包
- 对于webpack打包来说,在主入口中可以 采用 `CommonJS` 规范 或者 `ESModule` 规范.
- 加载模块和被加载模块,导出的内容同样可以 采用 `CommonJS` 规范 或者 `ESModule` 规范.
- 对于webpack源码内部来说, 采用 `CommonJS` 规范 加载和导出,执行的代码内容是最少的.