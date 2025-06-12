import {
  PASSENGER_TYPE,
  UMNR_AGE_ERROR_MSG,
  UMNR_ID_CODE,
  ageLimitUtil,
} from '../constants/constants';
import regexConstant from '../constants/regex';
import { calculateYearsFromDate, isOlderThanDays } from '../helpers';
import checkFutureOrValidDate from './checkFutureOrValidDate';

const passengersAgeUtil = {
  customAgeErrorMsg(dob, paxType, errorMsgs, specialFareCode = null, ssr = [], optLoyaltySignup) {
    let errorMsg = '';
    let correctAge = false;
    const travelDate = ssr?.[0]?.journeydetail?.departure;
    const {
      ADT_LOYALTY_AGE_LIMIT_ERROR_MSG,
      ADT_AGE_LIMIT_ERROR_MSG,
      SRCT_AGE_LIMIT_ERROR_MSG,
      CHD_AGE_LIMIT_ERROR_MSG,
      IFT_AGE_LIMIT_ERROR_MSG,
      UMNR_AGE_LIMIT_ERROR_MSG } = errorMsgs;

    if (optLoyaltySignup && !dob || optLoyaltySignup && dob === 'Invalid date') {
      return ADT_LOYALTY_AGE_LIMIT_ERROR_MSG;
    }
    const dateFormatError = checkFutureOrValidDate(dob, travelDate);
    if (dateFormatError) {
      return dateFormatError;
    }

    const age = dob.length === regexConstant.DOB_LENGTH_WITH_HYPHENS ? calculateYearsFromDate(dob, travelDate) : null;
    if (paxType === PASSENGER_TYPE.ADULT) {
      if (optLoyaltySignup) {
        errorMsg = ADT_LOYALTY_AGE_LIMIT_ERROR_MSG;
        correctAge = age >= ageLimitUtil.ADULT_START_LOYALTY && age <= ageLimitUtil.ADULT_END;
      } else if (!optLoyaltySignup && dob) {
        errorMsg = ADT_AGE_LIMIT_ERROR_MSG;
        correctAge = age >= ageLimitUtil.ADULT_START && age <= ageLimitUtil.ADULT_END;
      }
    }
    // if (paxType === PASSENGER_TYPE.ADULT && dob) {
    //   errorMsg = ADT_AGE_LIMIT_ERROR_MSG;
    //   correctAge = age >= ageLimitUtil.ADULT_START && age <= ageLimitUtil.ADULT_END;
    // }
    if (paxType === PASSENGER_TYPE.SENIOUR && dob) {
      errorMsg = SRCT_AGE_LIMIT_ERROR_MSG;
      correctAge = age >= ageLimitUtil.SENOIR_START && age < ageLimitUtil.SENOIR_END;
    }
    if (paxType === PASSENGER_TYPE.CHILD && dob && specialFareCode !== UMNR_ID_CODE) {
      errorMsg = CHD_AGE_LIMIT_ERROR_MSG;
      correctAge = age >= ageLimitUtil.CHILD_START && age < ageLimitUtil.CHILD_END;
    }
    if (paxType === PASSENGER_TYPE.CHILD && dob && specialFareCode === UMNR_ID_CODE) {
      errorMsg = UMNR_AGE_LIMIT_ERROR_MSG || UMNR_AGE_ERROR_MSG;
      correctAge = age >= ageLimitUtil.CHILD_UNMR_START && age < ageLimitUtil.CHILD_END;
    }
    if (paxType === PASSENGER_TYPE.INFANT && dob) {
      errorMsg = IFT_AGE_LIMIT_ERROR_MSG;
      correctAge = isOlderThanDays(dob, travelDate) && age < ageLimitUtil.INFANT_END;
    }
    if (dob?.length === regexConstant.DOB_LENGTH_WITH_HYPHENS && correctAge) {
      errorMsg = '';
    }
    return errorMsg;
  },
};

export default passengersAgeUtil;
