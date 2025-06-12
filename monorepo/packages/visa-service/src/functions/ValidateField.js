import { CONSTANTS } from '../constants';

const validateField = (formData, errorObj) => {
  const getErrorMessage = (messageKey) => {
    const errorMessage = errorObj?.find((msg) => msg.key === messageKey);
    return errorMessage?.value;
  };
  const errors = {};
  if (formData?.firstName?.length === 0) {
    errors.firstName = getErrorMessage(CONSTANTS.MANDETORY_FIELD);
  } else if (formData?.lastName.length === 0) {
    errors.lastName = getErrorMessage(CONSTANTS.MANDETORY_FIELD);
  } else if (formData?.dateOfBirth.length === 0) {
    errors.dateOfBirth = getErrorMessage(CONSTANTS.MANDETORY_FIELD);
  } else if (formData?.occupation.length === 0) {
    errors.occupation = getErrorMessage(CONSTANTS.MANDETORY_FIELD);
  } else if (formData?.cell.length === 0) {
    errors.cell = getErrorMessage(CONSTANTS.MANDETORY_FIELD);
  } else if (
    formData?.CountryCode === 'IN'
    && !formData?.cell?.match(CONSTANTS.REGEX_LIST.PHONE)
    && formData?.cell?.length <= 10
  ) {
    errors.cell = getErrorMessage(CONSTANTS.INVALID_PHONE_NUMBER);
  } else if (
    formData?.CountryCode !== 'IN'
    && !formData?.cell?.match(CONSTANTS.REGEX_LIST.PHONE_INTERNATIONAL)
    && formData?.cell?.length <= 14
  ) {
    errors.cell = getErrorMessage(CONSTANTS.INVALID_PHONE_NUMBER);
  } else if (formData?.emailId?.length === 0) {
    errors.emailId = getErrorMessage(CONSTANTS.MANDETORY_FIELD);
  } else if (!CONSTANTS.REGEX_LIST.EMAIL.test(formData?.emailId)) {
    errors.emailId = getErrorMessage(CONSTANTS.INVALID_EMAIL);
  } else if (formData?.passportNumber.length === 0) {
    errors.passportNumber = getErrorMessage(CONSTANTS.MANDETORY_FIELD);
  } else if (
    !CONSTANTS.REGEX_LIST.VALID_PASSPORT.test(formData?.passportNumber)
  ) {
    errors.passportNumber = getErrorMessage(CONSTANTS.NOT_VALID);
  } else if (formData?.passportExpiry.length === 0) {
    errors.passportExpiry = getErrorMessage(CONSTANTS.MANDETORY_FIELD);
  }
  return errors;
};

export const isFormValid = (formData) => {
  const isAtLeastOnePrimaryValid = formData.some((formDataItem) => formDataItem.primary === true);
  if (!isAtLeastOnePrimaryValid) {
    return false;
  }
  return formData.every((formDataItem) => {
    const {
      firstName,
      lastName,
      dateOfBirth,
      occupation,
      cell,
      emailId,
      passportNumber,
      passportExpiry,
    } = formDataItem;

    let phoneValid = false;
    if (formDataItem.CountryCode === 'IN') {
      phoneValid = (cell?.match(CONSTANTS.REGEX_LIST.PHONE) && (cell.length === 10));
    } else {
      phoneValid = CONSTANTS.REGEX_LIST.PHONE_INTERNATIONAL.test(cell) && cell.length <= 14;
    }
    return (
      [
        firstName,
        lastName,
        dateOfBirth,
        occupation,
        cell,
        emailId,
        passportNumber,
        passportExpiry,
      ].every(Boolean)
      && CONSTANTS.REGEX_LIST.EMAIL.test(emailId)
      && phoneValid
      && CONSTANTS.REGEX_LIST.VALID_PASSPORT.test(passportNumber)
    );
  });
};
export default validateField;
