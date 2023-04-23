"use strict";

/* 
TODO:
 :make the tab for the challenge select (clicking any amount of times on the challenge numbers themselves won't do anything, there must be a "start challenge" button to the right side with its description and reward)
 :the buttons inside the the big rectangle and the descriptions inside the rectangle

 concept images:
 outside simplify challenge: https://cdn.discordapp.com/attachments/769979905827143733/1092633200427278346/image.png
 inside simplify challenge: https://cdn.discordapp.com/attachments/769979905827143733/1093259477802823800/image.png
 inside simplify challenge (points > completeRequirement) in simplify_challenge tab: https://cdn.discordapp.com/attachments/769979905827143733/1093259536418209852/image.png
 inside simplify challenge (points > completeRequirement) in simplify_main tab: https://cdn.discordapp.com/attachments/769979905827143733/1093259579632144424/image.png

 w. the floating dots bg + the cursor lmao [most difficult]
 w+1. save function? perhaps?

note: i'm seeing a lot of delays because of html aaaaaaa
*/

for (let [index, comp] of Object.entries(comps)) {
    document.getElementById("gen-comp" + index + "-cost").innerHTML = "Cost: " + format(comp.cost);
    document.getElementById("gen-comp" + index + "-multi").innerHTML = format(comp.multi) + "x ";
    document.getElementById("gen-comp" + index + "-amount").innerHTML = format(comp.trueamount) + ", ";
    document.getElementById("gen-comp" + index + "-breakdown").innerHTML = "Show factors";
    document.getElementById("gen-comp" + index).style.display = index > compVisible ? "none" : "block";
}
for (let [index] of Object.entries(simplify.challenge.completed)){
    document.getElementById("simpChal" + index + "-id").innerHTML = index;
}
document.getElementById("simpChal0-type").innerHTML = "🔎 Challenges"
document.getElementById("simpChal4-type").innerHTML = "🔰 Challenges"
document.getElementById("simpChal8-type").innerHTML = "🚛 Challenges"
document.getElementById("simpChal12-type").innerHTML = "777 Challenges"
document.getElementById("simpEXP1b").innerHTML = "Allocate all SE into PP."
document.getElementById("simpEXP2b").innerHTML = "Allocate all SE into MP."
document.getElementById("simpEXP3b").innerHTML = "Allocate all SE into 1P."
document.getElementById("simpEXP4b").innerHTML = "Allocate all SE into DP."
document.getElementById("simpEXP1b").classList.add("defaultButton")
document.getElementById("simpEXP2b").classList.add("defaultButton")
document.getElementById("simpEXP3b").classList.add("defaultButton")
document.getElementById("simpEXP4b").classList.add("defaultButton")
document.getElementById("challengeStart1").classList.add("challengeStart", "defaultButton")
document.getElementById("challengeStart1").classList.add("startChallenge", "defaultButton")
document.getElementById("completeChallenge1").classList.add("challengeStart", "defaultButton")
document.getElementById("completeChallenge1").classList.add("completeChallenge", "defaultButton")
document.getElementById("tab_comp").classList.add("defaultTab", "defaultButton")
document.getElementById("tab_other").classList.add("defaultTab", "defaultButton")
document.getElementById("tab_other_stat").classList.add("defaultTab", "defaultButton")
document.getElementById("tab_other_changeLog").classList.add("defaultTab", "defaultButton")
document.getElementById("tab_other").classList.add("defaultTab", "defaultButton")
document.getElementById("maxAll").classList.add("defaultTab", "defaultButton")
document.getElementById("SER").classList.add("defaultSimplifyTab", "defaultButton")
document.getElementById("SEUPG1").classList.add("defaultSimplifyTab", "defaultButton")
document.getElementById("tab_simplify").classList.add("defaultSimplifyTab", "defaultButton")
document.getElementById("simplify_tab_simplify").classList.add("defaultButton")
document.getElementById("simplify_tab_tts").classList.add("defaultButton")
changeLog()

