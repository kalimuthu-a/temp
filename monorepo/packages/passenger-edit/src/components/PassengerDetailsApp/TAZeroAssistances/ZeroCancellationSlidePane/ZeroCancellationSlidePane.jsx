import React from 'react';
import "./ZeroCancellationSlidePane.scss";
import AssistanceSlidePane from '../AssistanceSlider/AssistanceSlider';

const ZeroCancellationSlidePane = (props) => {
  const {
    onCloseSlider,
    cancellationAssistanceBenefits
  } = props;

  const {
    sideDrawerHeading,
    sideDrawerNote,
    benefitsTermsAndConditions,
    caBenefits
  } = cancellationAssistanceBenefits[0];

  const assistanceSliderProps = {
    sideDrawerHeading,
    sideDrawerNote,
    benefitsTermsAndConditions
  }
  const sliderProps = {
    containerClassName: 'zero-cancellation-slider-container',
    onClose: onCloseSlider,
  };
  return (
    <AssistanceSlidePane sliderProps={sliderProps} assistanceSliderProps={assistanceSliderProps}>
      <div className='zero-cancellation-benefits-table-container'>
        <div className='zero-cancellation-benefits-table-wrapper'>
          <div dangerouslySetInnerHTML={{
            __html: caBenefits.html,
          }} />
        </div>
      </div>
    </AssistanceSlidePane>
  )
}

export default ZeroCancellationSlidePane