let COMP_FUNCTIONS = {
    updateCost(index) {
        player.comps.array[index].costFactors = `<br> Cost Scaling:`;
        let temp = player.comps.array[index].bought;
        let cost
        if (player.misc.inChallenge.includes("simp14")) { 
            temp = temp.mul(2); 
            player.comps.array[index].costFactors += "<br> SC3 Scaling: x" + format(dTwo, true, 3) + "  (" + format(temp, true) + " buys)" 
        }
        if (player.misc.inChallenge.includes("simp3")) { 
            temp = temp.pow(2); 
            player.comps.array[index].costFactors += "<br> MC4 Scaling: ^" + format(dTwo, true, 3) + "  (" + format(temp, true) + " buys)" 
        }
        if (player.misc.inChallenge.includes("simp8")) {
            let t2 = dZero
            for (let comp = 8; comp >= 1; --comp) {
                t2 = t2.add(player.comps.array[comp].bought)
            }
            temp = temp.add(t2);
            player.comps.array[index].costFactors += "<br> AC1 Scaling: +" + format(t2, true, 3) + "  (" + format(temp, true) + " buys)"
        }
        if (player.misc.inChallenge.includes("simp11")) { 
            temp = temp.add(player.simplify.main.timeInSimplify.mul(0.78)); 
            player.comps.array[index].costFactors += "<br> AC4 Scaling: +" + format(player.simplify.main.timeInSimplify.mul(0.78), true, 3) + "  (" + format(temp, true) + " buys)" 
        }
        if (player.simplify.challenge.completed[2]) { 
            temp = temp.mul(0.975); 
            player.comps.array[index].costFactors += "<br> MC3 Completion: x" + format(new Decimal(0.975), true, 3) + "  (" + format(temp, true) + " buys)" 
        }
        if (player.simplify.challenge.completed[3]) { 
            temp = temp.sub(player.simplify.challenge.MC4effect); 
            player.comps.array[index].costFactors += "<br> MC4 Completion: -" + format(player.simplify.challenge.MC4effect, true, 3) + "  (" + format(temp, true) + " buys)" 
        }
    
        player.comps.array[index].trueCost = temp
    
        let k = -1
        for (let i = Object.keys(player.scaling.ComPs).length - 1; i >= 0; i--) {
            if (temp.gte(player.scaling.ComPs[i].start)) {
                k = Math.max(k, i)
                temp = scale(["P", "E", "P"][i], temp, false, player.scaling.ComPs[i].start, player.scaling.ComPs[i].strength, 3, 0)[0]
            }
        }
    
        cost = Decimal.pow(10, new Decimal(2 * index).mul(temp.add(2)).sub(3)).div(player.simplify.challenge.MC1effect.pow(temp)).div(player.simplify.challenge.SC3effect.pow(Decimal.mul(index, temp)));
        player.comps.array[index].costFactors += `<br> ${scalingNames[player.settings.scalingNames][k + 1]} Scaling: ${format(cost.mul(player.simplify.challenge.MC1effect.pow(temp)).mul(player.simplify.challenge.SC3effect.pow(Decimal.mul(index, temp))), true, 3)}   `
        player.comps.array[index].costFactors += `[${(k >= Object.keys(player.scaling.ComPs).length - 1) ? "Final Stage" : "Next Stage @" + format(player.scaling.ComPs[k + 1].start, true, 3)}]`
    
        if (player.simplify.challenge.MC1effect.gt(1)) {
            player.comps.array[index].costFactors += "<br> MC1 Completion: /" + format(player.simplify.challenge.MC1effect.pow(temp), true, 3) + "  (" + format(cost, true) + ")"
        }
    
        if (player.simplify.challenge.SC3effect.gt(1)) {
            player.comps.array[index].costFactors += "<br> SC3 Completion: /" + format(player.simplify.challenge.SC3effect.pow(Decimal.mul(index, temp)), true, 3) + "  (" + format(cost, true) + ")"
        }
    
        if (player.simplify.challenge.completed[1]) { 
            cost = cost.pow(0.95); 
            player.comps.array[index].costFactors += "<br> MC2 Completion: ^" + format(new Decimal(0.95), true, 3) + "  (" + format(cost, true) + ")" 
        }
    
        if (player.simplify.challenge.AC2effect.gt(1)) {
            cost = cost.div(player.simplify.challenge.AC2effect)
            player.comps.array[index].costFactors += "<br> AC2 Completion: /" + format(player.simplify.challenge.AC2effect, true, 3) + "  (" + format(cost, true) + ")"
        }
    
        if (player.misc.inChallenge.includes("simp2") && index >= 2) { 
            cost = cost.mul(10000); 
            player.comps.array[index].costFactors += "<br> MC3 Scaling: x" + format(new Decimal(10000), true, 3) + "  (" + format(cost, true) + ")" 
        }
    
        if (player.misc.inChallenge.includes("simp2")) {
            cost = cost.pow(2);
            player.comps.array[index].costFactors += "<br> MC3 Scaling: ^" + format(new Decimal(2), true, 3) + "  (" + format(cost, true) + ")"
        }
    
        if (player.misc.inChallenge.includes("simp0")) {
            cost = cost.mul(Decimal.pow(2, temp.mul(temp.add(1)).div(2))); player.comps.array[index].costFactors += "<br> MC1 Scaling: x" + format(Decimal.pow(2, temp.mul(temp.add(1)).div(2)), true, 3) + "  (" + format(cost, true) + ")"
        }
    
        if (index == 1 && player.comps.array[index].bought.eq(0)) { 
            cost = dTen; 
        }
    
        player.comps.array[index].cost = cost;
    },
    updateMulti(index) {
        // i plan for this to have very minimal softcaps
        player.comps.array[index].multiFactors = "<br> Multipliers:";
        player.comps.array[index].multi = new Decimal(1);
        if (player.misc.inChallenge.includes("simp14")) { 
            player.comps.array[index].bought = player.comps.array[index].bought.sub(player.simplify.main.timeInSimplify.mul(0.4)); 
        }

        if (player.comps.array[index].bought.gte(2)) {
            player.comps.array[index].multi = player.comps.array[index].multi.mul(player.comps.compBM.pow(player.comps.array[index].bought.sub(1)))
            player.comps.array[index].multiFactors += "<br> Buy Multiplier (Total): x" + format(player.comps.compBM.pow(player.comps.array[index].bought.sub(1)), true, 2) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (index == 1) {
            player.comps.array[index].multi = player.comps.array[index].multi.mul(10)
            player.comps.array[index].multiFactors += "<br> ComP1 Bonus: x" + format(new Decimal(10), true, 2) + "  (" + format(player.comps.array[index].multi, true) + "x)"
            let temp = player.simplify.OP.effect
            if (player.misc.inChallenge.includes("simp12")) { temp = new Decimal(0.5); }
            player.comps.array[index].multi = player.comps.array[index].multi.pow(temp)
            player.comps.array[index].multiFactors += "<br> ComP1 Bonus: ^" + format(temp, true, 3) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (index == 2 || (index == 8 && player.simplify.challenge.completed[6])) {
            player.comps.array[index].multi = player.comps.array[index].multi.mul(4)
            player.comps.array[index].multiFactors += `<br> ${(index == 8 && player.simplify.challenge.completed[6])?"JC3":"ComP2"} Bonus: x` + format(new Decimal(4), true, 2) + "  (" + format(player.comps.array[index].multi, true) + "x)"
            let temp = new Decimal(1.584962500721156)
            if (player.simplify.challenge.completed[7]) { temp = new Decimal(5 / 3); }
            if (player.misc.inChallenge.includes("simp12")) { temp = new Decimal(0.5); }
            player.comps.array[index].multi = player.comps.array[index].multi.pow(temp)
            player.comps.array[index].multiFactors += `<br> ${(index == 8 && player.simplify.challenge.completed[6])?"JC3":"ComP2"} Bonus: ^` + format(temp, true, 3) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.simplify.main.simplifyStat.gt(0)) {
            if (player.misc.inChallenge.length == 0) {
                player.comps.array[index].multi = player.comps.array[index].multi.mul(player.simplify.main.simplifyStat.add(1).root(new Decimal(index)));
                player.comps.array[index].multiFactors += `<br> Simplified Count ${player.simplify.upgrades.simplifyMainUPG >= 1?" (Outside Challenge):":""} x${format(player.simplify.main.simplifyStat.add(1).root(new Decimal(index)), true, 2)}  (${format(player.comps.array[index].multi, true)}x)`
            }

            player.comps.array[index].multi = player.comps.array[index].multi.mul(player.simplify.main.totalSE.add(1).root(new Decimal((index) - 1 / 1.75 + 4)));
            player.comps.array[index].multiFactors += "<br> Total SE: x" + format(player.simplify.main.totalSE.add(1).root(new Decimal((index) - 1 / 1.75 + 4)), true, 2) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.simplify.MP.effect.gt(1)) {
            player.comps.array[index].multi = player.comps.array[index].multi.mul(player.simplify.MP.effect);
            player.comps.array[index].multiFactors += "<br> MP Effect: x" + format(player.simplify.MP.effect, true) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.simplify.PP.effect.gt(1) && index == 1) {
            player.comps.array[index].multi = player.comps.array[index].multi.mul(player.simplify.PP.effect);
            player.comps.array[index].multiFactors += "<br> PP Effect: x" + format(player.simplify.PP.effect, true, 2) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.misc.inChallenge.includes("simp0")) {
            player.comps.array[index].multi = player.comps.array[index].multi.pow(0.75);
            player.comps.array[index].multiFactors += "<br> Magnifying Challenge 1: ^" + format(new Decimal(0.75), true, 2) + "  (" + format(player.comps.array[index].multi, true) + "x)"
            player.comps.array[index].multi = player.comps.array[index].multi.div(1000);
            player.comps.array[index].multiFactors += "<br> Magnifying Challenge 1: /" + format(new Decimal(1000), true) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.misc.inChallenge.includes("simp3")) {
            player.comps.array[index].multi = player.comps.array[index].multi.pow(0.4);
            player.comps.array[index].multiFactors += "<br> Magnifying Challenge 4: ^" + format(new Decimal(0.4), true, 2) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.misc.inChallenge.includes("simp4")) {
            let temp = Decimal.clamp(player.simplify.challenge.JC1Time.div(40), 0, 1)
            player.comps.array[index].multi = player.comps.array[index].multi.pow(Decimal.add(0.3, temp.mul(0.3)));
            player.comps.array[index].multiFactors += "<br> Japanese Symbol Challenge 1: ^" + format(new Decimal(Decimal.add(0.3, temp.mul(0.3))), true, 3) + "  (" + format(player.comps.array[index].multi, true) + "x)"
            player.comps.array[index].multi = player.comps.array[index].multi.div(Decimal.pow(10, Decimal.sub(15, temp.mul(8))));
            player.comps.array[index].multiFactors += "<br> Japanese Symbol Challenge 1: /" + format(Decimal.pow(10, Decimal.sub(15, temp.mul(8))), true) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.misc.inChallenge.includes("simp7")) {
            player.comps.array[index].multi = player.comps.array[index].multi.pow(player.comps.compExp);
            player.comps.array[index].multiFactors += "<br> Japanese Symbol Challenge 4: ^" + format(player.comps.compExp, true, 3) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.misc.inChallenge.includes("simp10")) {
            let temp = Decimal.div(0.5, player.simplify.challenge.JC1Time.max(0.4).add(0.6).pow(0.7))
            player.comps.array[index].multi = player.comps.array[index].multi.pow(temp);
            player.comps.array[index].multiFactors += "<br> Articulated Challenge 3: ^" + format(temp, true, 3) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.simplify.challenge.completed[4]) {
            let temp = dOne
            for (let comp = index; comp > 1; --comp) {
                temp = temp.mul(player.comps.array[comp].multi.pow(0.1))
            }
            player.comps.array[index].multi = player.comps.array[index].multi.mul(temp);
            player.comps.array[index].multiFactors += "<br> JC1 Effect: x" + format(temp, true) + "  (" + format(player.comps.array[index].multi, true) + "x)"
        }

        if (player.misc.inChallenge.includes("simp14")) { 
            player.comps.array[index].bought = player.comps.array[index].bought.add(player.simplify.main.timeInSimplify.mul(0.4)); 
        }
    },
    updateAmount(index, amt) {
        player.comps.array[index].amount = player.comps.array[index].amount.add(amt);
        player.comps.array[index].trueAmount = player.comps.array[index].amount.pow(player.comps.compExp).add(player.comps.array[index].bought);
    },
}

function maxAllComPS() {
    let buy
    for (let comp = 8; comp >= 1; --comp) {
        let x = player.misc.points.log(10)
        x = x.add(player.simplify.challenge.AC2effect.log(10))
        if (player.misc.inChallenge.includes("simp13")) { x = x.div(0.1); }
        if (player.simplify.challenge.completed[1]) { x = x.div(0.95); }
        if (player.misc.points.gte(player.comps.array[comp].cost)) {
            buy = x.add(3).mul(ln10).sub(ln10.mul(Decimal.mul(comp, 4))).div(Decimal.mul(comp, player.simplify.challenge.SC3effect.ln().negate()).add(Decimal.mul(comp * 2, ln10)).sub(player.simplify.challenge.MC1effect.ln()))
            for (let i = 0; i < Object.keys(player.scaling.ComPs).length; i++) {
                if (buy.gte(player.scaling.ComPs[i].start)) {
                    buy = scale(["P", "E", "P"][i], buy, true, player.scaling.ComPs[i].start, player.scaling.ComPs[i].strength, 3, 0)[0]
                }
            }
            if (player.simplify.challenge.completed[3]) { buy = buy.add(player.simplify.challenge.MC4effect); }
            if (player.simplify.challenge.completed[2]) { buy = buy.div(0.975); }
            if (player.misc.inChallenge.includes("simp14")) { buy = buy.div(2); }
            player.comps.array[comp].bought = buy.floor();
            COMP_FUNCTIONS.updateCost(comp)
            player.misc.points = player.misc.points.sub(player.comps.array[comp].cost);
            buyComp(comp)
        }
    }
}

function buyComp(comp) {
    if (player.misc.points.gte(player.comps.array[comp].cost)) {
        player.misc.points = player.misc.points.minus(player.comps.array[comp].cost);
        player.comps.array[comp].bought = player.comps.array[comp].bought.add(1);
        player.simplify.challenge.JC1Time = dZero;
        COMP_FUNCTIONS.updateMulti(comp);
        COMP_FUNCTIONS.updateCost(comp);
    }
}

function expandComPMULTI(comp) {
    if (expandMultComP == comp) {
        if (expandMultComPType == 0) {
            expandMultComPType = 1
        } else {
            expandMultComP = 0
            expandMultComPType = 0
        }
    } else {
        expandMultComP = comp
    }
}

function calcCompxPerSecond(comp) {
    if (comp > 8 || comp < 1) { throw new RangeError(`comp #${comp} is not defined you stoopid!!`) }
    if (comp === 8) {
        let temp = dZero
        if (player.simplify.challenge.completed[13]) { temp = player.comps.array[1].trueAmount.mul(player.comps.array[1].multi).pow(0.075); }
        return temp;
    }
    return player.comps.array[comp + 1].trueAmount.mul(player.comps.array[comp + 1].multi);
}
