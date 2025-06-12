/* eslint-disable consistent-return */
/* eslint-disable sonarjs/cognitive-complexity */
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import createPostPayload from './createPostPaxPayload';
import {
  ARMED_FORCE_ID_CODE,
  CUSTOM_EVENTS,
  DEFAULT_COUNTRY_CODE,
  MEDICAL_LABEL,
  SALUTATION_ADULT,
  SPECIALFARE_ID_DATA,
  STUDENT_ID_CODE,
  VAXI_SPECIAL_CODE,
} from '../constants/constants';
import passengerEditActions from '../context/actions';
import createSSRPayloadForWheelchair from './createSSRPayloadForWheelchair';
import pushAnalytic from '../utils/analyticEvents';
import { pushDataLayer } from '../utils/dataLayerEvents';
import { GTM_CONSTANTS, localStorageKeys } from '../constants';
import LocalStorage from '../utils/LocalStorage';
import favTravellerPayload from './favTravellerPayload';
import passengerPost from './passengerPost';
import loyaltySignup from './loyaltySignup';
import createLoyaltyPayload from './createLoyaltyPayload';
import getFormattedLoyaltyInfo from './getFormattedLoyaltyInfo';

const getSalutionLabelByCode = (code) => {
  const filtered = SALUTATION_ADULT.find((i) => i.gender === code);
  return filtered?.label || code;
};

export const getSpecialFareMessageText = (type, dataUp) => {
  const formData = dataUp?.userFields || [];
  let messageText = '';
  if (type === MEDICAL_LABEL) {
    messageText = 'NSDR ID: ';
    formData?.forEach((formItem) => {
      const IdToAppend = formItem?.hospitalId || '';
      if (IdToAppend) {
        messageText += `${IdToAppend}|`;
      }
    });
  } else if (type === ARMED_FORCE_ID_CODE) {
    messageText = 'Military ID: ';
    formData?.forEach((formItem) => {
      const IdToAppend = formItem?.armedForcesId || '';
      if (IdToAppend) {
        messageText += `${IdToAppend}|`;
      }
    });
  } else if (type === STUDENT_ID_CODE) {
    messageText = 'STUD: ';
    formData?.forEach((formItem) => {
      const IdToAppend = `${formItem?.studentId}-${formItem?.institutionId}` || '';
      if (IdToAppend) {
        messageText += `${IdToAppend}|`;
      }
    });
  } else if (type === VAXI_SPECIAL_CODE) {
    messageText = 'VAC: ';
    formData?.forEach((pax, index) => {
      const salutation = getSalutionLabelByCode(pax?.gender);
      const firstName = pax.name.first.charAt(0).toUpperCase() + pax.name.first.slice(1);
      const lastName = pax.name.last.charAt(0).toUpperCase() + pax.name.last.slice(1);
      const IdToAppend = `${index},${salutation},${firstName},${lastName},${pax.vaccinationId}`
        || '';
      if (IdToAppend) {
        messageText += `${IdToAppend}|`;
      }
    });
  }
  const specialFareMessageText = messageText?.replace(/\|$/, '');
  // removing the "|" from the end if it is a last char

  formData?.forEach((data, index) => {
    const updatedData = {
      ...data,
      minorConsent: !!data?.minorConsent,
    };

    formData[index] = updatedData;
  });
  const dataToStore = {
    type,
    data: formData,
    commentText: specialFareMessageText,
  };
  LocalStorage.set(SPECIALFARE_ID_DATA, dataToStore);
};

