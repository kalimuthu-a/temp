import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const Toast = ({
  onClose,
  position = 'top-bottom',
  isAnimate = true,
  autoDismissTimeer,
  renderToastContent,
  containerClass,
  title,
  description,
  variation,
  mainToastWrapperClass,
  infoIconClass = 'icon-info',
}) => {
  const [dismiss, setDismiss] = useState(false);
  useEffect(() => {
    if (autoDismissTimeer) {
      setTimeout(() => {
        setDismiss(true);
        if (typeof onClose === 'function') onClose();
      }, autoDismissTimeer);
    }
  }, []);

  // close modal on esc keypress
  const handleKeyUp = useCallback((e) => {
    const keys = {
      27: () => {
        e.preventDefault();
        onClose();
        window.removeEventListener('keyup', handleKeyUp, false);
      },
    };

    if (keys[e.keyCode]) {
      keys[e.keyCode]();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp, false);

    return () => {
      window.removeEventListener('keyup', handleKeyUp, false);
    };
  }, [handleKeyUp]);

  const containerClassStr = `${containerClass} ${variation} ${position} ${
    isAnimate ? '' : 'no-animate'
  }`;

  return dismiss ? null : (
    <div className={`skyplus-design-toast ${mainToastWrapperClass}`}>
      <div
        role="dialog"
        aria-labelledby={title}
        aria-describedby={description}
        className={`skyplus-design-toast-container  ${containerClassStr}`}
      >
        {renderToastContent ? (
          renderToastContent()
        ) : (
          <div className="notifi-variation-container">
            <div className="notifi-variation-icon-wrapper">
              <i className={infoIconClass} />
            </div>
            <div className="notifi-variation-col">
              {title && <h5 className="title">{title}</h5>}
              <ul className="content">
                <li
                  aria-label={description}
                  className="desc body-small-regular"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </ul>
            </div>
            {onClose && (
              <i
                className="skyplus-design-toast__close icon-close-simple"
                onClick={onClose}
                onKeyUp={onClose}
                role="button"
                tabIndex={0}
                aria-label="close"
              />
            )}
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
  title: PropTypes.string,
  description: PropTypes.string,
  mainToastWrapperClass: PropTypes.string,
  infoIconClass: PropTypes.string,
};

export default Toast;
