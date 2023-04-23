"use strict";

const mode = "normal";
const ln10 = new Decimal(10).ln();
var compVisible = 1;
let points = new Decimal(10);
let pps = new Decimal(0);
let totalPointsInSimplify = new Decimal(10);
let totalPoints = new Decimal(10);
let inChallenge = []; // this is not in simplify list because theres potentially gonna be further layers with their own challenges (which can and will be nested)
let notation = "Mixed Scientific";
let totalTime = 0; // timespeed doesn't affect this
let gameTime = new Decimal(0); // timespeed will affect this (totalGameTime)
let timeSpeed = new Decimal(1);
let tab = [0,0,0];
let expandMultComP = 0;
let progressBar = new Decimal(0);
let progressBarText = "";
let inSChallenge = 0;
let simpChalSelected = 0;
let softcaps = [];
let sXPTypes = ["PP", "MP", "OP", "DP"]
let simplify = {
    "main": {
        simplifyEnergy: new Decimal(0),
        simplifyStat: new Decimal(0),
        SEExp: new Decimal(1.75),
        SAExp: new Decimal(0.75),
        simplifyReq: new Decimal(1e12),
        totalXP: new Decimal(0), // (TruePP + TrueMP + True1P + TrueDP)^SimpEXP
    },
    "PP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(1),
    },
    "MP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(1),
    },
    "OP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(2),
    },
    "DP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(1),
    },
    "challenge": {
        completed: Array(16).fill(0), // 0-3 Magnifying [] 4-7 Beginner [] 8-11 Articulated [] 12-15 77777777 []
        timeInChallenge: new Decimal(0), // time speed exists
        MC1effect: new Decimal(1),
        SC3effect: new Decimal(1),
    },
    "upgrades": {
        simplifyMainUPG: 0, 
        simplifyUPGNum2: new Decimal(0), // the upgrades here will not be unique, and may be bulk auto'd in the future, so i'm letting it stay as decimal
        PPUPG: new Decimal(0),
        MPUPG: new Decimal(0),
        OPUPG: new Decimal(0),
        DPUPG: new Decimal(0),
    },
    "situation1": {
        amount: new Decimal(0),
        rank: new Decimal(0),
        tier: new Decimal(0),
        tetr: new Decimal(0),
        pent: new Decimal(0),
    },
    "situation2": {
        amount: new Decimal(0),
        bar1: new Decimal(0),
        bar2: new Decimal(0),
        bar3: new Decimal(0),
        bar4: new Decimal(0),
    },
    "situation3": {
        amount: new Decimal(0),
        milestonePts: new Decimal(0),
        milestoneComp8: new Decimal(0),
        milestoneTotalBought: new Decimal(0),
        milestoneMisc: new Decimal(0), // custom challenges and stuff ("don't buy comp1 more than once", "reach 1e100 in 15 seconds without comp6+", etc)
    },
}

let comps = {
    "1": new ComP(1),
    "2": new ComP(2),
    "3": new ComP(3),
    "4": new ComP(4),
    "5": new ComP(5),
    "6": new ComP(6),
    "7": new ComP(7),
    "8": new ComP(8)
}

const SimpUPG1 = {
    1: "Invest in multiple energies to boost production.",
    2: "Unlock TTS Challenges.",
    3: "Unlock Simplify upgrades where you can use your SE, xP, and total xP to get advantages.",
    4: "Unlock 'Situations' where you can go on altered runs for different milestones.",
}
const simpChalDesc = {
    1: "Max All is disabled. ComP costs grow by 2^x per purchase. Multipliers are ^0.75 then /" + format(new Decimal(1000),true) + ".",
    2: "Max All is disabled. ComP's post-150 scaling now starts at 1. Multiplier per bought is lowered by 1, PP and MP's effect is ^0.5 and MP's effect is then /" + format(new Decimal(1000),true) + ".",
    3: "Max All is disabled. ComP's costs are squared. 2nd and further ComP's costs are multiplied by " + format(new Decimal(10_000),true) + "before being squared. Gain is ^0.5, and your goal is " + format(new Decimal(1e20),true) + ".",
    4: "Max All is disabled. ComP's costs act like their bought amount is squared. This also means that post-150 scaling starts earlier, and that MC3's effect is slightly stronger. All multipliers to ComPs and all xP effects are ^0.4.",
    5: "All ComP multipliers get severely reduced every time any ComP gets bought. This multiplier slowly goes back to /" + format(new Decimal(1e8),true) + " in 40 seconds. PP has no effect.",
    6: "Your base gain is effected by the same power that the ComP amount is being affected by. You must have " + format(new Decimal(1e8),true) + " SE (" + format(new Decimal("1e395"),true) + ") on reset to complete this challenge.",
    7: "All xP effects are neutralized.",
    8: "All ComP's multipliers are affected by the ComP exponent to amount, and PP, MP, 1P, and DP's effects are ^0.5.",
    9: "Max All is disabled. Your ComP costs scale entirely based off your total ComPs bought. MP, 1P, and DP's effects now only boost PP, Gain is reduced, and their individual effects are set to as if you had none.",
    10: "ComP's post 150 scaling slowly gets earlier over time, and gets delayed by some amount per purchase. Your gain is ^0.5 with /" + format(new Decimal(1e150),true) + ".",
    11: "Your ComPs only have a reasonable effect for 400ms before their multipliers quickly decay into ^0.5 of what it was. All ComPs' multi's are ^0.5.",
    12: "Max All is disabled. Your ComP 'bought' goes up over time but automatic ComP 'bought' doesn't increase multiplier. ComP's sub-powers goes from ^0.8 to ^0.5.",
    13: "ComPs 1-2's power modifiers are set to 0.5, however you have an extra sub-layer in the Simplify tab to help you in this challenge.",
    14: "Your gain is set to ^0.05, but your ComP costs are set to ^0.1. Not only that, you have a 'relative gain' which slowly decreases with time. If it goes lower than 1, you restart the challenge.",
    15: "ComP costs act like if you have bought double. Your 'bought' always goes down at a steady pace, but your cost never goes down. However, you will gain a sub-layer in the Simplify tab which will help you in this challenge. Simplify requirement is " + format(new Decimal(1e55),true) + ".",
    16: "Someone else is trying to compete with your growth. Reset everything including your simplify layer, and try to get " + format(new Decimal(1.797693e308),true) + " as fast as you can. Your previous Simplify stats are saved, and they also slightly boost your ComP multipliers based on how far you got before entering this challenge.",
}
const simpChalReward = {
    1: "ComP costs are divided by 2 per purchase.",
    2: "ComP costs are ^0.95.",
    3: "ComP costs now act like they're 0.975x less. This also slightly delays Post-150 scaling.",
    4: "All ComP costs are offset based off your points.",
    5: "Higher order ComPs get a multiplier bonus based off of the previous ComP's multipliers.",
    6: "The ComP exponent is slightly increased. (^0.8 -> ^0.825)",
    7: "The 8th ComP gets a power bonus similar with the 2nd ComP.",
    8: "2nd ComP's bonus exponent is increased. (^1.585 -> ^1.625)",
    9: "MP, 1P, and DP inceases PP's effect.",
    10: "ComP's post 150 scaling is 5% weaker, and gets delayed by 0.01 per total ComP purchase.",
    11: "ComP costs slowly decay based off time in this Simplify.",
    12: "Simplify Energy's base exponent is increased by 0.025.",
    13: "You gain a modified version of the sub-layer, which doesn't reset on Simplify.",
    14: "ComP1 produces ComP8 at a reduced rate.",
    15: "ComP costs get reduced by 1.25^ComP# per purchase.",
    16: "???",
}
