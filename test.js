/*
 * @Author: wuyanfeiying
 * @Date: 2021-07-02 17:52:46
 * @Description: 测试
 */


// 计算一个数的绝对值
function getABS(x) {
  console.log(x);
  return Math.abs(x)
}
// console.log(getABS(-6));
// console.log(getABS(-6));
// console.log(getABS(-6));

// 一个简易版本的记忆函数
function memoize (func) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  var memoized = function() {
    var args = arguments,
        key = args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new Map()
  return memoized;
}

const m = memoize(getABS)

console.log(m(-6));
console.log(m(-6));
console.log(m(-6));