/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const PopupModalWithContent = ({
  children = null,
  onCloseHandler = () => {},
  overlayClickClose = false,
  closeButtonIconClass = '',
  className = '',
  modalTitle,
  modalTitleDisplay = true,
  onOutsideClickClose,
  customPopupContentClassName,
  id,
  mobileBackgroundImage,
}) => {
  const reactComponentAsChildren = children?.type
    ?.toString()
    ?.includes('react');

  useEffect(() => {
    document.body.classList.add('no-scroll-on-popup');
    return () => {
      document.body.classList.remove('no-scroll-on-popup');
    };
  }, []);

  return (
    <div
      className={`popup-modal-global ${className}`}
      onClick={onOutsideClickClose}
    >
      <div
        className="popup-modal-global__bg-overlay"
        onClick={overlayClickClose ? onCloseHandler : null}
      >
        <div
          id={id}
          className={`popup-modal-global__content ${customPopupContentClassName}`}
          style={mobileBackgroundImage ? { backgroundImage: `url(${mobileBackgroundImage})` } : null}
        >
          <div className="popup-modal-global__header">
            <h3
              className={`popup-modal-global__header__title ${
                modalTitleDisplay ? '' : 'visibility-hidden'
              }`}
              dangerouslySetInnerHTML={{ __html: modalTitle }}
            />
            <button
              onClick={onCloseHandler}
              className={`popup-modal-global__close-overlay-button ${
                closeButtonIconClass === 'd-none' ? closeButtonIconClass : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.2751 3.72468C16.5192 3.96876 16.5192 4.36449 16.2751 4.60857L4.60845 16.2752C4.36437 16.5193 3.96864 16.5193 3.72456 16.2752C3.48048 16.0312 3.48048 15.6354 3.72456 15.3914L15.3912 3.72468C15.6353 3.48061 16.031 3.48061 16.2751 3.72468Z"
                  fill="#25304B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.2751 16.2752C16.031 16.5193 15.6353 16.5193 15.3912 16.2752L3.72456 4.60857C3.48048 4.36449 3.48048 3.96876 3.72456 3.72468C3.96864 3.48061 4.36437 3.48061 4.60845 3.72468L16.2751 15.3914C16.5192 15.6354 16.5192 16.0312 16.2751 16.2752Z"
                  fill="#25304B"
                />
              </svg>
            </button>
          </div>
          {reactComponentAsChildren
            ? React.cloneElement(children, { onCloseHandler })
            : children}
        </div>
      </div>
    </div>
  );
};

PopupModalWithContent.propTypes = {
  onCloseHandler: PropTypes.func,
  overlayClickClose: PropTypes.bool,
  children: PropTypes.any.isRequired,
  closeButtonIconClass: PropTypes.any,
  className: PropTypes.any,
  modalTitle: PropTypes.any,
  modalTitleDisplay: PropTypes.any,
  onOutsideClickClose: PropTypes.any,
  customPopupContentClassName: PropTypes.any,
  id: PropTypes.any,
  mobileBackgroundImage: PropTypes.string,
};

export default PopupModalWithContent;
