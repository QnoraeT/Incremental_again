function simpChalSelect(ex) {
    simpChalSelected = ex
    updateChallenge("simp")
}

function getSimplifyGain() {
    let temp;
    temp = Decimal.pow(player.simplify.main.SEExp, player.misc.totalPointsInSimplify.div(10).log(player.simplify.main.simplifyReq.div(10))).sub(1).div(player.simplify.main.SEExp.sub(1));
    return temp;
}

function simplifyXPtick(type, tickRate) {
    let temp;
    temp = player.simplify[simplifyXPTypes[type]].allocated.pow(1.5);
    player.simplify[simplifyXPTypes[type]].generated = player.simplify[simplifyXPTypes[type]].generated.add(temp.mul(tickRate));
    player.simplify[simplifyXPTypes[type]].trueValue = player.simplify[simplifyXPTypes[type]].generated.add(1).pow(player.simplify.main.SAExp).sub(1);
    temp = player.simplify[simplifyXPTypes[type]].trueValue;
    if (player.misc.inChallenge.includes("simp8") && !temp == 0) { temp = dZero; }
    switch (type) {
        case 0:
            temp = temp.pow(1.5).add(1);
            if (player.simplify.challenge.completed[8]) {
                temp = temp.mul(player.simplify[simplifyXPTypes[1]].effect.pow(1.1))
                    .pow(player.simplify[simplifyXPTypes[2]].effect.sub(1).max(1).root(1.7))
                    .mul(player.simplify[simplifyXPTypes[3]].effect.pow(64))
            }
            if (player.misc.inChallenge.includes("simp8")) {
                temp = temp.mul(player.simplify[simplifyXPTypes[1]].trueValue.pow(0.75).add(1))
                    .pow(player.simplify[simplifyXPTypes[2]].trueValue.add(10).log(10).root(5.5))
                    .pow(player.simplify[simplifyXPTypes[3]].trueValue.add(10).log(10).root(7).add(1).div(2));
            }
            if (player.misc.inChallenge.includes("simp1")) { temp = temp.root(2); }
            if (player.misc.inChallenge.includes("simp4")) { temp = dOne; }
            break
        case 1:
            temp = temp.pow(0.75).add(1);
            if (player.misc.inChallenge.includes("simp1")) { temp = temp.root(2).div(1000); }
            break
        case 2:
            temp = temp.add(1).mul(10).log(10).root(5.5).add(1);
            break
        case 3:
            temp = temp.add(1).mul(10).log(10).root(7).mul(2);
            if (player.misc.inChallenge.includes("simp1")) { temp = temp.sub(1); }
            temp = temp.max(1)
            break
        default:
            throw new Error("Type " + type + "is unknown!");
    }
    if (player.misc.inChallenge.includes("simp3")) { temp = temp.pow(0.4); }
    if (player.misc.inChallenge.includes("simp6")) { temp = dOne; }
    if (player.misc.inChallenge.includes("simp7")) { temp = temp.pow(0.5); }
    player.simplify[simplifyXPTypes[type]].effect = temp;
}

function simplify1Upg() {
    if (player.simplify.main.simplifyEnergy.gte_tolerance(simpUPG1Cost(), 0.001)) {
        player.simplify.main.simplifyEnergy = player.simplify.main.simplifyEnergy.sub(simpUPG1Cost());
        if (player.simplify.main.simplifyEnergy.lt(0)) {
            player.simplify.main.simplifyEnergy = dZero;
        }
        player.simplify.upgrades.simplifyMainUPG++;
    }
}

function simpExPAllocate(id) {
    player.simplify[simplifyXPTypes[id]].allocated = player.simplify[simplifyXPTypes[id]].allocated.add(player.simplify.main.simplifyEnergy);
    player.simplify.main.simplifyEnergy = dZero
}

function simplifyReset(...param) {
    if (player.misc.points.gte(player.simplify.main.simplifyReq) && player.misc.inSChallenge && !param.noChalComplete) {
        completeChallenge("simp")
        updateChallenge("simp")
    }
    player.simplify.main.simplifyEnergy = player.simplify.main.simplifyEnergy.add(getSimplifyGain().floor())
    player.simplify.main.totalSE = player.simplify.main.totalSE.add(getSimplifyGain().floor())
    player.simplify.main.simplifyStat = player.simplify.main.simplifyStat.add(1)
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
    compVisible = 1;
}

function simpUPG1Cost() {
    let ret = new Decimal(player.simplify.upgrades.simplifyMainUPG);
    ret = Decimal.pow(10, ret.pow(2)).mul(altFactorial(ret));
    return ret;
}
