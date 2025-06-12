/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-console */
import React, { useContext, useEffect, useState, useRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { useCustomEventListener } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
// import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { paxCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import PassengerDetails from './PassengerDetails/PassengerDetails';
import ContactDetailsForm from './ContactDetailsForm/ContactdetailsForm';
import PDConsent from './PDConsent/PDConsent';
import SavedPassengers from './SavedPassengers/SavedPassengers';
import { AppContext } from '../../context/appContext';
import passengerEditActions from '../../context/actions';
import BackToPrevPage from './BackToPrevPage/BackToPrevPage';
import {
  CUSTOM_EVENTS,
  LOGIN_SUCCESS,
  DEFAULT_COUNTRY_CODE,
  TAG_EXTRA_SEATS_ERROR_LABEL,
  PASSENGER_EDIT_SECTION_IDENTIFIER,
  PE_MODIFICATION_PAGE,
  TA_SSRCODE,
  WHATSAPP_KEY,
  EMAIL_ADDRESS_ELEMENT_NAME,
  PRIMARY_CONTACT_ELEMENT_NAME,
  ALT_CONTACT_ELEMENT_NAME,
  LOGOUT_SUCCESS,
  COUNTRY_CODE_ELEMENT_NAME,
  ALT_COUNTRY_CODE_ELEMENT_NAME,
  PASSENGER_TYPE,
  PRIVACY_POLICY_KEY,
  MINOR_POLICY_KEY,
  LOYALTY_LOGIN_SUCCESS,
  UMNR_ID_CODE,
  FAREMASKING_KEY,
  ZERO_CANCELLATION_SSRCODE,
  EUROPEAN_RESIDENT_KEY,
} from '../../constants/constants';

import onSubmit, {
  getSpecialFareMessageText,
} from '../../functions/onSubmitForm';
import JourneyBar from './JourneyBar/JourneyBar';
import Heading from '../../common/HeadingComponent/Heading';
// import TravelAssistance from './TravelAssistant/TravelAssistance';
import Shimmer from '../../common/Shimmer/Shimmer';
import checkIfAllSeatsTagged from '../../functions/checkIfAllSeatsTagged';
import {
  checkIfValidAltEmail,
  checkIfValidAltPhone,
  checkIfValidEmail,
  checkIfValidPhone,
  checkIfValidName,
} from '../../functions/checkIfValidContact';
import createSSRPayloadForWheelchair from '../../functions/createSSRPayloadForWheelchair';
import { GTM_CONSTANTS } from '../../constants';
import requiredTickSelected from '../../functions/checkIfRequiredTickSelected';
import createPostPayload from '../../functions/createPostPaxPayload';
import nextButtonStateUtil, {
  nextButtonLoadingStateUtil,
} from '../../utils/nextButtonStateUtil';
import makeAddonPostAPI from '../../functions/makeAddonPostApi';
import pushAnalytic from '../../utils/analyticEvents';
import consentChangeHandler from './PDConsent/consentChangeHandler';
import checkIfAllGenderOpted from '../../functions/checkIfAllGenderOpted';
import getSessionToken from '../../utils/storage';
import COOKIE_KEYS from '../../constants/cookieKeys';
import { makePrivacyPostApi } from '../../services';
import favTraveller from '../../functions/finalFavTraveller';
import { getLoggedInUser } from '../../functions/getTravellerWithLoggedInFirst';
import getPassengerApiCall from '../../functions/getPassengerApiCall';
import LoyaltyNote from '../LoyaltyNote/LoyaltyNote';
import GstForm from './GstForm/GstForm';
import checkDuplicateNames from './PassengerDetails/PassengerForm/PaxInput/checkDuplicateNames';
import { getIsBurnflow } from '../../functions/getIsBurnflow';
import checkDuplicateFF from './PassengerDetails/PassengerForm/FFNumber/checkDuplicateFF';
import { getBWCntxtVal } from '../../utils/localStorageUtils';
import { isIOSDevice, stripCountryCode } from '../../helpers';
import FareDetailsMasking from './FareDetailsMasking/FareDetailsMasking';
import getUpdatedFavNomineeTraveller from '../../functions/getUpdatedFavNomineeTraveller';
import checkIfMinorConsentForChild from '../../functions/checkIfMinorConsentForChild';
import AuthBannerLoyalty from '../AuthBannerLoyalty/AuthBannerLoyalty';
import TravelAndZeroAssistance from './TAZeroAssistances/TravelAndZeroAssistance';
import PointsSplitup from './PointsSplitup/PointsSplitup';

const PassengerDetailsApp = (props) => {
  const {
    state,
    state: {
      ssr,
      extraSeatKeys,
      bookingContext,
      passengers,
      modificationFlow,
      postApiPayload,
      loader,
      isSMEUser,
      loggedInUser,
      isBurnFlow,
      nextFlagForGst,
      gstDetails,
      specialFareCode,
      passengerEditError,
      isAuthenticated,
      disableLoyalty,
      adultConsentData,
      paxData: {
        agentAccountInfo,
        bookingcontacts,
        favoriteTraveller,
        nomineeTraveller,
        configurations,
        bookingDetails,
      },
      aemMainData: {
        privacyDescription,
        label,
        passengerDetails,
        travelAssistance,
        cancellationAssistance,
        backToSearchResultsPath,
        backToSearchResultsLabel,
        userPermittedForMiles,
        noteLabel,
        duplicateNameError,
        codeShare,
        loyaltyMemberAgeInvalidError,
        frequentFlyerDetails,
        loginWithSavedPaxDetails,
        duplicateNameFFNMismatchError,
        fareMaskingLabel,
        gstErrorMsg,
        confirmFareCtaLabel,
        pointSplitMandatoryErrorMessage,
      },
      bookingContext: { seatWiseSelectedPaxInformation },
      isLoyaltyAuthenticated,
    },
    dispatch,
  } = useContext(AppContext);

  const {
    isProtectionAdded,
    zeroCancellationAdded,
    setIsProtectionAdded,
    setZeroCancellationAdded,
  } = props;

  // const [isMobile] = useIsMobile();
  const [pointSplitValue, setPointSplitValue] = useState(null);
  const [pointSplitRequired, setPointSplitRequired] = useState(false);
  const [pointSplitError, setPointSplitError] = useState(null);
  const pointSplitRef = useRef();

  let isPointSplitupEnabled = true;
  if (disableLoyalty || !isLoyaltyAuthenticated || !isBurnFlow || !confirmFareCtaLabel) {
    isPointSplitupEnabled = false;
  }

  // reload the page if coming from the modification flow.
  useEffect(() => {
    const reloadPage = () => {
      window.location.reload();
    };

    if (PE_MODIFICATION_PAGE === window.pageType && isIOSDevice()) {
      window.addEventListener('pageshow', reloadPage);
    }
    return () => {
      window.removeEventListener('pageshow', reloadPage);
    };
  }, []);

  const [isHidden, setIsHidden] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [totalEarnPoints, setTotalEarnPoints] = useState(0);
  const [totalFare, setTotalFare] = useState(0);
  const [infantPrice, setInfantPrice] = useState(0);
  const [privacyPolicies, setPrivacyPolicies] = useState([]);

  const { validationMessage } = frequentFlyerDetails || {};
  const [fareMaskingEnable, setFareMaskingEnable] = useState(false);
  const codeShareDetails = codeShare?.find((obj) => bookingDetails?.carrierCode === obj?.carrierCode);
  const hidePE = !isEmpty(postApiPayload) && isHidden;
  const defaultValues = {};

  const bookingContact = bookingcontacts?.[0] || {};
  defaultValues.email = bookingContact.emailAddress || agentAccountInfo?.emailAddress || '';
  defaultValues.countryCode = bookingContact.MobilePhoneCountryCode
    || agentAccountInfo?.mobilePhoneCountryCode
    || DEFAULT_COUNTRY_CODE;
  defaultValues.isWhatsAppSubscribed = bookingContact.isWhatsAppSubscribed || '';
  defaultValues.fareMaskOptionValue = bookingContact.fareMaskOptionValue || fareMaskingEnable;
  const defaultPrimaryContact = bookingContact.MobilePhone || agentAccountInfo?.mobilePhone || '';
  defaultValues.primaryContact = stripCountryCode(defaultPrimaryContact, defaultValues.countryCode);
  const {
    OtherPhone,
    OtherPhoneCountryCode,
  } = bookingcontacts[0];
  defaultValues.altContact = OtherPhone;
  defaultValues.altCountryCode = OtherPhoneCountryCode || DEFAULT_COUNTRY_CODE;

  const methods = useForm({
    mode: 'all',
    defaultValues: {
      userFields: [],
      altEmail: '',
      ...defaultValues,
    },
  });

  const {
    setValue,
    getValues,
    control,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = methods;

  // eslint-disable-next-line no-unused-vars
  const { fields } = useFieldArray({
    control,
    name: 'userFields',
  });

  const modifyFlowNextBtnUrl = window?.msdv2?.itineraryPagePath;

  useEffect(() => {
    const hasParam = window.location.hash?.substring(1);
    if (
      [
        PASSENGER_EDIT_SECTION_IDENTIFIER.ADDON,
        PASSENGER_EDIT_SECTION_IDENTIFIER.SEATSELECTION,
      ].includes(hasParam)
    ) {
      setIsHidden(true);
    }

    const obj = localStorage.getItem('journeyReview');
    const parsedObj = JSON.parse(obj) || {};
    if (parsedObj?.priceBreakdown?.totalPotentialPoints) {
      setTotalEarnPoints(parsedObj?.priceBreakdown?.totalPotentialPoints);
    }
    if (parsedObj?.priceBreakdown?.journeywiseList?.length > 0) {
      let infantTemp = 0;
      parsedObj?.priceBreakdown?.journeywiseList.forEach((jItem) => {
        infantTemp += jItem.infantPrice;
      });
      setInfantPrice(infantTemp);
    }
    if (parsedObj?.priceBreakdown?.totalAmount) {
      setTotalFare(parsedObj?.priceBreakdown?.totalAmount);
    }
  }, []);

  const showToast = (description) => {
    setToastProps({
      flag: true,
      title: 'Error',
      position: 'top-bottom',
      description,
      variation: 'notifi-variation--Error',
      onClose: () => {
        setToastProps(null);
      },
    });
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    passengerEditError?.flag && showToast(passengerEditError?.message);
  }, [passengerEditError]);

  useEffect(() => {
    setValue(EMAIL_ADDRESS_ELEMENT_NAME, defaultValues.email);
    setValue('userFields', passengers);
    setValue(COUNTRY_CODE_ELEMENT_NAME, defaultValues.countryCode);
    setValue(PRIMARY_CONTACT_ELEMENT_NAME, defaultValues.primaryContact);
    setValue(ALT_COUNTRY_CODE_ELEMENT_NAME, defaultValues.altCountryCode);
    setValue(ALT_CONTACT_ELEMENT_NAME, defaultValues.altContact);
    setValue(FAREMASKING_KEY, defaultValues.fareMaskOptionValue);
  }, [passengers]);

  useEffect(() => {
    const { name, details } = loggedInUser || {};
    const loggedInUserData = getLoggedInUser({ name, details });
    const updatedFavNomineeTraveller = getUpdatedFavNomineeTraveller({
      loggedInUserData,
      favoriteTraveller,
      nomineeTraveller,
      isBurnFlow,
      disableLoyalty,
    });
    if (updatedFavNomineeTraveller) {
      dispatch({
        type: passengerEditActions.SET_SAVED_PASSENGERS,
        payload: favTraveller(passengers, updatedFavNomineeTraveller, configurations, ssr),
      });
    }
  }, [favoriteTraveller, nomineeTraveller, loggedInUser]);

  useEffect(() => {
    const preTAExist = ssr?.[0].journeySSRs?.find(
      (item) => item.category === TA_SSRCODE,
    )?.takenssr?.length;

    if (preTAExist) {
      setIsProtectionAdded(preTAExist);
    }

    const preZeroCancellationExist = ssr?.[0].journeySSRs?.find(
      (item) => item.category === ZERO_CANCELLATION_SSRCODE,
    )?.takenssr?.length;

    if (preZeroCancellationExist) {
      setZeroCancellationAdded(preZeroCancellationExist);
    }
  }, [ssr]);

  const [errorNextFlag, setErrorNextFlag] = useState();
  const getRhfErrors = async () => {
    return errors;
  };

  const disableNextButton = () => {
    if (isHidden) return;
    let flag = true;
    const optLoyaltySignup = watch(`userFields.${0}.loyaltyInfo.optLoyaltySignup`);
    const data = getValues();
    const allextSeatsTagged = checkIfAllSeatsTagged(
      data,
      seatWiseSelectedPaxInformation,
    );
    let isValidName = true;
    if (codeShare?.some((obj) => bookingDetails?.carrierCode === obj?.carrierCode)) {
      isValidName = checkIfValidName(data, codeShareDetails);
    }
    const isDuplicateName = checkDuplicateNames(errors, data.userFields, setError, clearErrors, duplicateNameError);
    const isDuplicateFFN = checkDuplicateFF({ passengers: data.userFields });

    const isValidPhone = checkIfValidPhone(data);
    const isValidEmail = checkIfValidEmail(data);
    const isValidAltEmail = checkIfValidAltEmail(data);
    const isValidAltContact = checkIfValidAltPhone(data);
    const allGenderSelected = checkIfAllGenderOpted(data?.userFields);
    const isRequiredTickChecked = requiredTickSelected(privacyDescription);
    const isConsentGivenForChild = checkIfMinorConsentForChild(data?.userFields, setError, clearErrors);
    if (errorNextFlag && !isEmpty(data)) {
      const { passengerArray = [], infants = [] } = createPostPayload(
        modificationFlow,
        data,
        passengerDetails,
        ssr,
        specialFareCode,
        optLoyaltySignup,
        loyaltyMemberAgeInvalidError,
      );
      if (
        allextSeatsTagged
        && isValidName
        && isValidPhone
        && isValidEmail
        && isValidAltEmail
        && isValidAltContact
        && !isRequiredTickChecked.length
        && passengerArray.length + infants.length === passengers?.length
        && allGenderSelected
        && nextFlagForGst
        && !isDuplicateName
        && !isDuplicateFFN
        && isConsentGivenForChild
      ) {
        flag = false;
      }
    }
    // console.log('---datasss:', data);
    // console.log('formSubmit-errors ===>', errors);
    // eslint-disable-next-line consistent-return
    return flag;
  };

  const watchEmail = watch('email');
  const watchPrimaryContact = watch('primaryContact');
  const watchAltContact = watch('altContact');

  useEffect(() => {
    nextButtonStateUtil(disableNextButton());
  }, [watchEmail, watchPrimaryContact, watchAltContact, errorNextFlag]);

  useEffect(() => {
    const updateErrorNextFlag = async () => {
      try {
        const err = await getRhfErrors();
        setErrorNextFlag(() => isEmpty(err));
      } catch (error) {
        console.error('Error fetching RHF errors: ', error);
        setErrorNextFlag(true);
      }
    };
    updateErrorNextFlag();
  }, [{ ...errors }]);

  const setInputValues = (name, value) => {
    setValue(name, value);
    const flag = disableNextButton();
    nextButtonStateUtil(flag);
  };

  const whatsappSubscriptionState = () => {
    const whatsappConsent = privacyDescription?.find(
      (consent) => consent.key === WHATSAPP_KEY,
    );
    return {
      whatsappCheck: whatsappConsent?.checked,
      userInteracted: whatsappConsent?.userInteracted,
    };
  };

  async function privacyPolicyCheck(data) {
    const token = getSessionToken();
    const authUser = Cookies.get(COOKIE_KEYS.AUTH_USER, true, true);
    const seatPaxInfo = getBWCntxtVal()?.seatWiseSelectedPaxInformation;
    const policyPayload = {
      data: {
        passengerInfos: [],
      },
    };
    policyPayload.data.passengerInfos = data?.userFields?.map((userField) => {
      const isAdultConsent = adultConsentData?.find((x) => x.passengerKey === userField?.passengerKey)?.isSelected;
      return {
        userId: authUser?.customerNumber || '',
        ip: '',
        formName: 'BookingContact',
        privacyPolicyConsent: true,
        genericConsent: false,
        umnrConsent: !!((specialFareCode === UMNR_ID_CODE && seatPaxInfo?.childrenCount > 0)),
        infantConsent: userField?.passengerTypeCode === paxCodes?.infant?.code,
        minorConsent: userField?.passengerTypeCode === paxCodes?.children?.code,
        pnr: '',
        sessionToken: token || '',
        adultConsent: isAdultConsent || false,
        seniorConsent: false,
        passengerName: `${userField?.name?.first} ${userField?.name?.last}`,
        passengerKey: userField?.passengerKey,
        passengerType: userField?.passengerTypeCode,
      };
    });
    const europeanResidentConsent = privacyDescription?.find((consent) => consent?.key === EUROPEAN_RESIDENT_KEY);
    const whatsappConsent = privacyDescription?.find((consent) => consent?.key === WHATSAPP_KEY);
    policyPayload.data.marketingConsent = [{
      countryCode: data?.countryCode,
      contactNumber: data?.primaryContact,
      emailAddress: data?.email,
      marketingConsent: europeanResidentConsent?.checked,
      whatsappConsent: whatsappConsent?.checked || false,
    },
    ];
    if (data?.altContact || data?.altEmail) {
      policyPayload.data.marketingConsent.push({
        countryCode: data?.altCountryCode,
        contactNumber: data?.altContact,
        emailAddress: data?.altEmail,
        marketingConsent: europeanResidentConsent?.checked,
        whatsappConsent: whatsappConsent?.checked || false,
      });
    }
    await makePrivacyPostApi(policyPayload);
  }

  const onClickNext = async (toPath) => {
    const data = getValues();
    const { email, countryCode, altContact, primaryContact, altCountryCode, isWhatsAppSubscribed,
    } = data;
    dispatch({
      type: passengerEditActions.SET_BOOKING_CONTACT,
      payload: {
        MobilePhoneCountryCode: countryCode,
        MobilePhone: primaryContact,
        OtherPhoneCountryCode: altCountryCode,
        OtherPhone: altContact,
        isWhatsAppSubscribed,
        emailAddress: email,
      },
    });
    const disableFlag = modificationFlow ? false : disableNextButton();
    if (!disableFlag) {
      nextButtonLoadingStateUtil(true);
      await privacyPolicyCheck(data);
      nextButtonLoadingStateUtil(false);
    }
    if (window.pageType === PE_MODIFICATION_PAGE) {
      nextButtonLoadingStateUtil(true);
      const wheelchairSSRList = createSSRPayloadForWheelchair(data, ssr);
      const payload = {
        data: {
          bundleSellRequest: [],
          mealSsrSellRequest: [],
          ssrRemoveRequest: [],
          ssrSellRequest: wheelchairSSRList,
        },
      };
      let addonPostResponse = {};
      if (wheelchairSSRList.length > 0) {
        addonPostResponse = await makeAddonPostAPI(payload);
      }

      if (addonPostResponse?.data?.success || wheelchairSSRList.length < 1) {
        // eslint-disable-next-line no-restricted-globals
        location.href = modifyFlowNextBtnUrl
          || '/content/skyplus6e/in/en/book/itinerary.html';
      } else {
        // console.log(addonPostResponse);
        nextButtonLoadingStateUtil(false);
        showToast('Something went wrong');
        pushAnalytic({
          data: {
            _event: 'error',
          },
          event: 'error',
        });
      }
    }
    if (!disableFlag) {
      // updating specialFare ID data to localstorage - will handle by container app(Payment) - START
      if (configurations.specialFareCode) getSpecialFareMessageText(configurations.specialFareCode, data);
      // updating specialFare ID data to localstorage - will handle by container app(Payment) - END
      nextButtonLoadingStateUtil(true);
      const isSuccess = await onSubmit({
        data,
        hidePE,
        errors,
        dispatch,
        passengers,
        extraSeatKeys,
        agentAccountInfo,
        setIsHidden,
        ssr,
        isProtectionAdded,
        zeroCancellationAdded,
        modificationFlow,
        state,
        whatsappState: whatsappSubscriptionState(),
        gstDetails,
        specialFareCode,
        privacyDescription,
        loyaltyMemberAgeInvalidError,
        setError,
        getValues,
        validationMessage,
        duplicateNameFFNMismatchError,
        setValue,
        fareMaskOptionValue: fareMaskingEnable,
        gstErrorMsg,
        ibc: pointSplitValue,
        isPointSplitupEnabled,
        setPointSplitError,
        pointSplitRequired,
        pointSplitMandatoryErrorMessage,
        pointSplitRef,
        totalFare,
      }, toPath);
      nextButtonLoadingStateUtil(false);
      if (isSuccess) {
        setPointSplitValue(null);
        // eslint-disable-next-line no-nested-ternary
        window.location.hash = toPath === 'seat' ? toPath : (toPath === 'payment' ? '' : 'addon');
      }
    } else {
      const errorMsg = TAG_EXTRA_SEATS_ERROR_LABEL;
      showToast(errorMsg);
      pushAnalytic({
        data: {
          _event: 'error',
        },
        event: 'error',
        error: { ...errorMsg },
      });
    }
  };
  useCustomEventListener(CUSTOM_EVENTS.ONCLICK_NEXT_FARE_SUMMARY_V2, () => {
    if (!isHidden) {
      onClickNext();
    }
  });

  useCustomEventListener(CUSTOM_EVENTS.GET_PASSENGER_DATA_FROM_FARE, (event) => {
    if (!isHidden) {
      onClickNext(event.toPath);
    }
  });

  useCustomEventListener(CUSTOM_EVENTS.REVIEW_SUMMARY_API_DATA, (event) => {
    if (event?.fareSummaryData?.priceBreakdown?.totalPotentialPoints) {
      setTotalEarnPoints(event?.fareSummaryData?.priceBreakdown?.totalPotentialPoints);
    }
    if (event?.fareSummaryData?.priceBreakdown?.journeywiseList?.length > 0) {
      let infantTemp = 0;
      event?.fareSummaryData?.priceBreakdown?.journeywiseList.forEach((jItem) => {
        infantTemp += jItem.infantPrice;
      });
      setInfantPrice(infantTemp);
    }
    if (event?.fareSummaryData?.priceBreakdown?.totalAmount) {
      setTotalFare(event?.fareSummaryData?.priceBreakdown?.totalAmount);
    }
  });
  useCustomEventListener(CUSTOM_EVENTS.MAKE_ME_EXPAND_V2, (detail) => {
    if (detail?.mfToOpen === 'passenger-edit') {
      // update Header title
      const updateTitleEvent = (data) => new CustomEvent(GTM_CONSTANTS.HEADER_CONTENT_UPDATE_EVENT, data);
      document.dispatchEvent(
        updateTitleEvent({
          bubbles: true,
          detail: { title: 'Passenger Edit' },
        }),
      );
      setIsHidden(false);
      window.location.hash = '';
    } else {
      setIsHidden(true);
    }
  });

  const onLoginSuccess = async () => {
    dispatch({
      type: passengerEditActions.SET_LOADER,
      payload: true,
    });
    /* eslint-disable no-shadow */
    const { passengerInfo: {
      favoriteTraveller,
      nomineeTraveller,
      bookingcontacts,
      agentAccountInfo,
    } } = await getPassengerApiCall();
    dispatch({
      type: passengerEditActions.SET_LOADER,
      payload: false,
    });
    dispatch({
      type: passengerEditActions.SET_IS_AUTHENTICATED,
      payload: true,
    });
    dispatch({
      type: passengerEditActions.SET_FAVORITE_TRAVELLER,
      payload: favoriteTraveller,
    });
    dispatch({
      type: passengerEditActions.SET_NOMINEE_TRAVELLER,
      payload: nomineeTraveller,
    });
    const authUser = Cookies.get('auth_user', true, true);

    if (authUser) {
      dispatch({
        type: passengerEditActions.SET_LOGGED_USER,
        payload: authUser,
      });

      dispatch({
        type: passengerEditActions.SET_IS_LOYALTY_AUTHENTICATED,
        payload: Boolean(authUser?.loyaltyMemberInfo?.FFN),
      });
      const bookingContact = bookingcontacts?.[0] || {};

      const defaultPrimaryContact = bookingContact.MobilePhone || agentAccountInfo?.mobilePhone || '';
      const defaultCountryCode = bookingContact.MobilePhoneCountryCode
        || agentAccountInfo?.mobilePhoneCountryCode
        || DEFAULT_COUNTRY_CODE;
      const primaryContact = stripCountryCode(defaultPrimaryContact, defaultCountryCode);
      setValue(EMAIL_ADDRESS_ELEMENT_NAME, bookingContact.emailAddress || agentAccountInfo?.emailAddress || '');
      setValue(COUNTRY_CODE_ELEMENT_NAME, defaultCountryCode);
      setValue(PRIMARY_CONTACT_ELEMENT_NAME, primaryContact);
      setValue(ALT_COUNTRY_CODE_ELEMENT_NAME, bookingContact?.OtherPhoneCountryCode || DEFAULT_COUNTRY_CODE);
      setValue(ALT_CONTACT_ELEMENT_NAME, bookingContact?.OtherPhone);
    }
  };

  const onLogoutSuccess = async () => {
    dispatch({
      type: passengerEditActions.SET_IS_AUTHENTICATED,
      payload: false,
    });
  };

  useEffect(() => {
    const authUser = Cookies.get('auth_user', true, true);

    dispatch({
      type: passengerEditActions.SET_IS_BURN_FLOW,
      payload: getIsBurnflow(getBWCntxtVal()?.payWith),
    });

    if (authUser) {
      dispatch({
        type: passengerEditActions.SET_LOGGED_USER,
        payload: authUser,
      });

      dispatch({
        type: passengerEditActions.SET_IS_LOYALTY_AUTHENTICATED,
        payload: Boolean(authUser?.loyaltyMemberInfo?.FFN),
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener(LOGIN_SUCCESS, onLoginSuccess);
    document.addEventListener(LOGOUT_SUCCESS, onLogoutSuccess);
    document.addEventListener(LOYALTY_LOGIN_SUCCESS, onLoginSuccess);

    const handleLoginClick = (event) => {
      if (event.target.classList.contains('loginWithSavedPaxClass')) {
        document.getElementById('userNavBtn')?.classList.add('active');
      }
    };

    document.addEventListener('click', handleLoginClick);

    return () => {
      document.removeEventListener('click', handleLoginClick);
    };
  }, []);

  useEffect(() => {
    const minorPaxIncluded = passengers?.some(
      (pax) => pax.passengerTypeCode === PASSENGER_TYPE.CHILD || pax.passengerTypeCode === PASSENGER_TYPE.INFANT,
    );

    const privacyPolicyIndex = privacyDescription?.findIndex(
      (item) => item.key === PRIVACY_POLICY_KEY,
    );
    const minorPolicyIndex = privacyDescription?.findIndex(
      (item) => item.key === MINOR_POLICY_KEY,
    );
    if (passengers?.length && privacyDescription?.length && privacyPolicyIndex > -1 && minorPolicyIndex > -1) {
      if (minorPaxIncluded) {
        privacyDescription.splice(privacyPolicyIndex, 1);
      } else {
        privacyDescription.splice(minorPolicyIndex, 1);
      }
    }
    setPrivacyPolicies([...privacyDescription]);

    const isRequiredTickChecked = requiredTickSelected(privacyDescription);
    nextButtonStateUtil(
      Boolean(isRequiredTickChecked.length) || disableNextButton(),
    );

    const whatsappConsent = privacyDescription?.find(
      (consent) => consent.key === WHATSAPP_KEY,
    );
    if (privacyDescription.length && !whatsappConsent?.initFlag) {
      const index = privacyDescription?.findIndex(
        (consent) => consent.key === WHATSAPP_KEY,
      );
      consentChangeHandler(
        dispatch,
        WHATSAPP_KEY,
        defaultValues.isWhatsAppSubscribed,
        index,
        true,
      );
    }
  }, [privacyDescription, passengers]);

  const [footerHeight, setFooterHeight] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    document.addEventListener(CUSTOM_EVENTS.TRACK_DOM_CHANGE, (e) => {
      setFooterHeight(e?.detail?.footerHeight);
    });

    return (() => {
      document.removeEventListener(CUSTOM_EVENTS.TRACK_DOM_CHANGE);
    });
  }, []);

  useEffect(() => {
    if (footerHeight > 108) {
      const offsetLocal = footerHeight - 108;
      setOffset(offsetLocal);
    }
  }, [footerHeight, offset]);
  const headingContent = !disableLoyalty && !isAuthenticated ? {
    headingTitle: label,
    headingSubTitle: loginWithSavedPaxDetails,
    headingClass: 'pb-0',
    subHeadingClass: 'link-small text-tertiary',
  } : { headingTitle: label };
  return loader ? (
    <Shimmer />
  ) : (
    <div
      className={
        isHidden
          ? 'd-none'
          : 'passenger-details-app pe-md-8'
      }
      style={{ '--padding-bottom': `${offset}px` }}
    >
      {window.pageType !== PE_MODIFICATION_PAGE ? (
        <BackToPrevPage
          backLinkLabel={backToSearchResultsLabel}
          backLinkPath={backToSearchResultsPath}
        />
      ) : null}
      <JourneyBar ssrData={ssr} />
      <FormProvider {...methods}>
        {isPointSplitupEnabled && (
        <PointsSplitup
          setPointSplitValue={setPointSplitValue}
          setPointSplitError={setPointSplitError}
          pointSplitError={pointSplitError}
          setPointSplitRequired={setPointSplitRequired}
          pointSplitRef={pointSplitRef}
          isHidden={isHidden}
          passengersCount={passengers?.length ?? 1}
        />
        )}
        <Heading {...headingContent} />
        <LoyaltyNote description={userPermittedForMiles} note={noteLabel} />
        {!modificationFlow && !isSMEUser ? (
          <SavedPassengers {...props} setInputValues={setInputValues} totalEarnPoints={totalEarnPoints} />
        ) : null}
        <form>
          <PassengerDetails
            originalPassengersData={passengers}
            bookingContext={bookingContext}
            allPaxFields={getValues('userFields')}
            setInputValues={setInputValues}
            errors={errors}
            ssr={ssr}
            infantPrice={infantPrice}
            codeShareDetails={codeShareDetails}
            {...props}
          />
          {
            PE_MODIFICATION_PAGE !== window.pageType
            && (
            <TravelAndZeroAssistance
              travelAssistance={travelAssistance}
              cancellationAssistance={cancellationAssistance}
              isProtectionAdded={isProtectionAdded}
              zeroCancellationAdded={zeroCancellationAdded}
              onToggleZeroCancellation={(status) => setZeroCancellationAdded(status)}
              ssrData={ssr}
              onToggleProtection={(status) => setIsProtectionAdded(status)}
            />
            )
          }
          <ContactDetailsForm setContactValues={setInputValues} {...props} />
          <GstForm disableNextButton={disableNextButton} />
          <PDConsent
            privacyDescription={privacyPolicies}
            dispatch={dispatch}
            {...props}
          />
          {bookingDetails?.isToShowFareMaskOption
            ? (
              <FareDetailsMasking
                fareMaskOptionLabel={fareMaskingLabel || 'As a B2B user I want to hide the fare details.'}
                fareMaskOptionValue={fareMaskingEnable}
                dispatch={dispatch}
                setFareMaskingEnable={setFareMaskingEnable}
              />
            )
            : null}
          {!modificationFlow && !isSMEUser && (
            <div className="loyalty-auth-banner-container my-sm-8">
              <AuthBannerLoyalty totalEarnPoints={totalEarnPoints} />
            </div>
          ) }
          {/* <TravelAssistance
            travelAssistance={travelAssistance}
            ssrData={ssr}
            isProtectionAdded={isProtectionAdded}
            onToggleProtection={(status) => setIsProtectionAdded(status)}
          /> */}
        </form>
      </FormProvider>
      {toastProps?.flag ? (
        <Toast
          position={toastProps.position}
          renderToastContent={toastProps.renderToastContent}
          onClose={toastProps.onClose}
          variation={toastProps.variation}
          containerClass={toastProps.containerClass}
          description={toastProps.description}
        />
      ) : null}
    </div>
  );
};

export default PassengerDetailsApp;
