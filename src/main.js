let points = new Decimal(10);
let compBought = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)]
let compMulti = [new Decimal(1), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)]
let compTrueAmount = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)]
let compAmount = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)]
let compcost = [new Decimal(1e1), new Decimal(1e5), new Decimal(1e9), new Decimal(1e13), new Decimal(1e17), new Decimal(1e21), new Decimal(1e25), new Decimal(1e29)]
let compExp = new Decimal(0.8)
let compBM = new Decimal(2)

document.getElementById("gen-comp1-amount").innerHTML = format(compAmount[0]) + ",";
document.getElementById("gen-comp1-multi").innerHTML = format(compMulti[0]) + "x";
document.getElementById("gen-comp1-cost").innerHTML = "Cost: " + format(compcost[0]);


function buyComp(dim)
{
    if (points.gte(compcost[dim-1]))
    {
        points = points.minus(compcost[dim-1]);
        compBought[dim-1] = compBought[dim-1].add(1);
        //update HTML

        
    }
}

function calcStuff(type,delta) {
    let sum 
    if (type == "pps"){
        sum = compTrueAmount[0].mul(compMulti[0]).times(new Decimal(delta))
        return sum;
    }
    if (type == "comp"){
        compTrueAmount[0]=compAmount[0].pow(compExp).add(compBought[0])
        for (let d = 0; d < 8; d++) { 
        // multiplier
        compMulti[d]=new Decimal(1)
        if (compBought[d].gte(2));{
        compMulti[d]=compMulti[d].mul(compBM.pow(compBought[d].sub(1)))}
        
        if (d == 0){
            compMulti[d]=compMulti[d].mul(10)
            compMulti[d]=compMulti[d].pow(2)
        }
        if (d == 1){
            compMulti[d]=compMulti[d].mul(4)
            compMulti[d]=compMulti[d].pow(1.584962500721156)
        }
        //update arithmetic dims
        compTrueAmount[d]=compAmount[d].pow(compExp).add(compBought[d])
        if (d >= 1){
        sum = compTrueAmount[d].mul(compMulti[d])
        compAmount[d-1]=compAmount[d-1].add(sum.times(delta))
        }
        //cost
        sum = new Decimal(d).add(1).mul(4).sub(3).add(new Decimal(d).add(1).mul(2).mul(compBought[d]))
        //10^(4(d+1)+2x(d+1)-3)
        compcost[d]=new Decimal(10).pow(sum)
        }
    }
}

{
    window.requestAnimationFrame(gameLoop);
    let oldTimeStamp = 0; 

    function gameLoop(timeStamp)
    {
        let delta = (timeStamp - oldTimeStamp) / 1000;
        const FPS = Math.round(1 / delta);

        points = points.add(calcStuff("pps",delta));
        calcStuff("comp",delta)
        document.getElementById("points").innerHTML = "Points: " + format(points, true);
        document.getElementById("fps").innerHTML = "FPS: " + FPS;
        for (let dim = 1; dim < 9; dim++) { 
        document.getElementById("gen-comp" + dim + "-amount").innerHTML = format(compTrueAmount[dim-1]) + ",";
        document.getElementById("gen-comp" + dim + "-multi").innerHTML = format(compMulti[dim-1]) + "x";
        document.getElementById("gen-comp" + dim + "-cost").innerHTML = "Cost: " + format(compcost[dim-1]);
        }
        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
}
