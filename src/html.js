for (let comp = 1; comp <= 8; ++comp)
{
    let div = document.createElement("div");
    div.id = "gen-comp" + comp;
    document.getElementById("comp").appendChild(div);

    let name = document.createElement("p");
    name.innerHTML = "ComP" + comp + ": ";
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
    div.appendChild(buyButton);

    //document.getElementById("comp").appendChild(document.createElement("br"));
}