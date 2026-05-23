"use strict";

class Element {
    constructor(el) {
        this.id = typeof el == "string" ? el : el.id;
        this.el = document.getElementById(this.id);
        if (this.el === null) {
            throw new Error(`${el} could not be found in the DOM!`)
        }
    }

    get style() {
        return this.el.style;
    }

    setTxt(txt) {
        if (this.el.textContent === txt) { return; }
        this.el.textContent = txt;
    }
    static setTxt(id, txt) {
        new Element(id).setTxt(txt);
    }

    setHTML(html) {
        if (this.el.innerHTML === html) { return; }
        this.el.innerHTML = html;
    }
    static setHTML(id, html) {
        new Element(id).setHTML(html);
    }

    addHTML(html) {
        this.el.innerHTML += html;
    }
    static addHTML(id, html) {
        new Element(id).addHTML(html);
    }

    setDisplay(bool) {
        this.el.style.display = bool ? "" : "none";
    }
    static setDisplay(id, bool) {
        new Element(id).setDisplay(bool);
    }

    setFlexDisplay(bool) {
        this.el.style.display = bool ? "flex" : "none";
    }
    static setFlexDisplay(id, bool) {
        new Element(id).setFlexDisplay(bool);
    }

    addClass(name) {
        this.el.classList.add(name);
    }
    static addClass(id, name) {
        new Element(id).addClass(name);
    }

    removeClass(name) {
        this.el.classList.remove(name);
    }
    static removeClass(id, name) {
        new Element(id).removeClass(name);
    }

    clearClasses() {
        this.el.className = "";
    }
    static clearClasses(id) {
        new Element(id).clearClasses();
    }

    setClasses(data) {
        this.clearClasses();
        let list = Object.keys(data).filter(x => data[x]);
        for (let i = 0; i < list.length; i++) this.addClass(list[i]);
    }
    static setClasses(id, data) {
        new Element(id).setClasses(data);
    }

    setVisible(bool) {
        var s = this.el.style
        s.visibility = bool ? "visible" : "hidden";
        s.opacity = bool ? 1 : 0
        s.pointerEvents = bool ? "all" : "none"
    }
    static setVisible(id, bool) {
        new Element(id).setVisible(bool);
    }

    setOpacity(value) {
        this.el.style.opacity = value;
    }
    static setOpacity(id, value) {
        new Element(id).setOpacity(value);
    }

    changeStyle(type, input) {
        this.el.style[type] = input;
    }
    static changeStyle(id, type, input) {
        new Element(id).changeStyle(type, input);
    }

    isChecked() {
        return this.el.checked;
    }
    static isChecked(id) {
        return new Element(id).isChecked();
    }

    static allFromClass(name) {
        return Array.from(document.getElementsByClassName(name)).map(x => new Element(x.id));
    }

    setAttr(name, input) {
        this.el.setAttribute(name, input);
    }
    static setAttr(id, name, input) {
        new Element(id).setAttribute(name, input);
    }

    setTooltip(input) {
        this.setAttr("tooltip-html", input);
    }
    static setTooltip(id, input) {
        new Element(id).setAttr("tooltip-html", input);
    }

    setSize(h, w) {
        this.el.style["min-height"] = h + "px";
        this.el.style["min-width"] = w + "px";
    }
    static setSize(id, h, w) {
        new Element(id).setSize(h, w);
    }
}

let el = x => document.getElementById(x);
const toHTMLvar = x => html[x] = new Element(x)

function setupHTML() {
    setupHTMLTabs();
    setupHTMLComPs();
    setupHTMLOther();
    setupHTMLSimplify();
}


function setupHTMLTabs() {
    toHTMLvar(`tab_comp`);
    toHTMLvar(`tab_other`);
    toHTMLvar(`tab_simplify`);
    html[`tab_comp`].setClasses({ font: true, defaultTab: true, defaultButton: true });
    html[`tab_other`].setClasses({ font: true, defaultTab: true, defaultButton: true });
    html[`tab_simplify`].setClasses({ font: true, defaultSimplifyTab: true, defaultButton: true });

}

