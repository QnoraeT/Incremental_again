"use strict";

for (let [index, comp] of Object.entries(player.comps.array)) {
    document.getElementById("gen-comp" + index + "-cost").innerText = "Cost: " + format(comp.cost);
    document.getElementById("gen-comp" + index + "-multi").innerText = format(comp.multi) + "x ";
    document.getElementById("gen-comp" + index + "-amount").innerText = format(comp.trueamount) + ", ";
    document.getElementById("gen-comp" + index + "-breakdown").innerText = "Show factors";
    document.getElementById("gen-comp" + index).style.display = index > compVisible ? "none" : "block";
}
for (let [index] of Object.entries(player.simplify.challenge.completed)){
    document.getElementById("simpChal" + index + "-id").innerText = index;
}
document.getElementById("simpChal0-type").innerText = "🔎 Challenges";
document.getElementById("simpChal4-type").innerText = "🔰 Challenges";
document.getElementById("simpChal8-type").innerText = "🚛 Challenges";
document.getElementById("simpChal12-type").innerText = "777 Challenges";
document.getElementById("simpEXP1b").innerText = "Allocate all SE into PP.";
document.getElementById("simpEXP2b").innerText = "Allocate all SE into MP.";
document.getElementById("simpEXP3b").innerText = "Allocate all SE into 1P.";
document.getElementById("simpEXP4b").innerText = "Allocate all SE into DP.";
document.getElementById("simpEXP1b").classList.add("defaultButton");
document.getElementById("simpEXP2b").classList.add("defaultButton");
document.getElementById("simpEXP3b").classList.add("defaultButton");
document.getElementById("simpEXP4b").classList.add("defaultButton");
document.getElementById("challengeStart1").classList.add("challengeStart", "defaultButton");
document.getElementById("challengeStart1").classList.add("startChallenge", "defaultButton");
document.getElementById("completeChallenge1").classList.add("challengeStart", "defaultButton");
document.getElementById("completeChallenge1").classList.add("completeChallenge", "defaultButton");
document.getElementById("tab_comp").classList.add("defaultTab", "defaultButton");
document.getElementById("tab_other").classList.add("defaultTab", "defaultButton");
document.getElementById("tab_other_stat").classList.add("defaultTab", "defaultButton");
document.getElementById("tab_other_changeLog").classList.add("defaultTab", "defaultButton");
document.getElementById("tab_other").classList.add("defaultTab", "defaultButton");
document.getElementById("maxAll").classList.add("defaultTab", "defaultButton");
document.getElementById("SER").classList.add("defaultSimplifyTab", "defaultButton");
document.getElementById("SEUPG1").classList.add("defaultSimplifyTab", "defaultButton");
document.getElementById("tab_simplify").classList.add("defaultSimplifyTab", "defaultButton");
document.getElementById("simplify_tab_simplify").classList.add("defaultButton");
document.getElementById("simplify_tab_tts").classList.add("defaultButton");
changeLog()

function changeLog(){
    let changeLog = ""
    changeLog += "<br><changeLog><p class='date0'> v0.0.0 - Apr 5, 2023 </p>";
    changeLog += "<br> Progress on TTS Challenges #1";
    changeLog += "<br> Added a new mode 'softcapped', currently unavaliable as an option";
    
    document.getElementById("changeLog").innerHTML = changeLog;
}

function switchTab(t,id) {
    tab[id] = t;
    for (let TA = id + 1; TA <= (tab.length - 1); ++TA) {
        tab[TA] = 0;
        if (TA > 40){
            throw new Error("what the hell? (broke out of somehow infinite loop)");
        }
    }
    hideShow("comp", tab[0] == 0)
    hideShow("Simplify", tab[0] == 2)
    hideShow("simplify_tab_simplify", tab[0] == 2)
    hideShow("ttsChal", tab[0] == 2 && tab[1] == 1)
    hideShow("tab_other_stat", tab[0] == 1)
    hideShow("tab_other_changeLog", tab[0] == 1)
    hideShow("changeLog", tab[0] == 1 && tab[1] == 2)
}

