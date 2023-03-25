for (let comp = 1; comp <= 8; ++comp)
{
    let name = document.createElement("p");
    name.innerHTML = "ComP" + comp + ": ";
    name.id = "gen-comp" + comp + "-name";
    name.classList.add("text");
    document.getElementById("comp").appendChild(name);

    let amount = document.createElement("p");
    amount.id = "gen-comp" + comp + "-amount";
    amount.classList.add("text");
    document.getElementById("comp").appendChild(amount);

    let multi = document.createElement("p");
    multi.id = "gen-comp" + comp + "-multi";
    multi.class = "text";
    multi.classList.add("text");
    document.getElementById("comp").appendChild(multi);

    let buyButton = document.createElement("button");
    buyButton.id = "gen-comp" + comp + "-cost";
    buyButton.onclick = () => buyComp(comp);
    document.getElementById("comp").appendChild(buyButton);

    document.getElementById("comp").appendChild(document.createElement("br"));
}