"use strict";

const simpUpg1Desc = {
    1: "Invest in multiple energies to boost production.",
    2: "Unlock TTS Challenges.",
    3: "Unlock Simplify upgrades where you can use your SE, xP, and total xP to get advantages.",
    4: "Unlock 'Situations' where you can go on altered runs for different milestones.",
}
const scalingNames = {
    DistInc: ["Normal", "Scaled", "Superscaled", "Hyper", "Atomic"],
    IncMass: ["Normal", "Super", "Hyper", "Ultra", "Meta"],
    Disaster: ["Standard", "Turbo", "Hyper", "Ultra", "Cruel"],
}
const simpChal = {
    simpChalDesc: {
        1: "Max All is disabled. ComP costs grow by 2^x per purchase. Multipliers are ^0.75 then /" + format(new Decimal(1000), true) + ".",
        2: "Max All is disabled. ComP's post-150 scaling now starts at 1. Multiplier per bought is lowered by 1, PP and MP's effect is ^0.5 and MP's effect is then /" + format(new Decimal(1000), true) + ".",
        3: "Max All is disabled. ComP's costs are squared. 2nd and further ComP's costs are multiplied by " + format(new Decimal(10_000), true) + " before being squared. Gain is ^0.5, and your goal is " + format(new Decimal(1e20), true) + ".",
        4: "Max All is disabled. ComP's costs act like their bought amount is squared. This also means that post-150 scaling starts earlier, and that MC3's effect is slightly stronger. All multipliers to ComPs and all xP effects are ^0.4.",
        5: "All ComP multipliers get severely reduced every time any ComP gets bought. This multiplier slowly goes back to /" + format(new Decimal(1e8), true) + " in 40 seconds. PP has no effect.",
        6: "Your base gain is effected by the same power that the ComP amount is being affected by. You must have " + format(new Decimal("1e395"), true) + " to complete this challenge.",
        7: "All xP effects are neutralized.",
        8: "All ComP's multipliers are affected by the ComP exponent to amount, and PP, MP, 1P, and DP's effects are ^0.5.",
        9: "Max All is disabled. Your ComP costs scale entirely based off your total ComPs bought. MP, 1P, and DP's effects now only boost PP, Gain is reduced, and their individual effects are set to as if you had none.",
        10: "ComP's post 150 scaling slowly gets earlier over time, and gets delayed by some amount per purchase. Your gain is ^0.5 with /" + format(new Decimal(1e150), true) + ".",
        11: "ComP's multipliers are only effective for 400ms before they quickly decay. This is reset every time you buy any ComP. All ComPs' multipliers are rooted by 2.",
        12: "Max All is disabled. Your ComP 'bought' goes up over time but it doesn't increase your multiplier. ComP's amount power is decreased from ^0.8 to ^0.5.",
        13: "ComPs 1-2's power modifiers are set to 0.5, however you have an extra sub-layer in the Simplify tab to help you in this challenge. Simplify requirement is " + format(new Decimal(1.111e111), true) + ".",
        14: "Your gain is set to ^0.05, but your ComP costs are set to ^0.1. Not only that, you have a 'relative gain' which slowly decreases with time. If it goes lower than 1, you restart the challenge.",
        15: "ComP costs act like if you have bought double. Your 'bought' always goes down at a steady pace, but your cost never goes down. However, you will gain a sub-layer in the Simplify tab which will help you in this challenge. Simplify requirement is " + format(new Decimal(1e55), true) + ".",
        16: "Someone else is trying to compete with your growth. Reset everything including your simplify layer, and try to get " + format(new Decimal(1.797693e308), true) + " as fast as you can. Your previous Simplify stats are saved, and they also slightly boost your ComP multipliers based on how far you got before entering this challenge.",
    },
    simpChalReward: {
        1: "ComP costs are divided by 2 per purchase.",
        2: "ComP costs are ^0.95.",
        3: "ComP costs now act like they're 0.975x less. This also slightly delays Post-150 scaling.",
        4: "All ComP costs are offset based off your points. This gets softcapped after " + format(new Decimal(200), true) + ".",
        5: "Higher order ComPs get a multiplier bonus based off of the previous ComP's multipliers.",
        6: "The ComP exponent is slightly increased. (^0.8 -> ^0.825)",
        7: "The 8th ComP gets a power bonus similar with the 2nd ComP.",
        8: "2nd ComP's bonus exponent is increased. (^1.585 -> ^1.667)",
        9: "MP, 1P, and DP increases PP's effect.",
        10: "ComP's post-150 scaling gets delayed by 0.01 per total ComP purchase.",
        11: "ComP costs slowly decay based off time in Simplify.",
        12: "Simplify Energy's base exponent is increased by 0.025.",
        13: "You gain a modified version of the sub-layer, which doesn't reset on Simplify.",
        14: "ComP1 produces ComP8 at a reduced rate.",
        15: "ComP costs get reduced by 1.25^ComP# per purchase.",
        16: "???",
    }
}
const dZero = new Decimal(0);
const dOne = new Decimal(1);
const dTwo = new Decimal(2);
const dTen = new Decimal(10);
const ln10 = dTen.ln();
const simplifyChalTypes = ["🔎", "🔰", "🚛", "777"]
const simplifyXPTypes = ["PP", "MP", "OP", "DP"]
const simplifyXPColor = ["#FF0000", "#FFFF00", "#00FF00", "#0000FF"]
const simplifyXPDesc = ["increasing overall gain by x", "increasing all multipliers by x", "improving 1st mult power to ^", "boosting multiplier per bought by x"]
let compVisible = 1;
let tab = [0, 0, 0];
let expandMultComP = 0;
let expandMultComPType = 0;
let progressBar = dZero;
let progressBarText = "";
let simpChalSelected = 0;
let softcaps = [];
let fpsList = [];
let FPS = 0;
let lastFPSCheck = 0;
let sessionTime = 0;
let delta = 0;
let html = {};

