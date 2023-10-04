"use strict";

const abbSuffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
                            "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg"];
const abbExp = 1e63

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function format(number, fixed, dec = 0, expdec = 3) {
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
        return `${n.div(Decimal.pow(1000, abb)).toNumber().toFixed(dec)} ${abbSuffixes[abb]}`
    } else if (n.lt("e1e6")) {
        let exp = n.log(10).mul(1.000001).floor()
        return `${n.div(Decimal.pow(10, exp)).toNumber().toFixed(expdec)}e${format(exp, fixed, 0, expdec)}`
    } else if (n.lt("10^^7")) {
        return `e${format(n.log(10), fixed, dec, expdec)}`
    } else {
        return `F${format(n.slog(10), fixed, dec, expdec)}`
    }
}

// function format(number, fixed = false, dec = 0, expdec = 3) {
//     if (number.lt(0))
//         return "-" + format(number.mul(-1), fixed, dec, expdec)
//     if (!Decimal.isFinite(number.mag))
//         return "Infinity"
//     if (Decimal.isNaN(number.mag))
//         return "NaN"

//     if (number.lessThan(1_000_000)) {
//         if (number.lessThan(0.1 ** Math.max(dec, 3))) {
//         return scientificNotation(number, fixed, expdec);
//         }
//         number = number.toNumber().toFixed(dec);
//         return numberWithCommas(number);
//     }

//     if (number.lessThan(new Decimal("1e" + (abberivationSuffixes.length * 3))))
//         return abberivate(number, fixed, expdec);

//     if (number.layer >= 6) {
//         return "F" + format(number.slog(10), fixed, dec, expdec);
//     } else {
//         return scientificNotation(number, fixed, expdec);
//     }
// }

// function abberivate(number, fixed = false, expdec) {
//     let powerOf1000 = Decimal.floor(number.log(1000));
//     let mantissa = number.divide(Decimal.pow(1000, powerOf1000));
//     // if (mantissa.gte(999.999)) {
//     //     mantissa = 1;
//     //     ++powerOf1000;
//     // }
//     return mantissa.toFixed(expdec) + abberivationSuffixes[powerOf1000];
// }

// function scientificNotation(number, fixed = false, expdec) {
//     if (number.eq(0)) {
//         return "0";
//     }
//     let exponent = Decimal.floor(number.log10().mul(1.0000001));
//     if (number.lt(0.1 ** expdec)) { exponent = exponent.sub(1) }
//     let mantissa = number.divide(Decimal.pow(10, exponent));
//     if (exponent.gte(1_000_000)) {
//         if (exponent.lessThan(new Decimal("1e" + (abberivationSuffixes.length * 3)))) {
//         return "e" + abberivate(exponent, fixed, expdec)
//         } else {
//         return "e" + scientificNotation(exponent, fixed, expdec)
//         }
//     } else {
//         return mantissa.toFixed(expdec) + "e" + format(exponent, true, 0, 3);
//     }
// }