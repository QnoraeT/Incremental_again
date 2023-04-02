for (let comp = 1; comp <= 8; ++comp)
{
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
    buyButton.classList.add("Unscaled");
    buyButton.classList.add("buttonRight");
    div.appendChild(buyButton);

    let button2 = document.createElement("button");
    button2.id = "gen-comp" + comp + "-breakdown";
    button2.onclick = () => expandComPMULTI(comp);
    button2.class = "ceMul";
    button2.classList.add("ceMul");
    div.appendChild(button2);

    let mbreakdown = document.createElement("p");
    mbreakdown.id = "gen-comp" + comp + "-mbd";
    mbreakdown.class = "text";
    mbreakdown.classList.add("text");
    mbreakdown.classList.add("compMultBreakdown");
    div.appendChild(mbreakdown);

    //document.getElementById("comp").appendChild(document.createElement("br"));
}