import Sort from './foundations/sort'

const S = [72, 23, 4, 85, 37, 19, 27, 66, 10, 50, 13, 22, 15, 33, 62, 88, 30, 39, 21, 37, 4]
const S2 = [72, 23, 85, 37, 19, 27, 66, 10, 50, 13, 22, 15, 33, 62, 88, 30, 39, 21]

console.log('before:', S)
// Sort.heap(S)
Sort.radix(S2)
console.log('after:', S)
