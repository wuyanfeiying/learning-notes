/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
 const twoSum = (sums,target)=>{
  // 声明一个空的map映射
  const map = new Map()
  // 遍历数组
  for(let i = 0; i < sums.length; i++){
    // 计算目标值和当前值的差
    const diffValue = target - sums[i]
    // 判断 差值 是否存在映射中
    if(map.has(diffValue)){
      // 存在，返回结果: diffValue + sums[i] = target
      // 通过key获取索引值，并返回
      return [map.get(diffValue),i]
    }
    // 反之，存储到映射中
    // key--> 值， value -->索引
    map.set(sums[i],i)
  }
  return []
}

const sums = [3,6,3,154,0,78]
const target = 9
console.log(twoSum(sums,target));
// @lc code=end