class ComP {
    constructor(index) {
        this.amount = dZero;
        this.bought = dZero;
        this.multi = dOne;
        this.cost = dTen;
        this.index = index;
        this.trueCost = dZero;
        this.multiFactors = "";
        this.costFactors = "";
    }

    get trueamount() {
        return this.amount.pow(player.comps.compExp).add(this.bought);
    }

    buy() {
        this.bought = this.bought.add(1);
        this.updateMultiplier();
        this.updateCost();
        player.simplify.challenge.JC1Time = dZero;
    }

    changeAmount(amount) {
        this.amount = this.amount.add(amount);
        this.updateMultiplier();
        this.updateCost();
    }

    updateMultiplier() {
        this.multiFactors = "<br> Multipliers:";
        this.multi = new Decimal(1);
        if (player.misc.inChallenge.includes("simp14")) { this.bought = this.bought.sub(player.simplify.main.timeInSimplify.mul(0.4)); }
        if (this.bought.gte(2)) {
            this.multi = this.multi.mul(player.comps.compBM.pow(this.bought.sub(1)))
            this.multiFactors += "<br> Buy Multiplier (Total): x" + format(player.comps.compBM.pow(this.bought.sub(1)), true, 2) + "  (" + format(this.multi, true) + "x)"
        }
        if (this.index == 1) {
            this.multi = this.multi.mul(10)
            this.multiFactors += "<br> ComP1 Bonus: x" + format(new Decimal(10), true, 2) + "  (" + format(this.multi, true) + "x)"
            let temp = player.simplify.OP.effect
            if (player.misc.inChallenge.includes("simp12")) { temp = new Decimal(0.5); }
            this.multi = this.multi.pow(temp)
            this.multiFactors += "<br> ComP1 Bonus: ^" + format(temp, true, 3) + "  (" + format(this.multi, true) + "x)"
        }
        if (this.index == 2 || (this.index == 8 && player.simplify.challenge.completed[6])) {
            this.multi = this.multi.mul(4)
            this.multiFactors += `<br> ${(this.index == 8 && player.simplify.challenge.completed[6])?"JC3":"ComP2"} Bonus: x` + format(new Decimal(4), true, 2) + "  (" + format(this.multi, true) + "x)"
            let temp = new Decimal(1.584962500721156)
            if (player.simplify.challenge.completed[7]) { temp = new Decimal(5 / 3); }
            if (player.misc.inChallenge.includes("simp12")) { temp = new Decimal(0.5); }
            this.multi = this.multi.pow(temp)
            this.multiFactors += `<br> ${(this.index == 8 && player.simplify.challenge.completed[6])?"JC3":"ComP2"} Bonus: ^` + format(temp, true, 3) + "  (" + format(this.multi, true) + "x)"
        }
        if (player.simplify.main.simplifyStat.gt(0)) {
            if (player.misc.inChallenge.length == 0) {
                this.multi = this.multi.mul(player.simplify.main.simplifyStat.add(1).root(new Decimal(this.index)));
                this.multiFactors += `<br> Simplified Count ${player.simplify.upgrades.simplifyMainUPG >= 1?" (Outside Challenge):":""} x${format(player.simplify.main.simplifyStat.add(1).root(new Decimal(this.index)), true, 2)}  (${format(this.multi, true)}x)`
            }
            this.multi = this.multi.mul(player.simplify.main.totalSE.add(1).root(new Decimal((this.index) - 1 / 1.75 + 4)));
            this.multiFactors += "<br> Total SE: x" + format(player.simplify.main.totalSE.add(1).root(new Decimal((this.index) - 1 / 1.75 + 4)), true, 2) + "  (" + format(this.multi, true) + "x)"
        }
        if (player.simplify.MP.effect.gt(1)) {
            this.multi = this.multi.mul(player.simplify.MP.effect);
            this.multiFactors += "<br> MP Effect: x" + format(player.simplify.MP.effect, true) + "  (" + format(this.multi, true) + "x)"
        }
        if (player.simplify.PP.effect.gt(1) && this.index == 1) {
            this.multi = this.multi.mul(player.simplify.PP.effect);
            this.multiFactors += "<br> PP Effect: x" + format(player.simplify.PP.effect, true, 2) + "  (" + format(this.multi, true) + "x)"
        }
        if (player.misc.inChallenge.includes("simp0")) {
            this.multi = this.multi.pow(0.75);
            this.multiFactors += "<br> Magnifying Challenge 1: ^" + format(new Decimal(0.75), true, 2) + "  (" + format(this.multi, true) + "x)"
            this.multi = this.multi.div(1000);
            this.multiFactors += "<br> Magnifying Challenge 1: /" + format(new Decimal(1000), true) + "  (" + format(this.multi, true) + "x)"
        }
        if (player.misc.inChallenge.includes("simp3")) {
            this.multi = this.multi.pow(0.4);
            this.multiFactors += "<br> Magnifying Challenge 4: ^" + format(new Decimal(0.4), true, 2) + "  (" + format(this.multi, true) + "x)"
        }
        if (player.misc.inChallenge.includes("simp4")) {
            let temp = Decimal.clamp(player.simplify.challenge.JC1Time.div(40), 0, 1)
            this.multi = this.multi.pow(Decimal.add(0.3, temp.mul(0.3)));
            this.multiFactors += "<br> Japanese Symbol Challenge 1: ^" + format(new Decimal(Decimal.add(0.3, temp.mul(0.3))), true, 3) + "  (" + format(this.multi, true) + "x)"
            this.multi = this.multi.div(Decimal.pow(10, Decimal.sub(15, temp.mul(8))));
            this.multiFactors += "<br> Japanese Symbol Challenge 1: /" + format(Decimal.pow(10, Decimal.sub(15, temp.mul(8))), true) + "  (" + format(this.multi, true) + "x)"
        }
        if (player.misc.inChallenge.includes("simp7")) {
            this.multi = this.multi.pow(player.comps.compExp);
            this.multiFactors += "<br> Japanese Symbol Challenge 4: ^" + format(player.comps.compExp, true, 3) + "  (" + format(this.multi, true) + "x)"
        }
        if (player.misc.inChallenge.includes("simp10")) {
            let temp = Decimal.div(0.5, player.simplify.challenge.JC1Time.max(0.4).add(0.6).pow(0.7))
            this.multi = this.multi.pow(temp);
            this.multiFactors += "<br> Articulated Challenge 3: ^" + format(temp, true, 3) + "  (" + format(this.multi, true) + "x)"

        }
        if (player.simplify.challenge.completed[4]) {
            let temp = dOne
            for (let comp = this.index; comp > 1; --comp) {
                temp = temp.mul(player.comps.array[comp].multi.pow(0.1))
            }
            this.multi = this.multi.mul(temp);
            this.multiFactors += "<br> JC1 Effect: x" + format(temp, true) + "  (" + format(this.multi, true) + "x)"
        }
        if (player.misc.inChallenge.includes("simp14")) { 
            this.bought = this.bought.add(player.simplify.main.timeInSimplify.mul(0.4)); 
        }
    }

