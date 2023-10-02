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
    toHTMLvar(`tab_comp`)
    toHTMLvar(`tab_other`)
    toHTMLvar(`tab_simplify`)
    html[`tab_comp`].setClasses({ defaultTab: true, defaultButton: true })
    html[`tab_other`].setClasses({ defaultTab: true, defaultButton: true })
    html[`tab_simplify`].setClasses({ defaultSimplifyTab: true, defaultButton: true })

}

function setupHTMLComPs() {
    let el = new Element("comp")
    let table = ""
    table += `<button id="maxAll" onclick="maxAllComPS();" class="defaultTab defaultButton" style="display: inherit;">Max All</button>`
    for (let comp = 1; comp < 9; ++comp) {
        table += `
            <div id="gen-comp${comp}" style="display: none;">
                <p id="gen-comp${comp}-name" class="text"> ComP${comp}: </p>
                <p id="gen-comp${comp}-amount" class="text">0, </p>
                <p id="gen-comp${comp}-multi" class="text">1x </p>
                <button id="gen-comp${comp}-cost" onclick="buyComp(${comp});" class="compNo buttonRight defaultButton Scaled0">Cost: ${format(player.comps.array[comp].cost, true, 3)}</button>
                <button id="gen-comp${comp}-breakdown" onclick="expandComPMULTI(${comp});" class="ceMul defaultButton">Show factors</button>
                <p id="gen-comp${comp}-mbd" class="text compMultBreakdown"></p>
            </div>
            `
    }
    el.setHTML(table)
    html["comp"] = new Element(`comp`)
    for (let comp = 1; comp <= 8; ++comp) {
        toHTMLvar(`gen-comp${comp}`)
        toHTMLvar(`gen-comp${comp}-name`)
        toHTMLvar(`gen-comp${comp}-amount`)
        toHTMLvar(`gen-comp${comp}-multi`)
        toHTMLvar(`gen-comp${comp}-cost`)
        toHTMLvar(`gen-comp${comp}-breakdown`)
        toHTMLvar(`gen-comp${comp}-mbd`)
    }
    toHTMLvar(`maxAll`)
}

function setupHTMLOther() {
    toHTMLvar(`other`)
    toHTMLvar(`tab_other_stat`)
    toHTMLvar(`tab_other_changeLog`)
    html[`tab_other_stat`].setClasses({ defaultTab: true, defaultButton: true })
    html[`tab_other_changeLog`].setClasses({ defaultTab: true, defaultButton: true })
}

function setupHTMLSimplify() {
    setupHTMLSimplifyGeneral();
    setupHTMLSimplifyXP();
    setupHTMLSimplifyChal();
}

function setupHTMLSimplifyGeneral() {
    toHTMLvar(`simplify`)
    toHTMLvar(`simplify_tab_simplify`)
    toHTMLvar(`simplify_tab_tts`)
    toHTMLvar(`SER`)
    toHTMLvar(`SEUPG1`)
    toHTMLvar(`simpEnergy`)
    toHTMLvar(`simpTabs`)
    html[`simplify_tab_simplify`].setClasses({ defaultButton: true })
    html[`simplify_tab_tts`].setClasses({ defaultButton: true })
    html[`SER`].setClasses({ defaultButton: true, defaultSimplifyTab: true })
    html[`SEUPG1`].setClasses({ defaultButton: true, defaultSimplifyTab: true })
}

function setupHTMLSimplifyXP() {
    let el = new Element("simpExP")
    let table = ""
    for (let i = 0; i < 4; i++) {
        table += `
        <span id="simpEXP${i + 1}"></span>
        <button id="simpEXP${i + 1}b" class="simplify${i + 1}b defaultButton" onclick="simpExPAllocate(${i});" border: "2px solid ${simplifyXPColor[i]}" color: "${simplifyXPColor[i]}">Allocate all SE into ${simplifyXPTypes[i]}.</button>
        <br>
        `
    }
    el.setHTML(table)
    html["simpExP"] = el
    for (let i = 0; i < 4; i++) {
        toHTMLvar(`simpEXP${i + 1}`)
        toHTMLvar(`simpEXP${i + 1}b`)
    }
}

