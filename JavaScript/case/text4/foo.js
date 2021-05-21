var x = 5
var addX = function (value) {
  return value + x;
}

exports.x = x
module.exports.addX = addX

var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};