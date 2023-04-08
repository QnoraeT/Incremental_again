const abberivationSuffixes = ["","K","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc",
"UDc","DDc","TDc","QaDc","QiDc","SxDc","SpDc","OcDc","NoDc","Vg"];

function format(number, fixed = false, dec = 0)
{
    if (number.lt(0))
      return "-" + format(number.times(-1), fixed, dec)
    if (!Number.isFinite(number.mag))
      return "Infinity"
    if (Number.isNaN(number.mag))
      return "NaN"
      
    if (number.lessThan(1_000_000))                                         //display with commas
    {
      number = Number.parseFloat(number.toNumber().toFixed(dec));
      return number.toLocaleString("en-US");
    }

    if (number.lessThan(new Decimal("1e" + (abberivationSuffixes.length * 3))))    //display abberviaed
      return abberivate(number, fixed);

  //display in scientific notation
  if (number.layer >= 6){
    return "F" + format(number.slog(10), fixed, dec)
  } else {
    return scientificNotation(number, fixed);
  }
}

function abberivate(number, fixed = false)
{
  let powerOf1000 = Decimal.floor(number.log(1000));
  let mantissa = number.divide(Decimal.pow(1000, powerOf1000))
  if (mantissa >= 999.999)
  {
    mantissa = 1;
    ++powerOf1000
  }

  if (fixed)
    return mantissa.toFixed(3) + abberivationSuffixes[powerOf1000];
  return  Number.parseFloat(mantissa.toFixed(3)) + abberivationSuffixes[powerOf1000];
}

function scientificNotation(number, fixed = false){
  if (number.eq(0))
    return "0";
  let exponent = Decimal.floor(number.log10());
  let mantissa = number.divide(Decimal.pow(10, exponent));
  if (exponent.gte(1_000_000)){
    if (exponent.lessThan(new Decimal("1e" + (abberivationSuffixes.length * 3)))){
      return "e" + abberivate(exponent, fixed)
    } else {
      return "e" + scientificNotation(exponent, fixed)
    }
  } else {
    if (fixed)
    return mantissa.toFixed(3) + "e" + exponent;
  return Number.parseFloat(mantissa.toFixed(3)) + "e" + exponent;
  }
}