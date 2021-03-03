import { deduplicate, uniquify } from './algorithm/other'
import { insertionSort, selectionSort } from './algorithm/sort'
import List from './struct/list'
import Vector from './struct/vector'

let data = [1, 7, 3, 8, 5, 6, 55, 20]

function listSort() {
    let list = new List<number>(data)

    list.sort()

    list.traverse((item: number) => {
        console.log('list', item)
    })
}

function arraySort() {
    // insertionSort(data)
    selectionSort(data)
    console.log(data)
}

// arraySort()

listSort()
