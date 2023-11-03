function switchTab(t, id) {
    tab[id] = t;
    for (let TA = id + 1; TA <= (tab.length - 1); ++TA) {
        tab[TA] = 0;
        if (TA > 40) {
            throw new Error("what the hell? (broke out of somehow infinite loop)");
        }
    }
}

function calcPointsPerSecond() {
    let temp = player.comps.array[1].trueAmount.mul(player.comps.array[1].multi);
    if (player.misc.inChallenge.includes("simp2")) { temp = temp.root(2); }
    if (player.misc.inChallenge.includes("simp5")) { temp = temp.pow(player.comps.compExp); }
    if (player.misc.inChallenge.includes("simp8")) { temp = temp.root(4); }
    if (player.misc.inChallenge.includes("simp9")) { temp = temp.root(2).div(1e150); }
    if (player.misc.inChallenge.includes("simp13")) { temp = temp.pow(0.05); }
    return temp;
}

function getProgress() { // progressBar = 0-1
    progressBar = dOne;
    progressBarProg = (progressBar.toNumber() * 100).toFixed(2) + "%";
    progressBarText = "All done! ";
    let canSet = true
    let m
    if (player.misc.inSChallenge && canSet) {
        progressBar = player.misc.totalPointsInSimplify.add(1).log(player.simplify.main.simplifyReq);
        m = progressBar.clamp(0, 1);
        progressBarText = `Complete Challenge: ${(m.toNumber() * 100).toFixed(2)}% ( ${format(player.misc.totalPointsInSimplify)} / ${format(player.simplify.main.simplifyReq)} )`;
        canSet = false
    }
    if (player.simplify.upgrades.simplifyMainUPG == 6 && canSet) {
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(1.2e27).max(1).log(Decimal.div(7.2e38, 1.2e27));
        m = progressBar.clamp(0, 1);
        progressBarText = `Next feature: ${(m.toNumber() * 100).toFixed(2)}% ( ${format(player.simplify.main.simplifyEnergy.add(getSimplifyGain()))} / 720.000 UDc )`;
        canSet = false
    }
    if (player.simplify.upgrades.simplifyMainUPG == 5 && canSet) {
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(2.4e17).max(1).log(Decimal.div(1.2e27, 2.4e17));
        m = progressBar.clamp(0, 1);
        progressBarText = `Next feature: ${(m.toNumber() * 100).toFixed(2)}% ( ${format(player.simplify.main.simplifyEnergy.add(getSimplifyGain()))} / 1.200 Oc )`;
        canSet = false
    }
    if (player.simplify.upgrades.simplifyMainUPG == 4 && canSet) {
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(6e9).max(1).log(Decimal.div(2.4e17, 6e9));
        m = progressBar.clamp(0, 1);
        progressBarText = `Next feature: ${(m.toNumber() * 100).toFixed(2)}% ( ${format(player.simplify.main.simplifyEnergy.add(getSimplifyGain()))} / 240.000 Qa )`;
        canSet = false
    }
    if (player.simplify.upgrades.simplifyMainUPG == 3 && canSet) {
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(20000).max(1).log(Decimal.div(6e9, 20000));
        m = progressBar.clamp(0, 1);
        progressBarText = `Next feature: ${(m.toNumber() * 100).toFixed(2)}% ( ${format(player.simplify.main.simplifyEnergy.add(getSimplifyGain()))} / 6.000 B )`;
        canSet = false
    }
    if (player.simplify.upgrades.simplifyMainUPG == 2 && canSet) {
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(10).max(1).log(Decimal.div(20000, 10));
        m = progressBar.clamp(0, 1);
        progressBarText = `Next feature: ${(m.toNumber() * 100).toFixed(2)}% ( ${format(player.simplify.main.simplifyEnergy.add(getSimplifyGain()))} / 20,000 )`;
        canSet = false
    }
    if (player.simplify.upgrades.simplifyMainUPG == 1 && canSet) {
        progressBar = player.simplify.main.simplifyEnergy.add(getSimplifyGain()).div(10);
        m = progressBar.clamp(0, 1);
        progressBarText = `Next feature: ${(m.toNumber() * 100).toFixed(2)}% ( ${format(player.simplify.main.simplifyEnergy.add(getSimplifyGain()))} / 10.000 )`;
        canSet = false
    }
    if (player.misc.totalPoints.lt(1e12) && canSet) {
        progressBar = player.misc.totalPoints.div(10).max(1).log(1e11);
        m = progressBar.clamp(0, 1);
        progressBarText = `Next layer: ${(m.toNumber() * 100).toFixed(2)}% ( ${format(player.misc.totalPoints)} / 1.000e12 )`;
        canSet = false
    }
    if (player.simplify.upgrades.simplifyMainUPG == 0 && canSet) {
        progressBarText = `Look in the \"Simplify\" tab! `;
        canSet = false
    }
}

