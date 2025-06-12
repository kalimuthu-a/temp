import { CONSTANTS } from '../../constants';

const {
  REGEX_LIST: { ONLY_CHARS_FIELD, EMAIL, PNR_VALID },
} = CONSTANTS;

const validateField = (formData, activeTabIndex, errorObj) => {
  const errors = {};
  if (activeTabIndex === 0) {
    if (formData?.pnr.length === 0) {
      errors.pnr = errorObj?.EmptyPNR;
    } else if (!PNR_VALID.test(formData.pnr)) {
      errors.pnr = errorObj?.InvalidPNR;
    }
    if (formData?.email.length === 0) {
      errors.email = errorObj?.EmptyEmail;
    } else if (
      !ONLY_CHARS_FIELD.test(formData?.email) &&
      !EMAIL.test(formData?.email)
    ) {
      errors.email = errorObj?.InvalidEmail;
    }
  } else if (activeTabIndex === 1) {
    if (formData?.invoiceNumber.length === 0) {
      errors.invoiceNumber = errorObj?.EmptyInvoiceNo;
    }
    if (formData?.gstEmail.length === 0) {
      errors.gstEmail = errorObj?.EmptyGstEmail;
    } else if (
      !ONLY_CHARS_FIELD.test(formData?.gstEmail) &&
      !EMAIL.test(formData?.gstEmail)
    ) {
      errors.gstEmail = errorObj?.InvalidGstEmail;
    }
  }
  return errors;
};

export const isFormValid = (activeIndex, data) => {
  if (activeIndex === 1) {
    return (EMAIL.test(data?.gstEmail) || ONLY_CHARS_FIELD.test(data?.gstEmail));
  }
  return (PNR_VALID.test(data?.pnr) && (EMAIL.test(data?.email) || ONLY_CHARS_FIELD.test(data?.email)));
};
export default validateField;
