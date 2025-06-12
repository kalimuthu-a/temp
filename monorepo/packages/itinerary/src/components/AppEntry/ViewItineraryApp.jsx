import React, { useState, useEffect } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import HotelStrip from 'skyplus-design-system-app/dist/des-system/HotelStrip';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
// eslint-disable-next-line import/no-unresolved
import LoyaltyAuthBanner from 'skyplus-design-system-app/dist/des-system/LoyaltyAuthBanner';
import { getMfConfirmationContent, getMfConfirmationAdditionalContent,
  getAemContent, getAemAdditionalContent, makeGetFeeCodeListReq,
  makeGetSSRListReq, makePNRSearch, makeExploreCityReq,
  getHotelsList } from '../../services';
import {
  setAbbreviationData,
  setItineraryDetails,
  setMfData,
  setExploreCities,
  setAuthInfo,
} from '../../store/itinerary';
import { CONSTANTS } from '../../constants';
import {
  setLoading,
  toggleToast,
  updateConfigInfo,
} from '../../store/configData';
import Loader from '../common/Loader/Loader';
import {
  UTIL_CONSTANTS,
  formatDate,
  getQueryStringByParameterName,
  removeQueryParamFromUrl,
  setBwCntxtVal,
  dateDiffToString,
} from '../../utils';
import BookingConfirmation from '../BookingConfirmation/BookingConfirmation';
import ConfirmationBanner from '../BookingConfirmation/ConfirmationBanner/ConfirmationBanner';
import NavigationContainer from '../NavigationSection/NavigationContainer';
import PaymentTransaction from '../PaymentTransaction/PaymentTransaction';
import MoreInformation from '../MoreInformation/MoreInformation';
import SmartWebCheckin from '../SmartWebCheckin';
import Flight from '../Flight/Flight';
import PaymentDetails from '../PaymentDetails';
import ModifyItineraryLayout from '../ModifyItineraryLayout';
import BookingInfo from '../BookingInfo/BookingInfo';
import RetrieveItinerary from '../RetrieveItinerary/RetrieveItinerary';
import ChatSection from '../ChatSection/ChatSection';
import ReturnFlightBanner from '../ReturnFlightBanner/ReturnFlightBanner';
import TravelTips, { TRAVELTIPS_VARIATION } from '../TravelTips/TravelTips';
import ExploreCity from '../TravelTips/ExploreCity';
import RetryPayment from '../RetryPayment/RetryPayment';
import { pushAnalytic } from '../../utils/analyticEvents';
import { pushDataLayer } from '../../utils/dataLayerEvents';
import { findTripType } from '../Passengers/dataConfig';
import ScratchCardWidget from '../ScratchCard/ScratchCardWidget';
import InfoBanner from '../common/InfoBanner/InfoBanner';
import LocalStorage from '../../utils/LocalStorage';

