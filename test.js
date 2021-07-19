/*
 * @Author: wuyanfeiying
 * @Date: 2021-07-02 17:52:46
 * @Description: 测试
 */

// 比较两个数大小的纯函数
function compareSize(b) {
  return function (a) {
    return a > b
  }
}

const compareNumTwo = compareSize(2)
console.log(compareNumTwo(1)); // false
console.log(compareNumTwo(2)); // false
console.log(compareNumTwo(3)); // true