function changeLog(){
    let changeLog = ""
    changeLog = changeLog + "<br><changeLog><p class='date0'> v0.0.0 - Apr 5, 2023 </p>"
    changeLog = changeLog + "<br> Progress on TTS Challenges #1"
    changeLog = changeLog + "<br> Added a new mode 'softcapped', currently unavaliable as an option"
    
    document.getElementById("changeLog").innerHTML = changeLog
}

function switchTab(t,id) {
    tab[id] = t;
    for (let TA = id + 1; TA <= (tab.length - 1); ++TA) {
        tab[TA] = 0;
        if (TA > 40){
            throw new Error("what the hell? (broke out of somehow infinite loop)")
        }
    }
}

function getSimplifyGain() {
    let temp
    temp = simplify.main.SEExp.pow(totalPointsInSimplify.log(simplify.main.simplifyReq).sub(1));
    return temp
}

function buyComp(comp) {
    if (points.gte(comps[comp].cost))
    {
        points = points.minus(comps[comp].cost);
        comps[comp].buy();
    }
}

function simplifyXPtick(type,tickRate) {
    let temp
    temp = simplify[sXPTypes[type]].allocated // increase xP gain later...
    simplify[sXPTypes[type]].generated = simplify[sXPTypes[type]].generated.add(temp.mul(tickRate))
    simplify[sXPTypes[type]].trueValue = simplify[sXPTypes[type]].generated.add(1).pow(simplify.main.SAExp).sub(1)
    temp = simplify[sXPTypes[type]].trueValue
    switch(type){
        case 0: 
            temp = temp.pow(1.5).add(1)
            break
        case 1: 
            temp = temp.pow(0.75).add(1)
            break
        case 2: 
            temp = temp.add(10).log(10).root(8).add(1)
            break
        case 3: 
            temp = temp.add(10).log(10).root(4)
            break
        default:
            console.warning("Type " + type + "is unknown!")
            break
    }
    simplify[sXPTypes[type]].effect = temp
}

function calcPointsPerSecond(){
    let tmp = comps[1].trueamount.mul(comps[1].multi)
    if (mode == "softcap"){
        tmp = softcap(tmp, "P", 0.1, 100, "pts1", false)[0]
        tmp = softcap(tmp, "E", 0.4, 1e8, "pts2", false)[0]
        tmp = softcap(tmp, "EP", 0.1, 1e16, "pts3", false)[0]
        tmp = softcap(tmp, "EP", 0.3, 1e25, "pts4", false)[0]
        tmp = softcap(tmp, "EP", 0.5, 1e40, "pts5", true)[0]
    }
    return tmp;
}

function simpUPG1Cost(){
    let ret = new Decimal(simplify.upgrades.simplifyMainUPG)
    ret = new Decimal(10).pow(ret.pow(2)).mul(ret.factorial())
    return ret
}

