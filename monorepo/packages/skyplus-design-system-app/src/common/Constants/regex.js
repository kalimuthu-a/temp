/* eslint-disable no-useless-escape */
const regexConstant = {
  ONLYDIGIT: /^[0-9]*$/g,
  PHONE: /^[6-9]\d{9}$/g,
  PHONE_INTERNATIONAL: /^[0-9]\d{5,13}$/g,
  EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/i,
};

export default regexConstant;
