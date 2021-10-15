/*
 * @Date: 2021-07-05 08:59:36
 * @LastEditors: chuhongguang
 */
function add(...args) {
  let final = [...args];
  setTimeout(() => {
    // final.reduce((sum, cur) => sum + cur)
    console.log(final.reduce((sum, cur) => sum + cur));
    // const a =  final.reduce((sum, cur) => sum + cur)
    // console.log(a);
  }, 0);
  const inner = function (...args) {
    final = [...final, ...args];
    return inner;
  };
  return inner;
}
// add(1)(2)(3)
console.log(add(1)(2)(3),'55'); //6