import { encryptAESForLogin } from 'skyplus-design-system-app/src/functions/loginEncryption';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { COOKIE_KEYS } from 'skyplus-design-system-app/src/constants';
import RSAEncryption from 'skyplus-design-system-app/src/functions/rsaEncryption';
import { CONSTANTS, PAGES } from '../components/constants';
import { getSessionToken } from '../utils';
import request from '../utils/request';

const API_LIST = {
  GET_ITINERARY: '',
  EMAIL_ITINERARY: '',
  PLANB_ELIGIBLITY: '/eligibility/check',
  AEM_CHECK_IN_DATA: '/content/api/s6web/in/en/v1/retrieve-pnr/check-in.json',
  AEM_CHECK_IN_DATA_BOOKINGS_PAGE: '/content/api/s6web/in/en/v1/retrieve-pnr/check-in-bookings-page.json',
  AEM_SPLIT_PNR_DATA: '/content/api/s6web/in/en/v1/split-pnr.json',
  VISA_STATUS: `${window?._env_retrieve_pnr.VISA_BOOKING_DOMAIN}${window?._env_retrieve_pnr.GET_VISA_BOOKING_STATUS}`,
  VISA_USER_KEY: `${window?._env_retrieve_pnr.GET_VISA_BOOKING_STATUS}`,
  ...window?._env_retrieve_pnr,
};

export const makePnrSearchReq = async (pnr, lastname, flag, isItinerary) => {
  let queryKey = 'email';
  if (CONSTANTS.REGEX_LIST.ONLY_CHARS_FIELD.test(lastname)) {
    queryKey = 'lastName';
  }

  const url = isItinerary ? `${API_LIST.GET_ITINERARY_CONTACT_US}?recordLocator=${pnr}&${queryKey}=${lastname}`
    : `${API_LIST.GET_ITINERARY}?recordLocator=${pnr}&${queryKey}=${lastname}&processFlag=${flag}`;

  const headers = {
    user_key: API_LIST.USERKEY_ITINERARY_GET,
  };
  try {
    const response = await request(url, { headers });
    if (response?.data?.success) {
      return { ...response.data, isSuccess: true };
    }
    return response;
  } catch ({ ...e }) {
    return { isError: true, ...e };
  }
};
export const emailItineraryReq = async (pnr, lastname) => {
  const token = getSessionToken();
  let queryKey = 'emailAddress';
  if (CONSTANTS.REGEX_LIST.ONLY_CHARS_FIELD.test(lastname)) {
    queryKey = 'lastName'; // if text hase only string then it will consider as lastname
  }
  const payload = {
    recordLocator: pnr,
    [queryKey]: lastname,
  };
  const url = API_LIST.EMAIL_ITINERARY;
  const config = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_ITINERARY_SAVE,
    },
  };
  try {
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      return { ...response.data, ...{ isSuccess: true } };
    }
    return response;
  } catch (err) {
    return { isError: true };
  }
};
export const makePlanbEligiblityReq = async (pnr, lastname) => {
  const token = getSessionToken();
  let queryKey = 'email';
  if (CONSTANTS.REGEX_LIST.ONLY_CHARS_FIELD.test(lastname)) {
    queryKey = 'lastName'; // if text hase only string then it will consider as lastname
  }
  const url = API_LIST.PLANB_ELIGIBLITY;
  const payload = {
    eligibilityCheck: {
      recordLocator: pnr,
      [queryKey]: lastname,
    },
  };

  const config = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_ITINERARY_GET,
    },
  };
  try {
    const response = await (await fetch(url, config)).json();
    if (response?.data?.success) {
      return { ...response.data, ...{ isSuccess: true } };
    }
    return response;
  } catch (error) {
    return { isError: true };
  }
};

export const getInitiateRefundOtp = async () => {
  try {
    return await (await fetch(API_LIST.GET_OTP_REFUND_MHB_API, { credentials: 'include' })).json();
  } catch (error) {
    return ({ isError: true });
  }
};

export const addInitiateRefund = async (pnr, lastName, setAlert, errMsg) => {
  const payload = {
    'indiGoRetrieveBooking.RecordLocator': pnr,
    polymorphicField: lastName,
    typeSelected: 'SearchByNAMEFLIGHT',
    'indiGoRetrieveBooking.IndiGoRegisteredStrategy':
      'Nps.IndiGo.Strategies.IndigoValidatePnrContactNameStrategy, Nps.IndiGo',
    'indiGoRetrieveBooking.IsToEmailItinerary': 'false',
    'indiGoRetrieveBooking.EmailAddress': '', // Pass an actual email if required
    'indiGoRetrieveBooking.LastName': lastName,
  };
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => formData.set(key, value));
  const url = API_LIST.RETRIEVE_AEM_CLAIM_REFUND;
  const config = {
    method: 'POST',
    body: formData,
    credentials: 'include',
  };
  try {
    let response = await (await fetch(url, config)).json();
    if (response?.indiGoRetrieveBooking) {
      const { getOTPRefundMHB } = await getInitiateRefundOtp();
      response = { ...response, ...getOTPRefundMHB };
      if (getOTPRefundMHB?.oTPResponse?.status !== 'Success') {
        setAlert(getOTPRefundMHB?.oTPResponse?.status);
      }
    } else {
      setAlert(errMsg);
    }
    return response;
  } catch (err) {
    return { isError: true };
  }
};

