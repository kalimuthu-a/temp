import React from 'react';
import PropTypes from 'prop-types';
import './AccordionCard.scss';

function AccordionCard({
  containerClass,
  title,
  subTitle,
  lineColor,
  children,
  label,
  isOpen,
  onClick,
  id,
  accordionRef,
}) {
  return (
    <div ref={accordionRef}>
      <div className={`accordion ${containerClass}`}>
        <div
          className={`${isOpen ? 'accordion-wrapper--active-light' : 'bg-white'}
          accordion-wrapper
          mt-6 mb-10
          d-flex justify-content-between
          w-100
          rounded`}
        >
          <div className="w-100">
            <button
              type="button"
              onClick={onClick}
              className="accordion-header
              d-flex p-6 p-6 px-md-12 py-md-8 justify-content-between bg-transparent border-0 w-100"
            >
              <div className="d-flex gap-4">
                <div className={`${lineColor} accordion__line`} />
                <div className="accordion-content">
                  <div className="d-flex gap-4 align-items-center">
                    <div className="accordion-title text-primary body-medium-regular text-capitalize text-start">
                      {title}
                    </div>
                    <div className="accordion-label">{label}</div>
                  </div>
                  <div className="accordion-subtitle">{subTitle}</div>
                </div>
              </div>
              <span
                className={`${
                  !isOpen
                    ? 'icon-accordion-down-simple'
                    : 'icon-accordion-up-simple'
                } pt-3 icon-size-sm icon-size-md-lg`}
              />
            </button>
            <div id={id}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

AccordionCard.propTypes = {
  containerClass: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.element,
  lineColor: PropTypes.string,
  label: PropTypes.any,
  children: PropTypes.any,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string,
  accordionRef: PropTypes.any,
};

export default AccordionCard;
