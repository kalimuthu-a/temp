import { CONSTANTS } from '../../constants';

const { GENERIC_DATA_CONTAINER_APP, LOYALTY_PAX_TYPES } = CONSTANTS;

export const getLoyaltyTierLabel = (tierStrApi) => {
  try {
    const localStorageObj = JSON.parse(localStorage.getItem(GENERIC_DATA_CONTAINER_APP));
    const foundLabelObj = localStorageObj?.loyaltyTierLabel?.find((i) => i?.key?.toLowerCase() === tierStrApi?.toLowerCase());
    return foundLabelObj?.value || tierStrApi;
  } catch (error) {
    return tierStrApi;
  }
};

// check nominee from passenger list
export const checkPassengerIsNotNomini = (passengerData) => {
  try {
    const isNominiOrSelf = passengerData?.travelDocuments?.[0]?.number.split('|')[0];
    return !((LOYALTY_PAX_TYPES.SELF === isNominiOrSelf.trim() || LOYALTY_PAX_TYPES.NOMINEE === isNominiOrSelf.trim()));
  } catch (error) {
    return false;
  }
};