function updateChallenge(){
    let temp
    let c
    for (let j = 1; j < 4; ++j){
        temp = false
        for (let i = 0; i <= 4; ++i){
            c=simplify.challenge.completed[i + (j - 1) * 4] == 1
            if ((i + j * 4) < 16){
                hideShow("simpChal" + (i + j * 4) + "-id", c)
            }
            if (c){
                temp = true
            }
        }
        hideShow("simpChal" + j * 4, temp)
    }

    inSChallenge = false
    for (let i = 0; i < 16; ++i){
        document.getElementById("simpChal" + i + "-id").classList.forEach(clas => {
            if (!clas == "simpChal")
            document.getElementById("simpChal" + i + "-id").classList.remove(clas);
        });

        document.getElementById("simpChal" + i + "-id").classList.add(simplify.challenge.completed[i] == 1 ? "simpChalComplete" : "simpChalIncomplete")
        if (document.getElementById("simpChal" + i + "-id").style.display == "inherit"){
            document.getElementById("simpChal" + i + "-id").style.display = ""
        }
        if (inChallenge.includes("simp" + i)){
            document.getElementById("simpChal" + i + "-id").classList.add("inSimpChal")
            inSChallenge = true 
        }
    }
    if (inSChallenge == true){
        document.getElementById("challengeStart1").classList.replace("startChallenge","exitChallenge")
    } else {
        document.getElementById("challengeStart1").classList.replace("exitChallenge","startChallenge")
    }
    document.getElementById("challengeStart1").innerHTML = inSChallenge ? "Exit Challenge" : "Start Challenge";
    document.getElementById("challengeStart1").style.width =  totalPointsInSimplify.gte(simplify.main.simplifyReq) && inSChallenge ? "180px" : "360px";
    document.getElementById("completeChallenge1").innerHTML = "Complete Challenge";
    hideShow("completeChallenge1", totalPointsInSimplify.gte(simplify.main.simplifyReq) && inSChallenge && tab[0] == 2 & tab[1] == 1)
}
function completeChallenge() {
    for (let i = 0; i < 16; ++i){
        if (inChallenge.includes("simp" + i)){
            simplify.challenge.completed[i] = 1
        }
    }
    simplifyReset()
}
function simpChalSelect(ex) {
    simpChalSelected = ex
}
function simplifyReset() {
    simplify.main.simplifyEnergy=simplify.main.simplifyEnergy.add(getSimplifyGain().floor())
    simplify.main.simplifyStat=simplify.main.simplifyStat.add(1)
    compVisible = 1;
    points = new Decimal(10);
    totalPointsInSimplify = new Decimal(10);
    comps = {
        "1": new ComP(1),
        "2": new ComP(2),
        "3": new ComP(3),
        "4": new ComP(4),
        "5": new ComP(5),
        "6": new ComP(6),
        "7": new ComP(7),
        "8": new ComP(8)
    }
    for (let [index, comp] of Object.entries(comps))
    {
        document.getElementById("gen-comp" + index + "-cost").innerHTML = "Cost: " + format(comp.cost);
        document.getElementById("gen-comp" + index + "-multi").innerHTML = format(comp.multi) + "x ";
        document.getElementById("gen-comp" + index + "-amount").innerHTML = format(comp.trueamount) + ", ";
        document.getElementById("gen-comp" + index).style.display = index > compVisible ? "none" : "block";
    }
}

function simplify1Upg() {
    if (simplify.main.simplifyEnergy.gte_tolerance(simpUPG1Cost(), 0.001))
    {
        simplify.main.simplifyEnergy = simplify.main.simplifyEnergy.sub(simpUPG1Cost())
        if (simplify.main.simplifyEnergy.lt(0)){
            simplify.main.simplifyEnergy = new Decimal(0)
        }
        simplify.upgrades.simplifyMainUPG++
    }
}

function simpExPAllocate(id) {
    switch(id){
        case 1: 
            simplify.PP.allocated = simplify.PP.allocated.add(simplify.main.simplifyEnergy)
            break;
        case 2: 
            simplify.MP.allocated = simplify.MP.allocated.add(simplify.main.simplifyEnergy)
            break;
        case 3: 
            simplify.OP.allocated = simplify.OP.allocated.add(simplify.main.simplifyEnergy)
            break;
        case 4: 
            simplify.DP.allocated = simplify.DP.allocated.add(simplify.main.simplifyEnergy)
            break;
        default:
            console.error("idk which simplify xP are you talking about!!")
            break;
    }
    simplify.main.simplifyEnergy=new Decimal(0)
}

function calcCompxPerSecond(comp)  {
    if (comp >= 8)
        return new Decimal(0);
    return comps[comp + 1].trueamount.mul(comps[comp + 1].multi);
}

