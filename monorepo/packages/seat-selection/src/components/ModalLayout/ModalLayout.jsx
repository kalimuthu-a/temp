import React from 'react';
import PropTypes from 'prop-types';

import './ModalLayout.scss';

function ModalLayout({ children, onClose }) {
  return (
    <>
      <div className="back-drop" />
      <div className="modal-layout-contaner">
        <div className="close" onClick={onClose} aria-hidden="true"><span className="icon-close-simple" /></div>
        {children}
      </div>
    </>
  );
}

ModalLayout.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.element,
};

export default ModalLayout;