    updateCost() {
        this.costFactors = `<br> Cost Scaling:`;
        let temp = this.bought;
        let cost
        if (player.misc.inChallenge.includes("simp14")) { temp = temp.mul(2); this.costFactors += "<br> SC3 Scaling: x" + format(dTwo, true, 3) + "  (" + format(temp, true) + " buys)" }
        if (player.misc.inChallenge.includes("simp3")) { temp = temp.pow(2); this.costFactors += "<br> MC4 Scaling: ^" + format(dTwo, true, 3) + "  (" + format(temp, true) + " buys)" }
        if (player.misc.inChallenge.includes("simp8")) {
            let t2 = dZero
            for (let comp = 8; comp >= 1; --comp) {
                t2 = t2.add(player.comps.array[comp].bought)
            }
            temp = temp.add(t2);
            this.costFactors += "<br> AC1 Scaling: +" + format(t2, true, 3) + "  (" + format(temp, true) + " buys)"
        }
        if (player.misc.inChallenge.includes("simp11")) { 
            temp = temp.add(player.simplify.main.timeInSimplify.mul(0.78)); 
            this.costFactors += "<br> AC4 Scaling: +" + format(player.simplify.main.timeInSimplify.mul(0.78), true, 3) + "  (" + format(temp, true) + " buys)" 
        }
        if (player.simplify.challenge.completed[2]) { 
            temp = temp.mul(0.975); 
            this.costFactors += "<br> MC3 Completion: x" + format(new Decimal(0.975), true, 3) + "  (" + format(temp, true) + " buys)" 
        }
        if (player.simplify.challenge.completed[3]) { 
            temp = temp.sub(player.simplify.challenge.MC4effect); 
            this.costFactors += "<br> MC4 Completion: -" + format(player.simplify.challenge.MC4effect, true, 3) + "  (" + format(temp, true) + " buys)" 
        }

        this.trueCost = temp

        let k = -1
        for (let i = Object.keys(player.scaling.ComPs).length - 1; i >= 0; i--) {
            if (temp.gte(player.scaling.ComPs[i].start)) {
                k = Math.max(k, i)
                temp = scale(["P", "E", "P"][i], temp, false, player.scaling.ComPs[i].start, player.scaling.ComPs[i].strength, 3, 0)[0]
            }
        }

        cost = Decimal.pow(10, new Decimal(2 * this.index).mul(temp.add(2)).sub(3)).div(player.simplify.challenge.MC1effect.pow(temp)).div(player.simplify.challenge.SC3effect.pow(Decimal.mul(this.index, temp)));
        this.costFactors += `<br> ${scalingNames[player.settings.scalingNames][k + 1]} Scaling: ${format(cost.mul(player.simplify.challenge.MC1effect.pow(temp)).mul(player.simplify.challenge.SC3effect.pow(Decimal.mul(this.index, temp))), true, 3)}   `
        this.costFactors += `[${(k >= Object.keys(player.scaling.ComPs).length - 1) ? "Final Stage" : "Next Stage @" + format(player.scaling.ComPs[k + 1].start, true, 3)}]`
        if (player.simplify.challenge.MC1effect.gt(1)) {
            this.costFactors += "<br> MC1 Completion: /" + format(player.simplify.challenge.MC1effect.pow(temp), true, 3) + "  (" + format(cost, true) + ")"
        }
        if (player.simplify.challenge.SC3effect.gt(1)) {
            this.costFactors += "<br> SC3 Completion: /" + format(player.simplify.challenge.SC3effect.pow(Decimal.mul(this.index, temp)), true, 3) + "  (" + format(cost, true) + ")"
        }

        if (player.simplify.challenge.completed[1]) { cost = cost.pow(0.95); this.costFactors += "<br> MC2 Completion: ^" + format(new Decimal(0.95), true, 3) + "  (" + format(cost, true) + ")" }
        if (player.simplify.challenge.AC2effect.gt(1)) {
            cost = cost.div(player.simplify.challenge.AC2effect)
            this.costFactors += "<br> AC2 Completion: /" + format(player.simplify.challenge.AC2effect, true, 3) + "  (" + format(cost, true) + ")"
        }
        if (player.misc.inChallenge.includes("simp2") && this.index >= 2) { cost = cost.mul(10000); this.costFactors += "<br> MC3 Scaling: x" + format(new Decimal(10000), true, 3) + "  (" + format(cost, true) + ")" }
        if (player.misc.inChallenge.includes("simp2")) {
            cost = cost.pow(2);
            this.costFactors += "<br> MC3 Scaling: ^" + format(new Decimal(2), true, 3) + "  (" + format(cost, true) + ")"
        }
        if (player.misc.inChallenge.includes("simp0")) {
            cost = cost.mul(Decimal.pow(2, temp.mul(temp.add(1)).div(2))); this.costFactors += "<br> MC1 Scaling: x" + format(Decimal.pow(2, temp.mul(temp.add(1)).div(2)), true, 3) + "  (" + format(cost, true) + ")"
        }
        if (this.index == 1 && this.bought.eq(0)) { cost = dTen; }
        this.cost = cost;
    }
}

