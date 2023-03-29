const abberivationSuffixes = ["","K","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc",
"UDc","DDc","TDc","QaDc","QiDc","SxDc","SpDc","OcDc","NoDc","Vg"];

function format(number, fixed = false)
{
    if (number.lt(0))
      return "-" + format(number.times(-1), fixed)
    if (!Number.isFinite(points.mag))
      return "Infinity"
    if (Number.isNaN(points.mag))
      return "NaN"
      
    if (number.lessThan(1_000_000))                                         //display with commas
      return Math.floor(number.toNumber()).toLocaleString("en-US");
    if (number.lessThan(new Decimal("1e" + (abberivationSuffixes.length * 3))))    //display abberviaed
      return abberivate(number, fixed);

  //display in scientific notation
  return scientificNotation(number, fixed);
}

function abberivate(number, fixed = false)
{
  let powerOf1000 = Decimal.floor(number.log(1000));
  let mantissa = number.divide(Decimal.pow(1000, powerOf1000))

  if (mantissa.round() >= 1000)
    mantissa = 999.999;

  if (fixed)
    return mantissa.toFixed(3) + abberivationSuffixes[powerOf1000];
  return  Number.parseFloat(mantissa.toFixed(3)) + abberivationSuffixes[powerOf1000];
}

function scientificNotation(number, fixed = false)
{
  if (number.eq(0))
    return "0";

  let exponent = Decimal.floor(number.log10());
  let mantissa = number.divide(Decimal.pow(10, exponent));

  if (fixed)
    return mantissa.toFixed(3) + "e" + exponent;
  return Number.parseFloat(mantissa.toFixed(3)) + "e" + exponent;
}