function setupHTMLComPs() {
    let el = new Element("comp");
    let table = "";
    table += `<button id="maxAll" onclick="maxAllComPS();" class="defaultTab defaultButton font">Max All</button>`;
    for (let comp = 1; comp < 9; ++comp) {
        table += `
            <div id="gen-comp${comp}" class="flex-horizontal" style="width: 100%">
                <div class="flex-vertical" style="align-items: flex-start; width: 70%; margin: 0px">
                    <div class="flex-horizontal font" style="justify-content: flex-start; margin: 0px">
                        <p style="margin: 0px" id="gen-comp${comp}-name">ComP${comp}:&nbsp;</p>
                        <p style="margin: 0px" id="gen-comp${comp}-amount">0, </p>&nbsp;
                        <p style="margin: 0px" id="gen-comp${comp}-multi">1x </p>
                    </div>
                    <p style="margin: 0px" id="gen-comp${comp}-mbd" class="compMultBreakdown font"></p>
                </div>
                <div class="flex-horizontal" style="justify-content: flex-end; width: 30%; margin: 0px;">
                    <button id="gen-comp${comp}-cost" style="margin: 2px; text-align: center; height: 24px;" onclick="buyComp(${comp});" class="compNo buttonRight defaultButton font Scaled0">Cost: null</button>
                    <button id="gen-comp${comp}-breakdown" style="margin: 2px; text-align: center; height: 24px;" onclick="expandComPMULTI(${comp});" class="ceMul defaultButton font">Show factors</button>
                </div>
            </div>
            `;
    }
    el.setHTML(table);
    html["comp"] = new Element(`comp`);
    for (let comp = 1; comp <= 8; ++comp) {
        toHTMLvar(`gen-comp${comp}`);
        toHTMLvar(`gen-comp${comp}-name`);
        toHTMLvar(`gen-comp${comp}-amount`);
        toHTMLvar(`gen-comp${comp}-multi`);
        toHTMLvar(`gen-comp${comp}-cost`);
        toHTMLvar(`gen-comp${comp}-breakdown`);
        toHTMLvar(`gen-comp${comp}-mbd`);
    }
    toHTMLvar(`maxAll`);
}

function changeLog() {
    let changeLog = ""
    changeLog += "<br><changeLog><p class='date0'> v0.0.0 - Apr 5, 2023 </p>";
    changeLog += "<br> Progress on TTS Challenges #1";
    changeLog += "<br> Added a new mode 'softcapped', currently unavaliable as an option";

    document.getElementById("changeLog").innerHTML = changeLog;
}

function setupHTMLOther() {
    toHTMLvar(`other`);
    toHTMLvar(`tab_other_stat`);
    toHTMLvar(`tab_other_changeLog`);
    toHTMLvar(`tab_other_note`);
    toHTMLvar(`changeLog`);
    let changeLog = ""

    html[`changeLog`].setHTML(changeLog)
    html[`tab_other_stat`].setClasses({ font: true, defaultTab: true, defaultButton: true });
    html[`tab_other_changeLog`].setClasses({ font: true, defaultTab: true, defaultButton: true });
    html[`tab_other_note`].setClasses({ font: true, defaultTab: true, defaultButton: true });
}

function setupHTMLSimplify() {
    setupHTMLSimplifyGeneral();
    setupHTMLSimplifyXP();
    setupHTMLSimplifyChal();
}

function setupHTMLSimplifyGeneral() {
    toHTMLvar(`simplify`);
    toHTMLvar(`simplify_tab_simplify`);
    toHTMLvar(`simplify_tab_tts`);
    toHTMLvar(`simplify_tab_simpUpg`);
    toHTMLvar(`SER`);
    toHTMLvar(`SEUPG1`);
    toHTMLvar(`simpEnergy`);
    toHTMLvar(`simpTabs`);
    html[`simplify_tab_simplify`].setClasses({ font: true, defaultButton: true });
    html[`simplify_tab_tts`].setClasses({ font: true, defaultButton: true });
    html[`SER`].setClasses({ font: true, defaultButton: true, defaultSimplifyTab: true });
    html[`SEUPG1`].setClasses({ font: true, defaultButton: true, defaultSimplifyTab: true });
    html[`simplify_tab_simpUpg`].setClasses({ font: true, defaultButton: true, defaultSimplifyTab: true });
}

function setupHTMLSimplifyXP() {
    let el = new Element("simpExP");
    let table = "";
    for (let i = 0; i < 4; i++) {
        table += `
            <span id="simpEXP${i + 1}" class="font"></span>
            <button id="simpEXP${i + 1}b" class="simplify${i + 1}b defaultButton font" onclick="simpExPAllocate(${i});" border: "2px solid ${simplifyXPColor[i]}" color: "${simplifyXPColor[i]}">Allocate all SE into ${simplifyXPTypes[i]}.</button>
            <br>
        `;
    }
    el.setHTML(table);
    html["simpExP"] = el;
    for (let i = 0; i < 4; i++) {
        toHTMLvar(`simpEXP${i + 1}`);
        toHTMLvar(`simpEXP${i + 1}b`);
    }
}

