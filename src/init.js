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
        3: "Max All is disabled. ComP's costs are squared. 2nd and further ComP's costs are multiplied by " + format(new Decimal(10), true) + " before being squared. Your gain is also square-rooted.",
        4: "Max All is disabled. ComP's costs act like their bought amount is squared. This also means that post-150 scaling starts earlier, and that MC3's effect is slightly stronger. All multipliers to ComPs and all xP effects are ^0.4.",
        5: "All ComP multipliers get severely reduced every time any ComP gets bought. This multiplier slowly goes back to /" + format(new Decimal(1e4), true) + " in 40 seconds. PP has no effect.",
        6: "Your base gain is effected by the same power that the ComP amount is being affected by. You must have " + format(new Decimal("1e395"), true) + " to complete this challenge.",
        7: `All xP effects are neutralized. Your goal is ${format(new Decimal(1e15))}.`,
        8: "All ComP's multipliers are affected by the ComP exponent to amount, and PP, MP, 1P, and DP's effects are cube rooted. The ComP exponent has also been reduced to 0.4.",
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

const dZero = Decimal.dZero;
const dOne = Decimal.dOne;
const dTwo = Decimal.dTwo;
const dTen = Decimal.dTen;
const dsqr2pi = new Decimal(Math.sqrt(2 * Math.PI))
const ln10 = dTen.ln();
const cbr2 = new Decimal(Math.cbrt(2));
const simplifyChalTypes = ["🔎", "🔰", "🚛", "777"];
const simplifyXPTypes = ["PP", "MP", "OP", "DP"];
const simplifyXPColor = ["#FF0000", "#FFFF00", "#00FF00", "#0000FF"];
const simplifyXPDesc = ["increasing overall gain by x", "increasing all multipliers by x", "improving 1st mult power to ^", "boosting multiplier per bought by x"];
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
let lastSave = 0;
let saveTime = 30000;
let html = {};

function makeComp(index) {
    let obj = {};
    obj.index = index;
    obj.amount = dZero;
    obj.bought = dZero;
    obj.multi = dOne;
    obj.cost = dTen;
    obj.trueCost = dZero;
    obj.trueAmount = dZero;
    obj.multiFactors = "";
    obj.costFactors = "";
    return obj;
}

let player = {};
let game = {};
let currentSave = 0;

function resetPlayer() {
    player = {
        misc: {
            chapter: 0,
            points: dTen,
            pps: dZero,
            totalPointsInSimplify: dTen,
            totalPoints: dTen,
            inChallenge: [], // this is not in simplify list because theres potentially gonna be further layers with their own challenges (which can and will be nested)
            totalTime: 0, // timespeed doesn't affect this
            gameTime: dZero, // timespeed will affect this (totalGameTime)
            timeSpeed: dOne,
            setTimeSpeed: dOne, // change this if you think the game is going too fast or slow, i won't judge you =P
            inSChallenge: 0,
            version: 0,
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
            compVisible: 1,
            array: {
                "1": makeComp(1),
                "2": makeComp(2),
                "3": makeComp(3),
                "4": makeComp(4),
                "5": makeComp(5),
                "6": makeComp(6),
                "7": makeComp(7),
                "8": makeComp(8)
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
                DPUPG: dZero
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
}

function fixData(defaultData, newData) {
    let item;
    for (item in defaultData) {
        if (defaultData[item] == null) {
            if (newData[item] === undefined);
            newData[item] = null;
        } else if (Array.isArray(defaultData[item])) {
            if (newData[item] === undefined) {
                newData[item] = defaultData[item];
            } else {
                fixData(defaultData[item], newData[item]);
            }
        } else if (defaultData[item] instanceof Decimal) { // Convert to Decimal
            if (newData[item] === undefined) {
                newData[item] = defaultData[item];
            } else {
                newData[item] = new Decimal(newData[item]);
            }
        } else if ((!!defaultData[item]) && (typeof defaultData[item] === "object")) {
            if (newData[item] === undefined || (typeof defaultData[item] !== "object")) {
                newData[item] = defaultData[item];
            } else {
                fixData(defaultData[item], newData[item]);
            }
        } else {
            if (newData[item] === undefined) {
                newData[item] = defaultData[item];
            }
        }
    }
    return newData;
}

const draw = document.querySelector("#effects");
const pen = draw.getContext("2d");
let dots = [];

function initDots() {
    for (let i = 0; i < 32; i++) {
        dots.push([0, rand(-10000, 10000), rand(-10000, 10000), rand(0.1, 0.4), rand(-0.02, 0.02), rand(-0.02, 0.02)]);
    }
    for (let i = 0; i < 128; i++) {
        dots.push([1, rand(-10000, 10000), rand(-10000, 10000), rand(1.1, 3), rand(-0.1, 0.1), rand(-0.1, 0.1)]);
    }
}

const drawing = () => {
    draw.width = window.innerWidth;
    draw.height = window.innerHeight;
    for (let i = 0; i < dots.length; i++) {
        dots[i][4] += Math.random() - 0.5;
        dots[i][5] += Math.random() - 0.5;
        dots[i][4] = lerp(1 - (0.9 ** delta), dots[i][4], 0);
        dots[i][5] = lerp(1 - (0.9 ** delta), dots[i][5], 0);
        dots[i][1] += dots[i][3] * delta * dots[i][4];
        dots[i][2] += dots[i][3] * delta * dots[i][5];

        pen.beginPath();
        let alpha;
        if (dots[i][0] === 0) {
            alpha = 20 + (4 * Math.cos((sessionTime + 11 * i) / 50));
        } else {
            alpha = 160 + (64 * Math.cos((sessionTime + 11 * i) / 50));
        }
        pen.fillStyle = `hsla(${sessionTime + (i * (dots[i][0] === 0 ? 1 : 0.1))}, 100%, 50%, ${alpha / 255})`;
        let j = Math.cos((sessionTime * dots[i][3] + i) / (2 * Math.PI));
        pen.arc((Math.abs(dots[i][1] % 3800) - 700),
            (Math.abs(dots[i][2] % 2400) - 700),
            dots[i][0] == 0 ? (300 + 100 * j) : (10 + 4 * j),
            0,
            2 * Math.PI);
        pen.fill();

    }
}
