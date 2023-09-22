"use strict";

class Element {
	constructor(el) {
		this.id = typeof el == "string" ? el : el.id;
		this.el = document.getElementById(this.id);
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

var el = x => document.getElementById(x);

for (let comp = 1; comp <= 8; ++comp) {
    let div = document.createElement("div");
    div.id = "gen-comp" + comp;
    document.getElementById("comp").appendChild(div);

    let name = document.createElement("p");
    name.innerHTML = "  ComP" + comp + ": ";
    name.id = "gen-comp" + comp + "-name";
    name.classList.add("text");
    div.appendChild(name);

    let amount = document.createElement("p");
    amount.id = "gen-comp" + comp + "-amount";
    amount.classList.add("text");
    div.appendChild(amount);

    let multi = document.createElement("p");
    multi.id = "gen-comp" + comp + "-multi";
    multi.class = "text";
    multi.classList.add("text");
    div.appendChild(multi);

    let buyButton = document.createElement("button");
    buyButton.id = "gen-comp" + comp + "-cost";
    buyButton.onclick = () => buyComp(comp);
    buyButton.class = "compNo";
    buyButton.classList.add("compNo");
    buyButton.classList.add("Scaled0");
    buyButton.classList.add("buttonRight");
    buyButton.classList.add("defaultButton");
    div.appendChild(buyButton);

    let button2 = document.createElement("button");
    button2.id = "gen-comp" + comp + "-breakdown";
    button2.onclick = () => expandComPMULTI(comp);
    button2.class = "ceMul";
    button2.classList.add("ceMul");
    button2.classList.add("defaultButton");
    div.appendChild(button2);

    let mbreakdown = document.createElement("p");
    mbreakdown.id = "gen-comp" + comp + "-mbd";
    mbreakdown.class = "text";
    mbreakdown.classList.add("text");
    mbreakdown.classList.add("compMultBreakdown");
    div.appendChild(mbreakdown);
}

for (let chall = 0; chall < 16;) {
    let div = document.createElement("div");
    div.id = "simpChal" + chall;
    document.getElementById("ttsChal").appendChild(div);

    let chtext = document.createElement("p");
    chtext.id = "simpChal" + chall + "-type";
    chtext.class = "simpChText";
    chtext.classList.add("simpChText");
    div.appendChild(chtext);

    for (let g = 0; g < 4; ++g) {
        let trueID = chall + g // such a stupid bug
        let challenge = document.createElement("button");
        challenge.id = "simpChal" + trueID + "-id";
        challenge.addEventListener('click', function() {
            simpChalSelect(trueID)
        });
        challenge.class = "simpChal";
        challenge.classList.add("simpChal");
        challenge.classList.add("simpChalIncomplete");
        challenge.classList.add("defaultButton");
        div.appendChild(challenge);
    }
    chall += 4
}
