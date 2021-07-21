/*
 * @Author: wuyanfeiying
 * @Date: 2021-07-02 17:52:46
 * @Description: 测试
 */

function compareSize(b) {
  return function (a) {
    return a > b
  }
}

const hasThanTarget = compareSize(2)
console.log(hasThanTarget(1)); // false
console.log(hasThanTarget(2)); // false
console.log(hasThanTarget(3)); // true