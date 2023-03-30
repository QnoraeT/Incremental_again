for (let [index, comp] of Object.entries(comps)){
    document.getElementById("gen-comp" + index + "-cost").innerHTML = "Cost: " + format(comp.cost);
    document.getElementById("gen-comp" + index + "-multi").innerHTML = format(comp.multi) + "x ";
    document.getElementById("gen-comp" + index + "-amount").innerHTML = format(comp.trueamount) + ", ";
    document.getElementById("gen-comp" + index).style.display = index > compVisible ? "none" : "block";
}
function switchTab(t,id){tab[id] = t;}
function getSimplifyGain(){
    let temp
    temp = simplify.main.SEExp.pow(totalPointsInSimplify.log(simplify.main.simplifyReq).sub(1)).floor();
    return temp
}
function compCost(comp,bought){
    let temp = bought
    if (temp.gte(compScale))
    temp = temp.div(compScale).pow(2).mul(compScale)

    temp = new Decimal((comp * 4) - 3).add(new Decimal(comp)
                .mul(2).mul(temp));
    return new Decimal(10).pow(temp);
}
function buyComp(comp){
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
                }else{
                    temp = b.pow(x)
                }
            }else{
                if (x.gte(b.pow(a))){
                    b = b.ln()
                    c = c.ln()
                    //((2ac-2b-c)/2c)+(sqrt(4bc-8abc+4b^2+8ln(x)*c+c^2)/2c)
                    temp = a.mul(c).mul(2).sub(b.mul(2)).sub(c).div(c.mul(2)).add(b.mul(c).mul(4).sub(a.mul(b).mul(c).mul(8)).add(b.pow(2).mul(4)).add(x.ln().mul(8).mul(c)).add(c.pow(2)).root(2).div(c.mul(2)))
                }else{
                    temp = x.log(b)
                }
            }
            return temp
        default:
            console.error("Cost scaling type " + type + " is not defined!!")
            return new Decimal(10) // fallback cost
    }
}
function simplifyXPEffect(){
    let temp
    temp = simplify["PP"].trueValue
    simplify.PP.effect = temp.pow(1.5).add(1)
    temp = simplify["MP"].trueValue
    simplify.MP.effect = temp.pow(0.75).add(1)
    temp = simplify["OP"].trueValue
    simplify.OP.effect = temp.add(10).log(10).root(8).add(1)
    temp = simplify["DP"].trueValue
    simplify.DP.effect = temp.add(10).log(10).root(4).add(1)
}
function calcPointsPerSecond(){
    return comps[1].trueamount.mul(comps[1].multi).mul(simplify.PP.effect);
}
function simpUPG1Cost(){
    let ret = new Decimal(simplify.upgrades.simplifyMainUPG)
    return new Decimal(10).pow(ret.pow(2)).mul(ret.factorial())
}
function simplifyReset(){
    simplify.main.simplifyEnergy=simplify.main.simplifyEnergy.add(getSimplifyGain())
    simplify.main.simplifyStat=simplify.main.simplifyStat.add(1)
    compVisible = 1;
    points = new Decimal(10);
    totalPointsInSimplify = new Decimal(10);
    comps = {
        "1": new ComP(10, 1),
        "2": new ComP(100_000, 2),
        "3": new ComP(1e9, 3),
        "4": new ComP(10e12, 4),
        "5": new ComP(100e15, 5),
        "6": new ComP(1e21, 6),
        "7": new ComP(10e24, 7),
        "8": new ComP(100e27, 8)
    }
    for (let [index, comp] of Object.entries(comps)){
        document.getElementById("gen-comp" + index + "-cost").innerHTML = "Cost: " + format(comp.cost);
        document.getElementById("gen-comp" + index + "-multi").innerHTML = format(comp.multi) + "x ";
        document.getElementById("gen-comp" + index + "-amount").innerHTML = format(comp.trueamount) + ", ";
        document.getElementById("gen-comp" + index).style.display = index > compVisible ? "none" : "block";
    }
}
function simplify1Upg(){
    if (simplify.main.simplifyEnergy.gte(simpUPG1Cost())){
        simplify.upgrades.simplifyMainUPG++
        simplify.main.simplifyEnergy=simplify.main.simplifyEnergy.sub(simpUPG1Cost())
    }
}
function calcCompxPerSecond(comp) {
    if (comp === 8)
        return new Decimal(0);
    return comps[comp + 1].trueamount.mul(comps[comp + 1].multi);
}
function hideShow(id, condition){
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

        simplifyXPEffect()
        compBM = simplify.DP.effect.mul(2)

        points = points.add(calcPointsPerSecond().times(gameDelta));
        if (compVisible < 8 && points.gte(comps[compVisible + 1].cost.mul(0.1))){
            ++compVisible;
            hideShow("gen-comp" + compVisible, true);
        }

        totalPoints = totalPoints.add(calcPointsPerSecond().times(gameDelta));
        totalPointsInSimplify = totalPointsInSimplify.add(calcPointsPerSecond().times(gameDelta));
        

        for (let comp = 1; comp <= 8; ++comp) {
            comps[comp].changeAmount(calcCompxPerSecond(comp).times(delta));
            let tr = comps[comp].amount.add(calcCompxPerSecond(comp)).pow(compExp).sub(comps[comp].amount.pow(compExp))
            const perSecondText = " (" + format(tr) + "/s),";
            const boughtText =  " [ " + format(comps[comp].bought) + " ]    "
            const text = tr.gt(0) ? perSecondText + boughtText : boughtText;
            document.getElementById("gen-comp" + comp + "-amount").innerHTML = format(comps[comp].trueamount) + " " + text;
        }
        
        document.getElementById("points").innerHTML = "Points: " + format(points, true) + " ( " +format(calcPointsPerSecond(),true) + " / s )";
        document.getElementById("fps").innerHTML = "FPS: " + FPS;
        document.getElementById("SER").innerHTML = "You will gain " + format(getSimplifyGain(), true) + " Simplify Energy. [ Next at " + format(new Decimal(10).pow(getSimplifyGain().add(1).log(10).div(simplify.main.SEExp.log(10)).add(1).mul(simplify.main.simplifyReq.log(10))).sub(totalPointsInSimplify), true) + " ]";
        document.getElementById("SEUPG1").innerHTML = SimpUPG1[simplify.upgrades.simplifyMainUPG + 1] + " Cost: " + format(simpUPG1Cost(),true) + " Simplify Energy";
        hideShow("comp", tab[0] == 0)
        hideShow("tab_simplify", totalPoints.gte(1e12))
        hideShow("Simplify", tab[2] == 0)
        hideShow("simpExP", simplify.upgrades.simplifyMainUPG >= 1 && tab[2] == 0)
        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
}