const simplifyChalTypes = ["🔎", "🔰", "🚛", "777"];
const simplifyXPTypes = ["Point Power", "Mult Power", "One Power", "Dimension Power"];
const simplifyXPTypeInternal = ["PP", "MP", "OP", "DP"];
const simplifyXPColor = ["#FF0000", "#FFFF00", "#00FF00", "#0000FF"];
const simplifyXPDesc = ["increasing 1st complicator's mult by x", "increasing all complicator multipliers by x", "improving 1st complicator's mult power to ^", "boosting multiplier per complicator bought by x"];

const simpUpg2Function = {
    cost(x) {
        let temp = x;
        temp = Decimal.pow(temp, 1.5).pow_base(1000).mul(1e33)
        return temp;
    },
    target(r) {
        let temp = r;
        temp = temp.div(1e33).log(1000).root(1.5)
        return temp;
    },
    power() {
        let temp = dOne;
        return temp;
    },
    display(type, total) {
        let temp = player.simplify.upgrades.simplifyUPGNum2;
        temp = temp.sub(type).div(10).add(1).floor();
        let t2 = (total) ? simpUpg2Function.strengthTotal(type, temp) : simpUpg2Function.strengthPer(type);
        switch (type) {
            case 1:
                temp = simplifyXPTypes[3] + "'s effect is raised by ^";
                temp += format(t2, 3);
                break;
            case 2:
                temp = "MC1's effect is increased by +";
                temp += format(t2, 3);
                break;
            case 3:
                temp = "Simplify Energy's gain exponent is increased by +";
                temp += format(t2, 3);
                break;
            case 4:
                temp = simplifyXPTypes[3] + "'s effect is reduced from 7.000 by /";
                temp += format(t2, 3);
                break;
            case 5:
                temp = "Complicators' post-150 scaling is delayed by +";
                temp += format(t2, 3);
                break;
            case 6:
                temp = "JC1's effect exponent is increased by +";
                temp += format(t2, 3);
                temp += ", weighted towards 8th ComP";
                break;
            case 7:
                temp = simplifyXPTypes[2] + "'s root is reduced from " + format(new Decimal(5.5), 3) + " by /";
                temp += format(t2, 3);
                break;
            case 8:
                temp = "MC4's effect exponent is multiplied by x";
                temp += format(t2[0], 3);
                temp += ", and it's effect divisor is decreased by /";
                temp += format(t2[1], 3);
                break;
            case 9:
                temp = "Complicators' post-150 scaling is weakened by ";
                temp += format(t2, 3);
                temp += "%"
                break;
            case 10:
                temp = "AC2's effect exponent is increased by x";
                temp += format(t2, 3);
            default:
                throw new Error("Type " + type + "is unknown!");
        }
        return temp + "."
    },
    strengthPer(type) {
        let temp = simpUpg2Function.power()
        switch (type) {
            case 1:
                return new Decimal(1.07).pow(temp);
            case 2:
                return new Decimal(0.65).mul(temp);
            case 3:
                return new Decimal(0.07).mul(temp);
            case 4:
                return new Decimal(0.11).pow(temp);
            case 5:
                return new Decimal(10.5).mul(temp);
            case 6:
                return new Decimal(0.044444444444).mul(temp);
            case 7:
                return new Decimal(0.087).mul(temp);
            case 8:
                return [new Decimal(1.01).pow(temp), new Decimal(1.1).pow(temp)];
            case 9:
                return new Decimal(1.01).pow(temp);
            case 10:
                return new Decimal(1.15).mul(temp);
            default:
                throw new Error("Type " + type + "is unknown!");
        }
    },
    strengthTotal(type, x) {
        let temp = x.root(2);
        let P = simpUpg2Function.strengthPer(type);
        switch (type) {
            case 1:
            case 4:
            case 9:
                return P.pow(temp);
            case 2:
            case 3:
            case 5:
            case 6:
            case 7:
            case 10:
                return P.mul(temp);
            case 8:
                return [P[0].pow(temp), P[1].pow(temp)];
            default:
                throw new Error("Type " + type + "is unknown!");
        }
    },
}

function simpChalSelect(ex) {
    simpChalSelected = ex;
    updateChallenge("simp");
}

function getSimplifyGain() {
    let temp;
    temp = Decimal.pow(player.simplify.main.SEExp, player.misc.totalPointsInSimplify.div(10).log(player.simplify.main.simplifyReq.div(10))).sub(1).div(player.simplify.main.SEExp.sub(1));
    return temp;
}

