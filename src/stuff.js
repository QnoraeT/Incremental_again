"use strict";

/*
levelUp(0, 84)
characters[0].xp += 61996
characters[0].levelUp()
characters[0].stats.hp = 862
characters[0].stats.mp = 58
characters[0].stats.patk = 670
characters[0].stats.matk = 172
characters[0].stats.pdef = 631
characters[0].stats.mdef = 249
characters[0].stats.eva = 190
characters[0].stats.acc = 570
showCharacter(0)
*/

function showCharacter(id) {
    let char = characters[id]
    console.log(`  > ${char.name} [ ${char.type} ] Level %c${char.level}%c
    HP:    %c${char.stats.hp}%c
    MP:    %c${char.stats.mp}%c
    PATK:  %c${char.stats.patk}%c
    MATK:  %c${char.stats.matk}%c
    PDEF:  %c${char.stats.pdef}%c
    MDEF:  %c${char.stats.mdef}%c
    EVA:   %c${char.stats.eva}%c
    ACC:   %c${char.stats.acc}%c`, 
    `color: #ffff00`,
    ``,
    `color: #ff0000`,
    ``,
    `color: #0060ff`,
    ``,
    `color: #ff6000`,
    ``,
    `color: #00acff`,
    ``,
    `color: #00ff00`,
    ``,
    `color: #8000ff`,
    ``,
    `color: #a0a0a0`,
    ``,
    `color: #606060`,
    ``,
    )
}

function levelUp(id, level) {
    let char = characters[id]
    char.xp = char.calcEXP(level - 1) + 0.5
    char.levelUp(true)
}

class Character {
    constructor(id, name, ai, level, config, type, baseStats, xp, team) {
        this.id = id
        this.name = name
        this.aiName = ai
        this.level = level
        this.config = config
        this.type = type
        this.baseStats = baseStats
        this.stats = structuredClone(this.baseStats);
        for (let key in this.stats) {
            if (this.stats.hasOwnProperty(key)) {
                this.stats[key] = Math.round(this.stats[key]);
            }
        }
        this.team = team
        this.baseXP = xp
        this.xp = 0
        this.xpReq = Math.max(0, (xp[0] * (XP_SCALE.cube[xp[1]] * (level ** 3) + XP_SCALE.quad[xp[1]] * (level ** 2) + XP_SCALE.line[xp[1]] * level + XP_SCALE.base[xp[1]])) / 10)
        this.health = this.stats.hp
        this.mana = this.stats.mp
        this.extraStats = {}
    }

    changeStats(stat, amt, name, color) {
        if (amt < 1) return
        console.log(`${name} increased from %c${this.stats[stat]} -> ${this.stats[stat] + amt}%c! (+${amt})`, `color: ${color}`, ``)
        this.stats[stat] += amt
    }

