import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';

const DeleteDocConfirmationPopup = ({
  isOpen,
  onClose,
  title,
  onConfirm,
  ctaLabel,
  secondaryCtaLabel,
}) => {
  const [selected, setSelected] = useState(null);
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
      onIopen={isOpen}
      modalTitle={title}
      className="visa-confirm-popup"
    >
      <div className="confirmation-modal__buttons">
        <Button
          classNames={`button_no ${selected === 'no' ? 'active' : ''}`}
          onClick={() => {
            setSelected('no');
            onClose();
          }}
        >
          {ctaLabel}
        </Button>
        <Button
          classNames={`button_yes ${selected === 'yes' ? 'active' : ''}`}
          onClick={() => {
            setSelected('yes');
            onConfirm();
            onClose();
          }}
        >
          {secondaryCtaLabel}
        </Button>
      </div>
    </PopupModalWithContent>
  );
};

DeleteDocConfirmationPopup.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onConfirm: PropTypes.func,
  ctaLabel: PropTypes.string,
  secondaryCtaLabel: PropTypes.string,
};

export default DeleteDocConfirmationPopup;