let player = {
    misc: {
        mode: "normal",
        chapter: 0,
        points: dTen,
        pps: dZero,
        totalPointsInSimplify: dTen,
        totalPoints: dTen,
        inChallenge: [], // this is not in simplify list because theres potentially gonna be further layers with their own challenges (which can and will be nested)
        totalTime: 0, // timespeed doesn't affect this
        gameTime: dZero, // timespeed will affect this (totalGameTime)
        timeSpeed: dOne,
        inSChallenge: 0,
    },
    settings: {
        notation: "Mixed Scientific",
        scalingNames: "DistInc",
        showCharacterImgs: true,
        nameChanges: false,
        theme: "Neon",
        background: ["Parallax", "Dots"],
        // available: "Parallax" "Dots" "ChapterBased" "TabBased" "CharacterBased"
        musicVolume: 0.00,
        sfxVolume: 0.00,
    },
    scaling: {
        ComPs: {
            0: {
                start: new Decimal(150),
                strength: dOne,
            },
            1: {
                start: new Decimal(100000),
                strength: dOne,
            },
            2: {
                start: new Decimal(1e6),
                strength: dOne,
            }
        },
    },
    comps: {
        compExp: new Decimal(0.8),
        compBM: new Decimal(2),
        array: {
            "1": new ComP(1),
            "2": new ComP(2),
            "3": new ComP(3),
            "4": new ComP(4),
            "5": new ComP(5),
            "6": new ComP(6),
            "7": new ComP(7),
            "8": new ComP(8),
        }
    },
    simplify: {
        "main": {
            simplifyEnergy: dZero,
            simplifyStat: dZero,
            totalSE: dZero,
            SEExp: new Decimal(1.5),
            SAExp: new Decimal(0.6),
            simplifyReq: new Decimal(1e12),
            totalXP: dZero, // ((TruePP + TrueMP + TrueOP + TrueDP) / 4) ^ SimpEXP
            timeInSimplify: dZero,
        },
        "PP": {
            allocated: dZero,
            generated: dZero,
            trueValue: dZero,
            effect: dOne,
        },
        "MP": {
            allocated: dZero,
            generated: dZero,
            trueValue: dZero,
            effect: dOne,
        },
        "OP": {
            allocated: dZero,
            generated: dZero,
            trueValue: dZero,
            effect: dTwo,
        },
        "DP": {
            allocated: dZero,
            generated: dZero,
            trueValue: dZero,
            effect: dTwo,
        },
        "challenge": {
            completed: Array(16).fill(false), // 0-3 Magnifying [] 4-7 Beginner [] 8-11 Articulated [] 12-15 77777777 []
            timeInChallenge: dZero, // time speed exists
            MC1effect: dOne,
            MC4effect: dOne,
            JC1Time: dZero,
            AC2effect: dOne,
            SC2RG: dOne,
            SC3effect: dOne,
        },
        "upgrades": {
            simplifyMainUPG: 0,
            simplifyUPGNum2: dZero, // the upgrades here will not be unique, and may be bulk auto'd in the future, so i'm letting it stay as decimal
            PPUPG: dZero,
            MPUPG: dZero,
            OPUPG: dZero,
            DPUPG: dZero,
            SimpUPG2: {
                cost(x) {
                    let temp = x

                    return temp
                },
                target(r) {
                    let temp = r

                    return temp
                },
                power() {
                    let temp = dOne
                    return temp
                },
                display(type, total) {
                    let temp = player.simplify.upgrades.simplifyUPGNum2
                    temp = temp.sub(type).div(10).add(1).floor()
                    let t2 = (total) ? player.simplify.upgrades.SimpUPG2.strengthTotal(type, temp) : player.simplify.upgrades.SimpUPG2.strengthPer(type)
                    switch (type) {
                        case 1:
                            temp = "ComP's effective bought amount for multipliers are multiplied by x"
                            temp += format(t2, true, 3)
                            break;
                        case 2:
                            temp = "MC1's effect is increased by +"
                            temp += format(t2, true, 3)
                            break;
                        case 3:
                            temp = "Simplify Energy's gain exponent is increased by +"
                            temp += format(t2, true, 3)
                            break;
                        case 4:
                            temp = "DP's root is reduced from " + format(new Decimal(7), true, 3) + " by -"
                            temp += format(t2, true, 3)
                            temp += `, it's effect severely weakens when the root has been weakened to ${format(new Decimal(5))} or lower.`
                            break;
                        case 5:
                            temp = "ComP's post-150 scaling is delayed by +"
                            temp += format(t2, true, 3)
                            break;
                        case 6:
                            temp = "JC1's effect exponent is increased by +"
                            temp += format(t2, true, 3)
                            temp += ", weighted towards 8th ComP"
                            break;
                        case 7:
                            temp = "OP's root is reduced from " + format(new Decimal(5.5), true, 3) + " by -"
                            temp += format(t2, true, 3)
                            temp += `, it's effect weakens when the root has been weakened to ${format(new Decimal(4))} or lower.`
                            break;
                        case 8:
                            temp = "MC4's effect exponent is multiplied by x"
                            temp += format(t2[0], true, 3)
                            temp += ", and it's effect divisor is decreased by /"
                            temp += format(t2[1], true, 3)
                            break;
                        case 9:
                            temp = "ComP's post-150 scaling is weakened by "
                            temp += format(t2, true, 3)
                            temp += "%"
                            break;
                        case 10:
                            temp = "AC2's effect exponent is increased by x"
                            temp += format(t2, true, 3)
                        default:
                            throw new Error("Type " + type + "is unknown!");
                    }
                    return temp + "."
                },
                strengthPer(type) {
                    let temp = player.simplify.upgrades.SimpUPG2.power()
                    switch (type) {
                        case 1:
                            return new Decimal(1.07).pow(temp)
                        case 2:
                            return new Decimal(0.65).mul(temp)
                        case 3:
                            return new Decimal(0.07).mul(temp)
                        case 4:
                            return new Decimal(0.26).pow(temp)
                        case 5:
                            return new Decimal(10.5).mul(temp)
                        case 6:
                            return new Decimal(0.044444444444).mul(temp)
                        case 7:
                            return new Decimal(0.45).mul(temp)
                        case 8:
                            return [new Decimal(1.01).pow(temp), new Decimal(1.1).pow(temp)]
                        case 9:
                            return new Decimal(1.01).pow(temp)
                        case 10:
                            return new Decimal(1.15).mul(temp)
                        default:
                            throw new Error("Type " + type + "is unknown!");
                    }
                },
                strengthTotal(type, x) {
                    let temp = x.root(2)
                    let P = player.simplify.upgrades.SimpUPG2.strengthPer(type)
                    switch (type) {
                        case 1:
                        case 4:
                        case 9:
                            return P.pow(temp)
                        case 2:
                        case 3:
                        case 5:
                        case 6:
                        case 7:
                        case 10:
                            return P.mul(temp)
                        case 8:
                            return [P[0].pow(temp), P[1].pow(temp)]
                        default:
                            throw new Error("Type " + type + "is unknown!");
                    }
                },
            },
        },
        "situation1": {
            amount: dZero,
            rank: dZero,
            tier: dZero,
            tetr: dZero,
            pent: dZero,
        },
        "situation2": {
            amount: dZero,
            bar1: dZero,
            bar2: dZero,
            bar3: dZero,
            bar4: dZero,
        },
        "situation3": {
            amount: dZero,
            milestonePts: dZero,
            milestoneComp8: dZero,
            milestoneTotalBought: dZero,
            milestoneMisc: dZero, // custom challenges and stuff ("don't buy comp1 more than once", "reach 1e100 in 15 seconds without comp6+", etc)
        },
    },
}

