"use strict";

function calcGeneralCosts() {
    // 1st arg is type, 2nd arg is effective bought, 3rd arg is if it's inverse, 4th+ are params
   let type = arguments[0]
   let x = new Decimal(arguments[1])
   let a = new Decimal(arguments[3])
   let b = new Decimal(arguments[4])
   let c = new Decimal(arguments[5])
   let d = new Decimal(arguments[6])
   let f = new Decimal(arguments[7])
   let g = new Decimal(arguments[8])
   let temp
   switch(type) {
        case "P":
            if (arguments[2] == false)
                temp = x.pow(Decimal.pow(c, b)).div(a.pow(Decimal.pow(c, b).sub(1)))
            else
                temp = x.mul(a.pow(Decimal.pow(c, b).sub(1))).pow(c.pow(b.mul(-1)))
            return temp
        case "SE":
            if (arguments[2] == false)
                temp = Decimal.pow(a, x.log(a).pow(Decimal.pow(c, b)))
            else
                temp = Decimal.pow(a, x.log(a).root(Decimal.pow(c, b)))
            return temp
        case "E":
            if (arguments[2] == false)
                temp = Decimal.pow(Decimal.pow(c, b), x.div(a).sub(1)).mul(a)
            else
                temp = x.div(a).log(Decimal.pow(c, b)).add(1).mul(a)
            return (arguments[2] == false)?(Decimal.max(temp,x)):temp // lmao 
        case "EP": // a*b^(x+(cx)^2)) - exponential:polynomial
            if (arguments[2] == false)
                temp = b.pow(x.mul(c).pow(2).add(x)).mul(a)
            else
                temp = b.ln().add(x.div(a).ln().mul(c.pow(2).mul(4))).root(2).div(b.ln().root(2).mul(c.pow(2).mul(2))).sub(new Decimal(1).div(c.pow(2).mul(2)))
            return temp
        case "EEP": // a*b^(xcd^((fx)^g)) - exponential^2:polynomial
            if (arguments[2] == false)
                temp = a.mul(b.pow(d.pow(x.mul(f).pow(g)).mul(c).mul(x)))
            else 
                temp = x.div(a).ln().pow(g).mul(d.ln()).mul(f.pow(g)).mul(g).div(c.pow(g).mul(b.ln().pow(g))).lambertw().root(g).div(g.root(g).mul(f).mul(d.ln().root(g)))
            return temp
        case "ADt": // antimatter dimension's free tickspeed from time softcap (a = start [AD = 300000], b = normal base [AD = 1.33 or 1.25], c = scale base [AD = 1.000006])
            if (arguments[2] == false){
                if (x.gte(a)){
                    temp = x.sub(a).add(1)
                    temp = b.pow(x).mul(c.pow(temp.sub(1).mul(temp).div(2)))
                } else {
                    temp = b.pow(x)
                }
            } else {
                if (x.gte(b.pow(a)))
                {
                    b = b.ln()
                    c = c.ln()
                    //((2ac-2b-c)/2c)+(sqrt(4bc-8abc+4b^2+8ln(x)*c+c^2)/2c)
                    temp = a.mul(c).mul(2).sub(b.mul(2)).sub(c).div(c.mul(2)).add(b.mul(c).mul(4).sub(a.mul(b).mul(c).mul(8)).add(b.pow(2).mul(4)).add(x.ln().mul(8).mul(c)).add(c.pow(2)).root(2).div(c.mul(2)))
                }
                else
                    temp = x.log(b)
            }
            return temp
        default:
            console.error("Cost scaling type " + type + " is not defined!!")
            return new Decimal(10) // fallback cost
   }
}


function softcap(amt, type, strength, start) {
    softcaps.push(arguments[4]) // arg4 is name for listing
    let sta = new Decimal(start)
    if (amt.gte(sta)){
        let str = new Decimal(strength)
        let temp
        let reduce
        switch(type) {
            case "P": // polynomial
                str = new Decimal(2).pow(str)
                temp = amt.root(str).mul(sta.pow(new Decimal(1).sub(new Decimal(1).div(str))))
                reduce = amt.div(temp)
                softcaps.push(reduce)
                return [temp, reduce] // "/{reduce}"
            case "E": // exponential 
                if (str.gt(1)){console.warn("Softcap \"E\" cannot work correctly with strength > 1 !  (Str: " + format(str, true, 3) + ")");str=dOne}
                str = Decimal.sub(1, new Decimal(2).pow(str).sub(1))
                temp = amt.log(sta.mul(amt.div(sta).pow(str))).add(1).pow(sta.mul(amt.div(sta).pow(str)).log(2))
                reduce = arguments[5] ? temp.log(amt) : amt.div(temp)
                softcaps.push(reduce)
                return [temp, reduce] // "^{reduce}" or "/{reduce}" if arg5 is false
            case "EP":
                str = new Decimal(2).pow(str)
                temp = new Decimal(10).pow(amt.log(10).root(str).mul(sta.log(10).pow(new Decimal(1).sub(new Decimal(1).div(str)))))
                reduce = arguments[5] ? temp.log(amt) : amt.div(temp)
                softcaps.push(reduce)
                return [temp, reduce] // "^{reduce}" or "/{reduce}" if arg5 is false
            default:
                console.error("Softcap type " + type + " is not defined!!")
                return [amt, new Decimal(1)] // fallback amt
        }
    }
    softcaps.push(new Decimal(1))
    return [amt, new Decimal(1)] 
}

function altFactorial(input){
    if (input.lt(2)) return Decimal.factorial(input)
    if (input.layer >= 2) return Decimal.exp(input)
    if (input.layer === 1) return Decimal.exp(input.mul(input.ln().sub(1)))
    let r = input
    let i = input.mag
    let t = 1
    r = Decimal.div(r, Math.E).pow(r).mul(Decimal.mul(2 * Math.PI, r).root(2))
    t += 1 / (12 * (i)) 
    t += 1 / (288 * (i ** 2)) 
    t -= 139 / (51840 * (i ** 3)) 
    t -= 571 / (2488320 * (i ** 4)) 
    t += 163879 / (209018880 * (i ** 5)) 
    t += 5246819 / (75246796800 * (i ** 6)) 
    return Decimal.mul(r,t)
}