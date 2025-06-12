import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const WarningPopup = ({
  heading,
  subHeading,
  ctaLabel,
  isCloseVisible,
  handleCloseClick,
  handleBtnClick,
}) => {
  return createPortal(
    <div className="warning-popup w-100 custom-margin h-100 background-cover position-fixed z-max">
      <div className="popup z-2 bg-white rounded-1 sm session-active-already">
        <div className="d-flex align-item-center justify-content-between head">
          <div className="sh2">{heading}</div>
          { isCloseVisible && (
            <div>
              <i
                role="button"
                tabIndex="0"
                aria-label="Close"
                onClick={handleCloseClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCloseClick();
                  }
                }}
                className="sky-icons icon-close-simple cursor-pointer md"
              />
            </div>
          )}
        </div>
        <div className="popup-content w-100 h-100 overflow-y-auto overflow-x-hidden h-100">
          <div className="skyplus-text my-8 sh5">{subHeading}</div>
          <div className="d-flex align-items-center justify-content-center">
            <div className="skyplus-button">
              <button
                type="button"
                onClick={handleBtnClick}
                className="skyplus-button--filled skyplus-button--filled-primary skyplus-button--medium"
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// Define prop types for the component
WarningPopup.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  ctaLabel: PropTypes.string,
  isCloseVisible: PropTypes.bool,
  handleCloseClick: PropTypes.func,
  handleBtnClick: PropTypes.func,
};

export default WarningPopup;
