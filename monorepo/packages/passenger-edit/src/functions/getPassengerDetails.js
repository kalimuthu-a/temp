/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-len */
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import passengerEditActions from '../context/actions';
import defaultStatePaxData from './errorStateDataStructure';
import { BLND_SSRCODE, DEAF_SSRCODE, FIRSTTIME_FLYER_ADDON_SSRCODE, MALE_CHILD_TITLE, MUTE_SSRCODE, PASSENGER_TYPE, SPECIALFARE_ID_DATA, TA_SSRCODE, WHEELCHAIR_ADDON_SSRCODE, WHEELCHAIR_USER_CODE } from '../constants/constants';
import { getPassengerTypeCode } from '../helpers';
import { BROWSER_STORAGE_KEYS } from '../constants';
import LocalStorage from '../utils/LocalStorage';
import getPassengerApiCall from './getPassengerApiCall';
import getPolicyConsent from './getPolicyConsentApiCall';

const checkSSRData = (currentPaxKey, ssr) => {
  const obj = {
    options: {
      speechImpaired: false,
      visuallyImpaired: false,
      hearingImpaired: false,
      personWithIntellectualOrDevelopmentDisabilityNeedingAssistance: false,
      electronicWheelchairPersonalWheelchairUser: false,
      wheelchair: false,
      wheelchairAlreadyOpt: false,
      speechImpairedAlreadyOpt: false,
      travelAssistantAlreadyOpt: false,
      visuallyImpairedAlreadyOpt: false,
      hearingImpairedAlreadyOpt: false,
      wheelchairRequired: false,
      speechImpairedRequired: false,
      isFirstTimeFlyerRequired: false,
      visuallyImpairedRequired: false,
    },
    journey: false,
    wheelchair: {
      reason: null,
    },
    consent: false,
  };

  ssr?.forEach(async (ssrItem) => {
    const journeySsrList = ssrItem?.journeySSRs || [];
    const wheelChairSSritem = journeySsrList.find((jssrItem) => jssrItem.category === WHEELCHAIR_ADDON_SSRCODE);
    const FirstTimeFlyerSSritem = journeySsrList.find((jssrItem) => jssrItem.category === FIRSTTIME_FLYER_ADDON_SSRCODE);
    const isDeafSSritem = journeySsrList.find((jssrItem) => jssrItem.category === DEAF_SSRCODE);
    const isSpeechSSritem = journeySsrList.find((jssrItem) => jssrItem.category === MUTE_SSRCODE);
    const isVisualSSritem = journeySsrList.find((jssrItem) => jssrItem.category === BLND_SSRCODE);
    const isTravelAssentSSritem = journeySsrList.find((jssrItem) => jssrItem.category === TA_SSRCODE);
    const wheelchairSSRList = wheelChairSSritem?.ssrs?.map((ssrSubItem) => ssrSubItem.passengersSSRKey.length);
    const visualSSRList = isVisualSSritem?.ssrs?.find((ssrSubItem) => ssrSubItem.passengersSSRKey.length);
    const speechSSRList = isSpeechSSritem?.ssrs?.find((ssrSubItem) => ssrSubItem.passengersSSRKey.length);
    const deafSSRList = isDeafSSritem?.ssrs?.find((ssrSubItem) => ssrSubItem.passengersSSRKey.length);
    const firstTimeFlyerSSRList = FirstTimeFlyerSSritem?.ssrs?.find((ssrSubItem) => ssrSubItem.passengersSSRKey.length);

    if (wheelchairSSRList) {
      obj.options.wheelchairRequired = true;
    }
    if (wheelChairSSritem?.takenssr?.length > 0) {
      const passengerTookWheelChair = wheelChairSSritem?.takenssr?.find((takenSsrItem) => (takenSsrItem?.PassengerKey === currentPaxKey || takenSsrItem?.passengerKey === currentPaxKey));
      if ((passengerTookWheelChair?.ssrCode === WHEELCHAIR_ADDON_SSRCODE) || (passengerTookWheelChair?.ssrCode === WHEELCHAIR_USER_CODE)) {
        obj.options.wheelchairAlreadyOpt = true;// this onchange will takecare if we already opted then wheelchair post will not taken to addon again
        obj.options.wheelchair = true;
      }
    }
    if (firstTimeFlyerSSRList) {
      obj.options.isFirstTimeFlyerRequired = true;
    }
    if (FirstTimeFlyerSSritem?.takenssr?.length > 0) {
      const passengerTookFirstTimeFlyer = FirstTimeFlyerSSritem?.takenssr?.find((takenSsrItem) => (takenSsrItem?.PassengerKey === currentPaxKey || takenSsrItem?.passengerKey === currentPaxKey));
      if (passengerTookFirstTimeFlyer?.ssrCode === FIRSTTIME_FLYER_ADDON_SSRCODE) { // this onchange will takecare if we already opted then wheelchair post will not taken to addon again
        obj.options.isFirstTimeFlyerAlreadyOpt = true;
        obj.options.isFirstTimeFlyer = true;
      }
    }
    if (deafSSRList) {
      obj.options.hearingImpairedRequired = true;
    }
    if (isDeafSSritem?.takenssr?.length > 0) {
      const passengerTookDeaf = isDeafSSritem?.takenssr?.find((takenSsrItem) => (takenSsrItem?.PassengerKey === currentPaxKey || takenSsrItem?.passengerKey === currentPaxKey));
      if (passengerTookDeaf?.ssrCode === DEAF_SSRCODE) {
        // this onchange will takecare if we already opted then wheelchair post will not taken to addon again
        obj.options.hearingImpairedAlreadyOpt = true;
        obj.options.hearingImpaired = true;
      }
    }
    if (visualSSRList) {
      obj.options.visuallyImpairedRequired = true;
    }
    if (isVisualSSritem?.takenssr?.length > 0) {
      const passengerTookBlind = isVisualSSritem?.takenssr?.find((takenSsrItem) => (takenSsrItem?.PassengerKey === currentPaxKey || takenSsrItem?.passengerKey === currentPaxKey));
      if (passengerTookBlind?.ssrCode === BLND_SSRCODE) {
        // this onchange will takecare if we already opted then wheelchair post will not taken to addon again
        obj.options.visuallyImpairedAlreadyOpt = true;
        obj.options.visuallyImpaired = true;
      }
    }
    if (speechSSRList) {
      obj.options.speechImpairedRequired = true;
    }
    if (isSpeechSSritem?.takenssr?.length > 0) {
      const passengerTookMute = isSpeechSSritem?.takenssr.find((takenSsrItem) => (takenSsrItem?.PassengerKey === currentPaxKey || takenSsrItem?.passengerKey === currentPaxKey));
      if (passengerTookMute?.ssrCode === MUTE_SSRCODE) {
        // this onchange will takecare if we already opted then wheelchair post will not taken to addon again
        // return null;
        obj.options.speechImpairedAlreadyOpt = true;
        obj.options.speechImpaired = true;
      }
    }
    if (isTravelAssentSSritem?.takenssr?.length > 0) {
      obj.options.travelAssistantAlreadyOpt = true;
    }
  });
  return obj;
};

