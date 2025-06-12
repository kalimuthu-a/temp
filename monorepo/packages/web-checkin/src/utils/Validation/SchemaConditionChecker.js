/**
 *
 * @param {string|number} value
 * @param {string|number} conditionValue
 * @returns {Boolean}
 */
const equalOperator = (value, conditionValue) => value === conditionValue;

/**
 *
 * @param {string|number} value
 * @param {string|number} conditionValue
 * @returns {Boolean}
 */
const notequalOperator = (value, conditionValue) => value !== conditionValue;

/**
 *
 * @param {string|number} value
 * @param {*} conditionValues
 * @returns {Boolean}
 */
const inOperator = (value, conditionValues) => conditionValues.includes(value);

const OperatorsMappings = new Map([
  ['equal', equalOperator],
  ['notequal', notequalOperator],
  ['in', inOperator],
]);

/**
 * @param {import("types/Passenger").Passenger} formData
 * @param {{ key: string, operator: string, value: string, formatter?: Function }} param0
 * @returns {any}
 */
export default (formData, { key, operator, value, formatter }) => {
  const fieldValue = formatter ? formatter(formData[key]) : formData[key];

  const operation = OperatorsMappings.get(operator);
  if (!operation) {
    return false;
  }

  return operation(fieldValue, value);
};
