import React, { useState } from 'react';
import "./TravelAssistanceSlidePane.scss";
import AssistanceSlidePane from '../AssistanceSlider/AssistanceSlider';

const TravelAssistanceSlidePane = ({
  onCloseSlider,
  travelBenefits
}) => {
  const {
    sideDrawerHeading,
    sideDrawerNote,
    taBenefits,
    viewMoreText,
    viewLessText,
    benefitsTermsAndConditions,
   } = travelBenefits[0];

  const assistanceSliderProps = {
    sideDrawerHeading,
    sideDrawerNote,
    benefitsTermsAndConditions
  };

  const sliderProps = {
    containerClassName: 'travel-assistance-slider-container',
    onClose: onCloseSlider,
  }
  const initialCount = 3;
  const [visibleItemsCount, setVisibleItemsCount] = useState(initialCount);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleView = () => {
    if(isExpanded){
      setVisibleItemsCount(initialCount);
    } else {
      setVisibleItemsCount(taBenefits.length);
    }
    setIsExpanded(!isExpanded)
  }

  return (
      <AssistanceSlidePane assistanceSliderProps={assistanceSliderProps} sliderProps={sliderProps}>
        <div className='travel-assistance-benefits-container'>
          <div className='travel-assistance-benefits-wrapper'>
            {
              taBenefits && taBenefits.length > 0 && taBenefits.slice(0, visibleItemsCount).map(benefitItem => (
                <div className='travel-assistance-benefit-item'>
                  <div className='icon-container'>
                    <i className={`${benefitItem?.icon} icon-size-md`}></i>
                  </div>
                  <div className='travel-assistance-benefit-text-wrapper'>
                    <div className='travel-assistance-benefit-heading'>{benefitItem?.title}</div>
                    <div className='travel-assistance-benefit-subHeading'>{benefitItem?.note}</div>
                    <div className='travel-assistance-benefit-desc'>{benefitItem?.description?.plaintext}</div>
                  </div>
                </div>
              ))
            }
          </div>
        <div className='travel-assistance-benefits-btn'>
          {taBenefits?.length > initialCount && (
            <button className='viewMoreBtn' onClick={toggleView}>{isExpanded ? viewLessText : viewMoreText}</button>
          )}
        </div>
        </div>
      </AssistanceSlidePane>
  )
}

export default TravelAssistanceSlidePane