function getProgress(delta) { // progressBar = 0-1
    let prev = new Decimal(1)
    progressBarText = "All done! "
    if (totalPoints.lt(1e12)){
        prev = totalPoints.add(1).log(1e12)
        progressBarText = "Next layer: "
    } else if (simplify.main.simplifyEnergy.lt(10)){
        prev = simplify.main.simplifyEnergy.add(getSimplifyGain()).div(10)
        progressBarText = "Next feature: "
    } else if (simplify.main.simplifyEnergy.lt(20_000)){
        prev = simplify.main.simplifyEnergy.add(getSimplifyGain()).div(10).log(new Decimal(20_000).div(10))
        progressBarText = "Next feature: "
    } else if (simplify.main.simplifyEnergy.lt(6e9)){
        prev = simplify.main.simplifyEnergy.add(getSimplifyGain()).div(20_000).log(new Decimal(6e9).div(20000))
        progressBarText = "Next feature: "
    } else if (simplify.main.simplifyEnergy.lt(240e15)){
        prev = simplify.main.simplifyEnergy.add(getSimplifyGain()).div(6e9).log(new Decimal(240e15).div(6e9))
        progressBarText = "Next feature: "
    } else if (simplify.main.simplifyEnergy.lt(1.2e27)){
        prev = simplify.main.simplifyEnergy.add(getSimplifyGain()).div(2.4e17).log(new Decimal(1.2e27).div(2.4e17))
        progressBarText = "Next feature: "
    } else if (simplify.main.simplifyEnergy.lt(7.2e38)){
        prev = simplify.main.simplifyEnergy.add(getSimplifyGain()).div(1.2e27).log(new Decimal(7.2e38).div(1.2e27))
        progressBarText = "Next feature: "
    }

    // cap and smooth from here
    if (prev.gte(1)){
        prev = new Decimal(1)
    }
    progressBar = prev
    
}

function hideShow(id, condition)
{
    let x = document.getElementById(id);
    x.style.display = condition ? "inherit" : "none";
}

function expandComPMULTI(comp){
    expandMultComP = (expandMultComP == comp) ? 0 : comp;
}

function getChalEffects(){
    return 
    let temp
    temp = new Decimal(1)
    if (simplify.challenge.completed[0] == 1){
        temp = temp.add(1)
    }
    simplify.challenge.MC1effect = temp
    temp = new Decimal(1)
    if (simplify.challenge.completed[14] == 1){
        temp = temp.add(0.25)
    }
    simplify.challenge.SC3effect = temp
    
}

