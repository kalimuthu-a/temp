import { CONSTANTS } from '../../constants';

const {
  REGEX_LIST: { ONLY_CHARS_FIELD, EMAIL, ALPHA_NUMERIC },
} = CONSTANTS;
// const PNR_VALID = /^[A-Z0-9]{6}$/i;
const PNR_VALID = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;

const isValidBookingId = (bookingId) => {
  return ((bookingId.length === 18) && (ALPHA_NUMERIC.test(bookingId)));
};

const validateField = (formData, activeTabIndex, errorObj) => {
  const errors = {};
  if (activeTabIndex === 0) {
    if (formData?.pnr.length === 0) {
      errors.pnr = errorObj?.EmptyPNR;
    } else if (!(PNR_VALID.test(formData.pnr))) {
      errors.pnr = errorObj?.InvalidPNR;
    }
    if (formData?.email.length === 0) {
      errors.email = errorObj?.EmptyEmail;
    } else if (!ONLY_CHARS_FIELD.test(formData?.email) && !EMAIL.test(formData?.email)) {
      errors.email = errorObj?.InvalidEmail;
    }
  } else if (formData.bookingId.length === 0) {
    errors.bookingId = errorObj?.EmptyBookingId;
  } else if (!isValidBookingId(formData.bookingId)) {
    errors.bookingId = errorObj?.InvalidBookingId;
  }
  return errors;
};

export const isFormValid = (activeIndex, data) => {
  if (activeIndex === 1) {
    return isValidBookingId(data.bookingId);
  }
  return (PNR_VALID.test(data.pnr) && (EMAIL.test(data.email) || ONLY_CHARS_FIELD.test(data.email)));
};

export default validateField;
