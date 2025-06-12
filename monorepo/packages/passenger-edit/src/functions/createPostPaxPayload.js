/* eslint-disable sonarjs/cognitive-complexity */
import moment from 'moment';
import {
  DOUBLE_LABEL,
  DOUBLE_SEAT_LABEL,
  TRIPLE_LABEL,
  TRIPLE_SEAT_LABEL,
  SALUTATION_ADULT,
  SRCT_ID,
  INFANT_TYPE_CODE,
  PASSENGER_TYPE,
  dateFormats,
  UMNR_ID_CODE,
} from '../constants/constants';
import { getGender } from './getGender';
import passengersAgeUtil from './passengersAgeUtil';
import { validateMod7 } from './validateMod7';

export const convertSplittedDateToZulu = (date) => {
  const dateArr = date && date?.split('-');
  if (dateArr?.length === 3) {
    const dd = dateArr[0];
    const mm = dateArr[1];
    const yyyy = dateArr[2];
    const newDate = new Date(yyyy, mm, dd);
    if (!isNaN(newDate)) {
      newDate.setTime(0);
      newDate.setDate(dd);
      newDate.setMonth(mm - 1);
      newDate.setFullYear(yyyy);
      return newDate.toISOString();
    }
  }
  return '';
};

const getSalutionLabel = (code) => {
  const filtered = SALUTATION_ADULT.find((i) => i.gender === code);
  return filtered && filtered.value ? filtered.value : code;
};

export const getErrorMsg = (passengerDetails, loyaltyMemberAgeInvalidError) => {
  return {
    ADT_LOYALTY_AGE_LIMIT_ERROR_MSG: loyaltyMemberAgeInvalidError,
    ADT_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode, discountCode }) => typeCode === PASSENGER_TYPE.ADULT && discountCode === null,
    )?.validationMessage,
    SRCT_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode, discountCode }) => typeCode === PASSENGER_TYPE.ADULT
        && discountCode === PASSENGER_TYPE.SENIOUR,
    )?.validationMessage,
    UMNR_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode }) => typeCode === UMNR_ID_CODE,
    )?.validationMessage,
    CHD_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode }) => typeCode === PASSENGER_TYPE.CHILD,
    )?.validationMessage,
    IFT_AGE_LIMIT_ERROR_MSG: passengerDetails?.find(
      ({ typeCode }) => typeCode === PASSENGER_TYPE.INFANT,
    )?.validationMessage,
  };
};

const createPostPayload = (modificationFlow = false, formData = [], passengerDetails = [], ssr = [], specialFareCode, optLoyaltySignup, loyaltyMemberAgeInvalidError) => {
  const passengerArray = [];
  const infants = [];

  formData?.userFields?.forEach((pax) => {
    let paxInfo = {};
    let infantInfo = {};
    const getGenderName = getGender(pax?.info?.gender);
    const genderCode = getGender(pax?.gender) || getGender(getGenderName);
    const paxGender = genderCode === '1' || genderCode === '2' ? +genderCode : genderCode;
    const gender = paxGender;
    const paxType = pax.passengerTypeCode;
    const isSRCT = pax.discountCode === SRCT_ID;
    const isSpecialFare = specialFareCode === UMNR_ID_CODE;
    const isFFNValid = pax?.loyaltyInfo?.FFN
      ? validateMod7(pax?.loyaltyInfo?.FFN)
      : true;
    const isDOBRequired = !!pax?.info?.dateOfBirth || isSRCT || paxType === INFANT_TYPE_CODE || isSpecialFare || pax?.loyaltyInfo?.optLoyaltySignup;
    const DOBValue = pax?.info?.dateOfBirth?.length === 10 ? pax?.info?.dateOfBirth : '';
    const errorMsgs = getErrorMsg(passengerDetails, loyaltyMemberAgeInvalidError);
    const getCustomErrorMsg = DOBValue || optLoyaltySignup ? passengersAgeUtil.customAgeErrorMsg(
      moment(convertSplittedDateToZulu(DOBValue)).format(dateFormats.USER_FRIENDLY_FORMAT),
      isSRCT ? pax.discountCode : paxType,
      errorMsgs,
      specialFareCode,
      ssr,
      optLoyaltySignup,
    ) : '';

    let seatTag = pax.extraSeatTag === DOUBLE_SEAT_LABEL ? DOUBLE_LABEL : '';
    if (pax?.extraSeatTag === TRIPLE_SEAT_LABEL) seatTag = TRIPLE_LABEL;
    if (pax?.name?.first && pax?.name?.last && gender && !pax?.isInfant
      && (!isDOBRequired || (DOBValue && !getCustomErrorMsg)) && isFFNValid && (!isSRCT || modificationFlow || pax.srctId)) {
      paxInfo = {
        passengerTypeCode: pax?.passengerTypeCode,
        discountCode: pax?.discountCode,
        passengerKey: pax?.passengerKey,
        name: {
          first:
            pax.name.first.charAt(0).toUpperCase() + pax.name.first.slice(1),
          middle: '',
          last: pax.name.last.charAt(0).toUpperCase() + pax.name.last.slice(1),
          title: getSalutionLabel(genderCode) || '',
          suffix: '',
          action: 'Update',
        },
        loyaltyInfo: {
          selfTravel: false,
          isNominee: false,
          NomineeId: '',
          ...pax.loyaltyInfo,
        },
        extraSeatTag: seatTag,
        travelDocumentToTake: pax.travelDocumentToTake,
        info: {
          nationality: null,
          gender,
          dateOfBirth: null,
        },
        travelDocuments: [],
      };
      if (DOBValue) {
        paxInfo.info.dateOfBirth = convertSplittedDateToZulu(DOBValue);
      }
    }
    if (pax.isInfant && (!isDOBRequired || (DOBValue && !getCustomErrorMsg))) {
      infantInfo = {
        dateOfBirth: convertSplittedDateToZulu(DOBValue),
        gender: genderCode,
        name: {
          first: pax?.name?.first,
          middle: '',
          last: pax?.name?.last,
          title: getSalutionLabel(genderCode) || '',
          suffix: '',
          action: 'New',
        },
      };
    }
    if (infantInfo?.name?.first)infants.push(infantInfo);
    if (paxInfo?.name?.first)passengerArray.push(paxInfo);
    passengerArray.forEach((pass, index) => {
      passengerArray[index].infant = infants?.[index];
    });
  });
  return { passengerArray, infants };
};

export default createPostPayload;
