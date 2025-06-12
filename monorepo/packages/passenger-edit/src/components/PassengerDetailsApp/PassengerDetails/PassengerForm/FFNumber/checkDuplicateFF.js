const checkDuplicateFF = ({
  errors = {},
  passengers,
  setError = () => {},
  clearErrors = () => {},
  duplicateFFNError = '',
  cardIndex,
}) => {
  const matchedIndices = new Set();
  const allIndices = new Set(passengers.map((_, index) => index));

  for (let i = 0; i < passengers.length; i += 1) {
    if (passengers[i].loyaltyInfo?.FFN) {
      for (let j = i + 1; j < passengers.length; j += 1) {
        if (passengers[i].loyaltyInfo?.FFN === passengers[j].loyaltyInfo?.FFN) {
          matchedIndices.add(i);
          matchedIndices.add(j);
        }
      }
    }
  }

  const matchedPax = [...matchedIndices];
  const nonMatchedPax = [...allIndices].filter(
    (index) => !matchedIndices.has(index),
  );

  matchedPax.forEach((paxIndex) => {
    if (!passengers?.[paxIndex]?.loyaltyInfo?.selfTravel) {
      setError(`userFields.${paxIndex}.loyaltyInfo.FFN`, {
        type: 'manual',
        message: duplicateFFNError,
        flag: 'duplicateFFN',
      });
    }
  });
  nonMatchedPax?.forEach((paxIndex) => {
    if (
      errors?.userFields?.[paxIndex]?.loyaltyInfo?.FFN?.flag === 'duplicateFFN'
    ) {
      clearErrors(`userFields.${paxIndex}.loyaltyInfo.FFN`);
    }
  });

  if (!cardIndex) {
    return matchedPax.length;
  }
  if (matchedPax.includes(cardIndex)) {
    return duplicateFFNError;
  }
  return false;
};

export default checkDuplicateFF;