function simplifyXPtick(type, tickRate) {
    let temp;
    temp = player.simplify[simplifyXPTypeInternal[type]].allocated.pow(1.5);
    player.simplify[simplifyXPTypeInternal[type]].generated = player.simplify[simplifyXPTypeInternal[type]].generated.add(temp.mul(tickRate));
    player.simplify[simplifyXPTypeInternal[type]].trueValue = player.simplify[simplifyXPTypeInternal[type]].generated.add(1).pow(player.simplify.main.SAExp).sub(1);
    temp = player.simplify[simplifyXPTypeInternal[type]].trueValue;
    if (player.misc.inChallenge.includes("simp8") && !temp == 0) { temp = dZero; }
    switch (type) {
        case 0:
            temp = temp.div(20).add(1).pow(2.1);
            if (player.simplify.challenge.completed[8]) {
                temp = temp.mul(player.simplify[simplifyXPTypeInternal[1]].effect.pow(0.5))
                    .pow(player.simplify[simplifyXPTypeInternal[2]].effect.sub(1).max(1).root(3))
                    .mul(player.simplify[simplifyXPTypeInternal[3]].effect.pow(8));
            }
            if (player.misc.inChallenge.includes("simp8")) {
                temp = temp.mul(player.simplify[simplifyXPTypeInternal[1]].trueValue.div(25).add(1).pow(1.125))
                    .pow(player.simplify[simplifyXPTypeInternal[2]].trueValue.add(10).log(10).root(5.5))
                    .pow(player.simplify[simplifyXPTypeInternal[3]].trueValue.add(10).log(10).root(7).add(1).div(2));
            }
            if (player.misc.inChallenge.includes("simp1")) { temp = temp.root(2); }
            if (player.misc.inChallenge.includes("simp4")) { temp = dOne; }
            break
        case 1:
            temp = temp.div(25).add(1).pow(1.125);
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
    if (player.misc.inChallenge.includes("simp7")) { temp = temp.root(3); }
    player.simplify[simplifyXPTypeInternal[type]].effect = temp;
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
    player.simplify[simplifyXPTypeInternal[id]].allocated = player.simplify[simplifyXPTypeInternal[id]].allocated.add(player.simplify.main.simplifyEnergy);
    player.simplify.main.simplifyEnergy = dZero;
}

function simplifyReset(...param) {
    if (player.misc.totalPointsInSimplify.gte(player.simplify.main.simplifyReq) && player.misc.inSChallenge && !param.noChalComplete) {
        completeChallenge("simp");
        updateChallenge("simp");
    }
    player.simplify.main.simplifyEnergy = player.simplify.main.simplifyEnergy.add(getSimplifyGain().floor());
    player.simplify.main.totalSE = player.simplify.main.totalSE.add(getSimplifyGain().floor());
    player.simplify.main.simplifyStat = player.simplify.main.simplifyStat.add(1);
    player.misc.points = dTen;
    player.misc.totalPointsInSimplify = dTen;
    player.simplify.main.timeInSimplify = dZero;
    player.comps.array = {
        "1": makeComp(1),
        "2": makeComp(2),
        "3": makeComp(3),
        "4": makeComp(4),
        "5": makeComp(5),
        "6": makeComp(6),
        "7": makeComp(7),
        "8": makeComp(8)
    }
    compVisible = 1;
}

function simpUPG1Cost() {
    let ret = new Decimal(player.simplify.upgrades.simplifyMainUPG);
    ret = Decimal.pow(10, ret.pow(2)).mul(ret.factorial());
    return ret;
}

function updateSimplify_game(gameDelta) {
    player.simplify.main.timeInSimplify = player.simplify.main.timeInSimplify.add(gameDelta);
    player.simplify.challenge.JC1Time = player.simplify.challenge.JC1Time.add(gameDelta);
    player.simplify.main.totalXP = dOne;
    for (let type = 0; type < 4; ++type) {
        simplifyXPtick(type, gameDelta);
        player.simplify.main.totalXP = Decimal.mul(player.simplify.main.totalXP, player.simplify[simplifyXPTypeInternal[type]].trueValue);
    }
    player.simplify.main.totalXP = player.simplify.main.totalXP.pow(player.simplify.main.SAExp);

    let temp;
    temp = dOne;
    if (player.simplify.challenge.completed[0]) { temp = temp.add(1); }
    player.simplify.challenge.MC1effect = temp;

    temp = dOne;
    if (player.simplify.challenge.completed[14]) { temp = temp.add(0.25); }
    player.simplify.challenge.SC3effect = temp;

    temp = dOne;
    if (player.simplify.challenge.completed[3]) { temp = player.misc.points.max(1e10).log10().log10().ln().mul(10); }
    player.simplify.challenge.MC4effect = temp;

    temp = dOne
    if (player.simplify.challenge.completed[10]) { temp = Decimal.pow(player.simplify.main.timeInSimplify.add(1), 32); }
    player.simplify.challenge.AC2effect = temp;

    temp = new Decimal(1.5)
    if (player.simplify.challenge.completed[11]) { temp = temp.add(0.025); }
    player.simplify.main.SEExp = temp;

    temp = new Decimal(1e12);
    if (player.misc.inChallenge.includes("simp5")) { temp = new Decimal("1e395"); }
    if (player.misc.inChallenge.includes("simp6")) { temp = new Decimal(1e15); }
    if (player.misc.inChallenge.includes("simp12")) { temp = new Decimal(1.111e111); }
    if (player.misc.inChallenge.includes("simp14")) { temp = new Decimal(1e55); }
    if (player.misc.inChallenge.includes("simp15")) { temp = new Decimal(1.797693e308); }
    player.simplify.main.simplifyReq = temp;

    if (player.misc.inChallenge.includes("simp13")) {
        temp = player.misc.pps.div(Decimal.pow(1.3, player.simplify.main.timeInSimplify));
        player.simplify.challenge.SC2RG = temp;
    }
}