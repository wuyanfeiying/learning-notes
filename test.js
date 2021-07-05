/*
 * @Author: wuyanfeiying
 * @Date: 2021-07-02 17:52:46
 * @Description: 测试
 */

let array = [1,2,3,4,5] // 原数组
const square = item=>item ** 2 // 一个回调函数，求2次幂运算
const newArr = array.map(square) // 使用map对数组内数据进行计算
console.log(newArr); // [ 1, 4, 9, 16, 25 ]

// Array.prototype.map() 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。
// 当我们调用 array.map(square) 时，参数square是一个回调函数，我们可以模拟一下 map()方法如下：

let array = [1,2,3,4,5] // 原数组

// array：原数组 fn: 回调函数
const map = (array, fn) => { 
  let results = [] 

  // 遍历原数组
  for (const value of array) { 
      results.push(fn(value)) // 对值先通过回调函数 fn()进行处理，之后再放到新数组 results 中
  }
  return results // 返回一个新数组
}
const newArr = map(array, v => v ** 2)
console.log(newArr) // [ 1, 4, 9, 16, 25 ]
















// 定义一个遍历数组的并对每一项做处理的函数，第一个函数是一个数组，第二个参数是一个函数。
// function forEach (array, fn) {
//   for (let i = 0; i < array.length; i++) {
//       fn(array[i]) 
//   } 
// }

// test
// let arr = [2,4,6]
// // 参数1：数组
// // 参数2：函数
// forEach(arr, item => {
//   item = item ** 2
//   console.log(item) // 2 4 6
// })