/* eslint-disable no-console */
import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import { AppContext } from '../../context/AppContext';
import { Text, Link } from '../../constants';

const DocumentInformation = ({ isOpen, onClose, title, note, sampleType, pointsList }) => {
  const { state } = useContext(AppContext);
  const aemData = state?.visaUploadDocumentsByPath || {};
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <PopupModalWithContent
      onCloseHandler={onClose}
      modalTitle={title}
      className="visa-upload-popup"
    >
      <div className="modalpopup-container">
        <div className="modalpopup-container-box">
          {(sampleType && sampleType.toLowerCase() === Link && (
          <img
            src={note}
            alt="Logo"
            className="img"
            style={{ width: pointsList[0] === '' ? '100%' : '50%' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          ))
          || (sampleType && sampleType.toLowerCase() === Text
           && <p className="visa-booking-card-body-list">{note}</p>)
          || (!sampleType && '')}
          <p className="pointlist">{pointsList} </p>
        </div>
      </div>

      <div className="visa-srp-wrapper__info-popup">
        <Button classNames="visa-alert__info-popup-btn" onClick={onClose}>
          {aemData?.alertsInfo?.[3]?.ctaLabel}
        </Button>
      </div>
    </PopupModalWithContent>
  );
};

DocumentInformation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  note: PropTypes.string,
  pointsList: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  sampleType: PropTypes.string,

};

export default DocumentInformation;
