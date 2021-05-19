const materials = [
  'Hydrogen',
  'Helium',
  'Lithium',
  'Beryllium'
]
function map (array, fn) {
    const newArray = []
    for (let i = 0; i < array.length; i++) {
        newArray.push(fn(array[i]))
    }
    return newArray
}


console.log(map(materials, material=>material.length))