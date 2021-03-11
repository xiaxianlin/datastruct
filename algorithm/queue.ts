import { rand } from '../common/util'
import Queue from '../struct/queue'

class Customer {
    time = 0
    window = 0
}

function bestWindow(windows: Queue<Customer>[], nWin: number) {
    let minSize = windows[0].size(),
        optiwin = 0
    for (let i = 0; i < nWin; i++) {
        if (minSize > windows[i].size()) {
            minSize = windows[i].size()
            optiwin = i
        }
    }
    return optiwin
}
export function simulate(nWin: number, servTime: number) {
    let windows: Queue<Customer>[] = []
    for (let now = 0; now < servTime; now++) {
        if (rand(nWin + 1) !== 1) {
            let c = new Customer()
            c.time = 1 + rand(98)
            c.window = bestWindow(windows, nWin)
            windows[c.window].enqueue(c)
        }
    }
    for (let i = 0; i < nWin; i++) {
        if (!windows[i].empty()) {
            if (--windows[i].front().time <= 0) {
                windows[i].dequeue()
            }
        }
    }
}
