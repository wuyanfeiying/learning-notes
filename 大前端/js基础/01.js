/*
 * @Date: 2021-09-01 22:52:43
 * @LastEditors: chuhongguang
 */
Function.prototype.myApply = function (context, args) {
  // 1. 做兼容处理
  context = context || window;
  args = args || [];

  // 2. 给 context 一个独一无二的属性
  const key = Symbol();

  // 3. 将this指向这个属性
  context[key] = this;

  // 执行这个函数, 并接受返回值, apply 是个数组, 所以使用拓展运算符来展开
  const result = context[key](...args)

  // 删除 添加的属性
  delete context[key]

  // 返回函数运算后的值
  return result
};
