import moment from 'moment';
import { paxCodes } from '../../../constants/index';

export function aboveDateExpiry(value) {
  if (value.dd && value.mm && value.yy) {
    return new Date(`${value.yy}-${value.mm}-${value.dd}`) > new Date();
  }

  return true;
}

export function isAlphaNumeric(value) {
  const alphaNumricRegex = /^[a-zA-Z0-9]+$/;
  return value ? alphaNumricRegex.test(value) : true;
}

export function isRequired(value) {
  return Boolean(value);
}

export function isAlphaNumericAndRequired(value, key, AEMData) {
  if (key === 'passportNumber') {
    if (isRequired(value)) {
      return isAlphaNumeric(value) ? '' : AEMData.alphanumericNotAllowedLabel;
    }
    return AEMData?.requiredFieldLabel || 'This field is Required';
  }
  return isAlphaNumeric(value) ? '' : AEMData?.alphanumericNotAllowedLabel;
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

export const defaultTabUserData = {
  passportNumber: '',
  passportExpiry: { dd: '', mm: '', yy: '' },
  visaExpiry: { dd: '', mm: '', yy: '' },
  visaNumber: '',
  dob: { dd: '', mm: '', yy: '' },
  type: '',
  errors: {},
};

/**
 *
 * @typedef {{dd: string, mm: string, yy: string}} DOB
passportNumber: "",
passportExpiry: { dd: "", mm: "", yy: "" },
visaExpiry: { dd: "", mm: "", yy: "" },
visaNumber: "",
dob: { dd: "", mm: "", yy: "" },
type: "ADT",
 * @param {Object} row
 * @param {string} row.passportNumber
 * @param {DOB} row.passportExpiry
 * @param {DOB} row.visaExpiry
 * @param {string} row.visaNumber
 * @param {DOB} row.dob
 * @param {'SRCT'|'ADT'} row.type
 * @param {{[key: string]: string}} row.errors
 * @param {boolean} isInternational
 *
 * @returns {boolean}
 */
export const travelAssistanceRowValidator = (row, isInternational) => {
  // Old Code:
  // const { passportNumber, passportExpiry, dob, errors } = row;
  const { errors } = row;

  const errorsLength = Object.values(errors).filter((r) => Boolean(r)).length;

  return (errorsLength === 0);

  /* Old Code:
  if (errorsLength !== 0) {
    return false;
  }

  if (!dob.yy || !dob.mm || !dob.dd) {
  return false;
  }

  if (isInternational) {
  if (
  passportNumber === "" ||
  passportExpiry.dd === "" ||
  passportExpiry.mm === "" ||
  passportExpiry.yy === ""
  ) {
  return false;
  }
  }

  return true; */
};
