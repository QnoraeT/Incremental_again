let points = new Decimal(10);
let totalPointsInSimplify = new Decimal(10);
let totalPoints = new Decimal(10);
//let compExp = new Decimal(0.8)                 moved to ComP.js
//let compBM = new Decimal(2)                    moved to ComP.js
//let compScale = new Decimal(150);              moved to ComP.js
let inChallenge = ["", "", "", ""]
let notation = "Mixed Scientific";
let totalTime = 0;
let gameTime = new Decimal(0);
let timeSpeed = new Decimal(1);
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
        completed: Array(15).fill(0), // 0-3 Magnifying [] 4-7 Beginner [] 8-11 Articulated [] 12-15 77777777 []
        timeInChallenge: new Decimal(0),  //Yoreni: why does this varible need to be a b_e number? 
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

//comp numbers that are bigger than this are not visable in the UI
let compVisable = 1;

let comps = {
    "1": new ComP(10, 1),
    "2": new ComP(100_000, 2),
    "3": new ComP(1e9, 3),
    "4": new ComP(10e12, 4),
    "5": new ComP(100e15, 5),
    "6": new ComP(1e21, 6),
    "7": new ComP(10e24, 7),
    "8": new ComP(100e27, 8)
}

for (let [index, comp] of Object.entries(comps))
{
    document.getElementById("gen-comp" + index + "-cost").innerHTML = "Cost: " + format(comp.cost);
    document.getElementById("gen-comp" + index + "-multi").innerHTML = format(comp.multi) + "x ";
    document.getElementById("gen-comp" + index + "-amount").innerHTML = format(comp.trueamount) + ", ";
    document.getElementById("gen-comp" + index).style.display = index > compVisable ? "none" : "block";
}

function switchTab(t,id)
{
    tab[id] = t;
}

function getSimplifyGain()
{
    let temp
    temp = simplify.main.SEExp.pow(totalPointsInSimplify.log(simplify.main.simplifyReq).sub(1)).floor()
    return temp
}

function compCost(comp,bought)
{
    let temp = bought
    if (temp.gte(compScale))
    temp = temp.div(compScale).pow(2).mul(compScale)

    temp = new Decimal((comp * 4) - 3).add(new Decimal(comp)
                .mul(2).mul(temp));
    return new Decimal(10).pow(temp);
}

function buyComp(comp)
{
    if (points.gte(comps[comp].cost))
    {
        points = points.minus(comps[comp].cost);
        comps[comp].buy();
        //update cost HTML
        document.getElementById("gen-comp" + comp + "-cost").innerHTML = "Cost: " + format(comps[comp].cost);
        document.getElementById("gen-comp" + comp + "-multi").innerHTML = format(comps[comp].multi) + "x ";
    }
}

function calcGeneralCosts()
{ // 1st arg is type, 2nd arg is effective bought, 3rd arg is if it's inverse, 4th+ are params
    //Yoreni: Tip: its best to avoid single letter varible names because its unclear to anyone else what they mean
    let type = arguments[0]
    let x = arguments[1]
    let temp
    let a = arguments[3]
    let b = arguments[4]
    let c = arguments[5]
    let d = arguments[6]
    let f = arguments[7]
    let g = arguments[8]
    switch(type) {
        case "EP": // a*b^(x+(cx)^2))
            if (arguments[2] == false){
                temp = b.pow(x.mul(c).pow(2).add(x)).mul(a)
            } else {
                temp = b.ln().add(x.div(a).ln().mul(c.pow(2).mul(4))).root(2).div(b.ln().root(2).mul(c.pow(2).mul(2))).sub(new Decimal(1).div(c.pow(2).mul(2)))
            }
            return temp
        case "EEP": // a*b^(xcd^((fx)^g))
           if (arguments[2] == false){
            temp = a.mul(b.pow(d.pow(x.mul(f).pow(g)).mul(c).mul(x)))
            } else {  
            temp = x.div(a).ln().pow(g).mul(d.ln()).mul(f.pow(g)).mul(g).div(c.pow(g).mul(b.ln().pow(g))).lambertw().root(g).div(g.root(g).mul(f).mul(d.ln().root(g)))
            }
            return temp
        default:
            console.error("Cost scaling type " + type + " is not defined!!")
            return new Decimal(10) // fallback cost
        }
}

function calcPointsPerSecond()
{
    return comps[1].trueamount.mul(comps[1].multi);
}

function calcCompxPerSecond(comp) 
{
    if (comp === 8)
        return new Decimal(0);
    return comps[comp + 1].trueamount.mul(comps[comp + 1].multi);
}

function hideShow(id, condition)
{
    let x = document.getElementById(id);
    x.style.display = condition ? "block" : "none";
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
        if (compVisable < 8 && points.gte(comps[compVisable + 1].cost.mul(0.1)))
        {
            ++compVisable;
            hideShow("gen-comp" + compVisable, true);
        }

        totalPoints = totalPoints.add(calcPointsPerSecond().times(gameDelta));
        totalPointsInSimplify = totalPointsInSimplify.add(calcPointsPerSecond().times(gameDelta));
        for (let comp = 1; comp <= 8; ++comp) 
        {
            comps[comp].changeAmount(calcCompxPerSecond(comp).times(delta));

            let tr = comps[comp].amount.add(calcCompxPerSecond(comp)).pow(compExp).sub(comps[comp].amount.pow(compExp))
            const perSecondText = " (" + format(tr) + "/s),";
            const broughtText =  " [ " + format(comps[comp].bought) + " ]    "
            const text = tr.gt(0) ? perSecondText + broughtText : broughtText;
            document.getElementById("gen-comp" + comp + "-amount").innerHTML = format(comps[comp].trueamount) + " " + text;
        }
        document.getElementById("points").innerHTML = "Points: " + format(points, true) + " ( " +format(calcPointsPerSecond(),true) + " / s )";
        document.getElementById("fps").innerHTML = "FPS: " + FPS;
        hideShow("comp", tab[0] == 0)
        hideShow("Simplify", tab[2] == 0)
        hideShow("tab_simplify", totalPoints.gte(1e15))
        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
}