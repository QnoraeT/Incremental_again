"use strict";

class ComP{
    constructor(index){
        this._amount = dZero;
        this._bought = dZero;
        this._multi = dOne;
        this._cost = dTen;
        this._index = index;
        this._multiFactors = [];
        this._costFactors = [];
    }

    get cost(){
        return this._cost;
    }

    get amount(){
        return this._amount;
    }

    get bought(){
        return this._bought;
    }

    get multi(){
        return this._multi;
    }

    get trueamount(){
        return this.amount.pow(player.comps.compExp).add(this.bought);
    }

    get index(){
        return this._index;
    }

    buy(){
        this._bought = this._bought.add(1);
        this._updateMultiplier();
        this._updateCost(); 
        player.simplify.challenge.JC1Time = dZero;
    }

    changeAmount(amount){
        this._amount = this._amount.add(amount);
        this._updateMultiplier();
        this._updateCost();
    }

    _updateMultiplier(){
        this._multiFactors = ["<br>Multipliers"];
        this._multi = new Decimal(1);
        if (player.misc.inChallenge.includes("simp14")){this._bought = this._bought.sub(player.simplify.main.timeInSimplify.mul(0.4));}
        if (this._bought.gte(2)){
            this._multi = this._multi.mul(player.comps.compBM.pow(this._bought.sub(1)))
            this._multiFactors.push("<br> Buy Multiplier (Total): x" + format(player.comps.compBM.pow(this._bought.sub(1)),true,2) + "  (" + format(this._multi,true) + "x)")
        }
        if (this._index == 1){
            this._multi = this._multi.mul(10)
            this._multiFactors.push("<br> ComP1 Bonus: x" + format(new Decimal(10),true,2) + "  (" + format(this._multi,true) + "x)")
            let temp = player.simplify.OP.effect
            if (player.misc.inChallenge.includes("simp12")){temp = new Decimal(0.5);}
            this._multi = this._multi.pow(temp)
            this._multiFactors.push("<br> ComP1 Bonus: ^" + format(temp,true,3) + "  (" + format(this._multi,true) + "x)")
            if (player.simplify.PP.effect.gt(1)){
                this._multi = this._multi.mul(player.simplify.PP.effect);
                this._multiFactors.push("<br> PP Effect: x" + format(player.simplify.PP.effect,true,2) + "  (" + format(this._multi,true) + "x)")
            }
        }
        if (this._index == 2){
            this._multi = this._multi.mul(4)
            this._multiFactors.push("<br> ComP2 Bonus: x" + format(new Decimal(4),true,2) + "  (" + format(this._multi,true) + "x)")
            let temp = new Decimal(1.584962500721156)
            if (player.simplify.challenge.completed[7] == 1){temp = new Decimal(5/3);}
            if (player.misc.inChallenge.includes("simp12")){temp = new Decimal(0.5);}
            this._multi = this._multi.pow(temp)
            this._multiFactors.push("<br> ComP2 Bonus: ^" + format(temp,true,3) + "  (" + format(this._multi,true) + "x)")
        }
        if (player.misc.inChallenge.length == 0 && player.simplify.main.simplifyStat.gt(0)){
            this._multi = this._multi.mul(player.simplify.main.simplifyStat.add(1).root(new Decimal(this._index)));
            this._multiFactors.push("<br> Simplified amount: x" + format(player.simplify.main.simplifyStat.add(1).root(new Decimal(this._index)),true,2) + "  (" + format(this._multi,true) + "x)")
        }
        if (player.simplify.MP.effect.gt(1)){
            this._multi = this._multi.mul(player.simplify.MP.effect);
            this._multiFactors.push("<br> MP Effect: x" + format(player.simplify.MP.effect,true) + "  (" + format(this._multi,true) + "x)")
        }
        if (player.misc.inChallenge.includes("simp0")){
            this._multi = this._multi.pow(0.75);
            this._multiFactors.push("<br> Magnifying Challenge 1: ^" + format(new Decimal(0.75),true,2) + "  (" + format(this._multi,true) + "x)")
            this._multi = this._multi.div(1000);
            this._multiFactors.push("<br> Magnifying Challenge 1: /" + format(new Decimal(1000),true) + "  (" + format(this._multi,true) + "x)")
        }
        if (player.misc.inChallenge.includes("simp3")){
            this._multi = this._multi.pow(0.4);
            this._multiFactors.push("<br> Magnifying Challenge 4: ^" + format(new Decimal(0.4),true,2) + "  (" + format(this._multi,true) + "x)")
        }
        if (player.misc.inChallenge.includes("simp4")){
            let temp = Decimal.clamp(player.simplify.challenge.JC1Time.div(40), 0, 1)
            this._multi = this._multi.pow(Decimal.add(0.25, temp.div(4)));
            this._multiFactors.push("<br> Japanese Symbol Challenge 1: ^" + format(new Decimal(Decimal.add(0.25, temp.div(4))),true,3) + "  (" + format(this._multi,true) + "x)")
            this._multi = this._multi.div(Decimal.pow(10, Decimal.sub(16, temp.mul(8))));
            this._multiFactors.push("<br> Japanese Symbol Challenge 1: /" + format(Decimal.pow(10, Decimal.sub(16, temp.mul(8))),true) + "  (" + format(this._multi,true) + "x)")
        }
        if (player.misc.inChallenge.includes("simp7")){
            this._multi = this._multi.pow(player.comps.compExp);
            this._multiFactors.push("<br> Japanese Symbol Challenge 4: ^" + format(player.comps.compExp,true,3) + "  (" + format(this._multi,true) + "x)")
        }
        if (player.misc.inChallenge.includes("simp10")){
            let temp = Decimal.div(0.5, player.simplify.challenge.JC1Time.max(0.4).add(0.6).pow(0.7))
            this._multi = this._multi.pow(temp);
            this._multiFactors.push("<br> Articulated Challenge 3: ^" + format(temp,true,3) + "  (" + format(this._multi,true) + "x)")

        }
        if (player.simplify.challenge.completed[4] == 1){
            let temp = dOne
            for (let comp = this._index; comp > 1; --comp){
                temp = temp.mul(player.comps.array[comp]._multi.pow(0.1))
            }
            this._multi = this._multi.mul(temp);
            this._multiFactors.push("<br> JC1 Effect: x" + format(temp,true) + "  (" + format(this._multi,true) + "x)")
        }
        if (player.simplify.challenge.completed[6] == 1 && this._index == 8){
            this._multi = this._multi.mul(4)
            this._multiFactors.push("<br> JC3 Bonus: x" + format(new Decimal(4),true,2) + "  (" + format(this._multi,true) + "x)")
            this._multi = this._multi.pow(1.584962500721156)
            this._multiFactors.push("<br> JC3 Bonus: ^" + format(new Decimal(1.584962500721156),true,3) + "  (" + format(this._multi,true) + "x)")
        }
        if (player.misc.mode == "softcap"){
            if (this._multi.gte(100)){
                this._multi = softcap(this._multi, "P", 0.1, 100, "mul1," + this._index, false)[0]
                this._multiFactors.push("<br><sc1> Softcap 1: /" + format(softcaps[softcaps.indexOf("mul1," + this._index)+1],true,3) + "  (" + format(this._multi,true) + "x)</sc1>")
            }
            if (this._multi.gte(1e8)){
                this._multi = softcap(this._multi, "E", 0.3, 1e8, "mul2," + this._index, false)[0]
                this._multiFactors.push("<br><sc2> Softcap 2: /" + format(softcaps[softcaps.indexOf("mul2," + this._index)+1],true,3) + "  (" + format(this._multi,true) + "x)</sc2>")
            }
            if (this._multi.gte(1e15)){
                this._multi = softcap(this._multi, "EP", 0.1, 1e15, "mul3," + this._index, false)[0]
                this._multiFactors.push("<br><sc3> Softcap 3: /" + format(softcaps[softcaps.indexOf("mul3," + this._index)+1],true,3) + "  (" + format(this._multi,true) + "x)</sc3>")
            }
            if (this._multi.gte(1e25)){
                this._multi = softcap(this._multi, "EP", 0.25, 1e25, "mul4," + this._index, false)[0]
                this._multiFactors.push("<br><sc4> Softcap 4: /" + format(softcaps[softcaps.indexOf("mul4," + this._index)+1],true,3) + "  (" + format(this._multi,true) + "x)</sc4>")
            }
        }
        if (player.misc.inChallenge.includes("simp14")){this._bought = this._bought.add(player.simplify.main.timeInSimplify.mul(0.4));}
    }

