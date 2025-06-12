import React, { useContext } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import { AppContext } from '../../../context/AppContext';
import { visaServiceActions } from '../../../context/reducer';

const BackConfirmationPopup = () => {
  const { state: {
    visaUploadDocumentsByPath,
  },
  dispatch,
  } = useContext(AppContext);

  const backButtonPopup = (open, redirect) => {
    dispatch({ type: visaServiceActions.OPEN_CONFIRMATION_POPUP, payload: open });
    if (redirect) {
      dispatch({ type: visaServiceActions.RESET_TO_INITIAL });
    }
  };

  const { resetBookingPopup } = visaUploadDocumentsByPath || {};
  return (

    <PopupModalWithContent
      onCloseHandler={backButtonPopup}
      modalContentClass="visa-schedule-time-line-modal__content"
      className="back-confirmation-popup"
      modalTitle={resetBookingPopup?.title?.html}
    >
      <div className="back-confirmation-info">
        <div>
          {resetBookingPopup?.note}
        </div>
        <div className="confirmation-modal-footer">
          <Button
            classNames="visa-schedule-modal__info-btn confirm-button-yes"
            variant="outline"
            size="small"
            onClick={() => backButtonPopup(false, true)}
          >{resetBookingPopup?.primaryCtaLabel}
          </Button>
          <Button
            classNames="visa-schedule-modal__info-btn"
            variant="filled"
            size="small"
            onClick={() => backButtonPopup(false, false)}
          >{resetBookingPopup?.secondaryCtaLabel}
          </Button>
        </div>

      </div>
    </PopupModalWithContent>
  );
};

export default BackConfirmationPopup;