function getChalEffects() {
    let temp;
    temp = dOne;
    if (player.simplify.challenge.completed[0]) { temp = temp.add(1); }
    player.simplify.challenge.MC1effect = temp;

    temp = dOne;
    if (player.simplify.challenge.completed[14]) { temp = temp.add(0.25); }
    player.simplify.challenge.SC3effect = temp;

    temp = dOne;
    if (player.simplify.challenge.completed[3]) { temp = player.misc.points.max(10).log(10).log(10).pow(2); }
    temp = Decimal.pow(10, scale("EP", temp.add(1).log(10), false, 2.30102999, 1, 1.5, 0)[0]); // this is a double log softcap lmfao
    player.simplify.challenge.MC4effect = temp;

    temp = new Decimal(0.8);
    if (player.simplify.challenge.completed[5]) { temp = temp.add(0.025); }
    if (player.misc.inChallenge.includes("simp11")) { temp = new Decimal(0.5); }
    if (player.misc.inChallenge.includes("simp7")) { temp = new Decimal(0.4); }
    player.comps.compExp = temp;

    temp = new Decimal(150);
    if (player.simplify.challenge.completed[9]) {
        for (let comp = 8; comp >= 1; --comp) {
            temp = temp.add(player.comps.array[comp].bought.mul(0.01))
        }
    }
    if (player.misc.inChallenge.includes("simp1")) { temp = dOne; }
    if (player.misc.inChallenge.includes("simp9")) {
        temp = temp.sub(player.simplify.main.timeInSimplify.mul(15));
        for (let comp = 8; comp >= 1; --comp) {
            temp = temp.add(player.comps.array[comp].bought.mul(0.25));
        }
    }
    player.scaling.ComPs[0].start = temp.max(1);

    temp = dOne
    if (player.simplify.challenge.completed[10]) { temp = Decimal.pow(player.simplify.main.timeInSimplify.add(1), 32); }
    player.simplify.challenge.AC2effect = temp;

    temp = new Decimal(1.5)
    if (player.simplify.challenge.completed[11]) { temp = temp.add(0.025); }
    player.simplify.main.SEExp = temp;

    temp = new Decimal(1e12);
    if (player.misc.inChallenge.includes("simp5")) { temp = new Decimal("1e395"); }
    if (player.misc.inChallenge.includes("simp6")) { temp = new Decimal("1e15"); }
    if (player.misc.inChallenge.includes("simp12")) { temp = new Decimal(1.111e111); }
    if (player.misc.inChallenge.includes("simp14")) { temp = new Decimal(1e55); }
    if (player.misc.inChallenge.includes("simp15")) { temp = new Decimal(1.797693e308); }
    player.simplify.main.simplifyReq = temp;

    if (player.misc.inChallenge.includes("simp13")) {
        temp = player.misc.pps.div(Decimal.pow(1.3, player.simplify.main.timeInSimplify));
        player.simplify.challenge.SC2RG = temp;
    }
}

function challengeToggle(type) {
    switch (type) {
        case "simp":
            if (player.misc.inSChallenge) {
                for (let i = 0; i < 16; ++i) {
                    if (player.misc.inChallenge.includes("simp" + i)) {
                        player.misc.inChallenge.splice(player.misc.inChallenge.indexOf("simp" + i), 1);
                    }
                }
            } else {
                player.misc.inChallenge.push("simp" + simpChalSelected);
            }
            simplifyReset({ noChalComplete: true });
            break;
        default:
            throw new Error("challenge type " + type + " does not exist.");
    }
    updateChallenge(type);
}

