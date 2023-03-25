let points = new Decimal(10);
let compExp = new Decimal(0.8)
let compBM = new Decimal(2)
let compScale = new Decimal(150);
let inChallenge = ["","","",""]
let notation = "Mixed Scientific";
let totalTime = 0;
let gameTime = new Decimal(0);
let timeSpeed = new Decimal(1);
let totalPointsInSimplify = new Decimal(10);
let totalPoints = new Decimal(0);
let tab = [0,0,0];
let simplify = {
    "main": {
        simplifyEnergy: new Decimal(0),
        simplifyStat: new Decimal(0),
        SEExp: new Decimal(1.75),
        SAExp: new Decimal(0.75),
        simplifyReq: new Decimal(1e15),
        totalXP: new Decimal(0), // (TruePP + TrueMP + True1P + TrueDP)^SimpEXP
    },
    "PP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(1)
    },
    "MP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(1)
    },
    "1P": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(2)
    },
    "DP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(1)
    },
    "challenge": {
        completed: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0-3 Magnifying [] 4-7 Beginner [] 8-11 Articulated [] 12-15 77777777 []
        timeInChallenge: new Decimal(0),
    },
    "upgrades": {
        simplifyMainUPG: new Decimal(0),
        simplifyUPGNum2: new Decimal(0),
        PPUPG: new Decimal(0),
        MPUPG: new Decimal(0),
        OPUPG: new Decimal(0), // OP -> 1P
        DPUPG: new Decimal(0),
    },
    "situation1": {
        amount: new Decimal(0),
        rank: new Decimal(0),
        tier: new Decimal(0),
        tetr: new Decimal(0),
        pent: new Decimal(0),
    },
    "situation2": {
        amount: new Decimal(0),
        bar1: new Decimal(0),
        bar2: new Decimal(0),
        bar3: new Decimal(0),
        bar4: new Decimal(0),
    },
    "situation3": {
        amount: new Decimal(0),
        milestonePts: new Decimal(0),
        milestoneComp8: new Decimal(0),
        milestoneTotalBought: new Decimal(0),
        milestoneMisc: new Decimal(0), // custom challenges and stuff ("don't buy comp1 more than once", "reach 1e100 in 15 seconds without comp6+", etc)
    },
}

let comps = {
    "1": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(10),
        multi: new Decimal(1)
    },
    "2": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(100_000),
        multi: new Decimal(1)
    },
    "3": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(1e9),
        multi: new Decimal(1)
    },
    "4": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(10e12),
        multi: new Decimal(1)
    },
    "5": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(100e15),
        multi: new Decimal(1)
    },
    "6": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(1e21),
        multi: new Decimal(1)
    },
    "7": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(10e24),
        multi: new Decimal(1)
    },
    "8": {
        bought: new Decimal(0),
        amount: new Decimal(0),
        trueamount: new Decimal(0),
        cost: new Decimal(100e27),
        multi: new Decimal(1)
    }
}

for (let [index, comp] of Object.entries(comps))
{
    document.getElementById("gen-comp" + index + "-cost").innerHTML = "Cost: " + format(comp.cost);
    document.getElementById("gen-comp" + index + "-multi").innerHTML = format(comp.multi) + "x ";
    document.getElementById("gen-comp" + index + "-amount").innerHTML = format(comp.trueamount) + ", ";
}
document.getElementById("tab_comp").innerHTML = "ComP";
document.getElementById("tab_other").innerHTML = "Other";
document.getElementById("tab_simplify").innerHTML = "Simplify";

function switchTab(t,id){tab[id]=t;}
function getSimplifyGain(){
    let temp
    temp = simplify.main.SEExp.pow(totalPointsInSimplify.log().div(12).sub(1)).floor()
    return temp
}
function buyComp(comp){
    if (points.gte(comps[comp].cost)){
        points = points.minus(comps[comp].cost);
        comps[comp].bought = comps[comp].bought.add(1);
        //update cost, formula: 10^(4(comp) + 2x(comp) - 3), x = comps[comp].bought
        //but what about further ingame, where ComP costs scale based off of time?? its not gonna update and will show an amount too high or low than it actually is
        let temp = comps[comp].bought
        if (temp.gte(compScale)){
        temp = temp.div(compScale).pow(2).mul(compScale)
        }
        temp = new Decimal((comp * 4) - 3).add(new Decimal(comp)
                    .mul(2).mul(temp));
        comps[comp].cost = new Decimal(10).pow(temp);
        //update multipliers
        //same issue with costs
        comps[comp].multi = new Decimal(1);
        if (comps[comp].bought.gte(2));{
            comps[comp].multi = comps[comp].multi.mul(compBM.pow(comps[comp].bought.sub(1)))
        }
        if (comp == 1){
            comps[comp].multi = comps[comp].multi.mul(10).pow(2);
        }
        if (comp == 2){
            comps[comp].multi = comps[comp].multi.mul(4).pow(1.584962500721156);
        }
        //update cost HTML
        document.getElementById("gen-comp" + comp + "-cost").innerHTML = "Cost: " + format(comps[comp].cost);
        document.getElementById("gen-comp" + comp + "-multi").innerHTML = format(comps[comp].multi) + "x ";
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
function hideShow(id, condition){
    let x = document.getElementById(id);
    if (condition) {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    //if (tab[tabID] == value) {
    //    x.style.display = "block";
    //  } else {
    //    x.style.display = "none";
    //  }
    // 
}
{
    window.requestAnimationFrame(gameLoop);
    let oldTimeStamp = 0; 

    function gameLoop(timeStamp)
    {
        let delta = (timeStamp - oldTimeStamp) / 1000;
        const FPS = Math.round(1 / delta);
        let gameDelta = new Decimal(delta).mul(timeSpeed)
        points = points.add(calcPointsPerSecond().times(gameDelta));
        totalPoints = totalPoints.add(calcPointsPerSecond().times(gameDelta));
        totalPointsInSimplify = totalPointsInSimplify.add(calcPointsPerSecond().times(gameDelta));
        for (let comp = 1; comp <= 8; ++comp) 
        {
            comps[comp].amount = comps[comp].amount.add(calcCompxPerSecond(comp).times(delta));
            document.getElementById("gen-comp" + comp + "-amount").innerHTML = format(comps[comp].trueamount) + ", ";
        }
        document.getElementById("points").innerHTML = "Points: " + format(points, true) + " ( " +format(calcPointsPerSecond(),true) + " / s )";
        document.getElementById("fps").innerHTML = "FPS: " + FPS;
        //hideShow("comp",0,0)
        //hideShow("Simplify",2,0)
        hideShow("comp",tab[0] == 0)
        hideShow("Simplify",tab[2] == 0)
        hideShow("simpTab",totalPoints.gte(1e15))
        
        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
}