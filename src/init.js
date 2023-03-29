var compVisable = 1;
let points = new Decimal(10);
let totalPointsInSimplify = new Decimal(10);
let totalPoints = new Decimal(10);
//let compExp = new Decimal(0.8)          moved to ComP.js
//let compBM = new Decimal(2)             moved to ComP.js
//let compScale = new Decimal(150);       moved to ComP.js
let inChallenge = [] // this is not in simplify list because theres potentially gonna be further layers with their own challenges (which can and will be nested)
let notation = "Mixed Scientific";
let totalTime = 0;
let gameTime = new Decimal(0);
let timeSpeed = new Decimal(1);
let tab = [0,0,0];
let simplify = {
    "main": {
        simplifyEnergy: new Decimal(0),
        simplifyStat: new Decimal(0),
        SEExp: new Decimal(1.75),
        SAExp: new Decimal(0.75),
        simplifyReq: new Decimal(1e15),
        totalXP: new Decimal(0), // (TruePP + TrueMP + True1P + TrueDP)^SimpEXP
    },
    "PP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(1)
    },
    "MP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(1)
    },
    "1P": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(2)
    },
    "DP": {
        allocated: new Decimal(0),
        generated: new Decimal(0),
        trueValue: new Decimal(0),
        effect: new Decimal(1)
    },
    "challenge": {
        completed: Array(15).fill(0), // 0-3 Magnifying [] 4-7 Beginner [] 8-11 Articulated [] 12-15 77777777 []
        timeInChallenge: new Decimal(0), // time speed exists
    },
    "upgrades": {
        simplifyMainUPG: new Decimal(0),
        simplifyUPGNum2: new Decimal(0),
        PPUPG: new Decimal(0),
        MPUPG: new Decimal(0),
        OPUPG: new Decimal(0), // OP -> 1P
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
    "1": new ComP(10, 1),
    "2": new ComP(100_000, 2),
    "3": new ComP(1e9, 3),
    "4": new ComP(10e12, 4),
    "5": new ComP(100e15, 5),
    "6": new ComP(1e21, 6),
    "7": new ComP(10e24, 7),
    "8": new ComP(100e27, 8)
}