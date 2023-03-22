function format(number, fixed = false)
{
    const abbSuffixes = ["","K","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc",
                        "UDc","DDc","TDc","QaDc","QiDc","SxDc","SpDc","OcDc","NoDc","Vg"];

    if (number.lessThan(1_000_000))                                         //display with commas
        return Math.floor(number.toNumber()).toLocaleString("en-US");
    if (number.lessThan(new Decimal("1e" + (abbSuffixes.length * 3))))           //display abberviaed
    {
        let powerOf1000 = Decimal.floor(number.log(1000));
        let mantissa = number.divide(Decimal.pow(1000, powerOf1000))
        
        if (mantissa.round() >= 1000)
          mantissa = 999.999;

        if (fixed)
          return mantissa.toFixed(3) + abbSuffixes[powerOf1000];
        return  Number.parseFloat(mantissa.toFixed(3)) + abbSuffixes[powerOf1000];
    }

    //display in scientific notation
    let exponent = Decimal.floor(number.log10());
    let mantissa = number.divide(Decimal.pow(10, exponent));

    if (fixed)
        return mantissa.toFixed(3) + "e" + exponent;
    return Number.parseFloat(mantissa.toFixed(3)) + "e" + exponent;

}