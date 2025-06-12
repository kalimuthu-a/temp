import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

const Modal = ({ heading, children, onClose }) => {
  const ref = useRef();
  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.add('overflow-hidden');
    };
  }, []);

  const onClickHandler = () => {
    onClose();
  };

  return createPortal(
    <div className="skyplus-modal" ref={ref}>
      <div className="skyplus-modal-content">
        {heading && (
          <div className="skyplus-modal-content-heading">
            <Icon className="icon-close-circle" size="lg" />
            {heading}
          </div>
        )}
        <div className="skyplus-modal-content-body">{children}</div>
        <div className="skyplus-modal-content-footer">
          <Button size="sm" onClick={onClickHandler}>
            Ok
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
