import React, { useEffect, useRef } from 'react';

/**
 *
 * @param {React.ComponentType<*>} Component
 * @returns {React.ComponentType<*>}
 */
const WithFocusTrap = (Component) => {
  const Wrapped = (props) => {
    const modalRef = useRef(null);

    const trapFocus = (element) => {
      const focusableElements = element.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
          'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, ' +
          '[tabindex="0"], [contenteditable], audio[controls], video[controls], ' +
          '[tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleFocusTrap = (event) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      };

      element.addEventListener('keydown', handleFocusTrap);

      return () => {
        element.removeEventListener('keydown', handleFocusTrap);
      };
    };

    useEffect(() => {
      const modal = modalRef.current;
      const removeFocusTrap = trapFocus(modal);

      return () => {
        removeFocusTrap();
      };
    }, []);

    return (
      <div ref={modalRef}>
        <Component {...props} />
      </div>
    );
  };

  Wrapped.propTypes = {};

  return Wrapped;
};

export default WithFocusTrap;
