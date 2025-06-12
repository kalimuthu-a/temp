import React from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import "./AssistanceSlider.scss";

const AssistanceSlidePane = ({
  assistanceSliderProps,
  sliderProps,
  children,
}) => {

  const {
    sideDrawerHeading,
    sideDrawerNote,
    benefitsTermsAndConditions
  } = assistanceSliderProps;

  const [firstNote, secondNote, thirdNote] = sideDrawerNote?.split(" ");
  return (
    <OffCanvas {...sliderProps}>
      <div className='assistance-slider-container'>
        <div className='assistance-header'>
            <div className='assistance-title'>{sideDrawerHeading}</div>
            <div className='assistance-subTitle'>{firstNote} {secondNote} <span>{thirdNote}</span></div>
        </div>
        {children}
        <div className='readAllWrapper' dangerouslySetInnerHTML={{
          __html: benefitsTermsAndConditions?.html,
        }} />
      </div>
    </OffCanvas>
  )
}

export default AssistanceSlidePane