/*
 * @Author: wuyanfeiying
 * @Date: 2021-07-02 17:52:46
 * @Description: 测试
 */

// 求一个数的二次方
function makePower(power) {
  return function (number) {
    return Math.pow(number, power);
  };
}

// 求平方
let power2 = makePower(2);
let power3 = makePower(2);
console.log(power2 === power3);
