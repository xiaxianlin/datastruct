export function swap<T>(arr: T[], i: number, j: number) {
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
}

export function max(arr: number[]) {
    let max = arr[0]
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i]
    }
    return max
}
