import {
  DEFAULT_COUNTRY_CODE,
  WHEELCHAIR_USER,
  WHEELCHAIR_USER_CODE,
  WHEELCHAIR_ADDON_SSRCODE,
  MEDICAL_REASONS,
  OTHERS,
  DEAF_SSRCODE,
  MUTE_SSRCODE,
  BLND_SSRCODE,
  ALL_LABEL,
} from '../constants/constants';

function createSSRPayloadForWheelchair(formData, ssrs) {
  const output = [];
  const { userFields = [] } = formData || {};

  userFields?.forEach((field) => {
    const {
      passengerKey,
      specialAssistance: { options = {}, wheelchair = {} } = {},
    } = field || {};

    if (
      !options?.wheelchairAlreadyOpt && (options?.wheelchair
        || options?.electronicWheelchairPersonalWheelchairUser)
    ) {
      const ssrCodeBasedWheelChairReason = wheelchair?.reason === WHEELCHAIR_USER
        ? WHEELCHAIR_USER_CODE
        : WHEELCHAIR_ADDON_SSRCODE;

      const selectedJourneys = field?.specialAssistance?.journey || [];

      const journeyList = selectedJourneys?.includes(ALL_LABEL)
        ? ssrs?.map(({ journeyKey }) => journeyKey)
        : selectedJourneys;

      journeyList?.forEach((key) => {
        const journeySSRItem = ssrs?.find((item) => item.journeyKey === key);
        const wheelchairSSR = journeySSRItem?.journeySSRs?.find(
          (item) => item?.category === WHEELCHAIR_ADDON_SSRCODE,
        );

        const journeySSRs = wheelchairSSR?.ssrs?.find(
          (sItems) => sItems?.ssrCode === ssrCodeBasedWheelChairReason,
        ) || {};

        const foundPassengerKey = journeySSRs?.passengersSSRKey?.find(
          (jItem) => jItem.passengerKey === passengerKey,
        );

        if (foundPassengerKey) {
          let noteText = `${ssrCodeBasedWheelChairReason}|${wheelchair?.reason}`;
          if (wheelchair?.reason === MEDICAL_REASONS) {
            noteText += `|${wheelchair?.category}|${wheelchair?.subCategory}`;
          } else if (wheelchair?.reason === WHEELCHAIR_USER) {
            noteText += `|${wheelchair?.category}`;
          } else if (wheelchair?.reason === OTHERS) {
            noteText += `|${wheelchair?.countryCode || DEFAULT_COUNTRY_CODE}|
            ${wheelchair?.contactNumber}|${wheelchair?.assistanceRequired}`;
          }
          if (wheelchair?.assistencelevel) {
            noteText += `|${wheelchair.assistencelevel}`;
          }
          output.push({
            // push the ssr key of foundPassengerKey
            ssrkey: foundPassengerKey?.ssrKey,
            count: 1,
            note: noteText,
          });
        }
      });
    }

    if (options?.hearingImpaired && !options?.hearingImpairedAlreadyOpt) {
      const apiSSRList = ssrs || [];
      apiSSRList.forEach((ssrItem) => {
        const findDeafSSR = ssrItem?.journeySSRs.find(
          (sItems) => sItems.category === DEAF_SSRCODE,
        ) || {};
        const passengerSpecificSSR = findDeafSSR?.ssrs?.find(
          (jSSRItem) => jSSRItem.ssrCode === DEAF_SSRCODE,
        ) || {};
        const foundPassengerSSR = passengerSpecificSSR?.passengersSSRKey?.find(
          (paxSSR) => paxSSR?.passengerKey === passengerKey,
        );
        if (foundPassengerSSR) {
          output.push({
            ssrkey: foundPassengerSSR?.ssrKey,
            count: 1,
            note: '',
          });
        }
      });
    }
    if (options?.speechImpaired && !options?.speechImpairedAlreadyOpt) {
      const apiSSRList = ssrs || [];
      apiSSRList.forEach((ssrItem) => {
        const findMuteTimeSSR = ssrItem?.journeySSRs.find(
          (sItems) => sItems.category === MUTE_SSRCODE,
        ) || {};
        const passengerSpecificSSR = findMuteTimeSSR?.ssrs?.find(
          (jSSRItem) => jSSRItem.ssrCode === MUTE_SSRCODE,
        ) || {};
        const foundPassengerSSR = passengerSpecificSSR?.passengersSSRKey?.find(
          (paxSSR) => paxSSR?.passengerKey === passengerKey,
        );
        if (foundPassengerSSR) {
          output.push({
            ssrkey: foundPassengerSSR?.ssrKey,
            count: 1,
            note: '',
          });
        }
      });
    }
    if (options?.visuallyImpaired && !options?.visuallyImpairedAlreadyOpt) {
      const apiSSRList = ssrs || [];
      apiSSRList.forEach((ssrItem) => {
        const findBlindTimeSSR = ssrItem?.journeySSRs.find(
          (sItems) => sItems.category === BLND_SSRCODE,
        ) || {};
        const passengerSpecificSSR = findBlindTimeSSR?.ssrs?.find(
          (jSSRItem) => jSSRItem.ssrCode === BLND_SSRCODE,
        ) || {};
        const foundPassengerSSR = passengerSpecificSSR?.passengersSSRKey?.find(
          (paxSSR) => paxSSR?.passengerKey === passengerKey,
        );
        if (foundPassengerSSR) {
          output.push({
            ssrkey: foundPassengerSSR?.ssrKey,
            count: 1,
            note: '',
          });
        }
      });
    }
  });
  return output;
}

export default createSSRPayloadForWheelchair;
