import { swap } from '../common/util'

const { random, floor } = Math

export function permute(a: []) {
    for (let i = a.length; i > 0; i--) {
        swap(a, i - 1, floor((random() * i) % i))
    }
}
