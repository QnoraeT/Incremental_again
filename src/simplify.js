let simpUpg2Function = {
    cost(x) {
        let temp = x;

        return temp;
    },
    target(r) {
        let temp = r;

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
                temp = "ComP's effective bought amount for multipliers are multiplied by x";
                temp += format(t2, true, 3);
                break;
            case 2:
                temp = "MC1's effect is increased by +";
                temp += format(t2, true, 3);
                break;
            case 3:
                temp = "Simplify Energy's gain exponent is increased by +";
                temp += format(t2, true, 3);
                break;
            case 4:
                temp = "DP's root is reduced from " + format(new Decimal(7), true, 3) + " by /";
                temp += format(t2, true, 3);
                temp += `, it's effect severely weakens when the root has been weakened to ${format(new Decimal(4.9))} or lower.`;
                break;
            case 5:
                temp = "ComP's post-150 scaling is delayed by +";
                temp += format(t2, true, 3);
                break;
            case 6:
                temp = "JC1's effect exponent is increased by +";
                temp += format(t2, true, 3);
                temp += ", weighted towards 8th ComP";
                break;
            case 7:
                temp = "OP's root is reduced from " + format(new Decimal(5.5), true, 3) + " by /";
                temp += format(t2, true, 3);
                temp += `, it's effect weakens when the root has been weakened to ${format(new Decimal(4.125))} or lower.`;
                break;
            case 8:
                temp = "MC4's effect exponent is multiplied by x";
                temp += format(t2[0], true, 3);
                temp += ", and it's effect divisor is decreased by /";
                temp += format(t2[1], true, 3);
                break;
            case 9:
                temp = "ComP's post-150 scaling is weakened by ";
                temp += format(t2, true, 3);
                temp += "%"
                break;
            case 10:
                temp = "AC2's effect exponent is increased by x";
                temp += format(t2, true, 3);
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
    temp = player.simplify[simplifyXPTypes[type]].allocated.pow(1.5);
    player.simplify[simplifyXPTypes[type]].generated = player.simplify[simplifyXPTypes[type]].generated.add(temp.mul(tickRate));
    player.simplify[simplifyXPTypes[type]].trueValue = player.simplify[simplifyXPTypes[type]].generated.add(1).pow(player.simplify.main.SAExp).sub(1);
    temp = player.simplify[simplifyXPTypes[type]].trueValue;
    if (player.misc.inChallenge.includes("simp8") && !temp == 0) { temp = dZero; }
    switch (type) {
        case 0:
            temp = temp.div(20).add(1).pow(2.1);
            if (player.simplify.challenge.completed[8]) {
                temp = temp.mul(player.simplify[simplifyXPTypes[1]].effect.pow(1.1))
                    .pow(player.simplify[simplifyXPTypes[2]].effect.sub(1).max(1).root(1.7))
                    .mul(player.simplify[simplifyXPTypes[3]].effect.pow(64));
            }
            if (player.misc.inChallenge.includes("simp8")) {
                temp = temp.mul(player.simplify[simplifyXPTypes[1]].trueValue.div(25).add(1).pow(1.125))
                    .pow(player.simplify[simplifyXPTypes[2]].trueValue.add(10).log(10).root(5.5))
                    .pow(player.simplify[simplifyXPTypes[3]].trueValue.add(10).log(10).root(7).add(1).div(2));
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
    player.simplify.main.simplifyEnergy = dZero;
}

function simplifyReset(...param) {
    if (player.misc.points.gte(player.simplify.main.simplifyReq) && player.misc.inSChallenge && !param.noChalComplete) {
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
    ret = Decimal.pow(10, ret.pow(2)).mul(altFactorial(ret));
    return ret;
}
