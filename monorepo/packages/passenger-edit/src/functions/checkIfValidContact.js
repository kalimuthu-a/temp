import { DEFAULT_COUNTRY_CODE } from '../constants/constants';
import regexConstant from '../constants/regex';

const checkIfValidPhone = (data) => {
  const { countryCode = DEFAULT_COUNTRY_CODE } = data;
  const isInternational = countryCode !== DEFAULT_COUNTRY_CODE;
  const phoneRegex = !isInternational ? regexConstant.PHONE : regexConstant.PHONE_INTERNATIONAL;
  return data?.primaryContact?.match(phoneRegex);
};

const checkIfValidAltPhone = (data) => {
  const { altCountryCode = DEFAULT_COUNTRY_CODE, countryCode, altContact, primaryContact } = data;
  const isInternational = altCountryCode !== DEFAULT_COUNTRY_CODE;
  const phoneRegex = !isInternational ? regexConstant.PHONE : regexConstant.PHONE_INTERNATIONAL;
  if (altContact?.length) {
    if (altContact === primaryContact && altCountryCode === countryCode) {
      return false;
    }
    return altContact?.match(phoneRegex);
  }
  return true;
};

const checkIfValidEmail = (data) => {
  let flag = false;
  const emailMatched = data?.email?.match(regexConstant.EMAIL);
  if (emailMatched) flag = true;
  return flag;
};

const checkIfValidAltEmail = (data) => {
  let flag = false;
  const { altEmail } = data;
  if (altEmail?.length) {
    const emailMatched = data?.email?.match(regexConstant.EMAIL);
    if (emailMatched) flag = true;
    return flag;
  }
  return true;
};

const checkIfValidName = (data, codeShareDetails) => {
  let flag = true;
  const { userFields } = data;
  for (let i = 0; i < userFields?.length; i++) {
    if (userFields?.[i]?.name?.first?.trim().length < codeShareDetails?.minCharLengthName
      || userFields?.[i]?.name?.last?.trim().length < codeShareDetails?.minCharLengthName) {
      flag = false;
    }
  }
  return flag;
};

export { checkIfValidPhone, checkIfValidAltPhone, checkIfValidAltEmail, checkIfValidEmail, checkIfValidName };
