import { PAGES } from '../constants';

/* eslint-disable sonarjs/no-duplicate-string */
export const visaServiceActions = {
  PAGE_SECTION_TYPE: 'PAGE_SECTION_TYPE',
  SET_VISA_AEM_MAIN_CONTENT: 'SET_VISA_AEM_MAIN_CONTENT',
  SET_VISA_API_ERROR: 'SET_VISA_API_ERROR',
  GET_VISA_BOOKING_DETAILS: 'GET_VISA_BOOKING_DETAILS',
  SET_VISA_SRP_DETAILS: 'SET_VISA_SRP_DETAILS',
  VISA_SELECTED_PAX: 'VISA_SELECTED_PAX',
  SELECTED_VISA_DETAILS: 'SELECTED_VISA_DETAILS',
  BOOKING_DETAILS: 'BOOKING_DETAILS',
  VISA_BOOKING_STATUS: 'VISA_BOOKING_STATUS',
  VISA_TRAVELER_DETAILS: 'VISA_TRAVELER_DETAILS',
  GET_VISA_QUOTATIONS: 'GET_VISA_QUOTATIONS',
  GET_ITINERARY_DETAILS: 'GET_ITINERARY_DETAILS',
  SHOW_FULL_VISA_BOOKING_WIDGET: 'SHOW_FULL_VISA_BOOKING_WIDGET',
  GET_COUNTRY_LIST: 'GET_COUNTRY_LIST',
  GET_VISA_COUNTRIES_DETAILS: 'GET_VISA_COUNTRIES_DETAILS',
  UPLOAD_DOCUMENT_LIST: 'UPLOAD_DOCUMENT_LIST',
  RESET_TO_INITIAL: 'RESET_TO_INITIAL',
  OPEN_CONFIRMATION_POPUP: 'OPEN_CONFIRMATION_POPUP',
};

const setPayloadValue = (payload, key, defaultValue = null) => {
  return payload[key] || defaultValue;
};

export const visaServiceReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case visaServiceActions.SET_VISA_AEM_MAIN_CONTENT: {
      return {
        ...state,
        visaSrpByPath: setPayloadValue(payload, 'srp'),
        visaPlanDetailsByPath: setPayloadValue(payload, 'planDetails'),
        visaTravelerDetailByPath: setPayloadValue(payload, 'travelerDetail'),
        visaReviewApplicationByPath: setPayloadValue(payload, 'reviewApplication'),
        visaUploadDocumentsByPath: setPayloadValue(payload, 'uploadDocuments'),
        visaBookingDetailsByPath: setPayloadValue(payload, 'bookingDetails'),
        visaPaxSelectByPath: setPayloadValue(payload, 'selectPax'),
        visaBookingSummaryByPath: setPayloadValue(payload, 'bookingSummary'),
        visaAllQuotations: setPayloadValue(payload, 'visaAllQuotations'),
        getItineraryDetails: setPayloadValue(payload, 'getItineraryDetails'),
        showFullVisaBookingWidget: setPayloadValue(payload, 'showFullVisaBookingWidget', false),
        getCountriesList: setPayloadValue(payload, 'getCountriesList', []),
        bookingConfirmation: setPayloadValue(payload, 'bookingConfirmation'),
        visaPlanDetailsByPathSrp: setPayloadValue(payload, 'srp'),
      };
    }
    case visaServiceActions.PAGE_SECTION_TYPE: {
      return {
        ...state,
        visaPageSectionType: payload,
      };
    }
    case visaServiceActions.GET_VISA_BOOKING_DETAILS: {
      return {
        ...state,
        visaBookingDetails: payload,
      };
    }
    case visaServiceActions.SELECTED_VISA_DETAILS: {
      return {
        ...state,
        selectedVisaDetails: payload,
      };
    }

    case visaServiceActions.VISA_SELECTED_PAX: {
      return {
        ...state,
        selectedVisaPax: payload,
      };
    }

    case visaServiceActions.BOOKING_DETAILS: {
      return {
        ...state,
        createdVisaBookingDetails: payload?.data || {},
      };
    }

    case visaServiceActions.VISA_BOOKING_STATUS: {
      return {
        ...state,
        visaBookingStatus: payload,
      };
    }

    case visaServiceActions.VISA_TRAVELER_DETAILS: {
      return {
        ...state,
        visaTravelerDetails: payload,
      };
    }

    case visaServiceActions.GET_VISA_QUOTATIONS: {
      return {
        ...state,
        visaAllQuotations: payload,
      };
    }

    case visaServiceActions.GET_ITINERARY_DETAILS: {
      return {
        ...state,
        getItineraryDetails: payload,
      };
    }

    case visaServiceActions.SHOW_FULL_VISA_BOOKING_WIDGET: {
      return {
        ...state,
        showFullVisaBookingWidget: payload,
      };
    }

    case visaServiceActions.GET_COUNTRY_LIST: {
      return {
        ...state,
        getCountriesList: payload,
      };
    }

    case visaServiceActions.GET_VISA_COUNTRIES_DETAILS: {
      return {
        ...state,
        visaCountriesDetails: payload,
      };
    }

    case visaServiceActions.UPLOAD_DOCUMENT_LIST: {
      return {
        ...state,
        uploadedDocumentList: payload,
      };
    }

    case visaServiceActions.OPEN_CONFIRMATION_POPUP: {
      return {
        ...state,
        openUploadBackConfirmPopup: payload,
      };
    }

    case visaServiceActions.RESET_TO_INITIAL: {
      return {
        ...state,
        visaTravelerDetails: null,
        visaBookingStatus: null,
        createdVisaBookingDetails: null,
        selectedVisaPax: null,
        uploadedDocumentList: null,
        visaPageSectionType: PAGES.VISA_SRP,
      };
    }

    default:
      return state;
  }
};
