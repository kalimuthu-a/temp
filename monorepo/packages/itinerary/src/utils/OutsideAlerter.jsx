import React, { useRef, useEffect } from 'react';

import PropTypes from 'prop-types';
/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, onOutsideClick) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        // eslint-disable-next-line no-unused-expressions
        onOutsideClick && onOutsideClick();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  // eslint-disable-next-line react/destructuring-assignment
  useOutsideAlerter(wrapperRef, props.onOutsideClick);

  // eslint-disable-next-line react/destructuring-assignment
  return <div ref={wrapperRef}> {props.children} </div>;
}
OutsideAlerter.propTypes = {
  children: PropTypes.element,
  onOutsideClick: PropTypes.func,
};
