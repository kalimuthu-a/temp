import React, { useEffect, useCallback, useRef } from 'react';

import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';

/**
 * @type {React.FC<{children: React.ReactElement[],
 *  onClose: () => void, containerClassName: string, ariaLabel: string,}>}
 */
const OffCanvas = ({
  children,
  onClose,
  containerClassName,
  renderHeader,
  renderFooter,
  ariaLabel,
  smoothSlide,
}) => {
  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const ref = useRef(null);

  const overflowHiddenClass = 'overflow-hidden';
  const header = document.querySelector('header');

  useEffect(() => {
    const getScrollbarWidth = () => {
      const { innerWidth } = window;
      const { clientWidth } = document.documentElement;
      return innerWidth - clientWidth;
    };
    const scrollBarWidth = getScrollbarWidth();

    const sliderTransition = () => {
      ref?.current?.classList?.remove('is-hidden');
      document.body?.classList?.add(overflowHiddenClass);
      if (header) header.style.marginRight = `${scrollBarWidth}px`;
      document.body.style.marginRight = `${scrollBarWidth}px`;
      ref?.current?.querySelector('.icon-close-simple')?.focus();
      ref?.current?.addEventListener('transitionend', () => {
        ref?.current?.querySelector('.icon-close-simple')?.focus();
      });
    };

    if (smoothSlide) {
      setTimeout(() => {
        sliderTransition();
      }, 200);
    } else {
      sliderTransition();
    }

    return () => {
      document.body?.classList?.remove(overflowHiddenClass);
      if (header) header.style.marginRight = '0px';
      document.body.style.marginRight = '0px';
    };
  }, []);

  // close slider on esc keypress
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

  return createPortal(
    <div
      className={`skyplus-offcanvas is-hidden ${containerClassName}`}
      ref={ref}
    >
      <div className="skyplus-offcanvas__overlay" />
      <div
        className="skyplus-offcanvas__contents"
        role="dialog"
        aria-modal="true"
        aria-hidden="false"
      >
        {renderHeader ? (
          renderHeader()
        ) : (
          <div className="skyplus-offcanvas__contents--header">
            <Icon
              className={containerClassName.includes('skyplus-offcanvas__child')
                ? 'icon-accordion-left-simple' : 'icon-close-simple'}
              role="button"
              aria-label={ariaLabel}
              tabIndex={0}
              onClick={onClose}
            />
          </div>
        )}
        <div className="skyplus-offcanvas__contents--body">{children}</div>
        {renderFooter && (
          <div className="skyplus-offcanvas__contents--footer">
            {renderFooter()}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

OffCanvas.defaultProps = {
  containerClassName: '',
  renderHeader: null,
  renderFooter: null,
  ariaLabel: '',
  smoothSlide: true,
};

OffCanvas.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func,
  containerClassName: PropTypes.string,
  ariaLabel: PropTypes.string,
  smoothSlide: PropTypes.bool,
};

export default OffCanvas;
