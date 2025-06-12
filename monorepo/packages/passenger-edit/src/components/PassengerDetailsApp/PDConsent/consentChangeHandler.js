import passengerEditActions from '../../../context/actions';

const consentChangeHandler = (dispatch, consentName, consentStatus, i, initRenderFlag = false) => {
  dispatch({
    type: passengerEditActions.PD_CONSENT,
    payload: {
      whichConsent: consentName,
      value: consentStatus,
      index: i,
      initRenderFlag,
      userInteracted: false,
    },
  });
};

export default consentChangeHandler;
