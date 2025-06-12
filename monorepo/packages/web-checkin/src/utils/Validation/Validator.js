import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';

import differenceInDays from 'date-fns/differenceInDays';
import parse from 'date-fns/parse';

import { ERROR_MSGS, regexConstant } from '../../constants';
import SchemaConditionChecker from './SchemaConditionChecker';

/**
 *
 * @param {*} value
 * @param {{errors: {[key: string]: String}}} param1
 * @returns {string}
 */
function requiredValidator(value, { errors }) {
  if (!value) {
    return errors.required;
  }
  return '';
}

/**
 * @returns {string}
 */
function safeValidator() {
  return '';
}

/**
 *
 * @param {*} value
 * @param {{max: number, min: number, errors: {[key: string]: String}}} param1
 * @returns {string}
 */
function numberValidator(value, { max, min, errors }) {
  if (parseInt(value, 10) < min) {
    return formattedMessage(errors.min, { min: String(min), max: String(max) });
  }

  if (parseInt(value, 10) > max) {
    return formattedMessage(errors.min, { min: String(min), max: String(max) });
  }
  return '';
}

/**
 *
 * @param {*} value
 * @param {{errors: {[key: string]: String}}} param1
 * @returns {string}
 */
function emailValidator(value, { errors }) {
  if (value && !value.match(regexConstant.EMAIL)) {
    return errors.email;
  }
  return '';
}

/**
 *
 * @param {*} value
 * @param {{regex?: RegExp ,errors: {[key: string]: String}}} param1
 * @returns {string}
 */
function matchValidator(value, { regex, errors }) {
  if (value && !value.match(regex)) {
    return errors.match;
  }
  return '';
}

function dateValidator(value, { fieldProps }) {
  const { minDate, maxDate } = fieldProps;
  const _error = ERROR_MSGS.INVALID_DATE;

  try {
    const inputDate = parse(value, 'dd-MM-yyyy', new Date());

    if (inputDate.toString() === ERROR_MSGS.INVALID_DATE && value !== 'dd-mm-yyyy') {
      return _error;
    }

    if (maxDate && differenceInDays(inputDate, maxDate) > 0) {
      return _error;
    }

    if (minDate && differenceInDays(inputDate, minDate) < 0) {
      return _error;
    }
  } catch (error) {
    return _error;
  }

  return '';
}

/**
 * @type {Map<string, any>}
 */
const validators = new Map([
  ['required', requiredValidator],
  ['number', numberValidator],
  ['email', emailValidator],
  ['safe', safeValidator],
  ['match', matchValidator],
  ['date', dateValidator],
]);

class Validator {
  static validate(schema, values) {
    const errors = {};

    // eslint-disable-next-line guard-for-in

    for (const key in schema) {
      const { conditions = [], ...element } = schema[key];
      let { type } = schema[key];

      conditions?.some((condition) => {
        if (SchemaConditionChecker(values, condition)) {
          type = condition.type;
          return true;
        }

        return false;
      });

      if (Array.isArray(type)) {
        type.some((_type) => {
          const validatorFunc = validators.get(_type);
          errors[key] = validatorFunc(values[key], element);
          return Boolean(errors[key]);
        });
      } else if (typeof type === 'function') {
        errors[key] = type(values[key], element);
      } else {
        const validatorFunc = validators.get(type);
        errors[key] = validatorFunc(values[key], element);
      }
    }

    return errors;
  }

  static validateSingle(schema, value, formData) {
    let error = '';
    const { conditions = [] } = schema;
    let { type, rules = {}, ...element } = schema;

    conditions?.some((condition) => {
      if (SchemaConditionChecker(formData, condition)) {
        ({ rules = {} } = condition);
        element = { ...element, ...rules };
        return true;
      }

      return false;
    });
    if (Array.isArray(type)) {
      type.some((_type) => {
        const validatorFunc = validators.get(_type);
        error = validatorFunc(value, element);
        return Boolean(error);
      });
    } else {
      const validatorFunc = validators.get(type);
      error = validatorFunc(value, element);
    }

    return error;
  }
}

export default Validator;
