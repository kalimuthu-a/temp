/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
const regexConstant = {
  DOB_BACKSPACE_OR_AUTOFILL: 'autoFil',
  DOB_LENGTH_WITH_HYPHENS: 10,
  DOB_HYPHEN_INDEX_2: 2,
  DOB_HYPHEN_INDEX_4: 4,
  FORM_NAME_FIELD: /^[a-zA-Z][a-zA-Z ]*$/,
  ALPHA_NUMERIC: /^[a-zA-Z0-9]+$/,
  ONLYDIGIT: /^\d*$/g,
  DOB_FORMAT: /^\d{4}-\d{2}-\d{2}$/,
  PHONE: /^[6-9]\d{9}$/g,
  PHONE_INTERNATIONAL: /^[0-9]\d{5,13}$/g,
  EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/i,
  // GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[1-9A-Z]{1}[0-9A-Z]{1}$/,
  GST: /^[a-zA-Z\-0-9]{15,16}$/,
  NAME_ONLY_ALPHABET_SPACE: /[^a-zA-Z\s]|\s{2}/g,
};

export default regexConstant;
