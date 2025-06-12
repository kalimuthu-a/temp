import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { DD_RUM_EVENTS, DD_RUM_PAYLOAD, MF_NAME, specialAssistanceKeys } from '../constants/constants';
import passengerEditActions from '../context/actions';
import { API_LIST } from '../services';
import pushDDRumAction from '../utils/ddrumEvent';

// eslint-disable-next-line sonarjs/cognitive-complexity
const getAemData = async (dispatch) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let aemData = {};
  let aemMainData = {};
  let aemAdditionalData = {};
  const mainKey = 'passengerDetailsMainByPath';
  const additionalKey = 'passengerDetailsAdditionalByPath';

  // DataDog for AEM
  const aemMainPayload = DD_RUM_PAYLOAD;
  const aemAdditionalPayload = DD_RUM_PAYLOAD;
  const aemMainAction = DD_RUM_EVENTS.AEM_DATA;
  const aemAdditionalAction = DD_RUM_EVENTS.AEM_ADDITIONAL_DATA;

  const startTimer = performance.now();

  try {
    aemMainPayload.method = 'GET'; // request method
    aemMainPayload.mfname = MF_NAME; // MF name
    aemAdditionalPayload.method = 'GET'; // request method
    aemAdditionalPayload.mfname = MF_NAME; // MF name

    const responseMain = await fetch(API_LIST?.PE_MAIN_DATA, config);
    aemMainData = await responseMain.json();
    aemMainPayload.responseTime = (performance.now() - startTimer) / 1000;
    aemMainPayload.statusCode = responseMain.status;

    const responseAdditional = await fetch(API_LIST.PE_ADDITIONAL_DATA, config);
    aemAdditionalData = await responseAdditional.json();
    aemMainPayload.apiurl = API_LIST?.PE_MAIN_DATA;
    aemAdditionalPayload.apiurl = API_LIST.PE_ADDITIONAL_DATA;
    aemAdditionalPayload.statusCode = responseAdditional.status;
    aemAdditionalPayload.responseTime = (performance.now() - startTimer) / 1000;
  } catch (error) {
    const errorCatch = getErrorMsgForCode(error?.code);
    aemAdditionalPayload.error = error;
    aemMainPayload.error = error;
    aemMainPayload.errorMessageForUser = errorCatch?.message || error?.message;
    aemAdditionalPayload.errorMessageForUser = errorCatch?.message;
    // eslint-disable-next-line no-console
    console.log(error);
  }
  if (aemMainData?.data?.[mainKey]) {
    aemMainPayload.response = aemMainData.data;
    const { item } = aemMainData.data[mainKey];
    aemMainData = item;
    // delete aemMainData.passengerDetails;
  } else if (aemMainData?.errors) {
    let errorMessage = '';
    let errorCode = '';

    if (Array.isArray(aemMainData.errors) && aemMainData.errors.length > 0) {
      errorMessage = aemMainData.errors[0]?.message;
      errorCode = aemMainData.errors[0]?.code;
    } else {
      errorMessage = aemMainData.errors?.message;
      errorCode = aemMainData.errors?.code;
    }

    const errorCatch = getErrorMsgForCode(errorCode);
    aemMainPayload.error = aemMainData.errors;
    aemMainPayload.errorMessageForUser = errorCatch?.message || errorMessage;
    aemMainPayload.errorMessage = errorMessage;
  }
  if (aemAdditionalData?.data?.[additionalKey]) {
    aemAdditionalPayload.response = aemAdditionalData?.data;
    const { item } = aemAdditionalData.data[additionalKey];
    aemAdditionalData = item;
    const updatedData = aemAdditionalData?.specialAssistanceDetails?.specialAssistanceOptions?.map((items) => {
      const newItem = { ...items };
      if (newItem.key in specialAssistanceKeys) {
        newItem.ssrCode = newItem.key;
        newItem.key = specialAssistanceKeys[newItem.key] || newItem.key;
      }
      return newItem;
    });
    aemAdditionalData.specialAssistanceDetails.specialAssistanceOptions = updatedData;
    // delete aemAdditionalData.passengerDetails;
  } else if (aemAdditionalData?.errors) {
    let errorMessage = '';
    let errorCode = '';

    if (Array.isArray(aemAdditionalData.errors) && aemAdditionalData.errors.length > 0) {
      errorMessage = aemAdditionalData.errors[0]?.message;
      errorCode = aemAdditionalData.errors[0]?.code;
    } else {
      errorMessage = aemAdditionalData.errors?.message;
      errorCode = aemAdditionalData.errors?.code;
    }
    const errorCatch = getErrorMsgForCode(errorCode);
    aemAdditionalPayload.errorMessageForUser = errorCatch?.message || errorMessage;
    aemAdditionalPayload.error = errorMessage;
  }
  // if (aemAdditionalData?.data?.[additionalKey]) {
  //   const { item } = aemAdditionalData.data[additionalKey];
  //   aemAdditionalData = item;
  //   const { specialAssistanceDetails } = item;
  //   aemAdditionalData.specialAssistanceDetails = {
  //     label: specialAssistanceDetails.label,
  //     selectYourJourneyLabel: specialAssistanceDetails.selectYourJourneyLabel,
  //     specialAssistanceRequiredLabel: specialAssistanceDetails.specialAssistanceRequiredLabel,
  //     allLabel: specialAssistanceDetails.allLabel,
  //     editLabel: specialAssistanceDetails.editLabel,
  //     selectReasonRequestLabel: specialAssistanceDetails.selectReasonRequestLabel,
  //     specialAssistanceOptionsTitle: specialAssistanceDetails.specialAssistanceOptionsTitle,
  //     seamlessJourneyTitle: specialAssistanceDetails.seamlessJourneyTitle,
  //     specialAssistanceOptions: specialAssistanceDetails.specialAssistanceOptions,
  //     wheelChairReason: specialAssistanceDetails.wheelChairReason,
  //     termsAndConditions: specialAssistanceDetails.termsAndConditions,
  //     wheelchairInfoList: specialAssistanceDetails.wheelchairInfoList,
  //   };
  // }
  aemData = { ...aemMainData, ...aemAdditionalData };

  // push actions to Datadog event listner | page load AEM
  pushDDRumAction(aemMainAction, aemMainPayload);
  pushDDRumAction(aemAdditionalAction, aemAdditionalPayload);

  dispatch({
    type: passengerEditActions.SET_AEM_DATA,
    payload: aemData,
  });
};

export default getAemData;
