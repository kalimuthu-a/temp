import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import RSAEncryption from 'skyplus-design-system-app/src/functions/rsaEncryption';
import { getEnvObj, getRoleDetails } from '../utils';
import { COOKIE_KEYS } from '../constants/cookieKeys';
import {
  apiResponse,
  ddRumErrorEventHandler,
  ddRumPayload,
} from './eventHandling';
import {
  mockConfirmPayment,
  mockCountryList,
  mockGetBookingStatus,
  mockGetCountryByGroupedName,
  mockGetCountryByName,
  mockGetVisaDocList,
  mockOccupationList,
  mockPostCreateBooking,
  uploadVisaDocument,
  visaPlanSummary,
} from './mock.api.data';
import { CONSTANTS, MEMBER } from '../constants';

const envObj = getEnvObj();

let API_LIST = {
  domain: envObj?.VISA_DOMAIN,
  bookingDomain: envObj?.VISA_BOOKING_DOMAIN,
  docDomain: envObj?.VISA_DOC_DOMAIN,
  COUNTRY_LIST: `${envObj?.VISA_DOMAIN}${envObj?.COUNTRY_LIST}`,
  COUNTRY_DETAILS_BY_NAME: `${envObj?.VISA_DOMAIN}${envObj?.COUNTRY_DETAILS_BY_NAME}`,
  COUNTRY_DETAILS_GROUPED_BY_NAME: `${envObj?.VISA_DOMAIN}${envObj?.COUNTRY_DETAILS_GROUPED_BY_NAME}`,
  GET_OCCUPATION_LIST: `${envObj?.VISA_DOMAIN}${envObj?.GET_OCCUPATION_LIST}`,
  GET_BOOKING_STATUS: `${envObj?.VISA_BOOKING_DOMAIN}${envObj?.GET_BOOKING_STATUS}`,
  DOWNLOAD_INVOICE: `${envObj?.VISA_DOC_DOMAIN}${envObj?.DOWNLOAD_INVOICE}`,
  GET_VISA_DOCUMENT_LIST: `${envObj?.VISA_DOC_DOMAIN}${envObj?.GET_VISA_DOCUMENT_LIST}`,
  UPLOAD_VISA_DOCUMENT: `${envObj?.VISA_DOC_DOMAIN}${envObj?.UPLOAD_VISA_DOCUMENT}`,
  CREATE_BOOKING: `${envObj?.VISA_BOOKING_DOMAIN}${envObj?.CREATE_BOOKING}`,
  CONFIRM_PAYMENT: `${envObj?.VISA_BOOKING_DOMAIN}${envObj?.CONFIRM_PAYMENT}`,
  GET_VISA_STATUS: `${envObj?.VISA_DOMAIN}${envObj?.GET_VISA_STATUS}`,
  GET_PASSENGER: envObj?.GET_PASSENGER,
  VISA_PLAN_SUMMARY: `${envObj?.VISA_DOMAIN}${envObj?.VISA_PLAN_SUMMARY}`,
  GET_PASSENGER_SAVE_KEY: envObj?.GET_PASSENGER_SAVE_KEY,
  BOOKING_WIDGET: envObj?.BOOKING_WIDGET,
  USER_KEY_BOOKING_WIDGET: envObj?.USER_KEY_BOOKING_WIDGET,
  CREATE_INVOICE: `${envObj?.VISA_DOC_DOMAIN}${envObj?.CREATE_INVOICE}`,
  CHECK_EVISA: `${envObj?.VISA_DOC_DOMAIN}${envObj?.CHECK_EVISA}`,
  DOWNLOAD_EINVOICE: `${envObj?.VISA_DOC_DOMAIN}${envObj?.DOWNLOAD_EINVOICE}`,
};

export const ENVCONFIG = {
  VISA_PAX_SELECT: '',
};

const authUser = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
const isLoyaltyMember = authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn || false;

const render = true;
if (render) {
  // Object.keys(envObj).length > 0 && window._env_visa_service
  // make sure the one mandatory key,value should be there
  API_LIST = {
    ...{
      ...envObj,
      VISA_MAIN:
        envObj.VISA_MAIN
        || '/content/api/s6web/in/en/v1/visa-main.json',
      EMAIL_ITINERARY: envObj.EMAIL_ITINERARY || '',
      LOGIN: envObj.LOGIN || '',
    },
    ...API_LIST,
  };
}

const commonHeaders = {
  user_key: API_LIST?.USER_KEY,
  SSOPolicyName: isLoyaltyMember ? MEMBER.B2C_1A_PH_LOYALTY : MEMBER.B2C_1A_PH_NON_LOYALTY,
};

// USER_KEY_SCRATCH_CARD: '',
const catchErrorMsg = 'catch block error';

