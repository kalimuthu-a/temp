import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './SeatSelectionToast.scss';

const Toast = ({
  onClose,
  position = 'bottom-top',
  isAnimate = true,
  autoDismissTimeer,
  renderToastContent,
  containerClass,
  title,
  description,
  variation,
  mainToastWrapperClass,
  buttonLabel,
}) => {
  const [dismiss, setDismiss] = useState(false);
  useEffect(() => {
    if (autoDismissTimeer) {
      setTimeout(() => {
        setDismiss(true);
        if (onClose) {
          onClose();
        }
      }, autoDismissTimeer);
    }
  }, []);
  return dismiss ? null : (
    <div className={`${mainToastWrapperClass} seat-selection--toast-wrapper`}>
      <div
        className={`skyplus-design-toast-container
         ${containerClass} ${variation} ${position} ${isAnimate ? '' : 'no-animate'
        }`}
      >
        {renderToastContent ? (
          renderToastContent()
        ) : (
          <div className="notifi-variation-container">
            <div className="notifi-variation-col">
              {title && <h5 className="title">{title}</h5>}
              <div className="content">
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
              <div className="notifi-button-contianer">
                {onClose && (
                <div
                  aria-hidden="true"
                  className="toast_close"
                  onClick={onClose}
                >{buttonLabel}
                </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Toast.propTypes = {
  onClose: PropTypes.func,
  position: PropTypes.oneOf([
    'top-bottom',
    'bottom-top',
    'top-right',
    'bottom-right',
    'top-left',
    'bottom-left',
  ]),
  isAnimate: PropTypes.bool,
  autoDismissTimeer: PropTypes.number,
  renderToastContent: PropTypes.func,
  containerClass: PropTypes.string,
  variation: PropTypes.oneOf([
    'notifi-variation--Success',
    'notifi-variation--Warning',
    'notifi-variation--Information',
    'notifi-variation--Error',
  ]),
  buttonLabel: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  mainToastWrapperClass: PropTypes.string,
};

Toast.defaultProps = {
  title: 'Error',
  buttonLabel: 'OK',
};

export default Toast;
