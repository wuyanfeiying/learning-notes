<!--
 * @Date: 2021-08-23 21:20:49
 * @LastEditors: chuhongguang
-->
[TOC]
#### webpack 与 tapable
##### Webpack 编译流程
> 事件驱动型的工作流机制
- 配置初始化
- 内容编译
- 输出编译后的内容
核心:
1. 负责编译的 `complier`
2. 负责创建 `bundles` 的 `compilation`

##### tapable
`tapable` 本身就是一个独立的库, 在 `webpack` 中进行了大量的使用

##### tapable 工作流程
1. 实例化 `hook` 注册事件监听
2. 通过 `hook` 触发事件监听
3. 执行懒编译生成的可执行代码

##### Hook
- `Hook` 本质是 `tapable` 实例对象
- `Hook` 执行机制可分为 同步 和 异步

##### Hook执行特点
- Hook: 普通钩子, 监听器之间互相独立不干扰
- BailHook: 熔断钩子, 某个监听返回非 undefined 时, 后续不再执行
- WaterfallHook: 瀑布钩子, 上一个监听的返回值可传递至下一个
- LoopHook: 循环钩子, 如果当前未返回 false, 则一直执行

##### tapable库同步钩子
- SyncHook
- SyncBailHook
- SyncWaterfallHook
- SyncLoopHook

##### tapable库异步串行钩子
- AsyncSeriesHook
- AsyncSeriesBailHook
- AsyncSeriesWaterfallHook

##### tapable库异步并行钩子
- AsyncParalleHook
- AsyncParalleBailHook