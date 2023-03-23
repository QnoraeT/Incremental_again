//let points = new Decimal(10);
let points = new Decimal(10);
let compExp = new Decimal(0.8)
let compBM = new Decimal(2)
let compScale = new Decimal(150);

let comps = {
    "1": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(10),
        multi: new Decimal(0)
    },
    "2": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(100_000),
        multi: new Decimal(0)
    },
    "3": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(1e9),
        multi: new Decimal(0)
    },
    "4": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(10e12),
        multi: new Decimal(0)
    },
    "5": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(100e15),
        multi: new Decimal(0)
    },
    "6": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(1e21),
        multi: new Decimal(0)
    },
    "7": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(10e24),
        multi: new Decimal(0)
    },
    "8": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(100e27),
        multi: new Decimal(0)
    }
}

for (let [index, comp] of Object.entries(comps)){
    document.getElementById("gen-comp" + index + "-cost").innerHTML = "Cost: " + format(comp.cost);
    document.getElementById("gen-comp" + index + "-multi").innerHTML = format(comp.multi) + "x";
    document.getElementById("gen-comp" + index + "-amount").innerHTML = format(comp.trueamount) + ",";
}

function buyComp(comp){
    if (points.gte(comps[comp].cost)){
        points = points.minus(comps[comp].cost);
        comps[comp].bought = comps[comp].bought.add(1);
        
        //update cost, formula: 10^(4(comp) + 2x(comp) - 3), x = comps[comp].bought
        let temp = comps[comp].bought
        if (temp.gte(compScale)){
        temp = temp.div(compScale).pow(2).mul(compScale)
        }
        temp = new Decimal((comp * 4) - 3).add(new Decimal(comp)
                    .mul(2).mul(temp));
        comps[comp].cost = new Decimal(10).pow(temp);

        //update multiplayers
        comps[comp].multi = new Decimal(1);
        if (comps[comp].bought.gte(2));
            comps[comp].multi = comps[comp].multi.mul(compBM.pow(comps[comp].bought.sub(1)))

        if (comp == 1)
            comps[comp].multi = comps[comp].multi.mul(10).pow(2);
        if (comp == 2)
            comps[comp].multi = comps[comp].multi.mul(4).pow(1.584962500721156);

        //update cost HTML
        document.getElementById("gen-comp" + comp + "-cost").innerHTML = "Cost: " + format(comps[comp].cost);
        document.getElementById("gen-comp" + comp + "-multi").innerHTML = format(comps[comp].multi) + "x";
    }
}

function getTrueAmount(comp){
    comps[comp].trueamount=comps[comp].amount.pow(compExp).add(comps[comp].bought)
    return comps[comp].trueamount;
}

function calcPointsPerSecond(){
    return getTrueAmount(1).mul(comps[1].multi);
}

function calcCompxPerSecond(comp) {
    if (comp === 8)
        return new Decimal(0);

    return getTrueAmount(comp + 1).mul(comps[comp + 1].multi);
}

{
    window.requestAnimationFrame(gameLoop);
    let oldTimeStamp = 0; 

    function gameLoop(timeStamp)
    {
        let delta = (timeStamp - oldTimeStamp) / 1000;
        const FPS = Math.round(1 / delta);

        points = points.add(calcPointsPerSecond().times(delta));
        for (let comp = 1; comp <= 8; ++comp) 
        {
            comps[comp].amount = comps[comp].amount.add(calcCompxPerSecond(comp).times(delta));
            document.getElementById("gen-comp" + comp + "-amount").innerHTML = format(comps[comp].trueamount) + ",";
        }
        document.getElementById("points").innerHTML = "Points: " + format(points, true) + " ( " +format(calcPointsPerSecond(),true) + " / s )";
        document.getElementById("fps").innerHTML = "FPS: " + FPS;

        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
}