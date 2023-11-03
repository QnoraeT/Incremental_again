"use strict";

const abbSuffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
                            "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg"];
const abbExp = 1e63

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function format(number, fixed, dec = 3, expdec = 3) {
    let n = new Decimal(number)
    if (n.lt(0)) return "-" + format(n.negate(), fixed, dec, expdec)
    if (n.eq(0)) return "0"
    if (!Decimal.isFinite(n.mag)) return "Infinity"
    if (Decimal.isNaN(n.mag)) return "NaN"
    if (n.lt(0.001)) {
        return "1 / " + format(n.recip(), fixed, dec, expdec)
    } else if (n.lt(1e6)) {
        return numberWithCommas(n.toNumber().toFixed(dec));
    } else if (n.lt(abbExp)) {
        let abb = n.log(1000).mul(1.000000001).floor()
        return `${n.div(Decimal.pow(1000, abb)).toNumber().toFixed(expdec)} ${abbSuffixes[abb]}`
    } else if (n.lt("e1e6")) {
        let exp = n.log(10).mul(1.000001).floor()
        return `${n.div(Decimal.pow(10, exp)).toNumber().toFixed(expdec)}e${format(exp, fixed, 0, expdec)}`
    } else if (n.lt("10^^7")) {
        return `e${format(n.log(10), fixed, dec, expdec)}`
    } else {
        return `F${format(n.slog(10), fixed, dec, expdec)}`
    }
}