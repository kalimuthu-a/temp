import React from 'react';
import PropTypes from 'prop-types';

const ModalComponent = (props) => {
  const {
    modalContent,
    showCrossIcon,
    onCloseHandler,
    modalContentClass,
    modalWrapperClass,
    variation = '',
    children,
  } = props;

  const onModalClose = () => {
    onCloseHandler();
  };

  const variationClass = variation ? `modal-as-${variation}` : '';

  return (
    <div className={`design-system-modal-component-wrapper 
    ${variationClass} ${modalWrapperClass}`}
    >
      <div className="modal-component-overlay">
        {showCrossIcon ? (
          <div className="modal-component-cross-icon position-absolute">
            <span
              role="button"
              tabIndex={0}
              aria-label="cross"
              onKeyDown={() => {}}
              onClick={() => onModalClose()}
              className="icon-close-solid cross-icon"
            />
          </div>
        ) : null}
        <div className={`modal-content ${modalContentClass}`}>
          {typeof modalContent === 'function' ? modalContent() : modalContent}
          {modalContent ? '' : children}
        </div>
      </div>
    </div>
  );
};
ModalComponent.propTypes = {
  showCrossIcon: PropTypes.bool,
  onCloseHandler: PropTypes.func,
  modalContentClass: PropTypes.string,
  modalContent: PropTypes.any.isRequired,
  modalWrapperClass: PropTypes.string,
  variation: PropTypes.string,
  children: PropTypes.any,
};

export default ModalComponent;