    levelUp(every) {
        if (this.xp < Math.round(this.xpReq)) {
            console.log(`${this.name} needs ${Math.round(this.xp - this.calcEXP(this.level - 1))} / ${Math.round(this.calcEXP(this.level) - this.calcEXP(this.level - 1))} XP to level up again.`)
            return;
        }
        for (let iter = 0; (this.xp >= this.xpReq && every && iter < 1000) || (!every && iter < 1); iter++) {
            this.prevStats = this.stats
            this.level++
            console.log(`${this.name} leveled up to [ ${this.level} ] !`)
            this.xpReq = this.calcEXP(this.level, this.baseXP)
            let lf = this.level
            lf = (1 + 6.5 * ((lf - 1) / 99)) * (1 + 0.04 * Math.floor(lf / 4)) * (1 + 0.05 * Math.floor(lf / 10)) * (1 + Math.floor(lf / 50) / 6)

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
                        change[key] *= (Math.random() * 0.75) + 0.5;
                    }
                }
            }

            for (let key in change) {
                if (change.hasOwnProperty(key)) {
                    change[key] = Math.round(change[key])
                }
            }

            this.changeStats("hp", change.hp, "Maximum HP", "#ff0000")
            this.health += change.hp
            this.changeStats("mp", change.mp, "Maximum MP", "#0060ff")
            this.mana += change.mp
            this.changeStats("patk", change.patk, "Strength", "#ff6000")
            this.changeStats("matk", change.matk, "Wisdom", "#00acff")
            this.changeStats("pdef", change.pdef, "Endurance", "#00ff00")
            this.changeStats("mdef", change.mdef, "Resistance", "#8000ff")
            this.changeStats("eva", change.eva, "Evasion", "#a0a0a0")
            this.changeStats("acc", change.acc, "Accuracy", "#606060")
        }
        console.log(`${this.name} now needs ${Math.round(this.xp - this.calcEXP(this.level - 1))} / ${Math.round(this.calcEXP(this.level) - this.calcEXP(this.level - 1))} XP to level up again.`)
    }

    calcEXP(lvl, xp = this.baseXP) {
        return Math.max(0, (xp[0] * (XP_SCALE.cube[xp[1]] * ((lvl) ** 3) + XP_SCALE.quad[xp[1]] * (lvl ** 2) + XP_SCALE.line[xp[1]] * lvl + XP_SCALE.base[xp[1]])) / 10)
    }
}

const XP_SCALE = {
    cube: {
        0: 0.79,
        1: 0.99,
        2: 1.23,
        3: 1.48,
        4: 1.98,
    },
    quad: {
        0: 0.92,
        1: 0.9,
        2: 1.9,
        3: 1.88,
        4: 1.85,
    },
    line: {
        0: 8,
        1: 10.02,
        2: 10.03,
        3: 12.03,
        4: 15.04,
    },
    base: {
        0: 0,
        1: -1.91,
        2: -3.16,
        3: -3.39,
        4: -3.86,
    },
}

function makeCharacter(name, ai, level, config, elementType, stats, xp, team) {
    globalID++
    return new Character(globalID - 1, name, ai, level, config, elementType, stats, xp, team)
}

let globalID = 0;
let characters = [];
characters.push(makeCharacter("FSBlue", "FSBlue", 1, {}, ["Fighting"], { hp: 45, mp: 3, patk: 35, matk: 9, pdef: 32.5, mdef: 12, eva: 10, acc: 30 }, [15, 4], 0))
characters.push(makeCharacter("HypSB", "HypSB", 1, {}, ["Psychic"], { hp: 20, mp: 15, patk: 8, matk: 20, pdef: 10, mdef: 25, eva: 10, acc: 30 }, [10, 1], 0))
characters.push(makeCharacter("DesSB", "DesSB", 1, {}, ["Normal"], { hp: 12, mp: 20, patk: 10, matk: 24, pdef: 3, mdef: 30, eva: 15, acc: 20 }, [10, 0], 0))
characters.push(makeCharacter("QsSB", "QsSB", 1, {}, ["Ground"], { hp: 32, mp: 10, patk: 15, matk: 12, pdef: 15, mdef: 14, eva: 4, acc: 18 }, [12, 2], 0))
characters.push(makeCharacter("Natalie Skyler", "Natsky", 1, {}, ["Electric", "Psychic"], { hp: 15, mp: 25, patk: 9, matk: 25, pdef: 7, mdef: 18, eva: 20, acc: 30 }, [12, 1], 0))
characters.push(makeCharacter("Toxafel Skyler", "Toxafel", 1, {}, ["Electric", "Poison"], { hp: 16, mp: 17, patk: 16.5, matk: 15, pdef: 12, mdef: 13.5, eva: 17, acc: 16 }, [10, 1], 0))
characters.push(makeCharacter("Alterian Skyler", "Altsky", 1, {}, ["Electric", "Normal"], { hp: 100, mp: 15, patk: 17, matk: 12, pdef: 1.5, mdef: 1.2, eva: 1.8, acc: 40 }, [12, 3], 0))