function getSimplifyGain() {
    let temp;
    temp = Decimal.pow(player.simplify.main.SEExp, player.misc.totalPointsInSimplify.div(10).log(player.simplify.main.simplifyReq.div(10))).sub(1).div(player.simplify.main.SEExp.sub(1));
    return temp;
}

function buyComp(comp) {
    if (player.misc.points.gte(player.comps.array[comp].cost)){
        player.misc.points = player.misc.points.minus(player.comps.array[comp].cost);
        player.comps.array[comp].buy();
    }
}

function simplifyXPtick(type,tickRate) {
    let temp;
    temp = player.simplify[player.simplify.main.sXPTypes[type]].allocated.pow(1.5); 
    player.simplify[player.simplify.main.sXPTypes[type]].generated = player.simplify[player.simplify.main.sXPTypes[type]].generated.add(temp.mul(tickRate));
    player.simplify[player.simplify.main.sXPTypes[type]].trueValue = player.simplify[player.simplify.main.sXPTypes[type]].generated.add(1).pow(player.simplify.main.SAExp).sub(1);
    temp = player.simplify[player.simplify.main.sXPTypes[type]].trueValue;
    if (player.misc.inChallenge.includes("simp8") && !temp == 0){temp = dZero;}
    switch(type){
        case 0: 
            temp = temp.pow(1.5).add(1);
            if (player.simplify.challenge.completed[8] == 1){
                temp = temp.mul(player.simplify[player.simplify.main.sXPTypes[1]].effect.pow(0.5))
                .pow(player.simplify[player.simplify.main.sXPTypes[2]].effect.sub(1).max(1).root(1.7))
                .mul(player.simplify[player.simplify.main.sXPTypes[3]].effect.pow(64))
            }
            if (player.misc.inChallenge.includes("simp8")){
                temp = temp.mul(player.simplify[player.simplify.main.sXPTypes[1]].trueValue.pow(0.75).add(1))
                .pow(player.simplify[player.simplify.main.sXPTypes[2]].trueValue.add(10).log(10).root(5.5))
                .pow(player.simplify[player.simplify.main.sXPTypes[3]].trueValue.add(10).log(10).root(7).add(1).div(2));
            }
            if (player.misc.inChallenge.includes("simp1")){temp = temp.root(2);}
            if (player.misc.inChallenge.includes("simp4")){temp = dOne;}
            break
        case 1: 
            temp = temp.pow(0.75).add(1);
            if (player.misc.inChallenge.includes("simp1")){temp = temp.root(2).div(1000);}
            break
        case 2: 
            temp = temp.add(1).mul(10).log(10).root(5.5).add(1);
            break
        case 3: 
            temp = temp.add(1).mul(10).log(10).root(7).mul(2);
            if (player.misc.inChallenge.includes("simp1")){temp = temp.sub(1);}
            temp = temp.max(1)
            break
        default:
            throw new Error("Type " + type + "is unknown!");
    }
    if (player.misc.inChallenge.includes("simp3")){temp = temp.pow(0.4);}
    if (player.misc.inChallenge.includes("simp6")){temp = dOne;}
    if (player.misc.inChallenge.includes("simp7")){temp = temp.pow(0.5);}
    player.simplify[player.simplify.main.sXPTypes[type]].effect = temp;
}

function calcPointsPerSecond(){
    let temp = player.comps.array[1].trueamount.mul(player.comps.array[1].multi);
    if (player.misc.inChallenge.includes("simp2")){temp = temp.root(2);}
    if (player.misc.inChallenge.includes("simp5")){temp = temp.pow(player.comps.compExp);}
    if (player.misc.inChallenge.includes("simp8")){temp = temp.root(3);}
    if (player.misc.inChallenge.includes("simp9")){temp = temp.root(2).div(1e150);}
    if (player.misc.inChallenge.includes("simp13")){temp = temp.pow(0.05);}
    return temp;
}

