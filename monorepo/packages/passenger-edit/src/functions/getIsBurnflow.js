import { INDIGO_BLUCHIPS, INDIGO_BLUCHIPS_CASH } from '../constants/constants';

export const getIsBurnflow = (payType) => {
  if (payType === INDIGO_BLUCHIPS || payType === INDIGO_BLUCHIPS_CASH) return true;
  return false;
};