export const getAEMData = (page) => {
  // for my bookings page if user is logged in then
  // need different labels for retrive itinerary
  // so calling separate API
  let checkinAemLabelUrl = API_LIST.AEM_CHECK_IN_DATA;
  const isLoggedIn = Cookies.get(COOKIE_KEYS.USER, true, true) || false;

  switch (window.pageType) {
    case PAGES.MY_BOOKINGS:
      if (isLoggedIn) {
        checkinAemLabelUrl = API_LIST?.AEM_CHECK_IN_DATA_BOOKINGS_PAGE;
      } else {
        checkinAemLabelUrl = API_LIST.AEM_CHECK_IN_DATA_BOOKINGS_PAGE_GUEST;
      }
      break;
    case PAGES?.CHANGE_FLIGHT:
      checkinAemLabelUrl = API_LIST?.AEM_CHANGE_FLIGHT_DATA;
      break;
    case PAGES?.UPDATE_CONTACT_DETAILS:
      checkinAemLabelUrl = API_LIST?.AEM_UPDATE_CONTACT_DETAILS_DATA;
      break;
    case PAGES?.CREDIT_SHELL:
      checkinAemLabelUrl = API_LIST?.AEM_CREDIT_SHELL_DATA;
      break;
    case PAGES?.EDIT_BOOKING:
      checkinAemLabelUrl = API_LIST?.AEM_EDIT_BOOKING_DATA;
      break;
    case PAGES?.HELP_PAGE:
      checkinAemLabelUrl = API_LIST?.AEM_HELP_DATA;
      break;
    case PAGES?.CANCELLATION:
      checkinAemLabelUrl = API_LIST?.AEM_CANCELLATION_DATA;
      break;
    case PAGES?.BOARDING_PASS:
      checkinAemLabelUrl = API_LIST?.AEM_BOARDING_PASS_DATA;
      break;
    case PAGES.TRACK_REFUND:
      checkinAemLabelUrl = API_LIST.AEM_TRACK_REFUND_DATA;
      break;
    case PAGES.PLAN_B:
      checkinAemLabelUrl = API_LIST.AEM_PLAN_B_DATA;
      break;
    case PAGES.CONTACT_US:
      checkinAemLabelUrl = API_LIST.AEM_INFO_CONTACT_US_DATA;
      break;
    case PAGES.REFUND:
      checkinAemLabelUrl = API_LIST.AEM_REFUND_DATA;
      break;
    case PAGES.VISA_TRACK_STATUS:
      checkinAemLabelUrl = API_LIST.VISA_TRACK_STATUS;
      break;
    case PAGES.INITIATE_REFUND:
      checkinAemLabelUrl = API_LIST.AEM_INITIATE_REFUND;
      break;
    default:
      checkinAemLabelUrl = API_LIST.AEM_CHECK_IN_DATA;
  }

  let apiEndpoint;
  if (page === PAGES.TRACK_REFUND) {
    apiEndpoint = API_LIST?.AEM_TRACK_REFUND_DATA;
  } else if (page === PAGES.SPLIT_PNR) {
    apiEndpoint = API_LIST?.AEM_SPLIT_PNR_DATA;
  } else if (page === PAGES.GST_INVOICE) {
    apiEndpoint = API_LIST.AEM_GST_INVOICE_DATA;
  } else {
    apiEndpoint = checkinAemLabelUrl || API_LIST?.AEM_CHECK_IN_DATA;
  }

  return request(apiEndpoint, {}).then((res) => {
    let data;
    if (page === PAGES.SPLIT_PNR) {
      data = res?.data?.splitPnrByPath?.item || {};
    } else if (page === PAGES.INITIATE_REFUND) {
      data = res?.data?.refundInitiateByPath?.item || {};
    } else {
      data = res?.data?.retrievePnrByPath?.item || {};
    }
    return data;
  });
};

export const makeRefundStatusReq = async (pnr, lastname, justpayId) => {
  const token = getSessionToken();
  let payload = '';
  if (justpayId) {
    payload = {
      TransactionId: justpayId,
    };
  } else {
    payload = {
      recordLocator: pnr,
      lastName: lastname,
    };
  }
  const url = API_LIST.POST_REFUND_STATUS;
  const config = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST.USERKEY_REFUND_STATUS,
    },
  };
  try {
    const response = await (await fetch(url, config)).json();
    if (response?.errors) {
      return { errors: response.errors };
    }
    if (response?.data?.indigoRefundStatus) {
      const encyptedPayload = encryptAESForLogin(JSON.stringify(payload));
      localStorage.setItem(CONSTANTS.BROWSER_STORAGE_KEYS.REFUND_FORM_DATA, encyptedPayload);
      return { data: response, isSuccess: true };
    }
  } catch (err) {
    return { isError: true };
  }
  return true;
};

export const makeTrackVisaStatusReq = async (pnr, bookingId) => {
  const key = window?.msdv2?.rsapK;

  const booking = await RSAEncryption.encrypt(bookingId, key);
  const pnrID = await RSAEncryption.encrypt(pnr, key);

  const payload = {
    bookingId: booking,
    pnr: pnrID,
  };

  const url = `${API_LIST?.VISA_BOOKING_DOMAIN}${API_LIST?.GET_VISA_BOOKING_STATUS}`;
  const config = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      user_key: API_LIST?.VISA_USER_KEY,
    },
  };
  try {
    const response = await (await fetch(url, config)).json();
    if (response?.errors) {
      return { errors: response.errors };
    }
    if (response?.data) {
      const visaLocalStorage = {
        bookingId: booking,
        pnrId: pnrID,
      };
      localStorage.setItem(CONSTANTS.BROWSER_STORAGE_KEYS.VISA_SERVICE_K, JSON.stringify(visaLocalStorage));
      return { data: response, isSuccess: true, bookingId };
    }
    if (response?.message) {
      return { message: response?.message };
    }
  } catch (err) {
    return { isError: true };
  }
  return true;
};

export { API_LIST };