function simpUPG1Cost(){
    let ret = new Decimal(player.simplify.upgrades.simplifyMainUPG);
    ret = Decimal.pow(10, ret.pow(2)).mul(altFactorial(ret));
    return ret;
}

function updateChallenge(type){
    let temp;
    let c;
    switch(type){
        case "simp": case "all":
            for (let j = 1; j < 4; ++j){
                temp = false;
                for (let i = 0; i <= 4; ++i){
                    c=player.simplify.challenge.completed[i + (j - 1) * 4] == 1;
                    if ((i + j * 4) < 16){
                        hideShow("simpChal" + (i + j * 4) + "-id", c);
                    }
                    if (c){temp = true;}
                }
                hideShow("simpChal" + j * 4, temp);
            }
            player.misc.inSChallenge = false
            for (let i = 0; i < 16; ++i){
                document.getElementById("simpChal" + i + "-id").classList.forEach(clas => {
                    if (!clas == "simpChal")
                    document.getElementById("simpChal" + i + "-id").classList.remove(clas);
                });
        
                document.getElementById("simpChal" + i + "-id").classList.add(player.simplify.challenge.completed[i] == 1 ? "simpChalComplete" : "simpChalIncomplete")
                if (document.getElementById("simpChal" + i + "-id").style.display == "inherit"){
                    document.getElementById("simpChal" + i + "-id").style.display = ""
                }
                if (player.misc.inChallenge.includes("simp" + i)){
                    document.getElementById("simpChal" + i + "-id").classList.add("inSimpChal")
                    player.misc.inSChallenge = true 
                }
            }
            if (player.misc.inSChallenge){
                document.getElementById("challengeStart1").classList.replace("startChallenge","exitChallenge")
            } else {
                document.getElementById("challengeStart1").classList.replace("exitChallenge","startChallenge")
            }
            document.getElementById("challengeStart1").innerText = player.misc.inSChallenge ? "Exit Challenge" : "Start Challenge";
            document.getElementById("challengeStart1").style.width =  player.misc.totalPointsInSimplify.gte(player.simplify.main.simplifyReq) && player.misc.inSChallenge ? "180px" : "360px";
            document.getElementById("completeChallenge1").innerText = "Complete Challenge";
            hideShow("completeChallenge1", player.misc.totalPointsInSimplify.gte(player.simplify.main.simplifyReq) && player.misc.inSChallenge && tab[0] == 2 & tab[1] == 1)
            break;
        default:
            throw new Error("challenge type " + type + " does not exist.")
    }
}

function completeChallenge(type){
    switch(type){
        case "simp":
            for (let i = 0; i < 16; ++i){
                if (player.misc.inChallenge.includes("simp" + i)){
                    player.simplify.challenge.completed[i] = 1;
                    player.misc.inChallenge.splice(player.misc.inChallenge.indexOf("simp" + i), 1)
                }
            }
            break;
        default:
            throw new Error("challenge type " + type + " does not exist.")
    }
}

function simpChalSelect(ex) {
    simpChalSelected = ex
    simpChal.simpChalDesc[ex]
}

function simplifyReset(){
    if (player.misc.points.gte(player.simplify.main.simplifyReq)){
        completeChallenge("simp")
        updateChallenge("simp")
    }
    player.simplify.main.simplifyEnergy=player.simplify.main.simplifyEnergy.add(getSimplifyGain().floor())
    player.simplify.main.simplifyStat=player.simplify.main.simplifyStat.add(1)
    compVisible = 1;
    player.misc.points = dTen;
    player.misc.totalPointsInSimplify = dTen;
    player.simplify.main.timeInSimplify = dZero;
    player.comps.array = {
        "1": new ComP(1),
        "2": new ComP(2),
        "3": new ComP(3),
        "4": new ComP(4),
        "5": new ComP(5),
        "6": new ComP(6),
        "7": new ComP(7),
        "8": new ComP(8)
    }
    for (let [index, comp] of Object.entries(player.comps.array)) {
        document.getElementById("gen-comp" + index + "-cost").innerText = "Cost: " + format(comp.cost);
        document.getElementById("gen-comp" + index + "-multi").innerText = format(comp.multi) + "x ";
        document.getElementById("gen-comp" + index + "-amount").innerText = format(comp.trueamount) + ", ";
        document.getElementById("gen-comp" + index).style.display = index > compVisible ? "none" : "block";
    }
}