function setupHTMLSimplifyChal() {
    let el = new Element("ttsChals");
    let table = "";
    for (let chall = 0; chall < 4; chall++) {
        table += `
        <div id="simpChal${chall}">
            <p id="simpChal${chall}-type" class="simpChText">${simplifyChalTypes[chall]} Challenges</p>
            <button id="simpChal${(4 * chall)}-id" onclick="simpChalSelect(${(4 * chall)});" class="simpChal font simpChalIncomplete defaultButton">${(4 * chall)}</button>
            <button id="simpChal${(4 * chall) + 1}-id" onclick="simpChalSelect(${(4 * chall) + 1});" class="simpChal font simpChalIncomplete defaultButton">${(4 * chall) + 1}</button>
            <button id="simpChal${(4 * chall) + 2}-id" onclick="simpChalSelect(${(4 * chall) + 2});" class="simpChal font simpChalIncomplete defaultButton">${(4 * chall) + 2}</button>
            <button id="simpChal${(4 * chall) + 3}-id" onclick="simpChalSelect(${(4 * chall) + 3});" class="simpChal font simpChalIncomplete defaultButton">${(4 * chall) + 3}</button>
        </div>
        `;
    }
    el.setHTML(table);
    html["ttsChals"] = el;
    for (let chall = 0; chall < 4; chall++) {
        toHTMLvar(`simpChal${chall}`);
        toHTMLvar(`simpChal${(4 * chall)}-id`);
        toHTMLvar(`simpChal${(4 * chall) + 1}-id`);
        toHTMLvar(`simpChal${(4 * chall) + 2}-id`);
        toHTMLvar(`simpChal${(4 * chall) + 3}-id`);
    }
    toHTMLvar("ttsChal");
    toHTMLvar("challengeStart1");
    toHTMLvar(`completeChallenge1`);
    toHTMLvar(`ttsChalArea`);

    updateSimpChallengeHTML();
}

function updateHTML() {
    updateTabHTML();
    updateCompHTML();
    updateOtherHTML();
    updateSimpHTML();
}

function updateTabHTML() {
    html[`tab_simplify`].setDisplay(player.misc.totalPoints.gte(1e12));
}

function updateOtherHTML() {
    html[`other`].setDisplay(tab[0] == 1);
    if (tab[0] !== 1) {
        return;
    }
}

function updateCompHTML() {
    html['comp'].setDisplay(tab[0] == 0);
    if (tab[0] !== 0) {
        return;
    }
    if (player.comps.compVisible <= 8 && player.misc.points.gte(player.comps.array[player.comps.compVisible].cost.mul(0.1)) || player.comps.compVisible == 1) {
        player.comps.compVisible++;
    }
    for (let comp = 1; comp <= 8; ++comp) {
        html[`gen-comp${comp}`].setDisplay(comp < player.comps.compVisible);
        let tr = calcCompxPerSecond(comp).add(player.comps.array[comp].amount).pow(player.comps.compExp).sub(player.comps.array[comp].amount.pow(player.comps.compExp));
        const perSecondText = " (" + format(tr, tr.lt(10) ? 1 : 0) + "/s),";
        const boughtText = " [ " + format(player.comps.array[comp].bought) + " ]    ";
        const text = tr.gt(0) ? perSecondText + boughtText : boughtText;
        html[`gen-comp${comp}-amount`].setTxt(format(player.comps.array[comp].trueAmount) + " " + text);
        html[`gen-comp${comp}-cost`].setTxt("Cost: " + format(player.comps.array[comp].cost));
        let can = player.misc.points.gte(player.comps.array[comp].cost);
        html[`gen-comp${comp}-cost`].setClasses({ font: true, defaultButton: true, compNo: !can, compYes: can });
        html[`gen-comp${comp}-cost`].addClass(`Scaled0`);
        for (let i = 0; i < Object.keys(player.scaling.ComPs).length; ++i) {
            if (player.comps.array[comp].trueCost.gte(player.scaling.ComPs[i].start)) {
                html[`gen-comp${comp}-cost`].removeClass(`Scaled${i}`);
                html[`gen-comp${comp}-cost`].addClass(`Scaled${i + 1}`);
            }
        }
        html[`gen-comp${comp}-multi`].setTxt(format(player.comps.array[comp].multi) + "x ");
        tr = (expandMultComP == comp) ? ((expandMultComPType == 0) ? player.comps.array[comp].multiFactors : player.comps.array[comp].costFactors) : "";
        html[`gen-comp${comp}-mbd`].setClasses({ font: true, compMultBreakdown: expandMultComPType == 0, compCostBreakdown: expandMultComPType == 1 });
        html[`gen-comp${comp}-breakdown`].setClasses({ font: true, defaultButton: true, ceMul: expandMultComPType == 0, ceCost: expandMultComPType == 1 });
        html[`gen-comp${comp}-mbd`].setHTML(tr);
    }
    html[`maxAll`].setDisplay(!(player.misc.inChallenge.includes("simp0") || player.misc.inChallenge.includes("simp1") || player.misc.inChallenge.includes("simp2") || player.misc.inChallenge.includes("simp3") || player.misc.inChallenge.includes("simp8") || player.misc.inChallenge.includes("simp11")));
}

