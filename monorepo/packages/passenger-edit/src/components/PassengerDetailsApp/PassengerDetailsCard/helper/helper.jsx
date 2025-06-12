/* eslint-disable sonarjs/cognitive-complexity */
import { localStorageKeys } from '../../../../constants';
import { NONE_SEAT_CODE, PASSENGER_TYPE } from '../../../../constants/constants';
import LocalStorage from '../../../../utils/LocalStorage';

const paxCardUtil = {
  isExtraSeats(isInfant, paxTypeCode, seatsCount = {}) {
    const {
      adultExtraDoubleSeat,
      adultExtraTripleSeat,
      childrenExtraDoubleSeat,
      childrenExtraTripleSeat,
      seniorCitizenExtraDoubleSeat,
      seniorCitizenExtraTripleSeat,
    } = seatsCount;
    if (paxTypeCode === PASSENGER_TYPE.ADULT) {
      return adultExtraDoubleSeat || adultExtraTripleSeat;
    }
    if (paxTypeCode === PASSENGER_TYPE.SENIOUR) {
      return seniorCitizenExtraDoubleSeat || seniorCitizenExtraTripleSeat;
    }
    if (paxTypeCode === PASSENGER_TYPE.CHILD) {
      return childrenExtraDoubleSeat || childrenExtraTripleSeat;
    }
    return !isInfant;
  },

  checkIfFormCompleted(id) {
    const elem = document.getElementById(id);
    const inputs = elem ? elem?.getElementsByTagName('input') : [];
    let valueEntered = 0;
    let requiredFields = 0;
    let radioChecked = false;
    let formCompleted = false;
    let validationError = false;

    for (let i = 0; i < inputs?.length; i += 1) {
      const classList = [...inputs[i].classList];
      if (i < 2) {
        if (inputs[i].checked) radioChecked = true;
      } else if (classList?.includes('required') && inputs[i].value) {
        valueEntered += 1;
      }
      if (inputs[i].validationMessage) {
        validationError = true;
      }
      if (classList?.includes('required')) requiredFields += 1;
    }
    formCompleted = valueEntered === requiredFields && radioChecked && !validationError;
    return formCompleted;
  },
  isExtraSeatsTagged(isInfant, paxKey, paxType, seatsCount = {}) {
    const {
      adultExtraDoubleSeat = 0,
      adultExtraTripleSeat = 0,
      childrenExtraDoubleSeat = 0,
      childrenExtraTripleSeat = 0,
      seniorCitizenExtraDoubleSeat = 0,
      seniorCitizenExtraTripleSeat = 0,
    } = seatsCount;
    const isExtraSeatsTagged = { };
    isExtraSeatsTagged[paxKey] = { flag: !!isInfant };
    const taggedExtraSeats = LocalStorage.getAsJson(localStorageKeys.ext_pax_keys);
    const { adultExtraSeats = {}, srctExtraSeats = {}, childExtraSeats = {} } = taggedExtraSeats;
    const {
      adultDoubleSeats = [],
      adultTripleSeats = [],
    } = adultExtraSeats;
    const {
      srctDoubleSeats = [],
      srctTripleSeats = [],
    } = srctExtraSeats;
    const {
      childDoubleSeats = [],
      childTripleSeats = [],
    } = childExtraSeats;

    if (paxType === PASSENGER_TYPE.ADULT) {
      if (adultExtraDoubleSeat) {
        const selectedSeats = adultDoubleSeats?.filter((seat) => seat.paxKey === paxKey);
        if (selectedSeats?.length) {
          isExtraSeatsTagged[paxKey] = { flag: true };
        }
      }
      if (adultExtraTripleSeat) {
        const selectedSeats = adultTripleSeats?.filter((seat) => seat.paxKey === paxKey);
        if (selectedSeats?.length) {
          isExtraSeatsTagged[paxKey] = { flag: true };
        }
      }
    }
    if (paxType === PASSENGER_TYPE.SENIOUR) {
      if (seniorCitizenExtraDoubleSeat) {
        const selectedSeats = srctDoubleSeats?.filter((seat) => seat.paxKey === paxKey);
        if (selectedSeats?.length) {
          isExtraSeatsTagged[paxKey] = { flag: true };
        }
      }
      if (seniorCitizenExtraTripleSeat) {
        const selectedSeats = srctTripleSeats?.filter((seat) => seat.paxKey === paxKey);
        if (selectedSeats?.length) {
          isExtraSeatsTagged[paxKey] = { flag: true };
        }
      }
    }
    if (paxType === PASSENGER_TYPE.CHILD) {
      if (childrenExtraDoubleSeat) {
        const selectedSeats = childDoubleSeats?.filter((seat) => seat.paxKey === paxKey);
        if (selectedSeats?.length) {
          isExtraSeatsTagged[paxKey] = { flag: true };
        }
      }
      if (childrenExtraTripleSeat) {
        const selectedSeats = childTripleSeats?.filter((seat) => seat.paxKey === paxKey);
        if (selectedSeats?.length) {
          isExtraSeatsTagged[paxKey] = { flag: true };
        }
      }
    }
    return isExtraSeatsTagged;
  },
  formValidation(args) {
    const {
      paxKey,
      paxTypeCode,
      cardIndex,
      isInfant,
      extraSeatTag,
      seatWiseSelectedPaxInformation,
    } = args;
    const isCompleted = {};
    const elemId = `${paxKey}-${cardIndex}`;
    const isAllInputFilled = paxCardUtil.checkIfFormCompleted(elemId);
    const isExtraSeats = paxCardUtil.isExtraSeats(isInfant, paxTypeCode, seatWiseSelectedPaxInformation);
    const isExtraSeatsTagged = paxCardUtil.isExtraSeatsTagged(
      isInfant,
      paxKey,
      paxTypeCode,
      seatWiseSelectedPaxInformation,
    );
    const flag = isAllInputFilled
    && (!isExtraSeats || extraSeatTag === NONE_SEAT_CODE || isExtraSeatsTagged?.[paxKey]?.flag);
    isCompleted[paxKey] = { flag };
    return isCompleted;
  },
};

export default paxCardUtil;