const draw = document.querySelector("#effects");
const pen = draw.getContext("2d");
let dots = [];

function initDots() {
    for (let i = 0; i < 32; i++) {
        dots.push([0, rand(-10000, 10000), rand(-10000, 10000), rand(0.1, 0.4), rand(-0.02, 0.02), rand(-0.02, 0.02)])
    }
    for (let i = 0; i < 128; i++) {
        dots.push([1, rand(-10000, 10000), rand(-10000, 10000), rand(1.1, 3), rand(-0.1, 0.1), rand(-0.1, 0.1)])
    }
}

const drawing = () => {
    draw.width = window.innerWidth;
    draw.height = window.innerHeight;
    for (let i = 0; i < dots.length; i++) {
        dots[i][4] += Math.random() - 0.5
        dots[i][5] += Math.random() - 0.5
        dots[i][4] = lerp(1 - (0.9 ** delta), dots[i][4], 0);
        dots[i][5] = lerp(1 - (0.9 ** delta), dots[i][5], 0);
        dots[i][1] += dots[i][3] * delta * dots[i][4]
        dots[i][2] += dots[i][3] * delta * dots[i][5]

        pen.beginPath();
        let alpha
        if (dots[i][0] === 0) {
            alpha = 20 + (4 * Math.cos((sessionTime + 11 * i) / 50))
        } else {
            alpha = 160 + (64 * Math.cos((sessionTime + 11 * i) / 50))
        }
        pen.fillStyle = `hsla(${sessionTime + (i * (dots[i][0] === 0 ? 1 : 0.1))}, 100%, 50%, ${alpha / 255})`
        let j = Math.cos((sessionTime * dots[i][3] + i) / (2 * Math.PI))
        pen.arc((Math.abs(dots[i][1] % 3800) - 700),
            (Math.abs(dots[i][2] % 2400) - 700),
            dots[i][0] == 0 ? (300 + 100 * j) : (10 + 4 * j),
            0,
            2 * Math.PI);
        pen.fill();

    }
}
