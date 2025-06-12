import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { PopupModalWithContent } from '../designComp/PopupModalWithContent';
import { formatDate, getEnvObj } from '../../functions/utils';
import { SCREEN_TYPE } from '../../constants';
import completeLogin from '../../functions/completeLogin';
import { LOCALSTORAGE } from '../../constants/common';
import Shimmer from '../Shimmer/Shimmer';

const IframeComponent = ({
  mfLabels,
  onCloseHandler = () => {},
  sharedData = {},
  setActiveScreen,
  activeScreen,
  setToastProps,
  setSharedData,
}) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const prevIdTokenRef = useRef(null);
  const envObj = getEnvObj() || {};
  const [isMobile] = useIsMobile();
  let mobNumber = null;
  let emailAdd = null;
  if (sharedData?.phone) {
    mobNumber = `+${sharedData.countryCode}${sharedData.phone}`;
  } else {
    emailAdd = sharedData?.email;
  }

  const userId = mobNumber || emailAdd;

  const url = sharedData?.checkUserApiResponse?.iframeUrl;

  // modify user number as per country code.
  const getPhoneNumber = (number, code) => {
    let localNumber = number;
    let localCode = code;
    if (!localNumber.includes('+')) {
      localNumber = `+${localNumber}`;
    }
    if (!localCode.includes('+')) {
      localCode = `+${localCode}`;
    }

    if (localNumber.includes(localCode)) {
      return localNumber.replace(localCode || '+91', '');
    }
    return localNumber.replace('+', '');
  };

  useEffect(() => {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const handleMessage = async (event) => {
      if (
        typeof event.data === 'string'
        && event.data !== prevIdTokenRef.current
      ) {
        prevIdTokenRef.current = event.data;
        window.removeEventListener('message', handleMessage);
        let cookieExpiredTime = envObj?.sso_token_validity_minutes
            || envObj?.SSO_TOKEN_VALIDITY_MINUTES
            || 60 * 24 * 60;
        cookieExpiredTime = cookieExpiredTime * 60 * 1000;
        const ciamTokenData = {
          ciamToken: event.data,
          expiryTime: cookieExpiredTime,
        };
        // storing refresh token in ciam_token localstorage
        localStorage.setItem(LOCALSTORAGE.CIAM_TOKEN, JSON.stringify(ciamTokenData));

        // validate token
        const {
          response,
          person,
          defaultEmail,
          defaultPhoneNumber,
          defaultCountryCode,
        } = await completeLogin({
          refreshtokenParam: event.data || null,
          ciamPolicyNameParam: sharedData?.ciamPolicyName || null,
          usernameParam: userId || null,
          sharedDataParam: sharedData || {},
        });

        if (response.data) {
          const getCountryCode = defaultCountryCode?.replaceAll('+', '')
          || sharedData?.countryCode
          || '91';
          setSharedData((prevData) => {
            return {
              ...prevData,
              firstName: person.name?.first || sharedData?.firstName || '',
              lastName: person.name?.last || sharedData?.lastName || '',
              email: defaultEmail || sharedData?.email || '',
              countryCode: getCountryCode,
              phone: defaultPhoneNumber ? getPhoneNumber(defaultPhoneNumber, getCountryCode)
                : sharedData?.phone
                || '',
              gender: person?.details?.gender === 1 ? 'Male' : 'Female',
              date: formatDate(person?.details?.dateOfBirth, '/') || '',
              validateTokenResponse: response?.data || {},
            };
          });

          // below move to next page after validate success

          if (
            sharedData?.redirectToBankInEnd
            && sharedData?.flow === SCREEN_TYPE.LOYALTY_DASHBOARD_WELCOME
          ) {
            setActiveScreen(SCREEN_TYPE.COBRAND_PARTNER_BANK);
          } else if (
            sharedData?.flow === SCREEN_TYPE.LOYALTY_DASHBOARD_WELCOME
          ) {
            onCloseHandler();
          } else if (sharedData?.flow === SCREEN_TYPE.SIGNUP_6E_USER) {
            // eslint-disable-next-line no-unused-expressions
            window?.disableLoyalty
              ? onCloseHandler()
              : setActiveScreen(sharedData?.flow);
          } else {
            setActiveScreen(sharedData?.flow);
          }
        } else {
          const err = Array.isArray(response?.errors)
            ? response.errors[0]
            : response?.error || response?.errors;

          const errorObj = getErrorMsgForCode(err?.code);
          setToastProps({
            title: 'Error',
            description: errorObj?.message || 'Something went wrong',
            variation: 'notifi-variation--Error',
            onClose: () => {
              setToastProps(null);
            },
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);

    const loadFrame = () => {
      iframeRef.current.onload = () => {
        setIsLoading(false);
      };
      iframeRef.current.src = url;
    };

    loadFrame();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setActiveScreen, setSharedData, setToastProps, sharedData, url]);

  return (
    <div>
      <PopupModalWithContent
        overlayClickClose={false}
        onOutsideClickClose={null}
        onCloseHandler={onCloseHandler}
        className="popup-modal-with-content-login-sso-form"
        modalTitle={mfLabels?.loginTitle?.html}
        mfLabels={mfLabels}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        customPopupContentClassName="login-sso-Iframe-modal"
      >

        {isLoading ? <Shimmer /> : null}
        <div style={isLoading ? { display: 'none' } : { display: 'block' }}>
          <iframe
            title="msalIframe"
            id="msalIframe"
            width="100%"
            height={isMobile ? '300' : '400'}
            src="about:blank"
            className="embed-responsive-item"
            allow="fullscreen"
            frameBorder="0"
            ref={iframeRef}
          />
        </div>
      </PopupModalWithContent>
    </div>
  );
};
IframeComponent.propTypes = {
  mfLabels: PropTypes.object.isRequired,
  onCloseHandler: PropTypes.func.isRequired,
  sharedData: PropTypes.object.isRequired,
  setActiveScreen: PropTypes.func.isRequired,
  activeScreen: PropTypes.string.isRequired,
  setToastProps: PropTypes.func.isRequired,
  setSharedData: PropTypes.func.isRequired,
};
export default IframeComponent;
