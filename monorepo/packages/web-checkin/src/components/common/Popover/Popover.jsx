import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import { emptyFn } from 'skyplus-design-system-app/dist/des-system/utils';

const Popover = ({
  containerClass,
  renderElement,
  renderPopover,
  onClose = emptyFn,
  onOpen = emptyFn,
  showPopover,
}) => {
  const [open, setOpen] = useState(false);
  const [isMobile] = useIsMobile();
  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const ref = useRef();

  const onClickHandler = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!open) {
      return () => {};
    }
    const listener = (e) => {
      if (
        ref.current.contains(e.target) &&
        !e.target.classList.contains('icon-circle')
      ) {
        if (isMobile) {
          document.body.classList.add('overflow-hidden');
        }
      } else {
        document.body.classList.remove('overflow-hidden');

        setOpen(false);
        onClose();
      }
    };

    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('click', listener);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      onOpen();
    }
  }, [open]);

  useEffect(() => {
    setOpen(showPopover);
  }, [showPopover]);

  return (
    <div
      className={`popover__wrapper ${containerClass} ${open ? 'focused' : ''}`}
      ref={ref}
      role="presentation"
      onClick={onClickHandler}
    >
      {renderElement()}
      {open && showPopover && (
        <div className="wc-popover__content">
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
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  renderElement: PropTypes.func,
  renderPopover: PropTypes.func,
  showPopover: PropTypes.bool,
};

export default Popover;
