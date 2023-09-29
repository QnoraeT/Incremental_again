"use strict";

const abberivationSuffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
  "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg"];

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function format(number, fixed = false, dec = 0, expdec = 3) {
  if (number.lt(0))
    return "-" + format(number.times(-1), fixed, dec, expdec)
  if (!Decimal.isFinite(number.mag))
    return "Infinity"
  if (Decimal.isNaN(number.mag))
    return "NaN"

  if (number.lessThan(1_000_000)) {
    if (number.lessThan(0.1 ** Math.max(dec, 3))) {
      return scientificNotation(number, fixed, expdec);
    }
    number = number.toNumber().toFixed(dec);
    return numberWithCommas(number);
  }

  if (number.lessThan(new Decimal("1e" + (abberivationSuffixes.length * 3))))
    return abberivate(number, fixed, expdec);

  if (number.layer >= 6) {
    return "F" + format(number.slog(10), fixed, dec, expdec);
  } else {
    return scientificNotation(number, fixed, expdec);
  }
}

function abberivate(number, fixed = false, expdec) {
  let powerOf1000 = Decimal.floor(number.log(1000));
  let mantissa = number.divide(Decimal.pow(1000, powerOf1000));
  if (mantissa >= 999.999) {
    mantissa = 1;
    ++powerOf1000;
  }
  if (fixed) {
    return mantissa.toFixed(expdec) + abberivationSuffixes[powerOf1000];
  }
  return Number.parseFloat(mantissa.toFixed(expdec)) + abberivationSuffixes[powerOf1000];
}

function scientificNotation(number, fixed = false, expdec) {
  if (number.eq(0)) {
    return "0";
  }
  let exponent = Decimal.floor(number.log10().mul(Decimal.add(1, 1e-9)));
  if (number.lt(0.1 ** expdec)) { exponent = exponent.sub(1) }
  let mantissa = number.divide(Decimal.pow(10, exponent));
  if (exponent.gte(1_000_000)) {
    if (exponent.lessThan(new Decimal("1e" + (abberivationSuffixes.length * 3)))) {
      return "e" + abberivate(exponent, fixed, expdec)
    } else {
      return "e" + scientificNotation(exponent, fixed, expdec)
    }
  } else {
    if (fixed) { return mantissa.toFixed(expdec) + "e" + exponent; }
    return Number.parseFloat(mantissa.toFixed(expdec)) + "e" + exponent;
  }
}