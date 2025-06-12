import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

const Popover = ({ containerClass, renderElement, renderPopover, setToggleModal, inputRef }) => {
  const [open, setOpen] = useState(false);
  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const ref = useRef();

  const onClickHandler = () => {
    // Old Code:
    // setOpen(true);
  };

  useEffect(() => {
    const listener = (e) => {
      const getInputRef = inputRef?.current ? inputRef : ref;
      if (getInputRef.current.contains(e.target)) {
        if (open && e.target.className.includes('icon-accordion-up-simple')) {
          setOpen(false);
          setToggleModal(false);
        } else {
          setOpen(true);
        }
      } else {
        setOpen(false);
        setToggleModal(false);
      }
    };

    document.addEventListener('click', listener);
    return () => {
      document.removeEventListener('click', listener);
    };
  }, [open]);

  return renderElement ? (
    <section
      className={`popover__wrapper ${containerClass} ${open ? 'focused' : ''}`}
      onClick={onClickHandler}
      ref={ref}
      role="presentation"
    >
      {renderElement()}
      {open ? <div className="popover__content">{renderPopover()}</div> : null}
    </section>
  ) : null;
};

Popover.propTypes = {
  containerClass: PropTypes.string,
  renderElement: PropTypes.func,
  renderPopover: PropTypes.func,
  setToggleModal: PropTypes.func,
  inputRef: PropTypes.shape({
    current: PropTypes.node,
  }),
};

export default Popover;
