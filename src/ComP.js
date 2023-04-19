let compExp = new Decimal(0.8);
let compBM = new Decimal(2);
let compScale1 = new Decimal(150);
let compScale2 = new Decimal(100000);
let compScale2Pow = [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)];

class ComP
{
    constructor(index)
    {
        this._amount = new Decimal(0);
        this._bought = new Decimal(0);
        this._multi = new Decimal(1);
        this._index = index;
        this._updateCost();
        this._factors = [];
    }

    get cost()
    {
        return this._cost;
    }

    get amount()
    {
        return this._amount;
    }

    get bought()
    {
        return this._bought;
    }

    get multi()
    {
        return this._multi;
    }

    get trueamount()
    {
        return this.amount.pow(compExp).add(this.bought);
    }

    get index()
    {
        return this._index;
    }

    buy()
    {
        this._bought = this._bought.add(1);
        this._updateMultiplier();
        this._updateCost(); 
    }

    changeAmount(amount)
    {
        this._amount = this._amount.add(amount);
        this._updateMultiplier();
        this._updateCost();
    }

    _updateMultiplier()
    {
        this._factors = [];
        this._multi = new Decimal(1);
        if (this._bought.gte(2)){
            this._multi = this._multi.mul(compBM.pow(this._bought.sub(1)))
            this._factors.push("<br> Buy Multiplier (Total): x" + format(compBM.pow(this._bought.sub(1)),true,2) + "  (" + format(this._multi,true) + "x)")
        }
        if (this._index == 1){
            this._multi = this._multi.mul(10)
            this._factors.push("<br> ComP1 Bonus: x" + format(new Decimal(10),true,2) + "  (" + format(this._multi,true) + "x)")
            this._multi = this._multi.pow(simplify.OP.effect)
            this._factors.push("<br> ComP1 Bonus: ^" + format(simplify.OP.effect,true,3) + "  (" + format(this._multi,true) + "x)")
            if (simplify.PP.effect.gt(1)){
                this._multi = this._multi.mul(simplify.PP.effect);
                this._factors.push("<br> PP Effect: x" + format(simplify.PP.effect,true) + "  (" + format(this._multi,true) + "x)")
                }
        }
        if (this._index == 2){
            this._multi = this._multi.mul(4)
            this._factors.push("<br> ComP2 Bonus: x" + format(new Decimal(4),true,2) + "  (" + format(this._multi,true) + "x)")
            this._multi = this._multi.pow(1.584962500721156)
            this._factors.push("<br> ComP2 Bonus: ^" + format(new Decimal(1.584962500721156),true,3) + "  (" + format(this._multi,true) + "x)")
        }
        if (inChallenge.length == 0 && simplify.main.simplifyStat.gt(0)){
            this._multi = this._multi.mul(simplify.main.simplifyStat.add(1).root(new Decimal(this._index)));
            this._factors.push("<br> Simplified amount: x" + format(simplify.main.simplifyStat.add(1).root(new Decimal(this._index)),true,2) + "  (" + format(this._multi,true) + "x)")
        }
        if (simplify.MP.effect.gt(1)){
        this._multi = this._multi.mul(simplify.MP.effect);
        this._factors.push("<br> MP Effect: x" + format(simplify.MP.effect,true) + "  (" + format(this._multi,true) + "x)")
        }
        if (inChallenge.includes("simp0")){
            this._multi = this._multi.pow(0.75);
            this._factors.push("<br> Magnifying Challenge 1: ^" + format(new Decimal(0.75),true,2) + "  (" + format(this._multi,true) + "x)")
            this._multi = this._multi.div(1000);
            this._factors.push("<br> Magnifying Challenge 1: /" + format(new Decimal(1000),true) + "  (" + format(this._multi,true) + "x)")
        }
        if (mode == "softcap"){
            if (this._multi.gte(100)){
                this._multi = softcap(this._multi, "P", 0.1, 100, "mul1," + this._index, false)[0]
                this._factors.push("<br><sc1> Softcap 1: /" + format(softcaps[softcaps.indexOf("mul1," + this._index)+1],true,3) + "  (" + format(this._multi,true) + "x)</sc1>")
            }
            if (this._multi.gte(1e8)){
                this._multi = softcap(this._multi, "E", 0.3, 1e8, "mul2," + this._index, false)[0]
                this._factors.push("<br><sc2> Softcap 2: /" + format(softcaps[softcaps.indexOf("mul2," + this._index)+1],true,3) + "  (" + format(this._multi,true) + "x)</sc2>")
            }
            if (this._multi.gte(1e15)){
                this._multi = softcap(this._multi, "EP", 0.1, 1e15, "mul3," + this._index, false)[0]
                this._factors.push("<br><sc3> Softcap 3: /" + format(softcaps[softcaps.indexOf("mul3," + this._index)+1],true,3) + "  (" + format(this._multi,true) + "x)</sc3>")
            }
            if (this._multi.gte(1e25)){
                this._multi = softcap(this._multi, "EP", 0.25, 1e25, "mul4," + this._index, false)[0]
                this._factors.push("<br><sc4> Softcap 4: /" + format(softcaps[softcaps.indexOf("mul4," + this._index)+1],true,3) + "  (" + format(this._multi,true) + "x)</sc4>")
            }
        }
    }

    _updateCost()
    {
        //update cost, formula: 10^(4(comp) + 2x(comp) - 3), x = comps[comp].bought
        let temp = this._bought;
        let cost
        if (temp.gte(compScale2)){
            let a = new Decimal("e133333333").mul(this._index)
            let b = new Decimal("e3000").mul(this._index)
            let c = compScale2Pow[0]
            let d = compScale2Pow[1].mul(0.0001).mul(this._index ** 0.25).add(1)
            let e = compScale2Pow[2].mul(0.0001).mul(this._index ** 0.25)
            let f = compScale2Pow[3].mul(2).mul(this._index ** 0.1)
            cost = calcGeneralCosts("EEP", temp.sub(compScale2), false, a, b, c, d, e, f)
        } else {
            if (temp.gte(compScale1)){
                cost = Decimal.pow(10, new Decimal(this._index).mul(temp.pow(2).mul(2).div(compScale1).add(4)).sub(3))
            } else {   
                cost = Decimal.pow(10, new Decimal(2 * this._index).mul(temp.add(2)).sub(3))
            }
        }
        cost = cost.div(simplify.challenge.MC1effect.pow(temp)).div(simplify.challenge.SC3effect.pow(new Decimal(this._index).mul(temp)))
        this._cost = cost;
    }
}
