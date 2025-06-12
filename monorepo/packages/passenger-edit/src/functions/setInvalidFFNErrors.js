export const setInvalidFFNErrors = ({
  getValues,
  setError,
  addPassengerResponseJson,
  validationMessage,
}) => {
  const userFields = getValues('userFields');
  userFields.forEach((user, index) => {
    const matchingError = addPassengerResponseJson?.errors.find(
      (error) => error.subType === user.loyaltyInfo.FFN,
    );

    if (matchingError) {
      const fieldName = `userFields.${index}.loyaltyInfo.FFN`;
      setError(fieldName, { message: validationMessage, flag: true });
    }
  });
};