function updateSimpHTML() {
    html['simplify'].setDisplay(tab[0] == 2);
    html['simpTabs'].setDisplay(player.simplify.upgrades.simplifyMainUPG >= 2);
    html['simpExP'].setDisplay(player.simplify.upgrades.simplifyMainUPG >= 1 && tab[0] == 2 && tab[1] == 0);
    html['ttsChal'].setDisplay(tab[0] == 2 && tab[1] == 1);

    html['simplify_tab_tts'].setDisplay(player.simplify.upgrades.simplifyMainUPG >= 2);
    html['simplify_tab_simpUpg'].setDisplay(player.simplify.upgrades.simplifyMainUPG >= 3);
    if (tab[0] !== 2) {
        return;
    }
    html["simpEnergy"].setTxt("You have " + format(player.simplify.main.simplifyEnergy) + " Simplify Energy.");
    html["SEUPG1"].setTxt(simpUpg1Desc[player.simplify.upgrades.simplifyMainUPG + 1] + " Cost: " + format(simpUPG1Cost()) + " Simplify Energy");
    html["SER"].setClasses({ font: true, defaultButton: true, defaultSimplifyTab: true, inSimpChal: player.misc.inSChallenge && player.misc.points.gte(player.simplify.main.simplifyReq) });
    let txt = `${(player.misc.totalPointsInSimplify.gte(player.simplify.main.simplifyReq)) ? "You will gain " + format(getSimplifyGain().floor()) + " Simplify Energy. " : "Reset your current simplify run. "} `;
    if (getSimplifyGain().lte(10000)) {
        txt += `[ Next at ${format(player.simplify.main.SEExp.sub(1).mul(getSimplifyGain().floor().add(3)).pow(player.simplify.main.simplifyReq.log(player.simplify.main.SEExp).sub(new Decimal(10).log(player.simplify.main.SEExp))).mul(10).sub(player.misc.totalPointsInSimplify))} ]`;
    } else {
        txt += `[ Next OoM at ${format(player.simplify.main.SEExp.sub(1).mul(Decimal.pow(10, getSimplifyGain().log(10).ceil()).add(2)).pow(player.simplify.main.simplifyReq.log(player.simplify.main.SEExp).sub(new Decimal(10).log(player.simplify.main.SEExp))).mul(10))} ]`;
    }
    html["SER"].setTxt(txt)
    switch (tab[1]) {
        case 0:
            if (player.simplify.upgrades.simplifyMainUPG < 1) { break; }
            for (let i = 0; i < 4; i++) {
                html[`simpEXP${i + 1}`].setTxt(`You have ${format(player.simplify[simplifyXPTypes[i]].allocated)} SE allocated to ${format(player.simplify[simplifyXPTypes[i]].trueValue, 2)} ${simplifyXPTypes[i]}, ${simplifyXPDesc[i]}${format(player.simplify[simplifyXPTypes[i]].effect, 2)}.`);
            }
            break;
        case 1:
            html[`challengeStart1`].setSize(0, player.misc.totalPointsInSimplify.gte(player.simplify.main.simplifyReq) && player.misc.inSChallenge ? 180 : 360);
            html[`completeChallenge1`].setDisplay(player.misc.totalPointsInSimplify.gte(player.simplify.main.simplifyReq) && player.misc.inSChallenge);
            break;
    }
}

function updateSimpChallengeHTML() {
            html[`challengeStart1`].setClasses({ font: true, challengeStart: true, startChallenge: !player.misc.inSChallenge, exitChallenge: player.misc.inSChallenge, defaultButton: true });
            html[`challengeStart1`].setTxt(player.misc.inSChallenge ? "Exit Challenge" : "Start Challenge");
            html[`completeChallenge1`].setClasses({ font: true, challengeStart: true, completeChallenge: true, defaultButton: true });
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
                    html[`simpChal${4 * i + j}-id`].setClasses({ font: true, simpChal: true, simpChalIncomplete: !c[4 * i + j], simpChalComplete: c[4 * i + j], inSimpChal: player.misc.inChallenge.includes(`simp${4 * i + j}`), defaultButton: true })
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
                html[`ttsChalArea`].setClasses({ font: true, simpChalDesc: true });
                html[`ttsChalArea`].setHTML(`${simplifyChalTypes[Math.floor(simpChalSelected / 4)]} Challenge ${(simpChalSelected % 4) + 1}: <br> ${simpChal.simpChalDesc[simpChalSelected + 1]} <br> <br> Reward: ${simpChal.simpChalReward[simpChalSelected + 1]}`);
            }
}