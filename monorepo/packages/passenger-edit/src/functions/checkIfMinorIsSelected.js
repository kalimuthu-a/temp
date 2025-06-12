const checkIfMinorIsSelected = (minorConsentCheckboxData, passengerKey) => {
  return minorConsentCheckboxData?.some((x) => x.passengerKey === passengerKey && x.isSelected === true);
};

export default checkIfMinorIsSelected;
