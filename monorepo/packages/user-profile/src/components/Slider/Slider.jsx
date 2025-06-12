import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

// import './Slider.scss';

const Slider = ({ children, customClass, open, closeHandler, delay }) => {
  const mainContentWrapperRef = useRef(null);
  const setBodyStyle = (paddingRight, overflow) => {
    const header = document.querySelector('header');
    if (header) {
      header.style.paddingRight = paddingRight;
    }
    document.body.style.paddingRight = paddingRight;
    document.body.style.overflow = overflow;
  };
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeHandler();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const initialBodyPaddingRight = parseInt(
      window.getComputedStyle(document.body)?.['padding-right'],
      10,
    ) || 0;
    setBodyStyle(`${initialBodyPaddingRight + scrollbarWidth}px`, 'hidden');

    return () => {
      setBodyStyle(initialBodyPaddingRight, 'auto');
    };
  }, [open]);

  const sliderStyle = {
    transition: `transform ${delay}ms`,
  };

  const handleClickOutside = (e) => {
    if (!mainContentWrapperRef.current?.contains(e.target)) {
      closeHandler();
    }
  };

  const component = (
    <div
      className={`slider-skyplus-mf ${customClass}`}
      onClick={handleClickOutside}
      onKeyDown={(event) => {
        // Check if the 'Enter' key is pressed
        if (event.key === 'Escape') {
          closeHandler();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div
        ref={mainContentWrapperRef}
        style={sliderStyle}
        className={`slider-main-content-wrapper ${open ? 'slide-now' : ''}`}
      >
        {children}
      </div>
    </div>
  );
  return createPortal(component, document.body);
};

Slider.propTypes = {
  children: PropTypes.element || PropTypes.string,
  customClass: PropTypes.string,
  open: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired,
  delay: PropTypes.number,
};

Slider.defaultProps = {
  customClass: '',
  delay: 500,
};

export default Slider;
