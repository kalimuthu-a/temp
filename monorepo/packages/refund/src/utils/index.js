import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { BROWSER_STORAGE_KEYS, FIELD_TYPE } from '../constants';

const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_TOKEN, true);
    return tokenObj.token || '';
  } catch (error) {
    //  console.log(error);
    return '';
  }
};

const requirendField = (value) => {
  if(value === '') return true
}

const containsAlphabets = (value) => {
  // Matches any alphabet (uppercase or lowercase)
  return /[a-zA-Z]/i.test(value);
};

const containsDigit = (value) => {
  // Returns true if the string contains at least one digit
  return /[0-9]/i.test(value); 
};


const validateIFSC = (value) => {
  return /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/i.test(value);
};

export const validateBankDetailsForm = (type = '', value = '', formData, aemData, fileSize) => {
  const { errorMessages, maxFileSize } = aemData;
  switch (type) {
    case FIELD_TYPE.NAME_OF_BANK: {
      if(requirendField(value)) {
        return errorMessages?.Required;
      }
      break;
    }

    case FIELD_TYPE.CONFIRMED_ACCOUNT_NUMBER:
    case FIELD_TYPE.ACCOUNT_NUMBER: {
      if(requirendField(value)) {
        return errorMessages?.Required;
      }
      if(containsAlphabets(value)) {
        return errorMessages?.InvalidAccountNumber;
      }
      if (type === "confirmedAccountNumber" && value !== formData.accountNumber) {
        return errorMessages?.ReEnterAccountNumber;
      }
      break;
    }

    case FIELD_TYPE.IFSC_CODE: {
      if(requirendField(value)) {
        return errorMessages?.Required;
      } else if (!validateIFSC(value)) {
        return errorMessages?.InvalidIFSE;
      } else if (value.length < 11) {
        return errorMessages?.IfseCode
      }
      break;
    }

    case FIELD_TYPE.FILE_NAME: {
      const maxSize = maxFileSize * 1024 * 1024;
      if(containsDigit(value)) {
        return errorMessages?.InvalidFileName;
      } else if (fileSize > maxSize) {
        return errorMessages?.maxFileSizeError;
      }
      break;
    }

    default:
      return '';
  }
};

export default getSessionToken;
