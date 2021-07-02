/*
 * @Author: wuyanfeiying
 * @Date: 2021-07-02 17:52:46
 * @Description: 测试
 */

// 将匿名函数赋值给变量
const fn = function() {
  console.log("fn_bar");
}
fn();

// 将有名称的函数赋值给变量
const fn2 = function name() {
  console.log("fn2_bar");
}
fn2();