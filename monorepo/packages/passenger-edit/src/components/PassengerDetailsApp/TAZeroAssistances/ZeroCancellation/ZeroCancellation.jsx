import React, {useState } from 'react';
import AssistanceCard from '../AssistanceCard/AssistanceCard';
import ZeroCancellationSlidePane from '../ZeroCancellationSlidePane/ZeroCancellationSlidePane';

const ZeroCancellation = (props) => {
  const {
    cancellationAssistance,
    zeroCancellationAdded,
    onToggleZeroCancellation,
    assistantPrice
  } = props;
  const [isOpenSlider, setOpenSlider] = useState(false);

  const onAddZeroCancellation = (event) => {
    event.preventDefault();
    onToggleZeroCancellation(!zeroCancellationAdded);
  }

  const assistanceProps = {
    ...cancellationAssistance,
    description: cancellationAssistance?.description?.html.replace('{caPrice}', assistantPrice),
    assistantPrice,
    assistanceAdded: zeroCancellationAdded,
    setOpenSlider: () => setOpenSlider(true),
    handleClick: onAddZeroCancellation,
  }

  const onCloseSlider = () => {
    setOpenSlider(false);
  }

  const sliderProps = {
    onCloseSlider: onCloseSlider,
    cancellationAssistanceBenefits: cancellationAssistance?.sideDrawerBenefits
  }
  return (
    <>
      <AssistanceCard assistanceProps={assistanceProps} />

      {isOpenSlider && <ZeroCancellationSlidePane {...sliderProps} />}
    </>
  )
}

export default ZeroCancellation