function simplify1Upg() {
    if (player.simplify.main.simplifyEnergy.gte_tolerance(simpUPG1Cost(), 0.001)){
        player.simplify.main.simplifyEnergy = player.simplify.main.simplifyEnergy.sub(simpUPG1Cost());
        if (player.simplify.main.simplifyEnergy.lt(0)){
            player.simplify.main.simplifyEnergy = dZero;
        }
        player.simplify.upgrades.simplifyMainUPG++;
    }
}

function simpExPAllocate(id) {
    switch(id){
        case 1: 
            player.simplify.PP.allocated = player.simplify.PP.allocated.add(player.simplify.main.simplifyEnergy);
            break;
        case 2: 
            player.simplify.MP.allocated = player.simplify.MP.allocated.add(player.simplify.main.simplifyEnergy);
            break;
        case 3: 
            player.simplify.OP.allocated = player.simplify.OP.allocated.add(player.simplify.main.simplifyEnergy);
            break;
        case 4: 
            player.simplify.DP.allocated = player.simplify.DP.allocated.add(player.simplify.main.simplifyEnergy);
            break;
        default:
            throw new Error("Wtf!! xP doesn't exist")
    }
    player.simplify.main.simplifyEnergy = dZero
}

function calcCompxPerSecond(comp)  {
    if (comp === 9) {throw new Error("comp >= 9 is not defined you stoopid!!")}
    if (comp === 8) {
        let temp = dZero
        if (player.simplify.challenge.completed[13] == 1) {temp = player.comps.array[1].trueamount.mul(player.comps.array[1].multi).pow(0.075);}
        return temp;
    }
    return player.comps.array[comp + 1].trueamount.mul(player.comps.array[comp + 1].multi);
}

function getProgress() { // progressBar = 0-1
    progressBar = dOne
    progressBarText = "All done! "
    if (player.misc.inSChallenge){
        progressBar = player.misc.totalPointsInSimplify.add(1).log(player.simplify.main.simplifyReq);
        progressBarText = "Complete Challenge: "; 
        return;
    }
    if (player.simplify.upgrades.simplifyMainUPG == 5){
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(1.2e27).add(1).log(Decimal.div(7.2e38, 1.2e27));
        progressBarText = "Next feature: "; 
        return;
    }
    if (player.simplify.upgrades.simplifyMainUPG == 4){
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(2.4e17).add(1).log(Decimal.div(1.2e27, 2.4e17));
        progressBarText = "Next feature: "; 
        return;
    }
    if (player.simplify.upgrades.simplifyMainUPG == 3){
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(6e9).add(1).log(Decimal.div(2.4e17, 6e9));
        progressBarText = "Next feature: "; 
        return;
    }
    if (player.simplify.upgrades.simplifyMainUPG == 2){
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain().add(1)).log(Decimal.div(6e9, 20_000));
        progressBarText = "Next feature: "; 
        return;
    }
    if (player.simplify.upgrades.simplifyMainUPG == 1){
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(10); 
        progressBarText = "Next feature: "; 
        return;
    }
    if (player.misc.totalPoints.lt(1e12)){
        progressBar = player.misc.totalPoints.add(1).log(1e12); 
        progressBarText = "Next layer: "; 
        return;
    }
    if (player.simplify.upgrades.simplifyMainUPG == 0){
        progressBarText = "Look in the \"Simplify\" tab! "; 
        return;
    }
}

