import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import { emptyFn } from 'skyplus-design-system-app/dist/des-system/utils';
import { scrollBookingDropdownsIntoView } from '../../../utils';

const Popover = ({
  containerClass,
  renderElement,
  renderPopover,
  onClose = emptyFn,
  onOpen = emptyFn,
  disableonClick = false,
  openPopover = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile] = useIsMobileBooking();
  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const ref = useRef();

  const onMouseEnter = () => {
    setHovered(true);
  };

  const onFocusHandler = () => {
    setHovered(true);
  };

  const onClickHandler = (e) => {
    if (e.target.classList.contains('booking-widget-field')) {
      scrollBookingDropdownsIntoView();
    }

    if (e.target.classList.contains('icon-circle')) {
      setOpen(false);
      setHovered(false);
    } else {
      setOpen(true);
    }
  };

  const onMouseLeave = () => {
    if (hovered && !open) {
      setHovered(false);
      setOpen(false);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };
  const listener = (e) => {
    if (
      (ref?.current?.contains(e?.target) &&
    !e?.target?.classList?.contains('icon-circle') &&
    !e?.target?.classList?.contains('icon-switch-destination'))
    ) {
      if (!disableonClick) {
        setOpen(true);
      }
    } else {
      setOpen(false);
      setHovered(false);
      onClose();
    }
  };
  useEffect(() => {
    requestAnimationFrame(() => {
    document.addEventListener('click', listener, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', listener, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  });
  }, []);

  useEffect(() => {
    if (open) {
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
      onOpen();
    }

    return () => {
      if (isMobile) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [open]);

  useEffect(() => {
    setOpen(openPopover);
    setHovered(openPopover);
  }, [openPopover]);

  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (open) {
        return;
      }

      setHovered(false);
      setOpen(false);
    } else if (e.key === 'Enter') {
      setOpen(true);
      setHovered(true);
    }
  };

  return (
    <div
      className={`popover__wrapper ${containerClass} ${
        hovered ? 'focused' : ''
      }`}
      ref={ref}
      role="presentation"
      {...(!disableonClick && {
        onMouseEnter,
        onClick: onClickHandler,
        onMouseLeave,
        onFocus: onFocusHandler,
        onKeyDown,
      })}
    >
      {renderElement()}
      {open && (
        <div className="bw-popover__content">
          <div className="pop-over-header-mobile">
            <div className="icon-circle">
              <Icon className="icon-close-simple" size="lg" />
            </div>
          </div>
          {renderPopover()}
        </div>
      )}
    </div>
  );
};

Popover.propTypes = {
  containerClass: PropTypes.string,
  disableonClick: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  openPopover: PropTypes.bool,
  renderElement: PropTypes.func,
  renderPopover: PropTypes.func,
};

export default Popover;