function exitChallenge(type) {
    switch (type) {
        case "simp":
            for (let i = 0; i < 16; ++i) {
                if (player.misc.inChallenge.includes("simp" + i)) {
                    player.misc.inChallenge.splice(player.misc.inChallenge.indexOf("simp" + i), 1);
                }
            }
            break;
        default:
            throw new Error("challenge type " + type + " does not exist.");
    }
    updateChallenge(type);
}

function updateChallenge(type) {
    switch (type) {
        case "simp": case "all":
            player.misc.inSChallenge = false;
            for (let i = 0; i < 16; ++i) {
                if (player.misc.inChallenge.includes("simp" + i)) {
                    player.misc.inSChallenge = true;
                }
            }
            html[`challengeStart1`].setClasses({ challengeStart: true, startChallenge: !player.misc.inSChallenge, exitChallenge: player.misc.inSChallenge, defaultButton: true });
            html[`challengeStart1`].setTxt(player.misc.inSChallenge ? "Exit Challenge" : "Start Challenge");
            html[`completeChallenge1`].setClasses({ challengeStart: true, completeChallenge: true, defaultButton: true });
            let c = player.simplify.challenge.completed
            for (let i = 0; i < 4; i++) {
                html[`simpChal${i}`].setDisplay(
                    c[4 * (i - 1)] ||
                    c[4 * (i - 1) + 1] ||
                    c[4 * (i - 1) + 2] ||
                    c[4 * (i - 1) + 3] ||
                    i == 0);
                for (let j = 0; j < 4; j++) {
                    html[`simpChal${4 * i + j}-id`].setDisplay(c[4 * (i - 1) + j] || i == 0)
                    html[`simpChal${4 * i + j}-id`].setClasses({ simpChal: true, simpChalIncomplete: !c[4 * i + j], simpChalComplete: c[4 * i + j], inSimpChal: player.misc.inChallenge.includes(`simp${4 * i + j}`), defaultButton: true })
                    if (simpChalSelected == 4 * i + j) {
                        if (!c[4 * i + j]) {
                            html[`simpChal${4 * i + j}-id`].removeClass("simpChalIncomplete");
                            html[`simpChal${4 * i + j}-id`].addClass("simpChalSelected");
                        }
                        if (c[4 * i + j]) {
                            html[`simpChal${4 * i + j}-id`].removeClass("simpChalComplete");
                            html[`simpChal${4 * i + j}-id`].addClass("simpChalCompleteSelected");
                        }
                        if (player.misc.inChallenge.includes(`simp${4 * i + j}`)) {
                            html[`simpChal${4 * i + j}-id`].removeClass("inSimpChal");
                            html[`simpChal${4 * i + j}-id`].addClass("inSimpChalSelected");
                        }
                    }
                }
                html[`ttsChalArea`].setClasses({ simpChalDesc: true });
                html[`ttsChalArea`].setHTML(`${simplifyChalTypes[Math.floor(simpChalSelected / 4)]} Challenge ${(simpChalSelected % 4) + 1}: <br> ${simpChal.simpChalDesc[simpChalSelected + 1]} <br> <br> Reward: ${simpChal.simpChalReward[simpChalSelected + 1]}`);
            }
        default:
        // do
    }
}

function completeChallenge(type) {
    switch (type) {
        case "simp":
            for (let i = 0; i < 16; ++i) {
                if (player.misc.inChallenge.includes("simp" + i)) {
                    player.simplify.challenge.completed[i] = true;
                    player.misc.inChallenge.splice(player.misc.inChallenge.indexOf("simp" + i), 1)
                }
            }
            break;
        default:
            throw new Error("challenge type " + type + " does not exist.");
    }
}

function resetTheFrickingGame() {
    localStorage.setItem("tearonq_incremental_save", null);
    document.location.reload(true);
}

function saveTheFrickingGame() {
    try {
        game[currentSave].player = player
        localStorage.setItem("tearonq_incremental_save", JSON.stringify(game));
        return "Game was saved!"
    } catch (e) {
        console.warn("Something went wrong while trying to save the game!!")
        throw e
    }
}

