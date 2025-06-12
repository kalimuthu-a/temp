import React from 'react';
import PropTypes from 'prop-types';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import FareDetailsComponent from '../FareDetails';

const VisaModal = ({ onClose }) => {
  return (
    <PopupModalWithContent
      onCloseHandler={onClose}
      modalContentClass="visa-modal-content"
      closeButtonIconClass="d-none"
    >
      <div className="visa-modal__info-popup">
        <div className="visa-modal__info-popup-title">
          <Icon className="icon-close-simple" onClick={onClose} />
        </div>
        <FareDetailsComponent />
      </div>
    </PopupModalWithContent>
  );
};

VisaModal.propTypes = {
  onClose: PropTypes.func,
};

export default VisaModal;
