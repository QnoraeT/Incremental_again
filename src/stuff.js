"use strict";

const objectMap = (obj, fn) =>
    Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
    )
)

class Character {
    constructor(id, name, ai, level, type, baseStats, xp, team) {
        this.id = id
        this.name = name
        this.aiName = ai
        this.level = level
        this.type = type
        this.baseStats = baseStats
        this.stats = structuredClone(this.baseStats); // JAVASCRIPT YOU MOTHERFUCKER
        this.team = team
        this.xp = 0
        this.xpReq = xp[0]
        this.baseXP = xp
        this.health = this.stats.hp
        this.mana = this.stats.mp
    }

    changeStats(stat, amt, name) {
        if (amt < 1) return
        this.stats[stat] += amt
        console.log(`${name} increased by ${amt}!`)
    }

    levelUp(every) {
        if (this.xp < this.xpReq) {
            console.log(`${this.name} now needs ${Math.round(this.xp - this.calcEXP(this.level - 1, this.baseXP))} / ${Math.round(this.calcEXP(this.level, this.baseXP) - this.calcEXP(this.level - 1, this.baseXP))} XP to level up again.`) 
            return;
        }
        for (let iter = 0; (this.xp >= this.xpReq && every && iter < 1000) || (!every && iter < 1); iter++) {
            this.prevStats = this.stats
            this.level++
            console.log(`${this.name} leveled up to [ ${this.level} ] !`)
            this.xpReq = this.calcEXP(this.level, this.baseXP)
            let lf = this.level
            lf = (1 + 4 * ((lf - 1) / 99)) * (1 + 0.04 * Math.floor(lf / 4)) * (1 + 0.05 * Math.floor(lf / 10)) * (1 + Math.floor(lf / 50) / 6)
    
            let newStats = structuredClone(this.baseStats);
    
            for (let key in newStats) {
                if (newStats.hasOwnProperty(key)) {
                    newStats[key] *= lf;
                }
            }
    
            let change = structuredClone(newStats)
            for (let key in change) {
                if (change.hasOwnProperty(key)) {
                    change[key] -= this.stats[key];
                }
            }
    
            if (this.level % 25 !== 0) {
                for (let key in change) {
                    if (change.hasOwnProperty(key)) {
                        change[key] *= (Math.random() * 0.5) + 0.5;
                    }
                }
            }
    
            for (let key in change) {
                if (change.hasOwnProperty(key)) {
                    change[key] = Math.round(change[key])
                }
            }
    
            this.changeStats("hp", change.hp, "Maximum HP")
            this.health += change.hp
            this.changeStats("mp", change.mp, "Maximum MP")
            this.mana += change.mp
            this.changeStats("patk", change.patk, "Strength")
            this.changeStats("matk", change.matk, "Wisdom")
            this.changeStats("pdef", change.pdef, "Endurance")
            this.changeStats("mdef", change.mdef, "Resistance")
            this.changeStats("eva", change.eva, "Evasion")
            this.changeStats("acc", change.acc, "Accuracy")
        }
        console.log(`${this.name} now needs ${Math.round(this.xp - this.calcEXP(this.level - 1, this.baseXP))} / ${Math.round(this.calcEXP(this.level, this.baseXP) - this.calcEXP(this.level - 1, this.baseXP))} XP to level up again.`)
    }

    calcEXP(lvl, xp = [10, 1]) {
        return (xp[0] * (XP_SCALE.cube[xp[1]] * (lvl ** 3) + XP_SCALE.quad[xp[1]] * (lvl ** 2) + XP_SCALE.line[xp[1]] * lvl + XP_SCALE.base[xp[1]])) / 10
    }
}

const XP_SCALE = {
    cube: {
        0: 0.79,
        1: 0.99,
        2: 1.23,
        3: 1.48,
    },
    quad: {
        0: 0.92,
        1: 0.9,
        2: 1.9,
        3: 1.88,
    },
    line: {
        0: 8,
        1: 10.02,
        2: 10.03,
        3: 12.03,
    },
    base: {
        0: 0,
        1: -1.91,
        2: -3.16,
        3: -3.39,
    },
}

function makeCharacter(name, ai, level, type, stats, xp, team) {
    globalID++
    return new Character(globalID - 1, name, ai, level, type, stats, xp, team)
}

let globalID = 0;
let characters = [];
characters.push(makeCharacter("FSBlue", "FSBlue", 1, ["Fighting"], {hp: 45, mp: 3, patk: 25, matk: 6, pdef: 19, mdef: 11, eva: 7, acc: 23}, [10, 3], 0))