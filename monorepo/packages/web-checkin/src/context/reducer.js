import { ERROR_MSGS } from '../constants';
import AEMModel from '../models/AEMModel';
import { isIssueDateAfterDOB } from '../pages/WebCheckIn/utils';

export const webcheckinActions = {
  SET_SELECTED_SPECIAL_FARE: 'SET_SELECTED_SPECIAL_FARE',
  SET_PROMO_CODE: 'SET_PROMO_CODE',
  SET_API_DATA: 'SET_API_DATA',
  SET_AEM_DATA: 'SET_AEM_DATA',
  SET_APP_ALERT: 'SET_APP_ALERT',
  SET_COUNTRIES: 'SET_COUNTRIES',
  ON_FORM_DATA_CHANGE: 'ON_FORM_DATA_CHANGE',
  SET_SSR: 'SET_SSR',
  COPY_FOR_ALL: 'COPY_FOR_ALL',
  COPY_PASSPORT_DETAILS_TO_VISA: 'COPY_PASSPORT_DETAILS_TO_VISA',
  SET_PASSENGERS_DATA: 'SET_PASSENGERS_DATA',
  SHOW_LOADER: 'SHOW_LOADER',
  SET_TOAST: 'SET_TOAST',
  SET_ANALYTICS_CONTEXT: 'SET_ANALYTICS_CONTEXT',
  SET_MINOR_CONSENT_SELECTION: 'SET_MINOR_CONSENT_SELECTION',
  CLEAR_MINOR_CONSENT_SELECTION: 'CLEAR_MINOR_CONSENT_SELECTION',
  EMERGENCY_FORM_UPADTE: 'EMERGENCY_FORM_UPADTE',
};

export const webcheckinReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case webcheckinActions.SET_SELECTED_SPECIAL_FARE: {
      return {
        ...state,
      };
    }

    case webcheckinActions.SET_AEM_DATA: {
      const { aem } = payload;

      const aemModel = aem.reduce((a, b) => ({ ...a, ...b }), {});

      let loaderImage = '';

      for (const key in aemModel) {
        if (Object.hasOwnProperty.call(aemModel, key)) {
          loaderImage =
            aemModel[key]?.loaderImagePath?._publishUrl || loaderImage;
        }
      }

      return {
        ...state,
        aemModel: new AEMModel(aemModel),
        aemData: aemModel,
        loaderImage,
      };
    }

    case webcheckinActions.SET_API_DATA: {
      return {
        ...state,
        loading: false,
        ...payload,
      };
    }

    case webcheckinActions.SHOW_LOADER: {
      return {
        ...state,
        loading: payload,
      };
    }

    case webcheckinActions.SET_APP_ALERT: {
      return {
        ...state,
        appAlert: payload,
      };
    }

    case webcheckinActions.SET_SSR: {
      const ssrMap = new Map();

      payload?.forEach((ssr) => {
        const { ssrCode, name } = ssr;
        ssrMap.set(ssrCode, name);
      });

      return {
        ...state,
        ssrs: ssrMap,
      };
    }

    case webcheckinActions.ON_FORM_DATA_CHANGE: {
      let { index, values, error = {} } = payload;
      const { formData, formErrors, copyForAll, emergencyDetails } = state;
      const { name, value } = values;
      const updatedData = formData.map((data, i) => {
        return i === index ||
          (copyForAll &&
            index === 0 &&
            ['country', 'mobile', 'email'].includes(name))
          ? { ...data, [name]: value }
          : data;
      });
      if(updatedData?.[index]?.visaIssuingDate && !isIssueDateAfterDOB(updatedData?.[index]?.visaDateOfBirth, updatedData?.[index]?.visaIssuingDate)){
        error = {visaIssuingDate: ERROR_MSGS.INVALID_DATE}
      }
      if(updatedData?.[index]?.passportIssuingDate && !isIssueDateAfterDOB(updatedData?.[index]?.passportDOB, updatedData?.[index]?.passportIssuingDate)){
        error = {passportIssuingDate: ERROR_MSGS.INVALID_DATE}
      }
        
      const updatedErrors = formErrors.map((data, i) => {
        
        return i === index ? { ...data, ...error } : data;
      });

      return {
        ...state,
        formData: updatedData,
        formErrors: updatedErrors,
      };
    }

    case webcheckinActions.EMERGENCY_FORM_UPADTE: {
      const { emergencyDetails, emergencyDetailsFormError } = state;

      const { index, values, error = {} } = payload;
      const { name, value } = values;
      return {
        ...state,
        emergencyDetailsFormError: { ...emergencyDetailsFormError, ...error },
        emergencyDetails: {
          ...emergencyDetails,
          [name]: value,
        },
      };
    }

    case webcheckinActions.COPY_FOR_ALL: {
      const { formData } = state;
      const [row] = formData;

      return {
        ...state,
        formData: formData.map((data, i) => {
          const newData = {
            ...data,
            email: row.email,
            mobile: row.mobile,
            country: row.country,
          };
          return i !== 0 ? newData : data;
        }),
        copyForAll: payload,
      };
    }

    case webcheckinActions.SET_PASSENGERS_DATA: {
      return {
        ...state,
        formData: payload,
      };
    }

    case webcheckinActions.SET_TOAST: {
      return {
        ...state,
        toast: payload,
      };
    }

    case webcheckinActions.SET_ANALYTICS_CONTEXT: {
      return {
        ...state,
        analyticsContext: payload,
      };
    }

    case webcheckinActions.COPY_PASSPORT_DETAILS_TO_VISA: {
      const { index, passportDetails } = payload;
      const { formData } = state;

      return {
        ...state,
        formData: formData.map((data, i) => {
          return i === index ? { ...data, ...passportDetails } : data;
        }),
      };
    }

    case webcheckinActions.SET_MINOR_CONSENT_SELECTION: {
      const { selection } = payload;

      return {
        ...state,
        minorConsentSelection: selection,
      };
    }

    case webcheckinActions.CLEAR_MINOR_CONSENT_SELECTION: {
      return {
        ...state,
        minorConsentSelection: new Set(),
      };
    }

    default:
      return state;
  }
};
