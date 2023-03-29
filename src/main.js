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
    temp = simplify.main.SEExp.pow(totalPointsInSimplify.log(simplify.main.simplifyReq).sub(1)).floor();
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

function calcGeneralCosts(){ // 1st arg is type, 2nd arg is effective bought, 3rd arg is if it's inverse, 4th+ are params
    // TearonQ - should i really just put all "arguments[n]" and make the formulas even more confusing than it already is?
    let type = arguments[0]
    let x = new Decimal(arguments[1])
    let a = new Decimal(arguments[3])
    let b = new Decimal(arguments[4])
    let c = new Decimal(arguments[5])
    let d = new Decimal(arguments[6])
    let f = new Decimal(arguments[7])
    let g = new Decimal(arguments[8])
    let temp
    switch(type) 
    {
        case "EP": // a*b^(x+(cx)^2))
            if (arguments[2] == false)
                temp = b.pow(x.mul(c).pow(2).add(x)).mul(a)
            else
                temp = b.ln().add(x.div(a).ln().mul(c.pow(2).mul(4))).root(2).div(b.ln().root(2).mul(c.pow(2).mul(2))).sub(new Decimal(1).div(c.pow(2).mul(2)))
            return temp
        case "EEP": // a*b^(xcd^((fx)^g))
            if (arguments[2] == false)
                temp = a.mul(b.pow(d.pow(x.mul(f).pow(g)).mul(c).mul(x)))
            else 
                temp = x.div(a).ln().pow(g).mul(d.ln()).mul(f.pow(g)).mul(g).div(c.pow(g).mul(b.ln().pow(g))).lambertw().root(g).div(g.root(g).mul(f).mul(d.ln().root(g)))
            return temp
        default:
            console.error("Cost scaling type " + type + " is not defined!!")
            return new Decimal(10) // fallback cost
    }
}

function calcPointsPerSecond(){
    return comps[1].trueamount.mul(comps[1].multi);
}
function simplifyReset(){
    simplify.main.simplifyEnergy=simplify.main.simplifyEnergy.add(getSimplifyGain())
    simplify.main.simplifyStat=simplify.main.simplifyStat.add(1)
}

function calcCompxPerSecond(comp) {
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
        document.getElementById("SER").innerHTML = "You will gain " + format(getSimplifyGain(), true) + " Simplify Energy. [ Next at " + format(new Decimal(10).pow(getSimplifyGain().add(1).log(10).div(simplify.main.SEExp.log(10)).add(1).mul(simplify.main.simplifyReq.log(10))).sub(totalPointsInSimplify), true) + " ]";
        hideShow("comp",  tab[0] == 0)
        hideShow("Simplify",  tab[2] == 0)
        hideShow("tab_simplify",  totalPoints.gte(1e15))
        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
}