function setupHTMLSimplifyChal() {
    let el = new Element("ttsChals")
    let table = ""
    for (let chall = 0; chall < 4; chall++) {
        table += `
        <div id="simpChal${chall}">
            <p id="simpChal${chall}-type" class="simpChText">${simplifyChalTypes[chall]} Challenges</p>
            <button id="simpChal${(4 * chall)}-id" onclick="simpChalSelect(${(4 * chall)});" class="simpChal simpChalIncomplete defaultButton">${(4 * chall)}</button>
            <button id="simpChal${(4 * chall) + 1}-id" onclick="simpChalSelect(${(4 * chall) + 1});" class="simpChal simpChalIncomplete defaultButton">${(4 * chall) + 1}</button>
            <button id="simpChal${(4 * chall) + 2}-id" onclick="simpChalSelect(${(4 * chall) + 2});" class="simpChal simpChalIncomplete defaultButton">${(4 * chall) + 2}</button>
            <button id="simpChal${(4 * chall) + 3}-id" onclick="simpChalSelect(${(4 * chall) + 3});" class="simpChal simpChalIncomplete defaultButton">${(4 * chall) + 3}</button>
        </div>
        `
    }
    el.setHTML(table)
    html["ttsChals"] = el
    for (let chall = 0; chall < 4; chall++) {
        toHTMLvar(`simpChal${chall}`)
        toHTMLvar(`simpChal${(4 * chall)}-id`)
        toHTMLvar(`simpChal${(4 * chall) + 1}-id`)
        toHTMLvar(`simpChal${(4 * chall) + 2}-id`)
        toHTMLvar(`simpChal${(4 * chall) + 3}-id`)
    }
    toHTMLvar("ttsChal")
    toHTMLvar("challengeStart1")
    toHTMLvar(`completeChallenge1`)
    toHTMLvar(`ttsChalArea`)
}

function updateHTML() {
    updateTabHTML();
    updateCompHTML();
    updateOtherHTML();
    updateSimpHTML();
}

function updateTabHTML() {
    html[`tab_simplify`].setDisplay(player.misc.totalPoints.gte(1e12))
}

function updateOtherHTML() {
    html[`other`].setDisplay(tab[0] == 1)
    if (tab[0] !== 1) {
        return;
    }
}

function updateCompHTML() {
    html['comp'].setDisplay(tab[0] == 0)
    if (tab[0] !== 0) {
        return;
    }
    if (compVisible <= 8 && player.misc.points.gte(player.comps.array[compVisible].cost.mul(0.1)) || compVisible == 1) {
        html[`gen-comp${compVisible}`].setDisplay(true);
        compVisible++;
    }
    for (let comp = 1; comp <= 8; ++comp) {
        let tr = calcCompxPerSecond(comp).add(player.comps.array[comp].amount).pow(player.comps.compExp).sub(player.comps.array[comp].amount.pow(player.comps.compExp))
        const perSecondText = " (" + format(tr, false, tr < 10 ? 1 : 0) + "/s),";
        const boughtText = " [ " + format(player.comps.array[comp].bought) + " ]    "
        const text = tr.gt(0) ? perSecondText + boughtText : boughtText;
        html[`gen-comp${comp}-amount`].setTxt(format(player.comps.array[comp].trueamount, false, 3) + " " + text)
        html[`gen-comp${comp}-cost`].setTxt("Cost: " + format(player.comps.array[comp].cost, true, 3))
        let can = player.misc.points.gte(player.comps.array[comp].cost)
        html[`gen-comp${comp}-cost`].setClasses({ buttonRight: true, defaultButton: true, compNo: !can, compYes: can })
        html[`gen-comp${comp}-cost`].addClass(`Scaled0`)
        for (let i = 0; i < Object.keys(player.scaling.ComPs).length; ++i) {
            if (player.comps.array[comp].trueCost.gte(player.scaling.ComPs[i].start)) {
                html[`gen-comp${comp}-cost`].removeClass(`Scaled${i}`)
                html[`gen-comp${comp}-cost`].addClass(`Scaled${i + 1}`)
            }
        }
        html[`gen-comp${comp}-multi`].setTxt(format(player.comps.array[comp].multi, true, 3) + "x ")
        tr = (expandMultComP == comp) ? ((expandMultComPType == 0) ? player.comps.array[comp].multiFactors : player.comps.array[comp].costFactors) : "";
        html[`gen-comp${comp}-mbd`].setClasses({ text: true, compMultBreakdown: expandMultComPType == 0, compCostBreakdown: expandMultComPType == 1 })
        html[`gen-comp${comp}-breakdown`].setClasses({ defaultButton: true, ceMul: expandMultComPType == 0, ceCost: expandMultComPType == 1 })
        html[`gen-comp${comp}-mbd`].setHTML(tr);
    }
    html[`maxAll`].setDisplay(!(player.misc.inChallenge.includes("simp0") || player.misc.inChallenge.includes("simp1") || player.misc.inChallenge.includes("simp2") || player.misc.inChallenge.includes("simp3") || player.misc.inChallenge.includes("simp8") || player.misc.inChallenge.includes("simp11")))
}

