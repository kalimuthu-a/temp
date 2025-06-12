/**
 *
 * Currency Formatter Function
 *
 * @param {number|bigint} amountToFormat
 * @param {Intl.NumberFormatOptions} intlOptions
 * @param {string} currency
 * @param {string} locale
 * @returns {string}
 */
export default (
  amountToFormat,
  currency = 'INR',
  intlOptions = {},
  locale = 'en-IN',
) => {
  const options = {
    style: 'currency',
    currency: currency ?? 'INR',
    minimumFractionDigits:
      typeof intlOptions?.minimumFractionDigits === 'number'
        ? intlOptions.minimumFractionDigits
        : 0,
    ...intlOptions,
  };
  const formatter = new Intl.NumberFormat(locale, options);

  return formatter.format(amountToFormat);
};
