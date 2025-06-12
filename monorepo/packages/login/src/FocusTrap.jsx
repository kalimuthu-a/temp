import React, { useEffect, useRef } from 'react';

function FocusTrap({ children }) {
  const modalRef = useRef(null);
  const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
      'a[data-href], a[href], area[href], input:not([disabled]), select:not([disabled]), '
        + 'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, '
        + '[tabindex="0"], [contenteditable], audio[controls], video[controls], '
        + '[tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleFocusTrap = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            console.log(
              'Attempted to shift-tab out of modal. Moving focus to the last element.',
            );
            lastElement.focus();
            event.preventDefault();
          }
        } else if (document.activeElement === lastElement) {
          console.log(
            'Attempted to tab out of modal. Moving focus to the first element.',
          );
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
    if (modal) {
      modal.querySelector('input')?.focus();
      const removeFocusTrap = trapFocus(modal);

      return () => {
        removeFocusTrap();
      };
    }
  }, [modalRef.current]);
  return (
    <div ref={modalRef}>{React.cloneElement(children, { ref: modalRef })}</div>
  );
}

FocusTrap.propTypes = {};

export default FocusTrap;
