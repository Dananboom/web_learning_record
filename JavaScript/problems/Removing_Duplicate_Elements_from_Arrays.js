function quchong (array){
    var hashTable = {}
    var arr = []
    for (var i = 0; i < array.length; i++){
        if(!hashTable[array[i]]){
            console.log(1)
            arr.push(array[i])
            hashTable[array[i]] = 1
        }
    }
    return arr;
}

var arr3 = [1,2,2,3]
var new_arr = quchong (arr3)
console.log(new_arr)