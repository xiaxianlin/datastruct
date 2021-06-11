import Search from './foundations/search'
// import Sort from './foundations/sort'

const S = [72, 23, 4, 85, 37, 19, 27, 66, 10, 50, 13, 22, 15, 33, 62, 88, 30, 39, 21]
// // const S2 = [72, 23, 85, 37, 19, 27, 66, 10, 50, 13, 22, 15, 33, 62, 88, 30, 39, 21]

// // console.log('before:', S)
// // Sort.heap(S)
// // console.log('after:', S)

// const S1 = [4, 10, 13, 15, 19, 21, 22, 23, 27, 30, 33, 37, 39, 50, 62, 66, 72, 85, 88, 99]

// console.log(S1)
let index = Search.selection2(S, 5)
console.log('result', index)