    _updateCost(){
        this._costFactors = ["<br>Cost Scaling"];
        let temp = this._bought;
        if (player.misc.inChallenge.includes("simp14")){temp = temp.mul(2); this._costFactors.push("<br> SC3 Scaling: x" + format(dTwo,true,3) + "  (" + format(temp,true) + " buys)");}
        if (player.misc.inChallenge.includes("simp3")){temp = temp.pow(2); this._costFactors.push("<br> MC4 Scaling: ^" + format(dTwo,true,3) + "  (" + format(temp,true) + " buys)");}
        if (player.misc.inChallenge.includes("simp8")){
            let t2 = dZero
            for (let comp = 8; comp >= 1; --comp){
                t2 = t2.add(player.comps.array[comp]._bought)
            }
            temp = temp.add(t2);
            this._costFactors.push("<br> AC1 Scaling: +" + format(t2,true,3) + "  (" + format(temp,true) + " buys)")
        }
        if (player.misc.inChallenge.includes("simp11")){temp = temp.add(player.simplify.main.timeInSimplify.mul(0.78)); this._costFactors.push("<br> AC4 Scaling: +" + format(player.simplify.main.timeInSimplify.mul(0.78),true,3) + "  (" + format(temp,true) + " buys)");}
        if (player.simplify.challenge.completed[2] == 1){temp = temp.mul(0.975); this._costFactors.push("<br> MC3 Completion: x" + format(new Decimal(0.975),true,3) + "  (" + format(temp,true) + " buys)");}
        if (player.simplify.challenge.completed[3] == 1){temp = temp.sub(player.simplify.challenge.MC4effect); this._costFactors.push("<br> MC4 Completion: -" + format(player.simplify.challenge.MC4effect,true,3) + "  (" + format(temp,true) + " buys)");}
        let cost
        if (temp.gte(player.scaling.ComPs[1].start)){
            let a = new Decimal("e133333333").mul(this._index)
            let b = new Decimal("e3000").mul(this._index)
            let c = player.scaling.ComPs[1].strength[0]
            let d = player.scaling.ComPs[1].strength[1].mul(0.0001).mul(this._index ** 0.25).add(1)
            let e = player.scaling.ComPs[1].strength[2].mul(0.0001).mul(this._index ** 0.25)
            let f = player.scaling.ComPs[1].strength[3].mul(2).mul(this._index ** 0.1)
            cost = calcGeneralCosts("EEP", temp.sub(player.scaling.ComPs[1].start), false, a, b, c, d, e, f)
            this._costFactors.push("<br> Exponential^2 Scaling: " + format(cost,true,3) + "  - Starting at " + format(player.scaling.ComPs[1].start,true,3) + ", it has the quaternion power of x: " + format(player.scaling.ComPs[1].strength[0].mul(100),true,3) + "%, y: " + format(player.scaling.ComPs[1].strength[1].mul(100),true,3) + "%, z: " + format(player.scaling.ComPs[1].strength[2].mul(100),true,3) + "%, w: " + format(player.scaling.ComPs[1].strength[3].mul(100),true,3) + "%");
        } else {
            if (temp.gte(player.scaling.ComPs[0].start)){
                cost = Decimal.pow(10, new Decimal(this._index).mul(temp.pow(2).mul(2).div(player.scaling.ComPs[0].start).add(4)).sub(3));
                this._costFactors.push("<br> Quadratic-Exponential Scaling: " + format(cost,true,3) + "  - Starting at " + format(player.scaling.ComPs[0].start,true,3) + "  [Next Stage @" + format(player.scaling.ComPs[1].start,true,3) + "]");
            } else {   
                cost = Decimal.pow(10, new Decimal(2 * this._index).mul(temp.add(2)).sub(3));
                this._costFactors.push("<br> Exponential Scaling: " + format(cost,true,3) + "  [Next Stage @" + format(player.scaling.ComPs[0].start,true,3) + "]");
            }
        }

        if (player.simplify.challenge.MC1effect.gt(1)){
            cost = cost.div(player.simplify.challenge.MC1effect.pow(temp))
            this._costFactors.push("<br> MC1 Completion: /" + format(player.simplify.challenge.MC1effect.pow(temp),true,3) + "  (" + format(cost,true) + ")");
        }
        if (player.simplify.challenge.SC3effect.gt(1)){
            cost = cost.div(player.simplify.challenge.SC3effect.pow(new Decimal(this._index).mul(temp)))
            this._costFactors.push("<br> SC3 Completion: /" + format(player.simplify.challenge.SC3effect.pow(new Decimal(this._index).mul(temp)),true,3) + "  (" + format(cost,true) + ")");
        }
        
        if (player.simplify.challenge.completed[1] == 1){cost = cost.pow(0.95); this._costFactors.push("<br> MC2 Completion: ^" + format(new Decimal(0.95),true,3) + "  (" + format(cost,true) + ")")}
        if (player.simplify.challenge.AC2effect.gt(1)){
            cost = cost.div(player.simplify.challenge.AC2effect)
            this._costFactors.push("<br> AC2 Completion: /" + format(player.simplify.challenge.AC2effect,true,3) + "  (" + format(cost,true) + ")");
        }
        if (player.misc.inChallenge.includes("simp2") && this._index >= 2){cost = cost.mul(10000); this._costFactors.push("<br> MC3 Scaling: x" + format(new Decimal(10000),true,3) + "  (" + format(cost,true) + ")")}
        if (player.misc.inChallenge.includes("simp2")){cost = cost.pow(2); this._costFactors.push("<br> MC3 Scaling: ^" + format(new Decimal(2),true,3) + "  (" + format(cost,true) + ")")}
        if (player.misc.inChallenge.includes("simp0")){cost = cost.mul(Decimal.pow(2, temp.mul(temp.add(1)).div(2))); this._costFactors.push("<br> MC1 Scaling: x" + format(Decimal.pow(2, temp.mul(temp.add(1)).div(2)),true,3) + "  (" + format(cost,true) + ")")}
        if (this._index == 1 && this._bought.eq(0)){cost = dTen;}
        this._cost = cost;
    }
}

