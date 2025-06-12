import { PASSENGER_TYPE } from '../constants/constants';

const checkIfMinorConsentForChild = (objectsArray, setError, clearErrors) => {
  for (const [index, obj] of objectsArray.entries()) {
    if ((!Object.prototype.hasOwnProperty.call(obj, 'minorConsent')
      || obj.minorConsent === '' || obj.minorConsent === false)
      && (obj.passengerTypeCode === PASSENGER_TYPE.CHILD
        || obj.passengerTypeCode === PASSENGER_TYPE.INFANT)) {
      setError(`userFields.${index}.minorConsent`, {
        type: 'manual',
        message: 'This field is required',
        flag: 'minorConsent',
      });
      return false;
    }

    clearErrors(`userFields.${index}.minorConsent`);
  }
  return true;
};
export default checkIfMinorConsentForChild;