import NoShowContainer from '../PaymentDetails/NoShowContainer';
import { bindWithDeepLinkUrl } from '../Flight/dataConfig';
// eslint-disable-next-line sonarjs/cognitive-complexity
const ViewItineraryApp = ({ loginType }) => {
  const [isMobile] = useIsMobile();
  const [isAEMContent, setAemContent] = useState(false); // NOSONAR
  const [isBookingFlow, setIsBookingFlow] = React.useState(false);
  const [isRetrievePnr, setIsRetrievePnr] = React.useState(false);
  const [modifyFlowCompleteIdentifier, setModifyFlowCompleteIdentifier] = React.useState('');
  // modifyFlowCompleteIdentifier -  this will be referenced to BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const mfAdditionalData = useSelector((state) => state.itinerary?.mfAdditionalDatav2) || {};
  const { hotelRecommendations } = useSelector((state) => state.itinerary?.mfDatav2?.itineraryMainByPath?.item) || {};
  const exploreCities = useSelector(
    (state) => state.itinerary?.exploreCitiesData,
  ) || [];
  const { confirmationImage } = exploreCities?.[0] || {};
  const { bannerImage, bannerBottomImage, bannerImageMobile,
    bannerBottomImageMobile, webCheckInLink, retrieveAnotherItineraryLabel,
    webCheckInTitle, itineraryDetailsTitle, heyUserLabel, mandatoryTitle, mandatoryIcon,
    mandatoryDescription, downloadFormCtaTitle, downloadFormCtaLink,
    itineraryStatusMessage, undoWebCheckInCta,
    undoWebCheckInCtaPath, internationalPassengerDetailsCtaPath, internationalPassengerDetailsCta,
    loyaltySignUpBanner,
    internationalWebCheckInLink,
    bookingStatus,
    loyaltyThanksBanner,
    earnedPtsLabel,
    pnrLabel,
    bookingConfirmRedirectUrl,
    defaultIataDetails,
  } = mfData?.itineraryMainByPath?.item || {};
  const isCommonLoading = useSelector((state) => state.configData?.isLoading);
  const isCommonToast = useSelector((state) => state.configData?.toastProps);
  const authUser = useSelector((state) => state.itinerary?.authUser);
  const isBurnFlow = useSelector((state) => state.itinerary?.isBurnFlow);
  const [isflowType, setFlowType] = React.useState(false);
  const [isAcknowledgementFlow, setAcknowledgementFlow] = React.useState(false);
  const [isEnablePaymentProgressCheck, setIsEnablePaymentProgressCheck] = useState(false);
  const [acknowledgePaymentStausFlag, setacknowledgePaymentStausFlag] = useState('');

  const isEarnFlow = useSelector((state) => state.itinerary?.isEarnFlow);
  const ssrListAbbreviation = useSelector(
    (state) => state.itinerary.ssrListAbbreviation,
  );
  const journeyDetail = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const [bannerImageTop, setBannerImageTop] = React.useState(
    bannerImage,
  );
  const [bannerImageBottom, setBannerImageBottom] = React.useState(
    bannerBottomImage,
  );

  let personasType = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.ROLE_DETAILS);
  personasType = personasType && JSON.parse(personasType);

  const showHotelStrip = [CONSTANTS.LOGIN_TYPE.MEMBER, CONSTANTS.LOGIN_TYPE.NO_LOGIN]
    .includes(personasType?.roleName?.toUpperCase());

  const [hotelList, setHotelList] = useState({ data: [], arrivalCityName: '', showMoreUrl: '' });
  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const apiNavigationMenu = itineraryApiData?.navigationMenu || [];
  const bookingDetails = (itineraryApiData && itineraryApiData.bookingDetails) || {};
  const passengersArray = (itineraryApiData && itineraryApiData.passengers) || [];
  const { BROWSER_STORAGE_KEYS, TAB_KEYS, BOOKING_STATUS, MODIFY_FLOW_IDENTIFIER,
    PAYMENT_STATUS, AUTH_LOGIN_SUCCESS,
    AUTH_TOKEN_LOGOUT_SUCCESS, LOYALTY_MEMBER_LOGIN_SUCCESS,
    LOYALTY_OPT_ENROLL_SIGNUP, HOTEL_TRAVELTIPS_VARIATION } = CONSTANTS;
  const passengerListArray = useSelector((state) => state.itinerary?.apiData?.passengers) || [];
  const isWebCheckinEnabled = apiNavigationMenu.find(
    (navItem) => (!!((navItem?.buttonCode?.toUpperCase() === TAB_KEYS.WEBCHECKIN) && !navItem.isDisabled)),
  );
  const isModifyFlow = itineraryApiData?.bookingDetails?.hasModification;
  const priceBreakdown = itineraryApiData?.priceBreakdown || {};
  const undoCheckInNavOption = itineraryApiData?.checkinNavigationMenu?.find(
    (item) => item?.buttonCode?.toUpperCase() === TAB_KEYS.UNDOCHECKIN,
  );

  const isUndoCheckInEnabled = (undoCheckInNavOption && !undoCheckInNavOption?.isDisabled);
  const daysUntilDeparture = (journeyDetail?.length > 0)
    ? dateDiffToString(new Date(), journeyDetail[0]?.segments[0]?.segmentDetails?.departure) : 0;
  // eslint-disable-next-line no-nested-ternary
  const daysLeftForWebCheckin = ((daysUntilDeparture?.days === 1) && (daysUntilDeparture?.hh > 0)) ? 2
    : (((daysUntilDeparture?.days === 0) && (daysUntilDeparture?.hh === 0)) ? 0 : 1);
  const webCheckInDayLeftLabel = daysLeftForWebCheckin > 1
    ? `${daysLeftForWebCheckin} days` : `${daysLeftForWebCheckin} day`;
  const prnNotGenerated = !bookingDetails?.recordLocator;

  const dispatch = useDispatch();
  let currentBookingStatus = bookingDetails?.bookingStatus;
  if (bookingDetails?.bookingStatus === BOOKING_STATUS.HOLD_CANCELLED) {
    currentBookingStatus = BOOKING_STATUS.CANCELLED;
  }

  const bookingStatusData = bookingStatus?.filter(
    (bookingState) => (bookingState?.key === currentBookingStatus),
  )?.[0];
  const [bookingStatusState, setBookingStatusState] = useState(bookingStatusData);
  const statusKey = bookingDetails?.bookingStatus || acknowledgePaymentStausFlag;
  const bookingDescriptionText = bookingStatusState?.description || bookingStatusData?.description;
  const bookingHoldDate = bookingDetails?.holdDate
    ? formatDate(bookingDetails?.holdDate, UTIL_CONSTANTS.DATE_SPACE_PRINTHEADER) : '';
  const emailId = itineraryApiData?.contacts?.[0]?.emailAddress || '';
  const indigoTaxRefundDetails = itineraryApiData?.indigoTaxRefund || {};
  const getHotelData = async () => {
    let date = '';
    let arrivalcity = '';
    let arrivalCityName = '';
    journeyDetail?.forEach((jItem) => {
      const isNearestJourneyDate = new Date(jItem?.journeydetail?.arrival) > new Date();

      if (isNearestJourneyDate && !date) {
        date = formatDate(jItem?.journeydetail?.arrival, UTIL_CONSTANTS.DATE_HYPHEN_YYYYMMDD);
        arrivalcity = jItem?.journeydetail?.destination;
        arrivalCityName = jItem?.journeydetail?.destinationCityName;
      }
    });
    if (!date) {
      return;
    }

    const queryStrin = `arrivalDate=${date}&arrival=${arrivalcity}`; // arrivalDate=2024-05-31&arrival=MAA
    const { data } = await getHotelsList(queryStrin);
    const showMoreUrl = data?.data?.search_page_url;
    if (data?.data?.response?.length > 0) {
      setHotelList({ data: data.data.response, arrivalCityName, showMoreUrl });
    }
  };

  const updateAuthInfo = () => {
    const authUserCookie = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    dispatch(setAuthInfo({ authUser: authUserCookie }));
  };

  const getPointsToUpdateCookie = () => {
    // this event will be catched in common-logic-container and update auth_userfor cookie
    const updateCookieLoyaltyPointsMessageEvent = (eventData) => {
      return new CustomEvent(CONSTANTS.LOYALTY_UPDATE_POINTS, eventData);
    };
    document.dispatchEvent(
      updateCookieLoyaltyPointsMessageEvent({
        bubbles: true,
        detail: {},
      }),
    );
  };

  useEffect(() => {
    const initFunction = async () => {
      const paramPlKey = getQueryStringByParameterName('pl');
      const isBookingFlowPage = getQueryStringByParameterName('isBookingFlow') === '1';
      // const paymentStatus = getQueryStringByParameterName('payment_status');
      // localstorage data clean-which set from booking flow - START
      localStorage.removeItem(BROWSER_STORAGE_KEYS.CLEAN_KEYS_SFD);
      localStorage.removeItem(BROWSER_STORAGE_KEYS.CLEAN_KEYS_BOOKING_CONTEXT);
      localStorage.removeItem(BROWSER_STORAGE_KEYS.CONTACT_DETAILS_FROM_SRP);
      // localstorage data clean-which set from booking flow - END
      if (isBookingFlowPage) {
        localStorage.removeItem(CONSTANTS.BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER);
      }

      dispatch(setLoading(true)); // make itinerary call will turn off the loading
      const { sslList } = await getAbbreviationAPI();// eslint-disable-line no-use-before-define
      makeGetItinerary(paramPlKey, sslList, isBookingFlowPage); // eslint-disable-line no-use-before-define
    };
    initFunction();
    updateAuthInfo();
    document.addEventListener(LOYALTY_MEMBER_LOGIN_SUCCESS, updateAuthInfo);
    document.addEventListener(AUTH_LOGIN_SUCCESS, updateAuthInfo);
    document.addEventListener(AUTH_TOKEN_LOGOUT_SUCCESS, updateAuthInfo);
    return () => {
      document.removeEventListener(LOYALTY_MEMBER_LOGIN_SUCCESS, updateAuthInfo);
      document.removeEventListener(AUTH_LOGIN_SUCCESS, updateAuthInfo);
      document.removeEventListener(AUTH_TOKEN_LOGOUT_SUCCESS, updateAuthInfo);
    };
  }, []);
  useEffect(() => {
    if (window.innerWidth <= 1023) {
      setBannerImageTop(bannerImageMobile);
      setBannerImageBottom(bannerBottomImageMobile);
    }
  }, [window.innerWidth, bannerImageTop, bannerImageBottom]);
  useEffect(() => {
    if (itineraryApiData && itineraryApiData.bookingDetails) {
      dispatch(setItineraryDetails({ data: itineraryApiData }));
    }
    if (isModifyFlow) {
      removeQueryParamFromUrl(['pl', 'isBookingFlow']);
      isBookingFlow && setIsBookingFlow(false); // eslint-disable-line no-unused-expressions
    } else {
      // if it is not modifyflow then we have to reset the modify redunt amount flag in from storage
      localStorage.removeItem(BROWSER_STORAGE_KEYS.CREDITSHELL_REFUNDTYPE);
    }
    setFlowType(true);
    getHotelData();
    setBwCntxtVal(itineraryApiData);
  }, [itineraryApiData]);

  useEffect(() => {
    if (!loginType) {
      dispatch(updateConfigInfo({ loginType }));
    }
  }, [loginType]);
  useEffect(() => {
    if (!modifyFlowCompleteIdentifier) {
      setModifyFlowCompleteIdentifier(localStorage.getItem(BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER));
    }
  }, [isModifyFlow]);

  useEffect(() => {
    if (isflowType && !isAEMContent) {
      const callingAEMContent = async () => {
        const isBookingFlowPage = getQueryStringByParameterName('isBookingFlow') === '1';
        if (isBookingFlowPage || isBookingFlow || isAcknowledgementFlow) {
          const mfConfirmationData = await getMfConfirmationContent();
          const mfAdditionalConfirmationData = await getMfConfirmationAdditionalContent();
          if ((mfConfirmationData?.data?.itineraryMainByPath?.item && mfAdditionalConfirmationData?.data?.itineraryAdditionalByPath)) { // eslint-disable-line max-len
            setAemContent(true);
            dispatch(setMfData(
              {
                data: mfConfirmationData?.data,
                mfAdditionalDatav2: mfAdditionalConfirmationData?.data,
              },
            ));
          }
        } else {
          const aemContent = await getAemContent();
          const aemAdditionalContent = await getAemAdditionalContent();
          if (aemContent?.data?.itineraryMainByPath?.item && aemAdditionalContent?.data?.itineraryAdditionalByPath?.item) { // eslint-disable-line max-len
            setAemContent(true);
            dispatch(setMfData(
              {
                data: aemContent?.data,
                mfAdditionalDatav2: aemAdditionalContent?.data,
              },
            ));
          }
        }
      };
      callingAEMContent();
    }
  }, [isflowType && !isAEMContent]);

  useEffect(() => {
    if (bookingDetails?.bookingStatus === BOOKING_STATUS.HOLD) {
      setAcknowledgementFlow(true);
    }
    if (bookingDetails?.bookingStatus === BOOKING_STATUS.HOLD
      && bookingDetails?.paymentStatus === BOOKING_STATUS.HOLD) {
      setAcknowledgementFlow(true);
    }
  }, [bookingDetails?.bookingStatus]);

  useEffect(() => {
    if (!bookingStatusState || (bookingStatusData?.key !== statusKey)) {
      const bookingData = bookingStatus?.filter(
        (bookingState) => (bookingState?.key === statusKey),
      )?.[0];
      setBookingStatusState(bookingData);
    }
  }, [!bookingStatusState, statusKey, bookingStatus]);

  const getModifyAcknowledgementDetail = (flowName) => {
    if (!flowName) {
      return;
    }
    if ([MODIFY_FLOW_IDENTIFIER.CANCEL_BOOKING,
      MODIFY_FLOW_IDENTIFIER.CANCEL_FLIGHT].includes(flowName)) {
      setAcknowledgementFlow(true);
    } else {
      let msg = 'Success! changed successfully';
      if (flowName === MODIFY_FLOW_IDENTIFIER.CHANGE_SEAT) {
        msg = 'Seat changed successfully';
      } else if (flowName === MODIFY_FLOW_IDENTIFIER.CHANGE_ADDON) {
        msg = 'Your add ons are successfully added.';
      } else if (flowName === MODIFY_FLOW_IDENTIFIER.CHANGE_WHEELCHAIR) {
        msg = 'Special Assistance added successfully';
      }
      dispatch(
        toggleToast({
          show: true,
          props: {
            title: '',
            description: msg,
            variation: 'notifi-variation--Success',
            containerClass: 'modification-success-toast itinearary-success-toast',
            autoDismissTimeer: 10000,
            infoIconClass: 'icon-check text-forest-green',
          },
        }),
      );
    }
    localStorage.removeItem(CONSTANTS.BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER);
  };

  const getExploreCities = async (journey) => {
    const cityCode = journey?.length > 0
      ? journey[0].journeydetail.destination
      : '';
    if (!cityCode) return;
    const { response } = await makeExploreCityReq(cityCode);
    if (response?.data?.iataDetailsList?.items?.length > 0) {
      const { items } = response?.data?.iataDetailsList || {};
      dispatch(setExploreCities({ data: items }));
    }
  };

  const makeGetItinerary = async (// eslint-disable-line no-unused-vars
    plKey,
    sslList = ssrListAbbreviation,
    isBookingFlow = false, // eslint-disable-line no-shadow
  // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    dispatch(setLoading(true));
    const data = await makePNRSearch(null, null, plKey);
    // Adobe Analytic event
    if ((data && data.error) || data?.errors || data?.type === 'Error') {
      dispatch(setItineraryDetails({ data: {} }));
      localStorage.removeItem(CONSTANTS.BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER);
      // Adobe analytic | error
      const getErrorMsg = getErrorMsgForCode(data.errorCode);
      const { message } = getErrorMsg;
      dispatch(
        toggleToast({
          show: true,
          props: {
            title: 'Error',
            description: message,
            variation: 'notifi-variation--error',
            autoDismissTimeer: 10000,
          },
        }),
      );
      pushAnalytic({
        data: {
          pnrResponse: { ...data },
          _event: 'itineraryPageLoad',
          isBookingFlow,
          ssrListAbbreviation: sslList,
        },
        event: 'itineraryPageLoad',
        error: Object.create(null, {
          code: { value: data.errorCode, enumerable: true },
          message: { value: message, enumerable: true },
        }),
      });
    } else {
      if ((data?.bookingDetails?.paymentStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.PENDING.toLowerCase())
      || (data?.bookingDetails?.bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.IN_PROGRESS.toLowerCase())) {
        setacknowledgePaymentStausFlag(CONSTANTS.PAYMENT_POLLING_STATUS_KEY.PAYMENTV2_INPROCESS);
        setIsEnablePaymentProgressCheck(true);
      }
      if (data?.bookingDetails?.bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.ON_HOLD.toLowerCase()
        || data?.bookingDetails?.bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.HOLD.toLowerCase()) {
        setIsEnablePaymentProgressCheck(true);
      }
      if (
        data?.bookingDetails?.bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.HOLD_CANCELLED.toLowerCase()
      ) {
        setacknowledgePaymentStausFlag('');
        setIsEnablePaymentProgressCheck(false);
      }
      const isPNRFoundInResponse = data?.bookingDetails?.recordLocator
      || data?.bookingDetails?.bookingStatus;
      dispatch(setItineraryDetails({ data: isPNRFoundInResponse ? data : {} }));

      const flowIdentifier = getQueryStringByParameterName('flowIdentifier');
      // after modification- we go to payment then comeback itinerary then success shows - START
      getModifyAcknowledgementDetail(flowIdentifier);
      removeQueryParamFromUrl(['flowIdentifier']);
      // after modification- we go to payment then comeback itinerary then success shows - END
      getExploreCities(data?.journeysDetail);
      const getErrorMsg = getErrorMsgForCode(data?.errorCode);
      const { message } = getErrorMsg;
      // Data Layer (TODO: below commented code for future use)
      // const url = new URL(window. location. href);
      // const searchParams = url.searchParams;
      // const isFirstLoad = searchParams.get('isfirstLoad') || 'false';
      if (isPNRFoundInResponse) {
        pushAnalytic({
          data: {
            pnrResponse: { ...data },
            _event: 'itineraryPageLoad',
            isBookingFlow,
            ssrListAbbreviation: sslList,
            isReviewItinerary: isModifyFlow,
          },
          event: 'itineraryPageLoad',
          error: Object.create(null, {
            code: { value: data.errorCode, enumerable: true },
            message: { value: message, enumerable: true },
          }),
          isChangeFlight: !sessionStorage.getItem('isChangeFlight'), // NOSONAR
        });
        pushDataLayer({
          data: {
            _event: 'page-load',
            pnrResponse: { ...data },
          },
          event: 'page-load',
        });
      }

      if (isBookingFlow && isPNRFoundInResponse
        && !localStorage.getItem(`bookingConfirmFirstTimeLoad_${data?.bookingDetails?.recordLocator}`)) {
        localStorage[`bookingConfirmFirstTimeLoad_${data?.bookingDetails?.recordLocator}`] = true;
        pushDataLayer({
          data: {
            _event: 'purchase',
            pnrResponse: { ...data },
          },
          event: 'purchase',
        });
      }
      const isRedeemTransaction = data?.bookingDetails?.isRedeemTransaction;
      if (isBookingFlow && isRedeemTransaction) {
        getPointsToUpdateCookie();
      }
    }
    if (isBookingFlow) setIsBookingFlow(true);
    dispatch(setLoading(false));
  };

  const updateItineraryAfterChange = async (flowFrom) => {
    dispatch(setLoading(true));
    const dataIti = await makePNRSearch();
    dispatch(setItineraryDetails({ data: dataIti }));
    dispatch(setLoading(false));
    if (flowFrom) {
      setModifyFlowCompleteIdentifier(flowFrom);
    }
  };

  const getAbbreviationAPI = async () => { // eslint-disable-line no-unused-vars
    const sslList = await makeGetSSRListReq();
    const feeCodeList = await makeGetFeeCodeListReq();
    dispatch(
      setAbbreviationData({
        feeCodeListAbbreviation: feeCodeList,
        ssrListAbbreviation: sslList,
      }),
    );
    return {
      sslList,
      feeCodeList,
    };
  };

  const checkUmnr = () => {
    let isUnaccompaniedMinor = false;
    const typeCodeList = passengerListArray?.map((i) => i?.passengerTypeCode) || [];
    const uniquePassengerTypeList = [...new Set(typeCodeList)];
    // taking all the passengerType and checking only CHD passenger there
    if (
      uniquePassengerTypeList.length === 1
      && uniquePassengerTypeList[0] === CONSTANTS.PASSENGER_TYPE.CHILD
    ) {
      isUnaccompaniedMinor = true;
    }
    return isUnaccompaniedMinor;
  };
  const propsFromRedux = isCommonToast?.props || {};
  const commonToastProps = {
    onClose: () => {
      dispatch(toggleToast({ show: false, props: {} }));
    },
    containerClass: 'toast-example',
    variation: 'notifi-variation--error',
    title: '',
    description: '',
    mainToastWrapperClass: 'itinerary-toast-container',
    ...propsFromRedux,
  };

  const isPNRHasTheInternational = () => {
    let isInternational = false;
    itineraryApiData?.journeysDetail?.forEach((jItem) => {
      if (isInternational) return; // if anyone segment has international then we consider as international
      jItem?.segments?.forEach((sItem) => {
        if (sItem?.international) {
          isInternational = true;
        }
      });
    });
    return isInternational;
  };

  const handleRedirection = () => {
    if (isPNRHasTheInternational()) {
      if (internationalWebCheckInLink?.includes('bau=1')) {
        window.location.href = bindWithDeepLinkUrl(internationalWebCheckInLink, bookingDetails, passengersArray);
      } else {
        window.location.href = internationalWebCheckInLink || '';
      }
    } else {
      window.location.href = webCheckInLink || '';
    }
  };

  const [tripType, setTripType] = useState('');

  const tripTypeFunction = (journeyTripType) => {
    setTripType(journeyTripType);
  };

  useEffect(() => {
    tripTypeFunction(findTripType(journeyDetail));
  }, [journeyDetail]);

  const isMulitcity = tripType === CONSTANTS.PNR_TYPE.MULTY_CITY;
  const isRoundCity = tripType === CONSTANTS.PNR_TYPE.ROUND_TRIP;
  let isSectorInternational = false;
  if (itineraryApiData?.journeysDetail?.length > 0) {
    isSectorInternational = itineraryApiData?.journeysDetail?.map(
      (journeys) => {
        return journeys?.segments?.map((seg) => seg?.international === true).includes(true);
      },
    )?.includes(true) || false;
  }
  const isCancelFlightFlow = bookingDetails?.bookingStatus === BOOKING_STATUS.CANCELLED;
  const isPaymentCompleted = isCancelFlightFlow || (bookingDetails?.paymentStatus === PAYMENT_STATUS.COMPLETED);

  const stripStatusAemFlag = mfData?.itineraryMainByPath?.item?.showScratchCardWidget || false;
  const stripStatusApiFlag = itineraryApiData?.bookingDetails?.IsScratchCardUser || false;

  const renderRightSection = (bookingFlow) => {
    return (
      <div className={`skp-itinerary-container--right ${bookingFlow ? 'confirmation-right' : ''}`}>
        {!bookingFlow && !bookingDetails?.hasModification && (retrieveAnotherItineraryLabel) && (
          <Button
            variant="link"
            color=""
            size="large"
            containerClass="retrieve-another-itinerary desktop-view"
            onClick={() => setIsRetrievePnr(true)}
            onKeyDown={(e) => { if (e.key === 'Enter') setIsRetrievePnr(true); }}
            tabIndex="0"
          >
            {retrieveAnotherItineraryLabel || 'Retriev Another itinerary'}
          </Button>
        )}
        {bookingFlow && !prnNotGenerated && <NavigationContainer isBookingFlow={bookingFlow} />}
        { (!isMulitcity
        && !isRoundCity)
        && !bookingDetails?.hasModification && !prnNotGenerated && <ReturnFlightBanner />}
        { (isMulitcity
        || isRoundCity)
        && !bookingFlow
        && isWebCheckinEnabled && !bookingDetails?.hasModification && !isAcknowledgementFlow && <SmartWebCheckin /> }
        {isWebCheckinEnabled
        && !bookingFlow && !bookingDetails?.hasModification && !isAcknowledgementFlow
        && (
        <Button
          variant="outline"
          color="primary"
          size="large"
          containerClass="webcheckin-cta"
          onClick={handleRedirection}
        >
          {webCheckInTitle || 'Web Check-in'}
        </Button>
        )}
        {isSectorInternational && !bookingFlow && !bookingDetails?.hasModification
        && !isAcknowledgementFlow && !prnNotGenerated
        && (
          <Button
            color="primary"
            size="large"
            containerClass={`webcheckin-cta ${isWebCheckinEnabled ? 'check-in-international' : 'international'}`}
            onClick={() => { window.location.href = internationalPassengerDetailsCtaPath || ''; }}
          >
            {internationalPassengerDetailsCta || 'Submit International Passenger Details'}
          </Button>
        )}
        {isUndoCheckInEnabled
        && !bookingFlow && !bookingDetails?.hasModification && !isAcknowledgementFlow
        && (
        <Button
          variant="outline"
          color="primary"
          size="large"
          containerClass="webcheckin-cta"
          onClick={() => { window.location.href = undoWebCheckInCtaPath || ''; }}
        >
          {undoWebCheckInCta || 'Undo web check in'}
        </Button>
        )}
        {(isAEMContent && !bookingDetails?.hasModification && !isAcknowledgementFlow)
        && <TravelTips swiperModel={TRAVELTIPS_VARIATION.TRAVELREMINDERS} />}
        { (isMulitcity || isRoundCity) && bookingFlow && isWebCheckinEnabled
        && !bookingDetails?.hasModification && <SmartWebCheckin /> }
        { (!isMulitcity
        && !isRoundCity)
        && isWebCheckinEnabled && !bookingDetails?.hasModification && !isAcknowledgementFlow && <SmartWebCheckin /> }
        {isUndoCheckInEnabled
        && bookingFlow
        && !bookingDetails?.hasModification && (
        <Button
          variant="outline"
          color="primary"
          size="large"
          containerClass="webcheckin-cta undo-checkin"
          onClick={() => { window.location.href = undoWebCheckInCtaPath || ''; }}
        >
          {undoWebCheckInCta || 'Undo check-in'}
        </Button>
        )}
        {
        (isAEMContent && (!bookingDetails?.hasModification || prnNotGenerated))
          ? (
            <>
              <ChatSection />
              {(!prnNotGenerated && !isCancelFlightFlow) && <ExploreCity />}
              <MoreInformation />
            </>
          )
          : null
        }
      </div>
    );
  };

  const paxName = passengerListArray
      && `${passengerListArray[0]?.name?.first} ${passengerListArray[0]?.name?.last}`;
  const contenthtml = heyUserLabel?.html?.replace(
    '{name}',
    paxName,
  );
  // const backButtonItineararyLabel = backButtonLabel || '';

  const formatHrsData = (journeyHr) => {
    return journeyHr < 10 ? Number(journeyHr) : journeyHr;
  };

  const isHoldFlexPayEnabled = (itineararyGenerateDescription = '') => {
    const pnr = bookingDetails?.recordLocator || '';
    const { journeydetail } = (journeyDetail && journeyDetail[0]) || {};
    const { hh: journeyHr, mm: journeyMin, days: journeyDays } = dateDiffToString(
      journeydetail?.utcdeparture,
      journeydetail?.utcarrival,
      true,
    );
    let journeyHrUpdated = formatHrsData(journeyHr);
    if (journeyDays > 0) {
      journeyHrUpdated = Number(journeyHrUpdated) + (Number(journeyDays) * 24);
    }
    const bannerProps = {
      title: bookingStatusState?.title || bookingStatusData?.title || '',
      source: journeydetail?.origin,
      destination: journeydetail?.destination,
      journeyType: tripType,
      redirectUrl: bookingConfirmRedirectUrl,
      earnPoints: earnedPtsLabel?.replace('{points}', priceBreakdown?.totalPoints || ''),
      totalPoints: priceBreakdown?.totalPoints || '',
      dateDeparture: journeydetail?.utcdeparture ? formatDate(
        journeydetail?.departure,
        UTIL_CONSTANTS.DATE_SPACE_DDDMMM,
      ) : '',
      time: journeydetail?.utcdeparture ? `${journeyHrUpdated}h ${journeyMin}m` : '',
      pnr: pnr ? pnrLabel?.replace('{pnr}', pnr) : '',
      imgUrl: confirmationImage?._publishUrl || defaultIataDetails?.confirmationImage?._publishUrl,
      imgAlt: bookingStatusState?.title || bookingStatusData?.title || '',
      bookingStatus: bookingDetails?.bookingStatus || bookingStatusData?.key,
      acknowledgePaymentStausFlag,
    };
    const isFlexData = (bookingDetails?.paymentStatus === CONSTANTS?.PAYMENT_STATUS?.PENDING)
    && bookingDetails?.isFlexPay;
    const paymentHoldDetails = bookingDescriptionText?.html?.replace(
      '{mail}',
      emailId,
    )?.replace('{date}', bookingHoldDate);
    const htmlDataToRender = (
      <div className="booking-confirmation mt-0 mb-8">
        <ConfirmationBanner
          {...bannerProps}
          holdDescription={paymentHoldDetails}
        />
      </div>
    );
    return (
      !isFlexData ? (
        <HtmlBlock
          html={bookingStatusState?.key?.toLocaleLowerCase() === CONSTANTS.BOOKING_STATUS.CONFIRMED.toLocaleLowerCase()
            ? (itineararyGenerateDescription)
            : paymentHoldDetails}
          className="itinerary-details-description-confirm"
        />
      ) : htmlDataToRender
    );
  };

  const isSectorInteranationalOrNot = (isSectorInt) => {
    const itineararyGenerateDescription = itineraryStatusMessage?.filter(
      (statusMsg) => statusMsg.key === 'itineraryGenerated',
    )?.[0]?.description?.html;

    if (isSectorInt) {
      const sumbitInternationalLabel = itineraryStatusMessage?.filter(
        (statusMsg) => statusMsg.key === 'sumbitInternational',
      )?.[0]?.description?.html;

      return (
        <HtmlBlock
          html={bookingStatusState?.key?.toLocaleLowerCase() === CONSTANTS.BOOKING_STATUS.CONFIRMED.toLocaleLowerCase()
            ? sumbitInternationalLabel
            : bookingDescriptionText?.html?.replace('{mail}', emailId).replace('{date}', bookingHoldDate)}
          className="itinerary-details-description-confirm"
        />
      );
    }

    return isHoldFlexPayEnabled(itineararyGenerateDescription);
  };

  const webCheckInDescriptionLabel = itineraryStatusMessage?.filter(
    (statusMsg) => statusMsg.key === 'flightDuration',
  )?.[0]?.description?.html;

  const triggerLoginPopup = () => {
    const toggleLoginPopupEvent = (config) => new CustomEvent('toggleLoginPopupEvent', config);
    document.dispatchEvent(
      toggleLoginPopupEvent({ bubbles: true, detail: { loginType: 'loginSSOPopup', persona: 'Member' } }),
    );
  };
  const triggerLoyaltyRegister = (isPrefillFromItinerary) => {
    const passengerData = passengerListArray?.[0] || {};
    const prefillData = {
      firstName: passengerData.name?.first,
      lastName: passengerData.name?.last,
      dob: passengerData.info?.dateOfBirth,
      email: '',
      mobileNumber: '',
      gender: passengerData.name?.title === 'MR' ? 0 : 1, // 1 for female, 0 for male => For UI
    };
    const toggleLoginPopupEvent = (config) => new CustomEvent('toggleLoginPopupEvent', config);
    document.dispatchEvent(
      toggleLoginPopupEvent({
        bubbles: true,
        detail: {
          loginType: 'EnrollSSOloyalty',
          persona: 'Member',
          prefillData: isPrefillFromItinerary ? prefillData : null,
        },
      }),
    );
  };

  const renderLoyaltyAuthBanner = () => {
    if (window.disableLoyalty) {
      return;
    }
    const isLoggedInLoyaltyUser = authUser?.loyaltyMemberInfo?.FFN;
    let ctaLabel = loyaltySignUpBanner?.ctaLabel;
    let heading;
    let subHeading;
    let buttonClick = triggerLoginPopup;
    const isBookingFlowPage = getQueryStringByParameterName('isBookingFlow') === '1';
    const isOptedForActivateFromPassengeredit = LocalStorage.get(LOYALTY_OPT_ENROLL_SIGNUP) === '1';
    const showActivateButton = isOptedForActivateFromPassengeredit && isBookingFlowPage;
    if ((isLoggedInLoyaltyUser || !loyaltySignUpBanner || prnNotGenerated || isBurnFlow) && !showActivateButton) {
      LocalStorage.remove(LOYALTY_OPT_ENROLL_SIGNUP);
      return;
    }
    if (showActivateButton) {
      // loggedIn User but not a loyalty user
      heading = loyaltyThanksBanner?.heading || 'Thank you for joining6E Loyalty ';
      subHeading = loyaltyThanksBanner?.description || {
        html: '\u003Cp\u003EKickstart your journey\u003C/p\u003E\n',
      };
      ctaLabel = loyaltyThanksBanner?.ctaLabel || 'Activate Now'; // loyaltySignUpBanner?.secondaryCtaLabel;
      buttonClick = () => triggerLoyaltyRegister(true); // trigger Loyalty registeration
    } else if (authUser && !isLoggedInLoyaltyUser) {
      heading = loyaltySignUpBanner?.heading;
      subHeading = loyaltySignUpBanner?.description;
      ctaLabel = loyaltySignUpBanner?.secondaryCtaLabel;
      buttonClick = () => triggerLoyaltyRegister();
    } else {
      heading = loyaltySignUpBanner?.heading;
      subHeading = loyaltySignUpBanner?.description;
      ctaLabel = loyaltySignUpBanner?.ctaLabel;
    }

    const isLoyaltyEnabled = !window.disableLoyalty;

    if (isLoyaltyEnabled) {
      return (
        <LoyaltyAuthBanner
          image={loyaltySignUpBanner?.image?._publishUrl || ''}
          btnContent={ctaLabel?.replace?.('{numberOfMiles}', priceBreakdown?.totalPoints || '')}
          subHeading={subHeading}
          heading={heading}
          handleClick={buttonClick}
          totalEarnPoints={priceBreakdown?.totalPoints || ''}
        />
      );
    }
  };

  const renderLoyaltyInfoBanner = () => {
    let text = '';
    const isCancelFlow = [
      MODIFY_FLOW_IDENTIFIER.CANCEL_FLIGHT,
      MODIFY_FLOW_IDENTIFIER.CANCEL_BOOKING,
    ].includes(modifyFlowCompleteIdentifier);
    const pointsEarn = priceBreakdown?.totalPoints || '';
    if (isEarnFlow && bookingDetails?.hasModification && isCancelFlow) {
      text = 'Lost in Transit! Unfortunately, canceling this journey means waving goodbye to {numberOfMiles} Miles.';
    } else if (isEarnFlow && isCancelFlow) {
      text = '{numberOfMiles} Miles not added to your wallet as you didn’t complete the journey.';
    }
    if (!text || !bookingDetails?.bookingStatus) return;
    text = text?.replace('{numberOfMiles}', pointsEarn);
    // eslint-disable-next-line consistent-return
    return (
      <div className="mt-6">
        <InfoBanner content={text} />
      </div>
    );
  };

  const isFlexHold = (bookingDetails?.paymentStatus === CONSTANTS?.PAYMENT_STATUS?.PENDING)
  && bookingDetails?.isFlexPay;

  return (
    <div className="skyplus-indigo-global-wrapper-v1 skp-itinerary-container">
      {isCommonLoading && <Loader />}
      {/* {modifyFlowCompleteIdentifier && <h2>{modifyFlowCompleteIdentifier}</h2>} */}
      {bookingDetails?.hasModification && !prnNotGenerated && (
      <ModifyItineraryLayout
        refreshData={updateItineraryAfterChange}
        modifyFlowCompleteIdentifier={modifyFlowCompleteIdentifier}
        setAcknowledgementFlow={setAcknowledgementFlow}
        getModifyAcknowledgementDetail={getModifyAcknowledgementDetail}
      />
      )}
      <div className={`view-itinerary skp-itinerary-container--left 
        ${bookingDetails?.hasModification ? 'modification-flow' : ''}`}
      >

        {isRetrievePnr && !bookingDetails?.hasModification && (
        <RetrieveItinerary onClose={() => setIsRetrievePnr(false)} />
        )}
        {isCommonToast && isCommonToast.show && <Toast {...commonToastProps} />}

        {(isBookingFlow || isAcknowledgementFlow || prnNotGenerated) && bookingDetails?.bookingStatus
          && (!bookingDetails?.hasModification || prnNotGenerated) && (
            <BookingConfirmation acknowledgePaymentStausFlag={acknowledgePaymentStausFlag} />
        )}
        {((isMobile && isBookingFlow) || (isMobile && isAcknowledgementFlow)) && bookingDetails.bookingStatus
          && !prnNotGenerated && (
            <NavigationContainer
              refreshData={updateItineraryAfterChange}
              isBookingFlow={isBookingFlow || isAcknowledgementFlow}
            />
        )}
        {(isBookingFlow || isAcknowledgementFlow || prnNotGenerated) && bookingDetails.bookingStatus
            && !isPaymentCompleted && (
              <PaymentTransaction acknowledgePaymentStausFlag={acknowledgePaymentStausFlag} />
        )}
        {(!isBookingFlow && !isAcknowledgementFlow && !prnNotGenerated) && (
        <HtmlBlock
          html={
                itineraryDetailsTitle?.html
              }
          className={`itinerary-details-title 
            ${isFlexHold
            && 'itinerary-details-title-flexPay'}`}
        />
        )}
        {(!isBookingFlow && !isAcknowledgementFlow && !prnNotGenerated)
            && bookingDetails.bookingStatus && (
              <>
                {!isFlexHold && (
                <HtmlBlock
                  html={contenthtml}
                  className="itinerary-details-description-title"
                />
                )}
                {!isSectorInternational && isWebCheckinEnabled ? (
                  <HtmlBlock
                    html={webCheckInDescriptionLabel?.replace('{days}', webCheckInDayLeftLabel)}
                    className="itinerary-details-description"
                  />
                )
                  : isSectorInteranationalOrNot(isSectorInternational)}
              </>
        )}
        {(!isBookingFlow || prnNotGenerated) && bookingDetails.bookingStatus && isAEMContent && (
        <BookingInfo isCancelFlight="false" />
        )}
        {isEnablePaymentProgressCheck && !bookingDetails?.hasModification && isAEMContent && (
          <RetryPayment
            refreshData={updateItineraryAfterChange}
            isEnablePaymentProgressCheck={isEnablePaymentProgressCheck}
            setacknowledgePaymentStausFlag={setacknowledgePaymentStausFlag}
            bookingStatus={bookingDetails?.bookingStatus}
            paymentStatus={bookingDetails?.paymentStatus}
          />
        )}
        {isWebCheckinEnabled && !isBookingFlow && isMobile && !prnNotGenerated && (

        <Button
          variant="outline"
          color="primary"
          size="large"
          containerClass="webcheckin-cta"
          onClick={handleRedirection}
        >
          {webCheckInTitle || 'Web Check-in'}
        </Button>
        )}
        {isSectorInternational && !isBookingFlow && isMobile && !prnNotGenerated && (
        <Button
          color="primary"
          size="large"
          containerClass={`webcheckin-cta ${isWebCheckinEnabled ? 'check-in-international' : 'international'}
                ${(bookingDetails?.hasModification) ? 'international-modify' : ''}`}
          onClick={() => { window.location.href = internationalPassengerDetailsCtaPath || ''; }}
        >
          {internationalPassengerDetailsCta || 'Submit International Passenger Details'}
        </Button>
        )}

        {isUndoCheckInEnabled && isMobile && !prnNotGenerated && (
        <Button
          variant="outline"
          color="primary"
          size="large"
          containerClass="webcheckin-cta undo-checkin"
          onClick={() => { window.location.href = undoWebCheckInCtaPath || ''; }}
        >
          {undoWebCheckInCta || 'Undo web check in'}
        </Button>
        )}
        {(!isBookingFlow && !isAcknowledgementFlow && !bookingDetails?.hasModification)
            && isAEMContent && !prnNotGenerated && !isCancelFlightFlow && (
              <NavigationContainer refreshData={updateItineraryAfterChange} />
        )}
        {renderLoyaltyInfoBanner()}
        {stripStatusAemFlag && stripStatusApiFlag
          ? <ScratchCardWidget /> : ''}

        {renderLoyaltyAuthBanner()}

        {/* <Strip data={stripData} ButtonComponent={Button} /> */}
        {isBookingFlow
          && !bookingDetails?.hasModification
          && !isAcknowledgementFlow
          && showHotelStrip
          && hotelList?.data?.length ? (
            <HotelStrip
              hotelList={hotelList?.data}
              arrivalCityName={hotelList?.arrivalCityName}
              showMoreUrl={hotelList?.showMoreUrl}
              isModificationFlow={bookingDetails?.hasModification}
              isBookingFlow={isBookingFlow}
              isCancelFlightFlow={isCancelFlightFlow}
              hotelRecommendations={hotelRecommendations}
              stripType={HOTEL_TRAVELTIPS_VARIATION.HOTELSTRIP}
            />
          ) : null }

        {bookingDetails?.bookingStatus && isAEMContent
          && !prnNotGenerated && <Flight />}
        {bookingDetails.recordLocator
          && indigoTaxRefundDetails?.isToShowTaxRefund && <NoShowContainer updateItineraryData={makeGetItinerary} />}
        {!isBookingFlow && showHotelStrip && hotelList?.data?.length ? (
          <HotelStrip
            hotelList={hotelList?.data}
            arrivalCityName={hotelList?.arrivalCityName}
            showMoreUrl={hotelList?.showMoreUrl}
            isModificationFlow={bookingDetails?.hasModification}
            isBookingFlow={isBookingFlow}
            isCancelFlightFlow={isCancelFlightFlow}
            hotelRecommendations={hotelRecommendations}
            stripType={HOTEL_TRAVELTIPS_VARIATION.HOTELSTRIP}
          />
        ) : null}
        {(!bookingDetails?.hasModification && !isAcknowledgementFlow && isAEMContent && !isCancelFlightFlow)
            && <TravelTips swiperModel={TRAVELTIPS_VARIATION.TRAVELCHECKOUTS} />}
        {isWebCheckinEnabled && isMobile && !isAcknowledgementFlow
            && !bookingDetails?.hasModification && <SmartWebCheckin />}
        {isMobile && !bookingDetails?.hasModification && !isAcknowledgementFlow && isAEMContent && (
        <TravelTips swiperModel={TRAVELTIPS_VARIATION.TRAVELREMINDERS} />
        )}
        {checkUmnr() && (
        <div className="unmr-notification">
          <pre>{JSON.stringify(mfAdditionalData.umnrFormSection, 0, 2)}</pre>
          <div className="unmr-notification__title">
            {mandatoryTitle || 'Mandatory'}
            <img
              alt=""
              src={mandatoryIcon?._publishUrl}
              loading="lazy"
            />
          </div>
          <div className="unmr-notification__text-container">
            <HtmlBlock
              html={
                    mandatoryDescription?.html
                      ? mandatoryDescription?.html
                      : '' // eslint-disable-line max-len
                  }
              className="unmr-notification__text"
            />
            <div>
              <a
                className="unmr-notification__download-btn btn"
                href={downloadFormCtaLink || '#'}
                target="_blank"
                rel="noreferrer"
                download
              >
                {downloadFormCtaTitle
                      || 'Download Form'}
              </a>
            </div>
          </div>
        </div>
        )}
        {isMobile && (!bookingDetails?.hasModification && !isAcknowledgementFlow
            && isAEMContent && !isCancelFlightFlow) && <ExploreCity />}
        {isMobile && isAEMContent && !bookingDetails?.hasModification && !isAcknowledgementFlow && <ChatSection />}
        {((isMulitcity
            && isRoundCity))
            && isMobile && isAEMContent && !bookingDetails?.hasModification
            && !isAcknowledgementFlow && <ReturnFlightBanner />}
        {bookingDetails?.bookingStatus && isAEMContent && <PaymentDetails />}
        {isMobile && (!bookingDetails?.hasModification || prnNotGenerated)
          && (!isAcknowledgementFlow || prnNotGenerated) && <MoreInformation />}
        {isMobile && (isAEMContent && !isAcknowledgementFlow && !bookingDetails?.hasModification) && (
        <Button
          variant="filled"
          color="primary"
          size="large"
          containerClass="retrieve-another-itinerary"
          onClick={() => setIsRetrievePnr(true)}
        >
          {retrieveAnotherItineraryLabel || 'Retriev Another itinerary'}
        </Button>
        )}
      </div>
      {!isMobile && renderRightSection(isBookingFlow || isAcknowledgementFlow)}
    </div>
  );
};

ViewItineraryApp.propTypes = {
  itineraryDetailsDescription: PropTypes.any,
  passengerDetails: PropTypes.any,
  loginType: PropTypes.string,
  mfAdditionalData: PropTypes.object,
};
export default ViewItineraryApp;
