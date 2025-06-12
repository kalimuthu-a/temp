/* eslint-disable react/prop-types */
import React from 'react';
import { useFormContext } from 'react-hook-form';
import PassengerDetailsCard from '../../PassengerDetailsCard/PassengerDetailsCard';
import PassengerForm from '../PassengerForm/PassengerForm';
import { calculateYearsFromDate } from '../../../../helpers';
import regexConstant from '../../../../constants/regex';

const SinglePaxCard = (props) => {
  const {
    bookingContext,
    validateThisCard,
    selectedCardIndex,
    setFilledFields,
    setSelectedCardIndex,
    setValidateThisCard,
    setInputValues,
    filledFields,
    paxInfo,
    cardIndex,
    setFieldValue,
    fieldValue,
    PaxFields,
    ssr,
    infantPrice,
    setisMinorSliderOpen,
    minorCheckboxData,
  } = props;

  const { getValues } = useFormContext();
  const userFields = getValues('userFields');
  const isCardOpen = paxInfo?.cardIndex === selectedCardIndex;
  const hideCardDetails = !isCardOpen;
  const travelDate = ssr?.[0]?.journeydetail?.departure;

  const { dateOfBirth } = userFields[cardIndex].info;
  const { extraSeatTag } = userFields[cardIndex];
  const paxAge = dateOfBirth?.length === regexConstant.DOB_LENGTH_WITH_HYPHENS
    ? `${calculateYearsFromDate(dateOfBirth, travelDate) || ''} years`
    : '';
  const selectedGender = paxInfo.paxGender || paxInfo.gender;

  return (
    <PassengerDetailsCard
      paxAge={paxAge}
      bookingContext={bookingContext}
      validateThisCard={validateThisCard}
      selectedCardIndex={selectedCardIndex}
      setFilledFields={setFilledFields}
      setSelectedCardIndex={setSelectedCardIndex}
      setValidateThisCard={setValidateThisCard}
      filledFields={filledFields}
      isCardOpen={isCardOpen}
      extraSeatTag={extraSeatTag}
      selectedGender={selectedGender}
      {...paxInfo}
    >
      <PassengerForm
        setValidateThisCard={setValidateThisCard}
        setFieldValue={setFieldValue}
        fieldValue={fieldValue}
        PaxFields={PaxFields}
        setInputValues={setInputValues}
        hideCardDetails={hideCardDetails}
        infantPrice={infantPrice}
        setisMinorSliderOpen={setisMinorSliderOpen}
        minorCheckboxData={minorCheckboxData}
        {...paxInfo}
      />
    </PassengerDetailsCard>
  );
};

export default SinglePaxCard;
