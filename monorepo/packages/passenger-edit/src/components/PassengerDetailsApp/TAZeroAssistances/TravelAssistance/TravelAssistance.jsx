import React, { useState } from 'react';
import AssistanceCard from '../AssistanceCard/AssistanceCard';
import TravelAssistanceSlidePane from '../TravelAssistanceSlidePane/TravelAssistanceSlidePane';

const TravelAssistance = (props) => {
  const {
    travelAssistance,
    isProtectionAdded,
    onToggleProtection,
    assistantPrice
  } = props;
  const [isOpenSlider, setOpenSlider] = useState(false);

  
  const onAddTravelAssistance = (event) => {
    event.preventDefault();
    onToggleProtection(!isProtectionAdded);
  }

  const onCloseSlider = () => {
    setOpenSlider(false);
  }

  const assistanceProps = {
    ...travelAssistance,
    description: travelAssistance?.description?.html?.replace('{taPrice}', assistantPrice),
    assistantPrice,
    assistanceAdded: isProtectionAdded,
    setOpenSlider: () => setOpenSlider(true),
    handleClick: onAddTravelAssistance,
  }

  const sliderProps = {
    onCloseSlider: onCloseSlider,
    travelBenefits: travelAssistance.sideDrawerBenefits
  }


  return (
    <>
      <AssistanceCard assistanceProps={assistanceProps} />

      {isOpenSlider && <TravelAssistanceSlidePane {...sliderProps} />}
    </>
  )
}

export default TravelAssistance