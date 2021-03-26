const MAx_DEGREE = 128
class Polynomial {
    coefficients: number[]
    highPower: number

    constructor() {
        this.zero()
    }

    set(power: number, coeff: number) {
        if (power > MAx_DEGREE) throw 'The max degree is 128.'
        this.coefficients[power] = coeff
        this.highPower = this.highPower > power ? this.highPower : power
    }

    zero() {
        for (let i = 0; i <= MAx_DEGREE; i++) this.coefficients[i] = 0
        this.highPower = 0
    }

    add(poly: Polynomial): Polynomial {
        let polySum = new Polynomial()
        polySum.highPower = Math.max(this.highPower, poly.highPower)
        for (let i = polySum.highPower; i >= 0; i--) {
            polySum.coefficients[i] = this.coefficients[i] + poly.coefficients[i]
        }
        return polySum
    }

    minus(poly: Polynomial): Polynomial {
        let polySum = new Polynomial()
        polySum.highPower = Math.max(this.highPower, poly.highPower)
        for (let i = polySum.highPower; i >= 0; i--) {
            polySum.coefficients[i] = this.coefficients[i] - poly.coefficients[i]
        }
        return polySum
    }

    mult(poly: Polynomial): Polynomial {
        let polyProd = new Polynomial()
        polyProd.highPower = Math.max(this.highPower, poly.highPower)
        for (let i = 0; i <= this.highPower; i++) {
            for (let j = 0; j <= poly.highPower; j++) {
                polyProd.coefficients[i + j] = this.coefficients[i] * poly.coefficients[j]
            }
        }
        return polyProd
    }
}

export default Polynomial
