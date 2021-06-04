import {
    createKnapsackResolve,
    createMColoringResolve,
    createPlaceQueenResolve,
    createSumOfSubsetsResolve
} from './foundations/backtracking'
import { Matrix2Mult, strassen } from './foundations/divid_conquer'
import { binSearch, dnaSeqAlign, floyd, matrixMultChain, tour } from './foundations/dynamic_programming'
import { minSpanningTree, shortestPath } from './foundations/greedy'
import { createMatrix } from './utils/matrix'

let A = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8]
]

let B = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8]
]

// let C = strassen(A, B)
// console.log(C)

// let R = cutMatrix(2, A)
// console.log(...R)

// floyd()

// matrixMultChain()

// binSearch()

// tour()

// dnaSeqAlign()

// minSpanningTree()

// shortestPath()

// createPlaceQueenResolve(8)()

// createSumOfSubsetsResolve(13, [0, 3, 4, 5, 6])()

// createMColoringResolve(4, ['Red', 'Green', 'Blue', 'Yellow'])()

createKnapsackResolve(4, 16, [2, 5, 10, 5], [40, 30, 50, 10])()
