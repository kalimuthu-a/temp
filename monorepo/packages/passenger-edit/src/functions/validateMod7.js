export const validateMod7 = (number) => {
  const numStr = number.toString();

  if (numStr.length !== 9 || numStr === '000000000') {
    return false;
  }

  const lastDigit = number % 10;
  const numberWithoutLastDigit = Math.floor(number / 10);

  if (parseInt(numberWithoutLastDigit) % 7 !== lastDigit) {
    return false;
  }

  return true;
};