function updatePlayerData(player) {
    let play = player;
    let vers = player.misc.version||-1;
    if (vers < 0) {
        vers = 0;
    }
    player = play;
}

window.addEventListener('DOMContentLoaded', () => {
    window.requestAnimationFrame(gameLoop);
    let oldTimeStamp = 0;
    lastFPSCheck = 0;

    resetPlayer();
    game = {
        0: {
            name: "Save #1",
            mode: "normal",
            player: player
        }
    }

    let loadgame = JSON.parse(localStorage.getItem("tearonq_incremental_save"));
    if (loadgame !== null) {
        game = fixData(game, loadgame);
        player = game[currentSave].player;
        updatePlayerData(player)
        player
    } else {
        currentSave = 0;
        console.log("reset");
    }

    switchTab(0, 0);
    initDots();
    setupHTML();

    function gameLoop(timeStamp) {
        try {
            delta = (timeStamp - oldTimeStamp) / 1000;
            fpsList.push(delta);
            if (timeStamp > lastFPSCheck) {
                lastFPSCheck = timeStamp + 500;
                FPS = 0;
                for (let i = 0; i < fpsList.length; ++i) {
                    FPS += fpsList[i];
                }
                FPS = (fpsList.length / FPS).toFixed(1);
                fpsList = [];
                document.getElementById("fps").innerText = `FPS: ${FPS}`;
            }
            let gameDelta = Decimal.mul(delta, player.misc.timeSpeed).mul(player.misc.setTimeSpeed);
            player.misc.gameTime = player.misc.gameTime.add(gameDelta);
            player.simplify.main.timeInSimplify = player.simplify.main.timeInSimplify.add(gameDelta);
            player.simplify.challenge.JC1Time = player.simplify.challenge.JC1Time.add(gameDelta);
            player.misc.totalTime += delta;
            sessionTime += delta;
            softcaps = [];
            player.simplify.main.totalXP = dOne;
            for (let type = 0; type < 4; ++type) {
                simplifyXPtick(type, gameDelta);
                player.simplify.main.totalXP = Decimal.mul(player.simplify.main.totalXP, player.simplify[simplifyXPTypes[type]].trueValue);
            }
            player.simplify.main.totalXP = player.simplify.main.totalXP.pow(player.simplify.main.SAExp);
            player.comps.compBM = player.simplify.DP.effect;

            player.misc.pps = calcPointsPerSecond();
            player.misc.points = player.misc.points.add(player.misc.pps.times(gameDelta));
            document.getElementById("points").innerText = format(player.misc.points, true, 3) + " ( " + format(player.misc.pps, true, 3) + " / s )";

            player.misc.totalPoints = player.misc.totalPoints.add(player.misc.pps.times(gameDelta));
            player.misc.totalPointsInSimplify = player.misc.totalPointsInSimplify.add(player.misc.pps.times(gameDelta));
            getProgress();
            progressBar = Decimal.clamp(progressBar, 0, 1);
            getChalEffects();
            for (let comp = 1; comp <= 8; ++comp) {
                COMP_FUNCTIONS.updateMulti(comp);
                COMP_FUNCTIONS.updateCost(comp);
                COMP_FUNCTIONS.updateAmount(comp, calcCompxPerSecond(comp).times(gameDelta));
            }

            if (timeStamp > lastSave + saveTime) {
                console.log(saveTheFrickingGame());
                lastSave = timeStamp;
            }

            // display
            document.getElementById("progressBar1").innerText = progressBarText;
            document.getElementById("progressBar1").style.width = `calc(${progressBar.toNumber() * 100}% - 20px)`;
            document.getElementById("progBarBase").style.width = `calc(100% - 20px)`;
            updateHTML();
            drawing();
        } catch (e) {
            console.error(e)
            document.getElementById("points").innerHTML = (e)
            document.getElementById("fps").innerHTML = "FPS: ;~; (Look in the console to see what happened, and especially look at the call stack) <br> How to bring up console on... <br>   - Firefox, Chrome: Right-Click -> Inspect"
            console.log("Game saving has been paused. It's likely that your save is broken or the programmer (TearonQ) is an idiot? Don't call them that, though.")
            return;
        }
        // do not change order at all
        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
});
