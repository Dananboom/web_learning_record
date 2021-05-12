/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    var hashTable = {}
    for (var i = 0; i < nums.length; i++){
        if (hashTable[target-nums[i]] === undefined){
            hashTable[nums[i]] = i
        }
        return [i, hashTable[target-nums[i]]]
    }

}