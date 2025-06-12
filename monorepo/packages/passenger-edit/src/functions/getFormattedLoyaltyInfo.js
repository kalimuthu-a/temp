import getNomineeType from './getNomineeType';

const getFormattedLoyaltyInfo = (passengers, setValue) => {
  passengers.forEach((passenger, index) => {
    const travelDocuments = passenger?.travelDocuments || [];
    if (travelDocuments?.length) {
      const nomineeDetails = getNomineeType(travelDocuments);

      setValue(
        `userFields.${index}.loyaltyInfo.selfTravel`,
        nomineeDetails?.isSelf,
      );
      setValue(
        `userFields.${index}.loyaltyInfo.isNominee`,
        nomineeDetails?.isNominee,
      );
      setValue(
        `userFields.${index}.loyaltyInfo.NomineeId`,
        nomineeDetails?.NomineeId,
      );
    }
  });
};

export default getFormattedLoyaltyInfo;
