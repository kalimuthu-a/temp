import React, { useContext, useState } from 'react';
import sanitizeHtml from 'skyplus-design-system-app/dist/des-system/sanitizeHtml';
import { AppContext } from '../../../context/appContext';
import { TOGGLE_LOGIN_POPUP, LOGIN_POPUP } from '../../../constants/constants';
import { GTM_CONSTANTS } from '../../../constants';
import pushAnalytic from '../../../utils/analyticEvents';
import { pushDataLayer } from '../../../utils/dataLayerEvents';

function SavedPassengersBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const {
    state: {
      aemMainData: {
        accessSavedPassenger,
        signInNote,
        signInDescription,
        signInTitle,
      },
    },
  } = useContext(AppContext);

  const clickHandler = () => {
    const event = new CustomEvent(TOGGLE_LOGIN_POPUP, {
      bubbles: true,
      detail: { loginType: LOGIN_POPUP },
    });

    document.dispatchEvent(event);

    // Google Analytic | SIGN IN NOW
    pushDataLayer({
      data: {
        _event: GTM_CONSTANTS.SIGN_IN_NOW,
      },
      event: GTM_CONSTANTS.SIGN_IN_NOW,
      error: {},
    });

    // Adobe Analytic | SIGN IN NOW
    pushAnalytic({
      data: {
        _event: GTM_CONSTANTS.SIGN_IN_NOW,
      },
      event: GTM_CONSTANTS.SIGN_IN_NOW,
      error: {},
    });
  };

  const accessSavedPassengerHtml = sanitizeHtml(accessSavedPassenger?.html);

  return (
    <div>
      {showBanner && (
        <div className="sp-banner text-primary mt-6 mt-md-10 p-6 p-md-12 bg-white rounded">
          <div
            className="h0 sp-banner__title"
            dangerouslySetInnerHTML={{
              __html: accessSavedPassengerHtml,
            }}
          />
          <div className="sp-banner__card mt-5 px-10 py-12 p-md-12">
            <div className="d-flex justify-content-between">
              <p className="sp-banner__sub-heading">{signInNote}</p>
              <button
                type="button"
                aria-label="close"
                onClick={() => setShowBanner(false)}
                className="sp-banner__close-icon bg-transparent border-0  icon-size-lg icon-close-simple icon-size-md"
              />
            </div>
            <div
              className="align-items-md-center d-flex gap-10
              flex-wrap flex-column flex-md-row"
            >
              <h1 className="sp-banner__heading mt-2 mt-md-0 h5">
                {signInDescription}
              </h1>
              <button
                type="button"
                onClick={clickHandler}
                className="sp-banner__cta border-0 bg-other-background-blur
            ps-12 d-flex align-items-center justify-content-between p-2 "
              >
                <span className="btn">{signInTitle}</span>
                <span
                  className="sp-banner__cta-icon
            text-white bg-primary-main rounded-circle
            bg-primary-main d-flex justify-content-center align-items-center icon-arrow-top-right icon-size-sm"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedPassengersBanner;