function hideShow(id, condition){
    let x = document.getElementById(id);
    x.style.display = condition ? "inherit" : "none";
}

function expandComPMULTI(comp){
    if (expandMultComP == comp){
        if (expandMultComPType == 0){
            expandMultComPType = 1
        } else {
            expandMultComP = 0
            expandMultComPType = 0
        }
    } else {
        expandMultComP = comp
    }
}

function getChalEffects(){
    let temp
    temp = dOne
    if (player.simplify.challenge.completed[0] == 1){temp = temp.add(1);}
    player.simplify.challenge.MC1effect = temp

    temp = dOne
    if (player.simplify.challenge.completed[14] == 1){temp = temp.add(0.25);}
    player.simplify.challenge.SC3effect = temp

    if (player.simplify.challenge.completed[3] == 1){temp = player.misc.points.max(10).log(10).sub(1).div(4).add(1).pow(0.4).sub(1);}
    temp = Decimal.pow(10, scale("EP", temp.add(1).log(10), false, 2.30102999, 1, 1.5, 0)[0]) // this is a double log softcap lmfao
    player.simplify.challenge.MC4effect = temp

    temp = new Decimal(0.8)
    if (player.simplify.challenge.completed[5] == 1){temp = temp.add(0.025);}
    if (player.misc.inChallenge.includes("simp11")){temp = new Decimal(0.5);}
    player.comps.compExp = temp

    temp = new Decimal(150)
    if (player.simplify.challenge.completed[9] == 1){
        for (let comp = 8; comp >= 1; --comp){
            temp = temp.add(player.comps.array[comp].bought.mul(0.01))
        }
    }
    if (player.misc.inChallenge.includes("simp1")){temp = dOne;}
    if (player.misc.inChallenge.includes("simp9")){
        temp = temp.sub(player.simplify.main.timeInSimplify.mul(15));
        for (let comp = 8; comp >= 1; --comp){
            temp = temp.add(player.comps.array[comp].bought.mul(0.25))
        }
    }
    player.scaling.ComPs[0].start = temp

    temp = dOne
    if (player.simplify.challenge.completed[10] == 1){temp = Decimal.pow(player.simplify.main.timeInSimplify.add(1), 32);}
    player.simplify.challenge.AC2effect = temp

    temp = new Decimal(0.75)
    if (player.simplify.challenge.completed[11] == 1){temp = temp.add(0.025);}
    player.simplify.main.SAExp = temp

    temp = new Decimal(1e12);
    if (player.misc.inChallenge.includes("simp2")){temp = new Decimal(1e20);}
    if (player.misc.inChallenge.includes("simp5")){temp = new Decimal("1e395");}
    if (player.misc.inChallenge.includes("simp12")){temp = new Decimal(1.111e111);}
    if (player.misc.inChallenge.includes("simp14")){temp = new Decimal(1e55);}
    if (player.misc.inChallenge.includes("simp15")){temp = new Decimal(1.797693e308);}
    player.simplify.main.simplifyReq = temp

    if (player.misc.inChallenge.includes("simp13")){
        temp = player.misc.pps.div(Decimal.pow(3.3, player.simplify.main.timeInSimplify));
        player.simplify.challenge.SC2RG = temp;
    }
}

function challengeToggle(type){
    switch(type){
        case "simp":
            if (player.misc.inSChallenge){
                for (let i = 0; i < 16; ++i){
                    if (player.misc.inChallenge.includes("simp" + i)){
                        player.misc.inChallenge.splice(player.misc.inChallenge.indexOf("simp" + i), 1);
                    }
                }
            } else {
                player.misc.inChallenge.push("simp" + simpChalSelected);
            }
            simplifyReset();
            break;
        default:
            throw new Error("challenge type " + type + " does not exist.")
    }
    updateChallenge(type)
}

