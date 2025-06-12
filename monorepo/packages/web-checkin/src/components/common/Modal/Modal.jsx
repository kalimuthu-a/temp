import React from 'react';
import { createPortal } from 'react-dom';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

const Modal = ({ heading, children }) => {
  return createPortal(
    <div className="web-checkin-modal">
      <div className="web-checkin-modal-heading">
        <Icon className="icon-close-solid" />
        {heading}
      </div>
      <div className="web-checkin-modal-body">{children}</div>
      <div className="web-checkin-modal-footer">
        <Button>Ok</Button>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
