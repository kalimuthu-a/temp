/* eslint-disable no-shadow */
import { PASSENGER_LABEL, PASSENGER_TYPE } from '../constants/constants';
import { getPassengerType, getPassengerTypeCode, getPaxName } from '../helpers';
import { getGender } from './getGender';

const getAllPaxDetails = (fields, originalPassengersData) => {
  const allPaxDetails = [];
  const paxAllAdults = [];
  const paxAllSRCT = [];
  const paxAllChild = [];

  fields.forEach((paxInfo, index) => {
    const {
      name,
      isInfant,
      passengerKey,
      passengerTypeCode,
      discountCode,
      taggedPaxIndex,
      paxTypeNumber,
    } = paxInfo;

    let infantTaggedWithPaxTypeName = '';
    let infantTaggedWithPaxName = '';

    const paxTypeName = getPassengerType(passengerTypeCode, discountCode); // i.e Adult || Senior Citizen
    const paxTypeCode = getPassengerTypeCode(passengerTypeCode, discountCode); // i.e ADT || SCRT
    const paxGender = originalPassengersData[index]?.name?.first ? getGender(paxInfo?.info?.gender) : '';

    const paxName = getPaxName(paxTypeName, paxTypeNumber, name);
    const passengerLabel = `${PASSENGER_LABEL} ${index + 1}`;
    const paxTypeLabel = `${paxTypeName} ${paxTypeNumber}`;
    const isMinorConsent = fields?.minorConsent;

    if (isInfant) {
      const { name, passengerTypeCode, discountCode, paxTypeNumber } = fields[taggedPaxIndex];
      infantTaggedWithPaxTypeName = getPassengerType(passengerTypeCode, discountCode);
      infantTaggedWithPaxName = getPaxName(infantTaggedWithPaxTypeName, paxTypeNumber, name);
    }

    if (paxTypeCode === PASSENGER_TYPE.ADULT) {
      paxAllAdults.push({
        paxName,
        paxKey: passengerKey,
      });
    }
    if (paxTypeCode === PASSENGER_TYPE.SENIOUR) {
      paxAllSRCT.push({
        paxName,
        paxKey: passengerKey,
      });
    }
    if (paxTypeCode === PASSENGER_TYPE.CHILD) {
      paxAllChild.push({
        paxName,
        paxKey: passengerKey,
      });
    }

    allPaxDetails.push({
      paxName,
      paxGender,
      ...paxInfo,
      paxTypeName,
      paxTypeCode,
      discountCode,
      paxTypeLabel,
      cardIndex: index,
      paxKey: passengerKey,
      infantTaggedWithPaxName,
      passengerLabel,
      isMinorConsent,
    });
  });
  const paxAllPersonalDetails = { paxAllAdults, paxAllSRCT, paxAllChild };
  return { paxDetails: allPaxDetails, paxAllPersonalDetails };
};

export default getAllPaxDetails;