/* Render components basic on page types */
const aemApiUrls = () => {
  return API_LIST.VISA_MAIN;
};

export const encryptText = async (text) => {
  const key = window?.msdv2?.rsapK || '';

  if (!key || !text) {
    return text;
  }
  // eslint-disable-next-line no-return-await
  return await RSAEncryption.encrypt(text, key);
};

export const getAemContent = async () => {
  // const authToken = cookies ? cookies.get('auth_token') : ''; // NOSONAR,  keeping the line for furture usecases
  // const USER_KEY_FETCH = ''; // NOSONAR keeping the line for furture usecases
  const startTime = Date.now();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
  const aemApiEndPoint = aemApiUrls() || ''; // AEM api url call basic page type
  try {
    const response = await (await fetch(aemApiEndPoint, config)).json();
    return apiResponse(
      response,
      config.method,
      {},
      aemApiEndPoint,
      startTime,
      true,
    );
  } catch (error) {
    const visaServicePayload = ddRumPayload(
      config.method,
      {},
      aemApiEndPoint,
    );

    ddRumErrorEventHandler(
      error,
      aemApiUrls() || '',
      startTime,
      visaServicePayload,
      true,
    );
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const getCountryList = async () => {
  // remove once api is ready
  const renderMock = false;
  if (renderMock) {
    const { response } = mockCountryList;
    return response;
  }

  const startTime = Date.now();
  const url = `${API_LIST.COUNTRY_LIST}`;
  try {
    const config = {
      method: 'GET',
      headers: {
        ...commonHeaders,
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(url, config)).json();
    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (error) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(error, url, startTime, visaServicePayload);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to get details of country by country name
export const getCountryDetailsByName = async (countryName) => {
  // remove once api is ready
  const renderMock = false;
  if (renderMock) {
    const { response } = mockGetCountryByName;
    return response.data;
  }

  const startTime = Date.now();
  const url = `${API_LIST.COUNTRY_DETAILS_BY_NAME}${countryName}`;
  try {
    const config = {
      method: 'GET',
      headers: {
        ...commonHeaders,
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(url, config)).json();
    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (error) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(error, url, startTime, visaServicePayload);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to get details of country GROUPED by country name 1
export const getCountryDetailsGroupedByName = async (countryName) => {
  // remove once api is ready
  const renderMock = false;
  if (renderMock) {
    const { response } = mockGetCountryByGroupedName;
    return response;
  }

  const startTime = Date.now();
  const url = `${API_LIST.COUNTRY_DETAILS_GROUPED_BY_NAME}${countryName}`;
  try {
    const config = {
      method: 'GET',
      headers: {
        ...commonHeaders,
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(url, config)).json();
    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (error) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(error, url, startTime, visaServicePayload);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to get occupation list 2
export const getOccupationList = async () => {
  // remove once api is ready
  const renderMock = false;
  if (renderMock) {
    const { response } = mockOccupationList;
    return response;
  }

  const startTime = Date.now();
  const url = API_LIST.GET_OCCUPATION_LIST;
  try {
    const config = {
      method: 'GET',
      headers: {
        ...commonHeaders,
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(url, config)).json();
    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (error) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(error, url, startTime, visaServicePayload);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to create booking for visa 3
export const createBookingReq = async (payload) => {
  // remove once api is ready
  const renderMock = false;
  if (renderMock) {
    const { response } = mockPostCreateBooking;
    return response;
  }

  const url = API_LIST.CREATE_BOOKING;
  const authToken = Cookies.get(COOKIE_KEYS.AUTH);
  const config = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: JSON.parse(authToken)?.token,
      ...commonHeaders,
      'Access-Control-Allow-Origin': '*',
    },
  };
  const startTime = Date.now();
  try {
    const response = await (await fetch(url, config)).json();
    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (err) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(err, url, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};

export const createInvoice = async (bookingIdValue, pnrId) => {
  const downloadInvoiceUrl = API_LIST?.CREATE_INVOICE;
  const startTime = Date.now();

  const payload = {
    bookingId: bookingIdValue,
    pnr: pnrId,
  };

  try {
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(downloadInvoiceUrl, config)).json();
    return apiResponse(response, config.method, {}, downloadInvoiceUrl, startTime, false);
  } catch (err) {
    const visaServicePayload = ddRumPayload('GET', {}, downloadInvoiceUrl, startTime, false);
    ddRumErrorEventHandler(err, downloadInvoiceUrl, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to download visa invoice
export const downloadInvoice = async (bookingIdValue, pnrId) => {
  const downloadInvoiceUrl = `${API_LIST.DOWNLOAD_INVOICE}`;
  const startTime = Date.now();

  const payload = {
    bookingId: bookingIdValue,
    pnr: pnrId,
  };

  try {
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    };
    const response = await fetch(downloadInvoiceUrl, config);

    if (!response.ok || response.status !== 200) {
      return await response.json();
    }
    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition');
    const fileNameMatch = contentDisposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const fileName = fileNameMatch ? fileNameMatch[1].replace(/['"]/g, '') : 'download.pdf';

    // Create a link to download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    return true;
  } catch (err) {
    const visaServicePayload = ddRumPayload('POST', {}, downloadInvoiceUrl, startTime, false);
    ddRumErrorEventHandler(err, downloadInvoiceUrl, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to get visa booking status 5
export const getBookingStatus = async (booking, pnrId, encrypted) => {
  // remove once api is ready
  const renderMock = false;
  if (renderMock) {
    const { response } = mockGetBookingStatus;
    return response;
  }

  const bookingId = encrypted ? booking : await encryptText(booking);
  const pnr = encrypted ? pnrId : await encryptText(pnrId);

  const payload = {
    bookingId,
    pnr,
  };

  const downloadInvoiceUrl = `${API_LIST.GET_BOOKING_STATUS}`;
  const startTime = Date.now();

  try {
    // will update once api variable name is confirmed
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(downloadInvoiceUrl, config)).json();
    return apiResponse(response, config.method, {}, downloadInvoiceUrl, startTime, false);
  } catch (err) {
    const visaServicePayload = ddRumPayload('GET', {}, downloadInvoiceUrl, startTime, false);
    ddRumErrorEventHandler(err, downloadInvoiceUrl, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to get visa document list
export const getVisaDocList = async (bookingId, travelId, pnr) => {
  // remove once api is ready
  const renderMock = false;
  if (renderMock) {
    const { response } = mockGetVisaDocList;
    return response.data;
  }

  const bookingID = await encryptText(bookingId);
  const travllerId = await encryptText(travelId);
  const recordLocator = await encryptText(pnr);

  const visaDocListUrl = `${API_LIST.GET_VISA_DOCUMENT_LIST}`;
  const startTime = Date.now();
  const payload = {
    bookingId: bookingID, // Encrypted
    pnr: recordLocator, // Encrypted,
    travelerId: travllerId, // Encrypted
  };
  try {
    const config = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        ...commonHeaders,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
    const response = await (await fetch(visaDocListUrl, config)).json();
    const res = apiResponse(response, config.method, {}, visaDocListUrl, startTime, false);
    return res?.data;
  } catch (err) {
    const visaServicePayload = ddRumPayload('GET', {}, visaDocListUrl, startTime, false);
    ddRumErrorEventHandler(err, visaDocListUrl, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to upload visa documents 6
export const uploadVisaDocuments = async (payload) => {
  // remove once api is ready
  const renderMock = false;
  if (renderMock) {
    const { response } = uploadVisaDocument;
    return response;
  }

  const uploadVisaDocUrl = API_LIST.UPLOAD_VISA_DOCUMENT;
  const startTime = Date.now();
  try {
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await fetch(uploadVisaDocUrl, config);
    if (response?.status !== 200) {
      const apiDate = await response.json();
      return { isSuccess: false, msg: apiDate?.message || response?.statusText || 'Internal Server Error' };
    }
    const apiDate = await response.json();
    return apiResponse(apiDate, config.method, {}, uploadVisaDocUrl, startTime, false);
  } catch (err) {
    const visaServicePayload = ddRumPayload('POST', {}, uploadVisaDocUrl, startTime, false);
    ddRumErrorEventHandler(err, uploadVisaDocUrl, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion for payment confirmation
export const confirmPayment = async ({
  bookingId,
  processPayment,
  amount,
}) => {
  const confirmPaymentUrl = API_LIST.CONFIRM_PAYMENT;
  const startTime = Date.now();
  const payload = {
    bookingId,
    processPayment,
    amount,
  };
  const renderMock = false;
  if (renderMock) {
    const { response } = mockConfirmPayment;
    return response;
  }

  try {
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(confirmPaymentUrl, config)).json();
    return apiResponse(response, config.method, {}, confirmPaymentUrl, startTime, false);
  } catch (err) {
    const visaServicePayload = ddRumPayload('POST', {}, confirmPaymentUrl, startTime, false);
    ddRumErrorEventHandler(err, confirmPaymentUrl, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to get details of country by country name
export const getVisaStatus = async (bookingId) => {
  const startTime = Date.now();
  const url = `${API_LIST.GET_VISA_STATUS}${bookingId}`;
  try {
    const config = {
      method: 'GET',
      headers: {
        ...commonHeaders,
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(url, config)).json();

    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (error) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(error, url, startTime, visaServicePayload);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to get details of country by country name
export const getVisaPlanSummary = async (quoteId) => {
  const renderMock = false;
  if (renderMock) {
    const { response } = visaPlanSummary;
    return response;
  }

  const startTime = Date.now();
  const url = `${API_LIST.VISA_PLAN_SUMMARY}${quoteId}`;
  try {
    const config = {
      method: 'GET',
      headers: {
        ...commonHeaders,
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(url, config)).json();
    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (error) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(error, url, startTime, visaServicePayload);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

// API function to get passenger details
export const getPassengersDetails = async (pnr, lastname, plKey) => {
  const startTime = Date.now();
  const authToken = Cookies.get(COOKIE_KEYS.AUTH);
  let url = `${API_LIST.GET_PASSENGER}`;
  if (plKey) {
    url += `?pl=${plKey}`;
  } else if (pnr && lastname && (lastname?.indexOf('@') !== -1)) {
    url += `?recordLocator=${pnr}&email=${lastname}`;
  } else if (pnr && lastname) {
    url += `?recordLocator=${pnr}&lastName=${lastname}`;
  }
  try {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: JSON.parse(authToken)?.token,
        user_key: API_LIST.GET_PASSENGER_SAVE_KEY,
      },
    };
    const response = await (await fetch(url, config)).json();
    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (error) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(error, url, startTime, visaServicePayload);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

export const getAllListOfDocument = async (bookingDetails, pnr) => {
  const travllerDoc = {};
  await Promise.all(bookingDetails?.travelerDetails?.map(async (item) => {
    const result = await getVisaDocList(bookingDetails.bookingId, item.travelerId, pnr);
    if (result) {
      travllerDoc[item.travelerId] = result;
    }
    return travllerDoc;
  }));
  return travllerDoc;
};

export const getWidgetData = async () => {
  const roleDetails = getRoleDetails();
  const startTime = Date.now();
  const url = formattedMessage(
    '{url}?roleName={roleName}&roleCode={roleCode}',
    {
      url: API_LIST.BOOKING_WIDGET,
      roleName: roleDetails.roleName || 'Anonymous',
      roleCode: roleDetails.roleCode || 'WWWA',
    },
  );
  try {
    const config = {
      method: 'GET',
      headers: {
        user_key: API_LIST.USER_KEY_BOOKING_WIDGET,
      },
    };
    const response = await (await fetch(url, config)).json();
    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (error) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(error, url, startTime, visaServicePayload);
    return { error, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to get visa booking status 5
export const confirmBookingPayment = async (booking, pnrId) => {
  // remove once api is ready
  const renderMock = false;
  if (renderMock) {
    const { response } = mockGetBookingStatus;
    return response;
  }
  const payload = {
    bookingId: booking,
    pnr: pnrId,
  };

  const url = `${API_LIST.CONFIRM_PAYMENT}`;
  const startTime = Date.now();
  try {
    // will update once api variable name is confirmed
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...commonHeaders,
      },
    };
    const response = await (await fetch(url, config)).json();
    return apiResponse(response, config.method, {}, url, startTime, false);
  } catch (err) {
    const visaServicePayload = ddRumPayload('GET', {}, url, startTime, false);
    ddRumErrorEventHandler(err, url, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};

export const checkEVisa = async (bookingIdValue, pnrId) => {
  const downloadInvoiceUrl = API_LIST?.CHECK_EVISA;
  const startTime = Date.now();

  const payload = {
    bookingId: bookingIdValue,
    pnr: pnrId,
  };

  try {
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const response = await (await fetch(downloadInvoiceUrl, config)).json();
    return apiResponse(response, config.method, {}, downloadInvoiceUrl, startTime, false);
  } catch (err) {
    const visaServicePayload = ddRumPayload('POST', {}, downloadInvoiceUrl, startTime, false);
    ddRumErrorEventHandler(err, downloadInvoiceUrl, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};

// api funtion to download e visa
export const dowloadEvisa = async (bookingIdValue, pnrId) => {
  const downloadInvoiceUrl = `${API_LIST.DOWNLOAD_EINVOICE}`;
  const startTime = Date.now();

  const payload = {
    bookingId: bookingIdValue,
    pnr: pnrId,
  };

  try {
    const config = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    };
    const response = await fetch(downloadInvoiceUrl, config);

    if (!response.ok || response.status !== 200) {
      return await response.json();
    }
    const contentType = response.headers.get('content-type');
    if (contentType === 'application/zip') {
      const blob = await response.blob();
      const filename = response.headers.get('content-disposition')
        ?.split('filename=')[1]?.replace(/["']/g, '');
        // Create a download link and click it
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'download.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    }
    return false;
  } catch (err) {
    const visaServicePayload = ddRumPayload('POST', {}, downloadInvoiceUrl, startTime, false);
    ddRumErrorEventHandler(err, downloadInvoiceUrl, startTime, visaServicePayload);
    return { err, isSuccess: false, msg: catchErrorMsg };
  }
};
