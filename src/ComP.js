let compExp = new Decimal(0.8);
let compBM = new Decimal(2);
let compScale = new Decimal(150);

class ComP
{
    constructor(index)
    {
        this._amount = new Decimal(0);
        this._bought = new Decimal(0);
        this._multi = new Decimal(1);
        this._index = index;
        this._updateCost();
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
        this._multi = new Decimal(1);
        if (this._bought.gte(2))
            this._multi = this._multi.mul(compBM.pow(this._bought.sub(1)));
        
        if (this._index == 1)
            this._multi = this._multi.mul(10).pow(simplify.OP.effect);
        if (this._index == 2)
            this._multi = this._multi.mul(4).pow(1.584962500721156);
        if (inChallenge.length == 0)
            this._multi = this._multi.mul(simplify.main.simplifyStat.add(1).root(new Decimal(this._index)));
        this._multi = this._multi.mul(simplify.MP.effect);
    }

    _updateCost()
    {
        //update cost, formula: 10^(4(comp) + 2x(comp) - 3), x = comps[comp].bought
        let temp = this._bought;
        if (temp.gte(compScale))
            temp = temp.div(compScale).pow(2).mul(compScale)
        temp = new Decimal((this._index * 4) - 3).add(new Decimal(this._index)
                    .mul(2).mul(temp));
        this._cost = new Decimal(10).pow(temp);
    }
}