function updateSimpHTML() {
    html['simplify'].setDisplay(tab[0] == 2)
    html['simpTabs'].setDisplay(player.simplify.upgrades.simplifyMainUPG >= 2)
    html['simpExP'].setDisplay(player.simplify.upgrades.simplifyMainUPG >= 1 && tab[0] == 2 && tab[1] == 0)
    html['ttsChal'].setDisplay(tab[0] == 2 && tab[1] == 1)
    if (tab[0] !== 2) {
        return;
    }
    html["simpEnergy"].setTxt("You have " + format(player.simplify.main.simplifyEnergy, true) + " Simplify Energy.");
    html["SEUPG1"].setTxt(simpUpg1Desc[player.simplify.upgrades.simplifyMainUPG + 1] + " Cost: " + format(simpUPG1Cost(), false) + " Simplify Energy")
    html["SER"].setClasses({ defaultButton: true, defaultSimplifyTab: true, inSimpChal: player.misc.inSChallenge && player.misc.points.gte(player.simplify.main.simplifyReq) })
    let txt = `${(player.misc.points.gte(player.simplify.main.simplifyReq)) ? "You will gain " + format(getSimplifyGain().floor(), true) + " Simplify Energy. " : "Reset your current simplify run. "} `
    if (getSimplifyGain().lte(10000)) {
        txt += `[ Next at ${format(player.simplify.main.SEExp.sub(1).mul(getSimplifyGain().floor().add(3)).pow(player.simplify.main.simplifyReq.log(player.simplify.main.SEExp).sub(new Decimal(10).log(player.simplify.main.SEExp))).mul(10), true, 3, 3)} ]`
    } else {
        txt += `[ Next OoM at ${format(player.simplify.main.SEExp.sub(1).mul(Decimal.pow(10, getSimplifyGain().log(10).ceil()).add(2)).pow(player.simplify.main.simplifyReq.log(player.simplify.main.SEExp).sub(new Decimal(10).log(player.simplify.main.SEExp))).mul(10), true, 3, 3)} ]`
    }
    html["SER"].setTxt(txt)
    switch (tab[1]) {
        case 0:
            if (player.simplify.upgrades.simplifyMainUPG < 1) break;
            for (let i = 0; i < 4; i++) {
                html[`simpEXP${i + 1}`].setTxt(`You have ${format(player.simplify[simplifyXPTypes[i]].allocated, true)} SE allocated to ${format(player.simplify[simplifyXPTypes[i]].trueValue, true, 1)} ${simplifyXPTypes[i]}, ${simplifyXPDesc[i]}${format(player.simplify[simplifyXPTypes[i]].effect, true, 3)}.`)
            }
            break;
        case 1:
            html[`challengeStart1`].setSize(0, player.misc.totalPointsInSimplify.gte(player.simplify.main.simplifyReq) && player.misc.inSChallenge ? 180 : 360)
            html[`completeChallenge1`].setDisplay(player.misc.totalPointsInSimplify.gte(player.simplify.main.simplifyReq) && player.misc.inSChallenge)
            break;
    }
}