function maxAllComPS(){
    let buy
    for (let comp = 8; comp >= 1; --comp){
        let x = points.log(10)
        if (points.gte(comps[comp].cost)){
            buy = new Decimal(comp * 4).sub(x).sub(3).mul(ln10).div(new Decimal(comp).mul(simplify.challenge.SC3effect.ln().mul(-1)).add(new Decimal(comp * 2).mul(ln10)).sub(simplify.challenge.MC1effect.ln())).mul(-1)
            if (buy.gte(compScale1)){
                buy = x.add(3).sub(new Decimal(comp * 4)).mul(new Decimal(comp * 8)).div(compScale1).add(new Decimal(comp).mul(simplify.challenge.SC3effect.log(10)).add(simplify.challenge.MC1effect.log(10)).pow(2)).root(2).mul(compScale1).add(new Decimal(comp).mul(compScale1).mul(simplify.challenge.SC3effect.log(10))).add(compScale1.mul(simplify.challenge.MC1effect.log(10))).div(new Decimal(comp * 4))
            }
            if (buy.gte(compScale2)){
                let a = new Decimal("e133333333").mul(comp)
                let b = new Decimal("e3000").mul(comp)
                let c = compScale2Pow[0]
                let d = compScale2Pow[1].mul(0.0001).mul(comp ** 0.25).add(1)
                let e = compScale2Pow[2].mul(0.0001).mul(comp ** 0.25)
                let f = compScale2Pow[3].mul(2).mul(comp ** 0.1)
                buy = calcGeneralCosts("EEP", Decimal.pow(10, x), true, a, b, c, d, e, f).add(compScale2)
            }
            comps[comp]._bought = buy.floor();
            comps[comp]._updateCost(); 
            points = points.sub(comps[comp].cost);
            comps[comp].buy();
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
        let gameDelta = new Decimal(delta).mul(timeSpeed)
        softcaps = [];
        for (let type = 0; type < 4; ++type)
            simplifyXPtick(type, gameDelta);
        compBM = simplify.DP.effect.mul(2)

        pps = calcPointsPerSecond()
        points = points.add(pps.times(gameDelta));

        if (compVisible < 8 && points.gte(comps[compVisible + 1].cost.mul(0.1))){
            ++compVisible;
            hideShow("gen-comp" + compVisible, true);
        }

        totalPoints = totalPoints.add(pps.times(gameDelta));
        totalPointsInSimplify = totalPointsInSimplify.add(pps.times(gameDelta));
        getProgress(delta)
        getChalEffects()

        for (let comp = 1; comp <= 8; ++comp){
            comps[comp].changeAmount(calcCompxPerSecond(comp).times(gameDelta));
            if (tab[0] == 0){
                let tr = comps[comp].amount.add(calcCompxPerSecond(comp)).pow(compExp).sub(comps[comp].amount.pow(compExp))
                const perSecondText = " (" + format(tr, true, tr < 10 ? 1 : 0) + "/s),";
                const boughtText =  " [ " + format(comps[comp].bought) + " ]    "
                const text = tr.gt(0) ? perSecondText + boughtText : boughtText;
                document.getElementById("gen-comp" + comp + "-amount").innerHTML = format(comps[comp].trueamount, true) + " " + text;
                document.getElementById("gen-comp" + comp + "-cost").innerHTML = "Cost: " + format(comps[comp].cost);
                document.getElementById("gen-comp" + comp + "-multi").innerHTML = format(comps[comp].multi) + "x ";
                tr = (expandMultComP == comp) ? comps[comp]._factors : "";
                document.getElementById("gen-comp" + comp + "-mbd").innerHTML = tr;
                if (points.gte(comps[comp].cost)) 
                    document.getElementById("gen-comp" + comp + "-cost").classList.replace("compNo", "compYes")
                else 
                    document.getElementById("gen-comp" + comp + "-cost").classList.replace("compYes", "compNo")
                
                document.getElementById("gen-comp" + comp + "-cost").classList.forEach(clas => {
                    if (clas.startsWith("Scaled"))
                        document.getElementById("gen-comp" + comp + "-cost").classList.remove(clas);
                    });
                if (comps[comp].bought.gte("eeeee10")) // filler
                    document.getElementById("gen-comp" + comp + "-cost").classList.add("Scaled4")
                if (comps[comp].bought.gte("ee1000")) // filler
                    document.getElementById("gen-comp" + comp + "-cost").classList.add("Scaled3")
                if (comps[comp].bought.gte(compScale2))
                document.getElementById("gen-comp" + comp + "-cost").classList.add("Scaled2")
                if (comps[comp].bought.gte(compScale1)) 
                    document.getElementById("gen-comp" + comp + "-cost").classList.add("Scaled1")
                else 
                    document.getElementById("gen-comp" + comp + "-cost").classList.add("Scaled0")
                //also somthing to consider for proformance reasons its better to change text when it needs to be changed
                //rather than doing it every frame for example this could be moved to when a comP gets bought as its
                //scaling only changes based on how many of that ComP has been bought.
                //
                // ^ this won't be effective because pretty soon there will be something that reduces/increases ComP costs *gradually*
            }
        }
        //html stuff
        let htmlTemp = ""
        document.getElementById("points").innerHTML = format(points, true) + " <pps>( " + format(pps,true) + " / s ) </pps>";
        if (mode == "softcap"){
            document.getElementById("scPts1").innerHTML = ""
            document.getElementById("scPts2").innerHTML = ""
            document.getElementById("scPts3").innerHTML = ""
            document.getElementById("scPts4").innerHTML = ""
            if (pps.gte(100)){
                htmlTemp = "<pps><sc1> Your gain is being reduced by /" + format(softcaps[softcaps.indexOf("pts1")+1],true,3) + " ! </sc1></pps>";
                document.getElementById("scPts1").innerHTML = htmlTemp
            }
            if (pps.gte(1e8)){
                htmlTemp = "<pps><sc2> Your gain is being reduced by /" + format(softcaps[softcaps.indexOf("pts2")+1],true,3) + " ! </sc2></pps>";
                document.getElementById("scPts2").innerHTML = htmlTemp
            }
            if (pps.gte(1e16)){
                htmlTemp = "<pps><sc3> Your gain is being reduced by /" + format(softcaps[softcaps.indexOf("pts3")+1],true,3) + " ! </sc3></pps>";
                document.getElementById("scPts3").innerHTML = htmlTemp
            }
            if (pps.gte(1e25)){
                htmlTemp = "<pps><sc4> Your gain is being reduced by /" + format(softcaps[softcaps.indexOf("pts4")+1],true,3) + " ! </sc4></pps>";
                document.getElementById("scPts4").innerHTML = htmlTemp
            }
            if (pps.gte(1e40)){
                htmlTemp = "<pps><sc5> Your gain is being reduced by ^" + format(softcaps[softcaps.indexOf("pts5")+1],true,6) + " ! </sc5></pps>";
                document.getElementById("scPts5").innerHTML = htmlTemp
            }
        } 
        document.getElementById("fps").innerHTML = "FPS: " + FPS;
        if (tab[0] == 2){ 
            document.getElementById("SER").innerHTML = "You will gain " + format(getSimplifyGain().floor(), true) + " Simplify Energy. [ Next at " + format(new Decimal(10).pow(getSimplifyGain().floor().add(1).log(10).div(simplify.main.SEExp.log(10)).add(1).mul(simplify.main.simplifyReq.log(10))).sub(totalPointsInSimplify), true) + " ]";
            if (inSChallenge){
                document.getElementById("SER").classList.add("inSimpChal");
            } else {
                document.getElementById("SER").classList.remove("inSimpChal");
            }
            document.getElementById("SEUPG1").innerHTML = SimpUPG1[simplify.upgrades.simplifyMainUPG + 1] + " Cost: " + format(simpUPG1Cost(),true) + " Simplify Energy";
            document.getElementById("simpEnergy").innerHTML = "You have " + format(simplify.main.simplifyEnergy,true) + " Simplify Energy.";
            document.getElementById("simpEXP1").innerHTML = "You have " + format(simplify.PP.allocated,true) + " SE allocated to " + format(simplify.PP.trueValue, true, 1) + " PP, increasing overall gain by x" + format(simplify.PP.effect, true, 2) + ".";
            document.getElementById("simpEXP2").innerHTML = "You have " + format(simplify.MP.allocated,true) + " SE allocated to " + format(simplify.MP.trueValue, true, 1) + " MP, increasing all multipliers by x" + format(simplify.MP.effect, true, 2) + ".";
            document.getElementById("simpEXP3").innerHTML = "You have " + format(simplify.OP.allocated,true) + " SE allocated to " + format(simplify.OP.trueValue, true, 1) + " 1P, improving 1st mult power to ^" + format(simplify.OP.effect, true, 3) + ".";
            document.getElementById("simpEXP4").innerHTML = "You have " + format(simplify.DP.allocated,true) + " SE allocated to " + format(simplify.DP.trueValue, true, 1) + " DP, causing DM per buy to be x" + format(compBM, true, 3) + ".";
        }
        hideShow("comp", tab[0] == 0)
        hideShow("maxAll", !(inChallenge.includes("simp0") || inChallenge.includes("simp1") || inChallenge.includes("simp2") || inChallenge.includes("simp3") || inChallenge.includes("simp8") || inChallenge.includes("simp11")))     
        hideShow("Simplify", tab[0] == 2)
        hideShow("simplify_tab_simplify", tab[0] == 2)
        hideShow("simplify_tab_tts", simplify.upgrades.simplifyMainUPG >= 2 && tab[0] == 2)
        hideShow("simpExP", simplify.upgrades.simplifyMainUPG >= 1 && tab[0] == 2 && tab[1] == 0)
        hideShow("ttsChal", tab[0] == 2 && tab[1] == 1)
        hideShow("tab_other_stat", tab[0] == 1)
        hideShow("tab_other_changeLog", tab[0] == 1)
        hideShow("changeLog", tab[0] == 1 && tab[1] == 2)
        hideShow("tab_simplify", totalPoints.gte(1e12))
        document.getElementById("progressBar1").innerHTML = progressBarText + (progressBar.toNumber() * 100).toFixed(2) + "%";
        document.getElementById("progressBar1").style.width = progressBar.toNumber() * 98 + "%";
        // do not change order at all
        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
}