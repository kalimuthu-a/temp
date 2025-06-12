import React from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import VisaShedule from '../VisaSchedule';

const VisaScheduleModal = ({ data, onClose, title, buttonText }) => {
  return (

    <PopupModalWithContent
      onCloseHandler={onClose}
      modalContentClass="visa-schedule-time-line-modal__content"
      modalTitle={title}
    >
      <div className="visa-schedule-modal__info-popup">
        <VisaShedule data={data} />
        <Button
          classNames="visa-schedule-modal__info-btn"
          onClick={() => onClose(true)}
        >{buttonText}
        </Button>
      </div>
    </PopupModalWithContent>
  );
};

VisaScheduleModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default VisaScheduleModal;
