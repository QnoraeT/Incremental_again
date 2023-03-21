let points = new Decimal(10);
let comp1Amount = new Decimal(0);
let comp1cost = new Decimal(10);

document.getElementById("gen-comp1-amount").innerHTML = comp1Amount;
document.getElementById("gen-comp1-cost").innerHTML = "Cost: " + comp1cost;

function buyComp1(event)
{
    if (points.gte(comp1cost))
    {
        points = points.minus(comp1cost);
        comp1Amount = comp1Amount.add(1);
        comp1cost = comp1cost.times(100);

        //update HTML
        document.getElementById("gen-comp1-amount").innerHTML = format(comp1Amount);
        document.getElementById("gen-comp1-cost").innerHTML = "Cost: " + format(comp1cost);
    }
}

function calcPointsPerSecond()
{
    let sum = new Decimal(0)

    sum = sum.add(comp1Amount.times(100));

    return sum;
}

{
    window.requestAnimationFrame(gameLoop);
    let oldTimeStamp = 0; 

    function gameLoop(timeStamp)
    {
        let delta = (timeStamp - oldTimeStamp) / 1000;
        const FPS = Math.round(1 / delta);

        points = points.add(calcPointsPerSecond().times(delta));
        document.getElementById("points").innerHTML = "Points: " + format(points, true);
        document.getElementById("fps").innerHTML = "FPS: " + FPS;

        oldTimeStamp = timeStamp;
        window.requestAnimationFrame(gameLoop);
    }
}
