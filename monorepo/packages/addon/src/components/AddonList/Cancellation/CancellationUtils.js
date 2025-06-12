import moment from 'moment';
import { paxCodes } from '../../../constants/index';

export function aboveDateExpiry(value) {
  if (value.dd && value.mm && value.yy) {
    return new Date(`${value.yy}-${value.mm}-${value.dd}`) > new Date();
  }

  return true;
}

export function isRequired(value) {
  return Boolean(value);
}

export function dobValidator(value, arrival, type) {
  const arrivalDate = moment(arrival);

  if (value.dd && value.mm && value.yy) {
    const dob = moment()
      .date(value.dd)
      .month(value.mm - 1)
      .year(value.yy);

    if (type === paxCodes.children.code) {
      return arrivalDate.diff(dob, 'years') > 2;
    }
    return arrivalDate.diff(dob, 'years') < 70;
  }

  return true;
}

/**
 *
 * @typedef {{dd: string, mm: string, yy: string}} DOB
 * @param {Object} row
 * @param {DOB} row.dob
 * @param {'SRCT'|'ADT'} row.type
 * @param {{[key: string]: string}} row.errors
 *
 * @returns {boolean}
 */
export const rowValidator = (row) => {
  const { dob, errors } = row;
  const errorsLength = Object.values(errors).filter((r) => Boolean(r)).length;

  if (!dob.yy || !dob.mm || !dob.dd) {
    return false;
  }

  return errorsLength === 0;
};

export const defaultTabUserData = {
  dob: { dd: '', mm: '', yy: '' },
  type: '',
  errors: {},
};
