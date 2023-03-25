const brTag = document.createElement("br");

for (let comp = 1; comp <= 8; ++comp)
{
    let name = document.createElement("span");
    
    name.innerHTML = "ComP" + comp + ": ";
    name.id = "gen-comp" + comp + "-name";
    document.getElementById("comp").appendChild(name);

    let amount = document.createElement("span");
    amount.id = "gen-comp" + comp + "-amount";
    document.getElementById("comp").appendChild(amount);

    let multi = document.createElement("span");
    multi.id = "gen-comp" + comp + "-multi";
    document.getElementById("comp").appendChild(multi);

    let buyButton = document.createElement("button");
    buyButton.id = "gen-comp" + comp + "-cost";
    buyButton.onclick = () => buyComp(comp);
    document.getElementById("comp").appendChild(buyButton);

    document.getElementById("comp").appendChild(document.createElement("br"));
}