function maxAllComPS(){
    let buy
    for (let comp = 8; comp >= 1; --comp){
        let x = player.misc.points.log(10)
        x = x.add(player.simplify.challenge.AC2effect.log(10))
        if (player.misc.inChallenge.includes("simp13")){x = x.div(0.1);}
        if (player.simplify.challenge.completed[1] == 1){x = x.div(0.95);}
        if (player.misc.points.gte(player.comps.array[comp].cost)){
            buy = new Decimal(comp * 4).sub(x).sub(3).mul(ln10).div(new Decimal(comp).mul(player.simplify.challenge.SC3effect.ln().mul(-1)).add(new Decimal(comp * 2).mul(ln10)).sub(player.simplify.challenge.MC1effect.ln())).mul(-1)
            if (buy.gte(player.scaling.ComPs[0].start)){
                buy = x.add(3).sub(new Decimal(comp * 4)).mul(new Decimal(comp * 8)).div(player.scaling.ComPs[0].start).add(new Decimal(comp).mul(player.simplify.challenge.SC3effect.log(10)).add(player.simplify.challenge.MC1effect.log(10)).pow(2)).root(2).mul(player.scaling.ComPs[0].start).add(new Decimal(comp).mul(player.scaling.ComPs[0].start).mul(player.simplify.challenge.SC3effect.log(10))).add(player.scaling.ComPs[0].start.mul(player.simplify.challenge.MC1effect.log(10))).div(new Decimal(comp * 4))
            }
            if (buy.gte(player.scaling.ComPs[1].start)){
                let a = new Decimal("e133333333").mul(comp)
                let b = new Decimal("e3000").mul(comp)
                let c = player.scaling.ComPs[1].strength[0]
                let d = player.scaling.ComPs[1].strength[1].mul(0.0001).mul(comp ** 0.25).add(1)
                let e = player.scaling.ComPs[1].strength[2].mul(0.0001).mul(comp ** 0.25)
                let f = player.scaling.ComPs[1].strength[3].mul(2).mul(comp ** 0.1)
                buy = calcGeneralCosts("EEP", Decimal.pow(10, x), true, a, b, c, d, e, f).add(player.scaling.ComPs[1].start)
            }
            if (player.simplify.challenge.completed[3] == 1){buy = buy.add(player.simplify.challenge.MC4effect);}
            if (player.simplify.challenge.completed[2] == 1){buy = buy.div(0.975);}
            if (player.misc.inChallenge.includes("simp14")){buy = buy.div(2);}
            player.comps.array[comp].bought = buy.floor();
            player.comps.array[comp].updateCost(); 
            player.misc.points = player.misc.points.sub(player.comps.array[comp].cost);
            player.comps.array[comp].buy();
        }
    }
}

