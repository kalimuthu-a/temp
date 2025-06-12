/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';

// eslint-disable-next-line max-len
const SELECTOR_FOCUSABLE = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';

const WithFocusTrap = (Component) => {
  const Wrapped = (props) => {
    const ref = useRef(null);

    const trapFocus = (
      element,
      prevFocusableElement = document.activeElement,
    ) => {
      const focusableEls = Array.from(
        element.querySelectorAll(SELECTOR_FOCUSABLE),
      );
      const firstFocusableEl = focusableEls[0];
      const lastFocusableEl = focusableEls[focusableEls.length - 1];
      let currentFocus = null;

      firstFocusableEl?.focus();
      currentFocus = firstFocusableEl;

      const handleFocus = (e) => {
        e.preventDefault();
        // if the focused element "lives" in your modal container then just focus it
        if (focusableEls.includes(e.target)) {
          currentFocus = e.target;
        } else {
          if (currentFocus === firstFocusableEl) {
            lastFocusableEl?.focus();
          } else {
            firstFocusableEl?.focus();
          }
          // update the current focus var
          currentFocus = document.activeElement;
        }
      };

      document.addEventListener('focus', handleFocus, true);

      return {
        onClose: () => {
          document.removeEventListener('focus', handleFocus, true);
          prevFocusableElement?.focus();
        },
      };
    };

    useEffect(() => {
      const trapped = trapFocus(ref.current);

      return () => {
        trapped?.onClose();
      };
    }, []);

    return (
      <div>
        <div tabIndex="0" role="button" />
        <div className="focus-trap-wraper" ref={ref}>
          {React.createElement(Component, { ...props })}
        </div>
        <div tabIndex="0" role="none" />
      </div>
    );
  };

  Wrapped.propTypes = {};

  return Wrapped;
};

export default WithFocusTrap;
