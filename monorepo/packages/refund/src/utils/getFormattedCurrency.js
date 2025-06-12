import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';

const getFormattedCurrency = (amount, code, minDigit) => {
  const tempCurrency = formatCurrency(0, code, minDigit);
  return tempCurrency?.replace(/0/, ` ${amount}`)?.replace(/,/g, '');
};
export default getFormattedCurrency;