const dZero = new Decimal(0);
const dOne = new Decimal(1);
const dTwo = new Decimal(2);
const dTen = new Decimal(10);
const ln10 = dTen.ln();
let compVisible = 1;
let tab = [0,0,0];
let expandMultComP = 0;
let expandMultComPType = 0;
let progressBar = dZero;
let progressBarText = "";
let simpChalSelected = 0;
let softcaps = [];
let fpsList = [];
let FPS = 0;
let lastFPSCheck = 0;
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
        names0: ["", "Scaled", "Superscaled", "Hyper", "Atomic"], // DISTINC
        names1: ["", "Super", "Hyper", "Ultra", "Meta"], // IMR
        names2: ["Standard", "Turbo", "Hyper", "Ultra", "Cruel"], // NATURAL DISASTERS
        ComPs: {
            0: {
                start: new Decimal(150),
            },
            1: {
                start: new Decimal(100000),
                strength: [dOne, dOne, dOne, dOne],
            },
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
            SEExp: new Decimal(1.75),
            SAExp: new Decimal(0.75),
            simplifyReq: new Decimal(1e12),
            totalXP: dZero, // (TruePP + TrueMP + True1P + TrueDP)^SimpEXP
            timeInSimplify: dZero,
            sXPTypes: ["PP", "MP", "OP", "DP"],
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
            effect: dOne,
        },
        "challenge": {
            completed: Array(16).fill(0), // 0-3 Magnifying [] 4-7 Beginner [] 8-11 Articulated [] 12-15 77777777 []
            timeInChallenge: dZero, // time speed exists
            MC1effect: dOne,
            MC4effect: dOne,
            JC1Time: dZero,
            AC2effect: dOne,
            SC2RG: dOne,
            SC3effect: dOne,
            simpChalDesc: {
                1: "Max All is disabled. ComP costs grow by 2^x per purchase. Multipliers are ^0.75 then /" + format(new Decimal(1000),true) + ".",
                2: "Max All is disabled. ComP's post-150 scaling now starts at 1. Multiplier per bought is lowered by 1, PP and MP's effect is ^0.5 and MP's effect is then /" + format(new Decimal(1000),true) + ".",
                3: "Max All is disabled. ComP's costs are squared. 2nd and further ComP's costs are multiplied by " + format(new Decimal(10_000),true) + "before being squared. Gain is ^0.5, and your goal is " + format(new Decimal(1e20),true) + ".",
                4: "Max All is disabled. ComP's costs act like their bought amount is squared. This also means that post-150 scaling starts earlier, and that MC3's effect is slightly stronger. All multipliers to ComPs and all xP effects are ^0.4.",
                5: "All ComP multipliers get severely reduced every time any ComP gets bought. This multiplier slowly goes back to /" + format(new Decimal(1e8),true) + " in 40 seconds. PP has no effect.",
                6: "Your base gain is effected by the same power that the ComP amount is being affected by. You must have " + format(new Decimal("1e395"),true) + " to complete this challenge.",
                7: "All xP effects are neutralized.",
                8: "All ComP's multipliers are affected by the ComP exponent to amount, and PP, MP, 1P, and DP's effects are ^0.5.",
                9: "Max All is disabled. Your ComP costs scale entirely based off your total ComPs bought. MP, 1P, and DP's effects now only boost PP, Gain is reduced, and their individual effects are set to as if you had none.",
                10: "ComP's post 150 scaling slowly gets earlier over time, and gets delayed by some amount per purchase. Your gain is ^0.5 with /" + format(new Decimal(1e150),true) + ".",
                11: "Your ComPs only have a reasonable effect for 400ms before their multipliers quickly decay. This is reset every time you buy any ComP. All ComPs' multi's are ^0.5.",
                12: "Max All is disabled. Your ComP 'bought' goes up over time but automatic ComP 'bought' doesn't increase multiplier. ComP's sub-powers goes from ^0.8 to ^0.5.",
                13: "ComPs 1-2's power modifiers are set to 0.5, however you have an extra sub-layer in the Simplify tab to help you in this challenge. Simplify requirement is " + format(new Decimal(1.111e111),true) + ".",
                14: "Your gain is set to ^0.05, but your ComP costs are set to ^0.1. Not only that, you have a 'relative gain' which slowly decreases with time. If it goes lower than 1, you restart the challenge.",
                15: "ComP costs act like if you have bought double. Your 'bought' always goes down at a steady pace, but your cost never goes down. However, you will gain a sub-layer in the Simplify tab which will help you in this challenge. Simplify requirement is " + format(new Decimal(1e55),true) + ".",
                16: "Someone else is trying to compete with your growth. Reset everything including your simplify layer, and try to get " + format(new Decimal(1.797693e308),true) + " as fast as you can. Your previous Simplify stats are saved, and they also slightly boost your ComP multipliers based on how far you got before entering this challenge.",
            },
            simpChalReward: {
                1: "ComP costs are divided by 2 per purchase.",
                2: "ComP costs are ^0.95.",
                3: "ComP costs now act like they're 0.975x less. This also slightly delays Post-150 scaling.",
                4: "All ComP costs are offset based off your points. This gets softcapped after " + format(new Decimal(200),true) + ".",
                5: "Higher order ComPs get a multiplier bonus based off of the previous ComP's multipliers.",
                6: "The ComP exponent is slightly increased. (^0.8 -> ^0.825)",
                7: "The 8th ComP gets a power bonus similar with the 2nd ComP.",
                8: "2nd ComP's bonus exponent is increased. (^1.585 -> ^1.667)",
                9: "MP, 1P, and DP increases PP's effect.",
                10: "ComP's post-150 gets delayed by 0.01 per total ComP purchase.",
                11: "ComP costs slowly decay based off time in this Simplify.",
                12: "Simplify Energy's base exponent is increased by 0.025.",
                13: "You gain a modified version of the sub-layer, which doesn't reset on Simplify.",
                14: "ComP1 produces ComP8 at a reduced rate.",
                15: "ComP costs get reduced by 1.25^ComP# per purchase.",
                16: "???",
            },
        },
        "upgrades": {
            simplifyMainUPG: 0, 
            simplifyUPGNum2: dZero, // the upgrades here will not be unique, and may be bulk auto'd in the future, so i'm letting it stay as decimal
            PPUPG: dZero,
            MPUPG: dZero,
            OPUPG: dZero,
            DPUPG: dZero,
            SimpUPG1: {
                1: "Invest in multiple energies to boost production.",
                2: "Unlock TTS Challenges.",
                3: "Unlock Simplify upgrades where you can use your SE, xP, and total xP to get advantages.",
                4: "Unlock 'Situations' where you can go on altered runs for different milestones.",
            },
            SimpUPG2: { // this forms a repeat
                cost(x){
                    let temp = x

                    return temp
                },
                target(r){
                    let temp = r

                    return temp
                },
                power() {
                    let temp = dOne
                    return temp
                },
                display(type, total){
                    let temp = player.simplify.upgrades.simplifyUPGNum2
                    temp = temp.sub(type).div(8).add(1).floor()
                    let t2 = (total)?player.simplify.upgrades.SimpUPG2.strengthTotal(type, temp):player.simplify.upgrades.SimpUPG2.strengthPer(type)
                    switch(type){
                        case 1: 
                            temp = "ComP's effective bought amount for multipliers are multiplied by x"
                            temp += format(t2,true,3)
                            break;
                        case 2: 
                            temp = "MC1's effect is increased by +"
                            temp += format(t2,true,3)
                            break;
                        case 3: 
                            temp = "Simplify Energy's gain exponent is increased by +"
                            temp += format(t2,true,3)
                            break;
                        case 4: 
                            temp = "DP's root is reduced from " + format(new Decimal(5),true,3) + " by -"
                            temp += format(t2,true,3)
                            temp += ", softcapped when root < 3.75"
                            break;
                        case 5: 
                            temp = "ComP's post-150 scaling is delayed by +"
                            temp += format(t2,true,3)
                            break;
                        case 6: 
                            temp = "JC1's effect exponent is increased by +"
                            temp += format(t2,true,3)
                            temp += ", weighted towards 8th ComP"
                            break;
                        case 7: 
                            temp = "OP's root is reduced from " + format(new Decimal(6.5),true,3) + " by -"
                            temp += format(t2,true,3)
                            temp += ", softcapped when root < 5"
                            break;
                        case 8: 
                            temp = "MC4's effect exponent is multiplied by x"
                            temp += format(t2[0],true,3)
                            temp += ", and it's effect divisor is decreased by /"
                            temp += format(t2[1],true,3)
                            break;
                        default:
                            throw new Error("Type " + type + "is unknown!");
                    }
                    return temp + "."
                },
                strengthPer(type){
                    let temp = player.simplify.upgrades.SimpUPG2.power()
                    switch(type){
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
                            return [new Decimal(1.015).pow(temp), new Decimal(1.15).pow(temp)]
                        default:
                            throw new Error("Type " + type + "is unknown!");
                    }
                },
                strengthTotal(type, x){
                    let temp = x.root(2)
                    let P = player.simplify.upgrades.SimpUPG2.strengthPer(type)
                    switch(type){
                        case 1: 
                        case 4: 
                            return P.pow(temp)
                        case 2: 
                        case 3: 
                        case 5: 
                        case 6: 
                        case 7: 
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








