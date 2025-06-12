import React from 'react';

const AssistanceCard = ({assistanceProps}) => {
  const {
    heading,
    description,
    mainBenefits,
    benefitsLogo,
    assistantPrice,
    protectYourTripText,
    viewMoreBenefitsText,
    acceptText,
    rejectText,
    termsAndConditions,
    setOpenSlider,
    handleClick,
    assistanceAdded
  } = assistanceProps;

  const [firstWord, secondWord] = heading?.split(" ");

  

  return (
    <div className={`assistance-card-wrapper ${assistanceAdded ? "assistanceAdded" : ""}`}>
      <div className='assistance-card-header'>
        <div className='assistance-card-title'>{firstWord} <span>{secondWord}</span></div>
        <div className='assistance-card-desc' dangerouslySetInnerHTML={{
          __html: description,
        }} />
      </div>
      <div className='assistance-benefits-wrapper'>
        <div className='assistance-benefits'>
          {mainBenefits && mainBenefits.length > 0 && mainBenefits.map(benefitItem => (
            <div className='assistance-benefit'>
            <i className={`${benefitsLogo} icon`}></i>
            <span className='assistance-benefit-text'>{benefitItem}</span>
          </div>
          ))}
        </div>
        <button className='viewBenefitsButton' onClick={setOpenSlider}>{viewMoreBenefitsText}</button>
      </div>
      <div className='assistance-add-wrapper'>
        <div className='assistance-price-wrapper'>
          <div className='assistance-add-text'>{protectYourTripText}</div>
          <div className='assistance-price'>{assistantPrice}</div>
        </div>
        <button className='assistance-add-btn' onClick={handleClick}>{assistanceAdded ? rejectText : acceptText}</button>
      </div>
      <div className='assistance-term-conditions-wrapper'>
        <div className='assistance-term-conditions' dangerouslySetInnerHTML={{
          __html: termsAndConditions?.html,
        }} />
      </div>
    </div>
  )
}

export default AssistanceCard