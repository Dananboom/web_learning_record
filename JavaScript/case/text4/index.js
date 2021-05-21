var foo = require('./foo');
console.log(foo)

// {
//   message: "hi",
//   say: [Function]
// }

console.log(require.main === module)

console.log(foo.counter);  // 3
foo.incCounter();
console.log(foo.counter); 