const onSubmit = async ({
  data,
  hidePE,
  errors,
  dispatch,
  passengers,
  extraSeatKeys,
  setIsHidden,
  ssr,
  isProtectionAdded,
  zeroCancellationAdded,
  state,
  agentAccountInfo,
  modificationFlow,
  whatsappState,
  gstDetails,
  specialFareCode,
  privacyDescription,
  loyaltyMemberAgeInvalidError,
  setError,
  getValues,
  duplicateNameFFNMismatchError,
  setValue,
  fareMaskOptionValue,
  gstErrorMsg,
  ibc,
  isPointSplitupEnabled,
  setPointSplitError,
  pointSplitRequired,
  pointSplitMandatoryErrorMessage,
  pointSplitRef,
  totalFare,
}, toPath) => {
  if (hidePE) {
    return;
  }

  if (isEmpty(errors) && !isEmpty(data)) {
    getFormattedLoyaltyInfo(data?.userFields, setValue);
    // eslint-disable-next-line prefer-const
    if (isPointSplitupEnabled && pointSplitRequired?.required) {
      setPointSplitError(pointSplitMandatoryErrorMessage
        ?.replace('{maximumAllowed}', pointSplitRequired
          ?.maximumAllowed
          ?.toLocaleString('en-IN')));
      setTimeout(() => {
        pointSplitRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
      return;
    }
    let { passengerArray = [], infants = [] } = createPostPayload(
      modificationFlow,
      data,
      [],
      ssr,
      specialFareCode,
      false,
      loyaltyMemberAgeInvalidError,
    );
    const originalPax = passengers;
    if (passengerArray.length + infants.length === originalPax?.length) {
      passengerArray = sortBy(passengerArray, 'infant');
      passengerArray = uniqBy(passengerArray, 'passengerKey');
      const firstpassengerArray = passengerArray[0] ? passengerArray[0] : {};
      const seatKeys = (extraSeatKeys || []).map((item) => ({
        passengerKey: item.passengerKey,
        discountCode: item.discountCode,
      }));
      const savedpassengers = data?.userFields?.filter((el) => el.save);
      const payload = {
        passengers: passengerArray,
        extraSeatKeys: seatKeys || [],
      };
      if(isPointSplitupEnabled && ibc) {
        payload.ibc = ibc;
      }
      payload.agentAccountInfo = agentAccountInfo;
      payload.bookingcontacts = [
        {
          MobilePhoneCountryCode: data.countryCode || DEFAULT_COUNTRY_CODE,
          MobilePhone: data.primaryContact,
          OtherPhoneCountryCode: data.altCountryCode || '',
          OtherPhone: data.altContact || '',
          EmergencyPhoneCountryCode: null,
          EmergencyPhone: null,
          EmergencyContactRelationship: null,
          isWhatsAppSubscribed: whatsappState.whatsappCheck || false,
          emailAddress: data.email,
          name: firstpassengerArray?.name,
          fareMaskOptionValue,
        },
      ];

      const { companyName, companyGstNum, companyEmail } = gstDetails;
      if (companyName.value && companyGstNum.value && companyEmail.value) {
        payload.gstContact = {
          CompanyName: companyName.value,
          CustomerNumber: companyGstNum.value,
          EmailAddress: companyEmail.value,
          SkipInformation: false,
        };
      }

      if (savedpassengers?.length > 0) {
        payload.newfavoriteTraveller = favTravellerPayload(savedpassengers);
      }

      delete payload?.passengers?.[0]?.loyaltyInfo?.optLoyaltySignup;

      let loyaltySignupPromise = null;

      if (data?.userFields?.[0]?.loyaltyInfo?.optLoyaltySignup) {
        const loyltySignupPayload = createLoyaltyPayload({
          data,
          privacyDescription,
        });
        loyaltySignupPromise = loyaltySignup(
          loyltySignupPayload,
          'Passenger Details',
          modificationFlow,
          dispatch,
          setValue,
        );
      } else {
        loyaltySignupPromise = Promise.resolve(null);
      }

      const [passengerPostResponse, loyaltySignupResponse] = await Promise.all([
        passengerPost(
          {
            data: payload,
            errors: null,
          },
          dispatch,
          'Passenger Details',
          modificationFlow,
          setError,
          getValues,
          duplicateNameFFNMismatchError,
          gstErrorMsg,
        ),
        loyaltySignupPromise,
      ]);

      const isPassengerPostSuccess = passengerPostResponse?.data?.success;
      let isLoyaltySignupSuccess = true;
      if (data?.userFields?.[0]?.loyaltyInfo?.optLoyaltySignup) {
        if (loyaltySignupResponse?.data?.success) {
          isLoyaltySignupSuccess = true;
          LocalStorage.set(localStorageKeys.loyal_opt_signup_enroll, 1);
        } else if (loyaltySignupResponse?.errors) {
          isLoyaltySignupSuccess = false;
        }
      }

      if (isPassengerPostSuccess && isLoyaltySignupSuccess) {
        const eventData = {
          // payload,
          from: 'passenger-details',
          // eslint-disable-next-line no-nested-ternary
          mfToOpen: toPath === 'seat'
            ? 'seat-selection'
            : (toPath === 'payment' ? '' : 'addon'),
        };

        const genderValues = passengerArray?.map((ele) => ele?.info?.gender);
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!toPath) {
          const dataEvent = new CustomEvent('GET_PASSENGER_DATA', {
            bubbles: true,
            detail: {
              formData: { ...data, ...firstpassengerArray, genderValues },
              eventData: toPath,
              whatsappState,
              state,
            },
          });
          document.dispatchEvent(dataEvent);
        }

        if (toPath === 'payment') {
          const passengerEvent = new CustomEvent(CUSTOM_EVENTS.PASSENGER_ADDED, {
            bubbles: true,
            detail: { isPassengerAdded: isPassengerPostSuccess },
          });
          document.dispatchEvent(passengerEvent);
        }

        eventData.wheelchairSSRList = createSSRPayloadForWheelchair(data, ssr);
        eventData.travelAssistance = isProtectionAdded;
        eventData.zeroCancellation = zeroCancellationAdded;
        if (toPath) {
          eventData.isPassengerAdded = isPassengerPostSuccess;
        }

        const event = new CustomEvent(CUSTOM_EVENTS.MAKE_ME_EXPAND_V2, {
          bubbles: true,
          detail: eventData,
        });
        // dispatching event to catch the event in seatselect component and toggle the addon
        document.dispatchEvent(event);
        dispatch({
          type: passengerEditActions.ADD_PASSENGER_PAYLOAD,
          payload,
        });
        setIsHidden(true);
        // Google Analytic
        pushDataLayer({
          data: {
            data,
            _event: GTM_CONSTANTS.NEXT,
            journeyFlow: modificationFlow,
            savedpassengers: passengers,
          },
          event: GTM_CONSTANTS.NEXT,
          error: {},
        });
        /**
         * Adobe Analytic | page load
         */

        if (!toPath) {
          pushAnalytic({
            data: {
              formData: { ...data, ...firstpassengerArray },
              _event: GTM_CONSTANTS.ENTER_PASSENGER_DETAILS,
              name: GTM_CONSTANTS.NEXT,
              state,
              whatsappState,
              ssr,
              totalFare,
            },
            event: 'passengerDetails',
            error: {},
          });
        }
        return true;
      }
      setValue(`userFields.${0}.loyaltyInfo.optLoyaltySignup`, false);
      return false;
    }
  }
};

export default onSubmit;
