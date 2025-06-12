import React from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { AppContext } from '../../context/AppContext';

const VisaDisclaimerPopup = ({ isOpen, onClose, onCancel }) => {
  const {
    state: {
      visaSrpByPath,
    },
  } = React.useContext(AppContext);
  const { disclaimerPopup } = visaSrpByPath || {};

  return (
    <PopupModalWithContent
      onCloseHandler={onCancel}
      onIopen={isOpen}
      modalTitle={disclaimerPopup?.value}
      className="visa-disclaimer-popup"
    >
      <div className="visa-disclaimer-popup-container">
        <HtmlBlock
          className="visa-disclaimer-popup-disclaimer-text"
          html={disclaimerPopup?.description?.html}
        />
        <div className="visa-disclaimer-popup-ctas">
          <Button
            classNames="visa-disclaimer-popup-btn cancel"
            onClick={() => {
              onCancel();
            }}
            variant="outline"
            color="seconday"
          >
            {disclaimerPopup?.cancelCtaLabel || 'Cancel'}
          </Button>
          <Button
            classNames="visa-disclaimer-popup-btn"
            onClick={() => {
              onClose();
            }}
          >
            {disclaimerPopup?.ctaLabel}
          </Button>
        </div>
      </div>
      <div className="visa-disclaimer-popup-footer">
        {disclaimerPopup?.note}
      </div>
    </PopupModalWithContent>
  );
};

VisaDisclaimerPopup.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
};

export default VisaDisclaimerPopup;
