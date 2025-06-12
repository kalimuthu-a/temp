import { makePnrSearchReq } from '../../services';
import { CONSTANTS } from '../constants';

const {
  REGEX_LIST: { ONLY_CHARS_FIELD, EMAIL },
} = CONSTANTS;

function validatePNR(pnr) {
  // Check if PNR matches the expected format (e.g., 6 alphanumeric characters)
  return /^[A-Z0-9]{6}$/i.test(pnr);
}

export const submitHandler = async (pnr, lastname, flag, isItinerary = false) => {
  return makePnrSearchReq(pnr, lastname, flag, isItinerary);
};

export const validateForm = (formData) => {
  const obj = {};

  if (!validatePNR(formData.pnr)) {
    obj.pnr = true;
  }

  if (!ONLY_CHARS_FIELD.test(formData?.email) && !EMAIL.test(formData?.email)) {
    obj.email = true;
  }

  return obj;
};