const getPassengersDocs = async (dispatch) => {
  let paxData = {};
  const role = Cookies.get(BROWSER_STORAGE_KEYS.ROLE_DETAILS, true);
  const isSMEUser = role?.roleCode === BROWSER_STORAGE_KEYS.SME_ROLE_TYPE;
  const isAgent = role?.roleCode === BROWSER_STORAGE_KEYS.AGENT_ROLE_TYPE;
  try {
    paxData = await getPassengerApiCall(true);
    if (!paxData?.errors && paxData?.passengerInfo) {
      let modificationFlow = false;
      const { passengerInfo } = paxData;
      const { passengers, ssr, configurations, agentAccountInfo } = passengerInfo;
      if (!configurations.specialFareCode) {
        // if the booking dont have specialfare - we clear storage so that will not pick during payment
        LocalStorage.remove(SPECIALFARE_ID_DATA);
      }
      const allPax = [];
      const infants = [];
      const paxTypeCount = {
        ADT: 0,
        SRCT: 0,
        CHD: 0,
        INFT: 0,
      };
      passengers.forEach((pax, paxIndex) => {
        const paxDetails = { ...pax };
        if (!pax.name) {
          paxDetails.name = {
            first: '',
            middle: '',
            last: '',
          };
        }
        const paxTypeCode = getPassengerTypeCode(pax.passengerTypeCode, pax.discountCode);
        paxTypeCount[paxTypeCode] += 1;
        paxDetails.paxTypeNumber = paxTypeCount[paxTypeCode];
        if (paxTypeCode === PASSENGER_TYPE.ADULT && isSMEUser) {
          const { name, info } = agentAccountInfo;
          let gender = '';
          if (name.title === MALE_CHILD_TITLE) gender = 1;
          else gender = 2;
          paxDetails.name = name;
          paxDetails.info = info;
          paxDetails.info.gender = gender;
        }
        if (pax?.name?.first) modificationFlow = true;
        if (pax.infant) {
          paxDetails.infantTaggedWith = {
            name: pax.name,
            parentTypeCode: pax.passengerTypeCode,
            paxNumber: paxIndex,
          };
        }

        paxDetails.infant = null;

        // Update SSR Data -START
        const obj = checkSSRData(pax?.passengerKey, ssr);
        paxDetails.specialAssistance = obj;
        // Update SSR Data -END
        allPax.push(paxDetails);
      });
      passengers.forEach((pax, paxIndex) => {
        if (pax?.infant) {
          paxTypeCount.INFT += 1;
          infants.push({
            isInfant: true,
            name: pax.infant.name,
            passengerTypeCode: 'INFT',
            taggedPaxIndex: paxIndex,
            paxTypeNumber: paxTypeCount.INFT,
            passengerKey: `${pax.passengerKey}infant`,
            info: {
              dateOfBirth: pax.infant.dateOfBirth,
              gender: pax.infant.gender,
            },
          });
        }
      });
      const paxInfo = [...allPax, ...infants];
      passengerInfo.passengers = paxInfo;
      passengerInfo.modificationFlow = modificationFlow;
      passengerInfo.isSMEUser = !modificationFlow && isSMEUser;
      passengerInfo.isAgentUser = isAgent;
      let getPolicyData = null;
      if (modificationFlow) {
        getPolicyData = await getPolicyConsent();
        let minorConsentCheckboxData=[];
        if (getPolicyData && !getPolicyData?.errors) {
          getPolicyData?.forEach((data) => {
            if (data?.AdultConsent) {
              minorConsentCheckboxData.push({
                passengerKey: data?.PassengerKey,
                isSelected: true,
                isCardSelected: true,
              });
            }
          })
        }
        dispatch({
          type: passengerEditActions.SET_ADULT_CONSENT_DATA,
          payload: minorConsentCheckboxData,
        });
      }
      if (!passengerInfo?.bookingcontacts?.length) {
        passengerInfo.bookingcontacts = defaultStatePaxData.bookingcontacts;
      }
      dispatch({
        type: passengerEditActions.SET_PASSENGERS_DATA,
        payload: passengerInfo,
      });
      dispatch({
        type: passengerEditActions.SET_LOADER,
        payload: false,
      });
      dispatch({
        type: passengerEditActions.SET_PRIVACY_POLICY_DATA,
        payload: getPolicyData,
      });
    }
  } catch (e) {
    paxData = defaultStatePaxData;
    console.log('Get passenger API error', e);
    return {};
  }
  return {};
};

export default getPassengersDocs;