{
    window.requestAnimationFrame(gameLoop);
    let oldTimeStamp = 0; 
    lastFPSCheck = 0; 
    switchTab(0, 0);
    initDots();
    setupHTML();
    function gameLoop(timeStamp){
            delta = (timeStamp - oldTimeStamp) / 1000;
            fpsList.push(delta)
            if (timeStamp > lastFPSCheck){
                lastFPSCheck = timeStamp + 500;
                FPS = 0
                for (let i = 0; i < fpsList.length; ++i){
                    FPS += fpsList[i];
                }
                FPS = (fpsList.length / FPS).toFixed(1);
                fpsList = [];
                document.getElementById("fps").innerText = "FPS: " + FPS;
            }
            let gameDelta = Decimal.mul(delta, player.misc.timeSpeed);
            player.misc.gameTime = player.misc.gameTime.add(gameDelta);
            player.simplify.main.timeInSimplify = player.simplify.main.timeInSimplify.add(gameDelta);
            player.simplify.challenge.JC1Time = player.simplify.challenge.JC1Time.add(gameDelta);
            player.misc.totalTime += delta;
            sessionTime += delta;
            softcaps = [];
            for (let type = 0; type < 4; ++type){
                simplifyXPtick(type, gameDelta);          
            }
            player.comps.compBM = player.simplify.DP.effect;

            player.misc.pps = calcPointsPerSecond();
            player.misc.points = player.misc.points.add(player.misc.pps.times(gameDelta));
            document.getElementById("points").innerText = format(player.misc.points, true, 3) + " ( " + format(player.misc.pps, true, 3) + " / s )";
            // document.getElementById("points").innerText = format(player.misc.points, true, 3)
            // document.getElementById("pps").innerText = "(  " + format(player.misc.pps, true, 3) + " / s )";
            
            if (compVisible < 8 && player.misc.points.gte(player.comps.array[compVisible + 1].cost.mul(0.1))){
                ++compVisible;
                hideShow("gen-comp" + compVisible, true);
            }

            player.misc.totalPoints = player.misc.totalPoints.add(player.misc.pps.times(gameDelta));
            player.misc.totalPointsInSimplify = player.misc.totalPointsInSimplify.add(player.misc.pps.times(gameDelta));
            getProgress(); 
            progressBar = Decimal.clamp(progressBar, 0, 1);
            getChalEffects();

            for (let comp = 1; comp <= 8; ++comp){
                player.comps.array[comp].changeAmount(calcCompxPerSecond(comp).times(gameDelta));
                if (tab[0] == 0){
                    let tr = calcCompxPerSecond(comp).add(player.comps.array[comp].amount).pow(player.comps.compExp).sub(player.comps.array[comp].amount.pow(player.comps.compExp))
                    const perSecondText = " (" + format(tr, false, tr < 10 ? 1 : 0) + "/s),";
                    const boughtText =  " [ " + format(player.comps.array[comp].bought) + " ]    "
                    const text = tr.gt(0) ? perSecondText + boughtText : boughtText;
                    const compCost = document.getElementById("gen-comp" + comp + "-cost")
                    document.getElementById("gen-comp" + comp + "-amount").innerText = format(player.comps.array[comp].trueamount, false, 3) + " " + text;
                    compCost.innerText = "Cost: " + format(player.comps.array[comp].cost, true, 3);
                    document.getElementById("gen-comp" + comp + "-multi").innerText = format(player.comps.array[comp].multi, true, 3) + "x ";
                    tr = (expandMultComP == comp) ? ((expandMultComPType == 0) ? player.comps.array[comp].multiFactors : player.comps.array[comp].costFactors) : "";
                    if (expandMultComPType == 0) {
                        document.getElementById("gen-comp" + comp + "-mbd").classList.replace("compCostBreakdown", "compMultBreakdown");
                        document.getElementById("gen-comp" + comp + "-breakdown").classList.replace("ceCost", "ceMul");
                    } else {
                        document.getElementById("gen-comp" + comp + "-mbd").classList.replace("compMultBreakdown", "compCostBreakdown");
                        document.getElementById("gen-comp" + comp + "-breakdown").classList.replace("ceMul", "ceCost");
                    }
                    document.getElementById("gen-comp" + comp + "-mbd").innerText = tr;
                    if (player.misc.points.gte(player.comps.array[comp].cost)) {
                        compCost.classList.replace("compNo", "compYes");
                    } else {
                        compCost.classList.replace("compYes", "compNo");
                    }
                    compCost.classList.forEach(clas => {
                        if (clas.startsWith("Scaled")){compCost.classList.remove(clas);}
                        });
                    if (player.comps.array[comp].bought.gte("e77777777")) // filler
                        compCost.classList.add("Scaled4")
                    if (player.comps.array[comp].bought.gte("e77777777")) // filler
                        compCost.classList.add("Scaled3")
                    if (player.comps.array[comp].bought.gte(player.scaling.ComPs[1].start))
                        compCost.classList.add("Scaled2")
                    if (player.comps.array[comp].bought.gte(player.scaling.ComPs[0].start)) 
                        compCost.classList.add("Scaled1")
                    else 
                        compCost.classList.add("Scaled0")
                    //also somthing to consider for proformance reasons its better to change text when it needs to be changed
                    //rather than doing it every frame for example this could be moved to when a comP gets bought as its
                    //scaling only changes based on how many of that ComP has been bought.
                    //
                    // ^ this won't be effective because pretty soon there will be something that reduces/increases ComP costs *gradually*
                }
            }
            //html stuff
            let htmlTemp = ""
            if (tab[0] == 2){ 
                // Decimal.pow(player.simplify.main.SEExp, player.misc.totalPointsInSimplify.div(10).log(player.simplify.main.simplifyReq.div(10))).sub(1).div(player.simplify.main.SEExp.sub(1));
                // y = (E^log_(R/10)(x/10)-1)/(E-1)
                document.getElementById("SER").innerText = ((player.misc.points.gte(player.simplify.main.simplifyReq)) ? "You will gain " + format(getSimplifyGain().floor(), true) + " Simplify Energy. " : "Reset your current simplify run. ") + "[ Next at " + format(dTen.pow(getSimplifyGain().floor().add(1).log(10).div(player.simplify.main.SEExp.log(10)).add(1).mul(player.simplify.main.simplifyReq.log(10))).sub(player.misc.totalPointsInSimplify), true, 3, 3) + " ]";
                if (player.misc.inSChallenge && player.misc.points.gte(player.simplify.main.simplifyReq)){
                    document.getElementById("SER").classList.add("inSimpChal");
                } else {
                    document.getElementById("SER").classList.remove("inSimpChal");
                }
                document.getElementById("SEUPG1").innerText = player.simplify.upgrades.SimpUPG1[player.simplify.upgrades.simplifyMainUPG + 1] + " Cost: " + format(simpUPG1Cost(),false) + " Simplify Energy";
                document.getElementById("simpEnergy").innerText = "You have " + format(player.simplify.main.simplifyEnergy,true) + " Simplify Energy.";
                document.getElementById("simpEXP1").innerText = "You have " + format(player.simplify.PP.allocated,true) + " SE allocated to " + format(player.simplify.PP.trueValue, true, 1) + " PP, increasing overall gain by x" + format(player.simplify.PP.effect, true, 2) + ".";
                document.getElementById("simpEXP2").innerText = "You have " + format(player.simplify.MP.allocated,true) + " SE allocated to " + format(player.simplify.MP.trueValue, true, 1) + " MP, increasing all multipliers by x" + format(player.simplify.MP.effect, true, 2) + ".";
                document.getElementById("simpEXP3").innerText = "You have " + format(player.simplify.OP.allocated,true) + " SE allocated to " + format(player.simplify.OP.trueValue, true, 1) + " 1P, improving 1st mult power to ^" + format(player.simplify.OP.effect, true, 3) + ".";
                document.getElementById("simpEXP4").innerText = "You have " + format(player.simplify.DP.allocated,true) + " SE allocated to " + format(player.simplify.DP.trueValue, true, 1) + " DP, causing DM per buy to be x" + format(player.comps.compBM, true, 3) + ".";
            }
            hideShow("maxAll", !(player.misc.inChallenge.includes("simp0") || player.misc.inChallenge.includes("simp1") || player.misc.inChallenge.includes("simp2") || player.misc.inChallenge.includes("simp3") || player.misc.inChallenge.includes("simp8") || player.misc.inChallenge.includes("simp11")));
            hideShow("simplify_tab_tts", player.simplify.upgrades.simplifyMainUPG >= 2 && tab[0] == 2)
            hideShow("simpExP", player.simplify.upgrades.simplifyMainUPG >= 1 && tab[0] == 2 && tab[1] == 0)
            hideShow("tab_simplify", player.misc.totalPoints.gte(1e12))
            document.getElementById("progressBar1").innerText = progressBarText + (progressBar.toNumber() * 100).toFixed(2) + "%";
            document.getElementById("progressBar1").style.width = progressBar.toNumber() * 98 + "%";
            drawing()
            // do not change order at all
            oldTimeStamp = timeStamp;
            window.requestAnimationFrame(gameLoop);

    }
}