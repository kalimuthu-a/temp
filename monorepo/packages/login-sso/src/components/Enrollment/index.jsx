import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Progress from 'skyplus-design-system-app/dist/des-system/Progress';
import EnrollmentForm from './EnrollmentForm';
import EnrollmentOTP from './EnrollmentOtp';
import EnrollmentPwd from './EnrollmentPwd';
import { DD_RUM_EVENTS, DD_RUM_LOAD_CLICK_PAYLOAD, SCREEN_TYPE } from '../../constants/index';
import MemberBenefitsPage from '../MemberBenefitsPage/MemberBenefitsPage';
import pushAnalytic from '../../functions/analyticEvents';
import pushDDRumAction from '../../utils/ddrumEvent';

// const STEPLIST = {
//   FORM: 'Personal Information',
//   OTP: 'Verify contact information',
//   PWD: 'Create Password',
// };

// eslint-disable-next-line sonarjs/cognitive-complexity
function Enrollment({
  mfLabels,
  onCloseHandler = () => {},
  sharedData = {},
  setActiveScreen,
  activeScreen,
  setSharedData,
  setToastProps,
  persona,
}) {
  const THREESTEP = {
    FORM:
      mfLabels?.loyaltyInformation?.personalInformationLabel
      || 'Personal Information',
    OTP:
      mfLabels?.loyaltyInformation?.verifyInformationLabel
      || 'Verify contact information',
    PWD: mfLabels?.createPassword || 'Create Password',
  };

  const TWOSTEP = {
    FORM:
      mfLabels?.loyaltyInformation?.personalInformationLabel
      || 'Personal Information',
    OTP:
      mfLabels?.loyaltyInformation?.verifyInformationLabel
      || 'Verify contact information',
  };

  // mobile is always visible
  let showMobileOtp = true;
  let showEmailOtp = sharedData?.checkbox?.sixeloyalty;

  if (
    [
      SCREEN_TYPE.SIGNUP_6E_USER_MIGRATION,
      SCREEN_TYPE.SIGNUP_6E_REWARD_MIGRATION,
    ].includes(activeScreen)
  ) {
    showEmailOtp = sharedData?.isMobileEntered;
    showMobileOtp = !sharedData?.isMobileEntered;
  }
  if ([SCREEN_TYPE.SIGNUP_ONBOARD_BANK].includes(activeScreen)) {
    showMobileOtp = true;
    showEmailOtp = true;
  }
  if ([SCREEN_TYPE.SIGNUP_6E_USER].includes(activeScreen)) {
    if (window?.disableLoyalty) {
      onCloseHandler();
    }
    showMobileOtp = false;
    showEmailOtp = true;
  }

  const [showWelcome, setShowWelcome] = useState(false);
  const [STEPLIST, setSTEPLIST] = useState(THREESTEP);
  const [activeStep, setActiveStep] = useState(STEPLIST.FORM);
  const [isMounted, setIsMounted] = useState(false);
  let ModalTitle;
  if ([SCREEN_TYPE.SIGNUP_ONBOARD_BANK].includes(activeScreen)) {
    ModalTitle = mfLabels?.loyaltyInformation?.activateTitle?.html;
  } else if ([SCREEN_TYPE.SIGNUP_6E_USER_MIGRATION].includes(activeScreen)) {
    ModalTitle = mfLabels?.newPasswordTitle || 'New Password';
  } else if ([SCREEN_TYPE.SIGNUP_6E_REWARD_MIGRATION].includes(activeScreen)) {
    ModalTitle = mfLabels?.createPassword || 'Create Password';
  } else {
    ModalTitle = mfLabels?.loyaltyInformation?.loginEnrollTitle?.html;
  }
  // const onClickSubmitFromSetPassword = async (passwordText) => {};
  const stepComponent = () => (
    <Progress
      customClass="login-sso-progress"
      allSteps={Object.values(STEPLIST)}
      currentStep={activeStep}
      titlePos="top"
      title={activeStep} // comment remove title to show next step
    />
  );

  let startTimer = 0;
  let responseTime = 0;

  if(!showWelcome)
  {
    startTimer = performance.now();
  }
  useEffect(() => {
    if (
      [
        SCREEN_TYPE.COBRAND_LOYALTY_MEMBER,
        SCREEN_TYPE.SIGNUP_6E_USER,
        SCREEN_TYPE.COBRAND_6E_USER,
      ].includes(activeScreen)
    ) {
      setSTEPLIST(TWOSTEP);
        responseTime = (performance.now() - startTimer) / 1000;
        const MigrationPopUpLoad = DD_RUM_LOAD_CLICK_PAYLOAD;
        const MigrationDataDogAction = DD_RUM_EVENTS.MEMBER_POPUP_EVENT;
        MigrationPopUpLoad.action = 'Migration popup load time';
        MigrationPopUpLoad.datadogSessionId = window.DD_RUM?.getInternalContext()?.session_id;
        MigrationPopUpLoad.timestamp = new Date().toISOString();
        MigrationPopUpLoad.metadata = {
          page: 'Migration Page',
          step: 'PageLoad',
          component: 'Enrollment',
          application: 'login-sso',
          durationMs: responseTime,
          flowType: 'Login',
          context: {
            deviceType: '',
            browser: '',
            os: '',
            env: '',
          },
        };
        
      // eslint-disable-next-line no-unused-expressions
      !showWelcome && setShowWelcome(true);
      pushDDRumAction(MigrationDataDogAction, MigrationPopUpLoad);

    }

    if (!isMounted) {
      setIsMounted(true);
      responseTime = (performance.now() - startTimer) / 1000;
      const signupPageLoad = DD_RUM_LOAD_CLICK_PAYLOAD;
      signupPageLoad.action = 'Sign up Page Load';
      signupPageLoad.datadogSessionId = window.DD_RUM?.getInternalContext()?.session_id;
      signupPageLoad.timestamp = new Date().toISOString();
      signupPageLoad.metadata = {
        page: 'SignUp',
        step: 'PageLoad',
        component: 'Enrollment',
        application: 'login-sso',
        durationMs: responseTime,
        flowType: 'SignUp',
      }
      pushDDRumAction(DD_RUM_EVENTS.SIGNUP_LOAD_DATA, signupPageLoad);
    }
  }, []);

  const nextStep = () => {
    pushAnalytic({
      state: '',
      event: 'Enroll Me Now',
    });
    setShowWelcome(false);
  };

  const fieldsDisabled = !sharedData?.isformFieldsEditable;
  const dobDisabled = !sharedData.isDOBEditable;
  const genderDisable = !sharedData.isGenderEditable;

  const commonProps = {
    persona,
    activeScreen,
    setActiveScreen,
    sharedData,
    setSharedData,
    mfLabels,
    setToastProps,
    onCloseHandler,
    // onClickSubmitFromSetPassword: onClickSubmitFromSetPassword,
    STEPLIST,
    setActiveStep,
    stepComponent,
    ModalTitle,
    nextStep,
    fieldsDisabled,
    showEmailOtp,
    showMobileOtp,
    dobDisabled,
    genderDisable,
  };

  if (activeScreen === SCREEN_TYPE.COBRAND_LOYALTY_MEMBER) {
    return (
      <div className="login-sso-enrollment">
        <EnrollmentForm {...commonProps} />
      </div>
    );
  }
  return (
    <div className="login-sso-enrollment">
      {showWelcome ? (
        <MemberBenefitsPage {...commonProps} />
      ) : (
        (() => {
          switch (activeStep) {
            case STEPLIST.FORM:
              return <EnrollmentForm {...commonProps} />;
            case STEPLIST.OTP:
              return <EnrollmentOTP {...commonProps} />;
            case STEPLIST.PWD:
              return <EnrollmentPwd {...commonProps} />;
            default:
              return null;
          }
        })()
      )}
    </div>
  );
}

Enrollment.propTypes = {
  mfLabels: PropTypes.object.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  sharedData: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func.isRequired,
  activeScreen: PropTypes.string.isRequired,
  setSharedData: PropTypes.func.isRequired,
  persona: PropTypes.string.isRequired,
  setToastProps: PropTypes.func.isRequired,
};

export default Enrollment;
