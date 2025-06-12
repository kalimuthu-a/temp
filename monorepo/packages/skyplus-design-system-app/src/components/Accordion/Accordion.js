import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Checkbox from '../CheckBox/CheckBox';

const Accordion = (props) => {
  const {
    accordionData,
    activeIndex,
    setActiveIndex,
    isMultiOpen,
    initalActiveIndexes = [],
    ariaProps = {},
    onClickAccordianHeader,
    isChecked,
    onChangeHandler,
    checkAmenities = false,
    mfData,
  } = props;

  const [activeIndexes, setActiveIndexes] = useState([activeIndex]);

  useEffect(() => {
    if (initalActiveIndexes.length > 0) setActiveIndexes(initalActiveIndexes.slice());
    else if (isMultiOpen) setActiveIndexes([]);
  }, []);
  const onClickAccordianTitle = (index) => {
    if (isMultiOpen) {
      setActiveIndexes((prevIndexes) => {
        if (prevIndexes.includes(index)) {
          return prevIndexes.filter((panelIndex) => panelIndex !== index);
        }
        return [...prevIndexes, index];
      });
    } else {
      setActiveIndexes((prevIndexes) => {
        if (prevIndexes.includes(index)) {
          return [];
        }
        return [index];
      });
    }
    setActiveIndex(index);
    if (onClickAccordianHeader) {
      onClickAccordianHeader(index);
    }
  };

  return accordionData?.map((aData, index) => (
    <>
      <AccordionBlock
        {...aData}
        index={index}
        setActiveIndex={onClickAccordianTitle}
        isOpen={activeIndexes.includes(index)}
        ariaProps={{ ...ariaProps }}
        isDisabled={aData?.isDisabled}
      />
      {(checkAmenities && index === 0) && (
        <Checkbox
          containerClass="body-medium-regular skyplus-accordion__same-amenities"
          checked={isChecked}
          id={index}
          onChangeHandler={() => { onChangeHandler(); setActiveIndexes([]); }}
          disabled={isChecked}
        >
          {mfData?.addAmenities}
        </Checkbox>
      )}
    </>
  ));
};
const AccordionBlock = (props) => {
  const {
    setActiveIndex,
    isOpen,
    index,
    title,
    subTitle,
    renderAccordionContent,
    renderAccordionHeader,
    // addServices = {},
    addedAddons,
    ariaProps = {},
    renderSubtitle = false,
    containerClassName = '',
    isDisabled = false,
  } = props;

  // const isAddService = !!Object.keys(addServices).length;

  const onClickHandler = () => {
    setActiveIndex(index);
  };

  const className = classNames('skyplus-accordion box-shadow-card-soft', containerClassName);

  return (
    <div className={className}>
      <div
        className={`skyplus-accordion__header ${
          isOpen && 'skyplus-accordion__header--active'
        } ${isDisabled && 'disabled-accordions-inner-item'}`}
        onClick={onClickHandler}
        onKeyDown={(e) => { if (e.key === 'Enter') setActiveIndex(index); }}
        role="button"
        tabIndex="0"
        {...ariaProps}
        aria-expanded={isOpen}
      >
        <div className="skyplus-accordion__head-root">
          <div
            className={`skyplus-accordion__header-left ${
              isOpen && 'skyplus-accordion__header-left--active'
            } ${addedAddons && 'skyplus-accordion__header-left--added'}`}
          />
          <div className="skyplus-accordion__header-right">
            <div className="skyplus-accordion__header-container">
              <div className="skyplus-accordion__header-name body-medium-regular">
                {title}
              </div>
              <i
                className={`skyplus-accordion__icon ${
                  isOpen
                    ? 'icon-accordion-up-simple'
                    : 'icon-accordion-down-simple'
                }`}
              />
            </div>
            {renderSubtitle
              ? renderSubtitle()
              : (
                <div className="skyplus-accordion__subtitle body-small-regular">
                  {subTitle}
                </div>
              )}
          </div>
        </div>
        {renderAccordionHeader}
        {addedAddons && (
          <div className="skyplus-accordion__footer">
            <div className="skyplus-accordion__footer-text">
              {/* <span className={addServices.icon} /> */}
              {/* {addServices.text} */}
              {addedAddons}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="skyplus-accordion__body"> {renderAccordionContent}</div>
      )}
    </div>
  );
};

Accordion.propTypes = {
  accordionData: PropTypes.array,
  activeIndex: PropTypes.number,
  setActiveIndex: PropTypes.func,
  isChecked: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  checkAmenities: PropTypes.bool,
};
AccordionBlock.propTypes = {
  setActiveIndex: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  renderAccordionContent: PropTypes.node,
  renderAccordionHeader: PropTypes.node,
  renderSubtitle: PropTypes.any,
  addedAddons: PropTypes.node,
  ariaProps: PropTypes.object,
  containerClassName: PropTypes.string,
  isDisabled: PropTypes.bool,
};
export default Accordion;
