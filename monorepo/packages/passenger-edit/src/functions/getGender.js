/* eslint-disable import/prefer-default-export */
import {
  MALE_GENDER_TYPE,
  FEMALE_GENDER_TYPE,
  OTHERS_GENDER_TYPE,
} from '../constants/constants';

const getGender = (digit) => {
  if (digit) {
    if (digit.toString() === '1') return MALE_GENDER_TYPE;
    if (digit.toString() === '2') return FEMALE_GENDER_TYPE;
    if (digit.toString() === '3') return FEMALE_GENDER_TYPE;
    if (digit === MALE_GENDER_TYPE) return '1';
    if (digit === FEMALE_GENDER_TYPE) return '2';
    if (digit === OTHERS_GENDER_TYPE) return '2';
    return OTHERS_GENDER_TYPE;
  }
  return '';
};

export { getGender };
