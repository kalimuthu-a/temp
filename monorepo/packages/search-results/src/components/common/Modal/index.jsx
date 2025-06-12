import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

import { createPortal } from 'react-dom';
import classnames from 'classnames';

const Modal = ({
  onClose,
  children,
  heading,
  size = 'sm',
  containerClass = '',
}) => {
  const onClickHandler = () => {
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const className = classnames(
    'popup z-2 bg-white rounded-1',
    size,
    containerClass,
  );

  return createPortal(
    <div className="srp-modal w-100 custom-margin h-100 background-cover position-fixed z-max">
      <div className={className}>
        <div className="d-flex align-item-center justify-content-between head">
          <div className="sh2">{heading}</div>
          <div>
            <Icon
              className="icon-close-simple cursor-pointer"
              size="md"
              onClick={onClickHandler}
            />
          </div>
        </div>
        <div className="popup-content w-100 h-100 overflow-y-auto overflow-x-hidden h-100">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

Modal.propTypes = {
  onClose: PropTypes.func,
};

export default Modal;
