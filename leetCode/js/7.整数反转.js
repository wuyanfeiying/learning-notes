/*
 * @Date: 2021-07-08 19:54:38
 * @LastEditors: chuhongguang
 */
/*
 * @lc app=leetcode.cn id=7 lang=javascript
 *
 * [7] 整数反转
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
  // 如果反转后整数超过 32 位的有符号整数的范围 [−2**31,  2**31 − 1] ，就返回 0。
  if (x <= -(2**31) || (x>(2**31) - 1)) return 0

  // 取绝对值
  let num = Math.abs(x) 
  // 数字转字符串 -> 分割字符串为数组 -> 反转数组
  let reverseArr = `${num}`.split('').reverse()
  // 从左到右开始查找，找到不为0的索引值
  const normalIndex = reverseArr.findIndex(item=>item!=='0')
  // 根据索引值，过滤数组--> 转字符串
  let resultNum = reverseArr.filter((item,index)=> index>=normalIndex).join('')
   // 转数字输出，这里根据原始值要判断正负数
   resultNum = x < 0 ? Number(-resultNum) : Number(resultNum)
  if (-(2**31) <= resultNum && resultNum<= (2**31) - 1) return resultNum
  // 如果反转后整数超过 32 位的有符号整数的范围 [−2**31,  2**31 − 1] ，就返回 0。
  return 0
};
console.log(reverse(123)); // 321
console.log(reverse(-123)); // -123
console.log(reverse(120)); // 21
console.log(reverse(0)); // 0
// @lc code=end
