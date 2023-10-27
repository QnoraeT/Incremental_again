"use strict";

function pad(num, length) {
    while (num.length < length) {
        num = "0" + num;
    }
    return num;
}

function colorChange(color, val, sat) { // #ABCDEF format only
    if (color[0] === "#") { color = color.slice(1); }
    color = parseInt(color, 16);
    let r = ((color >> 16) % 256) / 256;
    let g = ((color >> 8) % 256) / 256;
    let b = (color % 256) / 256;
    r = 1 - ((1 - r) * sat);
    g = 1 - ((1 - g) * sat);
    b = 1 - ((1 - b) * sat);
    r = Math.min(255, r * val * 256);
    g = Math.min(255, g * val * 256);
    b = Math.min(255, b * val * 256);
    return "#" + pad(Math.floor(r).toString(16), 2)
        + pad(Math.floor(g).toString(16), 2)
        + pad(Math.floor(b).toString(16), 2);
}

function mixColor(color, nextColor, type, time) {
    if (color[0] === "#") { color = color.slice(1); }
    color = parseInt(color, 16)
    if (nextColor[0] === "#") { nextColor = nextColor.slice(1); }
    nextColor = parseInt(nextColor, 16);
    let r = ((color >> 16) % 256) / 256;
    let g = ((color >> 8) % 256) / 256;
    let b = (color % 256) / 256;
    let lr = ((nextColor >> 16) % 256) / 256;
    let lg = ((nextColor >> 8) % 256) / 256;
    let lb = (nextColor % 256) / 256;
    r = lerp(time, r, lr, type) * 256;
    g = lerp(time, g, lg, type) * 256;
    b = lerp(time, b, lb, type) * 256;
    return "#" + pad(Math.floor(r).toString(16), 2)
        + pad(Math.floor(g).toString(16), 2)
        + pad(Math.floor(b).toString(16), 2);
}

function gRC(time, val, sat) {
    let r = 0;
    let g = 0;
    let b = 0;
    let t = time % 1;
    let s = Math.floor(time) % 6;
    switch (s) {
        case 0:
            r = 1;
            g = t;
            break;
        case 1:
            r = 1 - t;
            g = 1;
            break;
        case 2:
            g = 1;
            b = t;
            break;
        case 3:
            g = 1 - t;
            b = 1;
            break;
        case 4:
            b = 1;
            r = t;
            break;
        case 5:
            b = 1 - t;
            r = 1;
            break;
        default:
            throw new Error("Wtf!! Why is there an invalid number?  [" + s + "]");
    }
    r = 1 - ((1 - r) * sat);
    g = 1 - ((1 - g) * sat);
    b = 1 - ((1 - b) * sat);
    r = r * val * 255;
    g = g * val * 255;
    b = b * val * 255;
    return "#" + pad(Math.round(r).toString(16), 2)
        + pad(Math.round(g).toString(16), 2)
        + pad(Math.round(b).toString(16), 2);
}

function clamp(num, min, max) { // why isn't this built in
    return Math.min(Math.max(num, min), max);
}

function lerp(t, s, e, type, p) {
    if (isNaN(t)) {
        throw new Error(`malformed input [LERP]: ${t}, expecting f64`)
    }
    t = clamp(t, 0, 1);
    if (t === 0) {
        return s;
    }
    if (t === 1) {
        return e;
    }
    switch (type) {
        case "QuadIn":
            t = t * t;
            break;
        case "QuadOut":
            t = 1.0 - ((1.0 - t) * (1.0 - t));
            break;
        case "CubeIn":
            t = t * t * t;
            break;
        case "CubeOut":
            t = 1.0 - ((1.0 - t) * (1.0 - t) * (1.0 - t));
            break;
        case "Smooth":
            t = 6 * (t ** 5) - 15 * (t ** 4) + 10 * (t ** 3);
            break;
        case "ExpSCurve":
            t = (Math.tanh(p * Math.tan((t + 1.5 - ((t - 0.5) / 1e9)) * Math.PI)) + 1) / 2;
            break;
        case "Sine":
            t = Math.sin(t * Math.PI / 2) ** 2;
            break;
        case "Expo":
            if (p > 0) {
                t = Math.coth(p / 2) * Math.tanh(p * t / 2);
            } else if (p < 0) {
                t = 1.0 - Math.coth(p / 2) * Math.tanh(p * (1.0 - t) / 2);
            }
            break;
        default:
            break;
    }
    return (s * (1 - t)) + (e * t);
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function intRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function scale(type, amt, inv, start, pow, powScale, change) {
    if (amt.lt(start)) {
        return [amt, new Decimal(1)]
    }
    let temp = amt;
    let str = Decimal.pow(powScale, pow);
    switch (type) {
        case "P":
            if (!inv) {
                temp = amt.div(start).pow(str).sub(1).mul(start).div(str).add(start)
            } else {
                temp = amt.sub(start).mul(str).div(start).add(1).root(str).mul(start)
            }
            break;
        case "EP":
            if (!inv) {
                temp = Decimal.pow(start, amt.log(start).pow(str).sub(1).div(str).add(1))
            } else {
                temp = Decimal.pow(start, amt.log(start).sub(1).mul(str).add(1).root(str))
            }
            break;
        case "E":
            if (str.lt(1)) {
                console.warn("type E scaling should not be used with strength lower than 1! (using STRENGTH^x)")
            }
            if (!inv) {
                temp = amt.mul(Decimal.pow(str, amt.div(start).sub(1)))
            } else {
                temp = amt.mul(str).mul(str.ln()).div(start).lambertw().mul(start).div(str.ln())
            }
            break;
        default:
            console.warn(`type ${type} seems to not exist?`)
    }

    switch (change) {
        case 0:
            change = amt.div(temp) // Due to people getting bored, your popularity is decreased by /194.430!
            break;
        case 1:
            change = temp.div(amt) // Super scale
            break;
        case 2:
            change = temp.log(amt) // Due to Massive Meme Overflow, your memes are raised to the ^0.10690!
            break;
        case 3:
            change = amt.log(temp) // Due to someone being clumsy, your held items are rooted by 7.18920!
            break;
        default:
            console.warn(`${change} doesn't seem to be valid.`)
    }
    return [temp, change]
}

function altFactorial(input) {
    if (input.lt(2)) return Decimal.factorial(input)
    if (input.layer >= 2) return Decimal.exp(input)
    if (input.layer === 1) return Decimal.exp(input.mul(input.ln().sub(1)))
    let r = input
    let i = input.mag
    let t = 1
    r = Decimal.div(r, Math.E).pow(r).mul(Decimal.mul(2 * Math.PI, r).root(2))
    t += 1 / (12 * (i))
    t += 1 / (288 * (i ** 2))
    t -= 139 / (51840 * (i ** 3))
    t -= 571 / (2488320 * (i ** 4))
    t += 163879 / (209018880 * (i ** 5))
    t += 5246819 / (75246796800 * (i ** 6))
    return Decimal.mul(r, t)
}