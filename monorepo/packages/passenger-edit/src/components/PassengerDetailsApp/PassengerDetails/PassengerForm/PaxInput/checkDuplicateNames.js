const checkDuplicateNames = (errors, passengers, setError, clearErrors, duplicateNameError = '', cardIndex) => {
  const matchedIndices = new Set();
  const allIndices = new Set(passengers.map((_, index) => index));

  for (let i = 0; i < passengers.length; i += 1) {
    if (
      !passengers[i].gender
      || !passengers[i]?.name?.first?.trim().toLowerCase()
      || !passengers[i]?.name?.last?.trim().toLowerCase()
    ) {
      continue;
    }
    for (let j = i + 1; j < passengers.length; j += 1) {
      if (
        passengers[j].gender
        && passengers[j]?.name?.first?.trim().toLowerCase()
        && passengers[j]?.name?.last?.trim().toLowerCase()
        && passengers[i].gender === passengers[j].gender
        && passengers[i]?.name?.first?.trim().toLowerCase()
        === passengers[j]?.name?.first?.trim().toLowerCase()
        && passengers[i]?.name?.last?.trim().toLowerCase()
        === passengers[j]?.name?.last?.trim().toLowerCase()
        && passengers[i].passengerTypeCode === passengers[j].passengerTypeCode
        && passengers[i].discountCode === passengers[j].discountCode
      ) {
        matchedIndices.add(i);
        matchedIndices.add(j);
      }
    }
  }

  const matchedPax = [...matchedIndices];
  const nonMatchedPax = [...allIndices].filter((index) => !matchedIndices.has(index));

  matchedPax.forEach((paxIndex) => {
    setError(`userFields.${paxIndex}.name.first`, {
      type: 'manual',
      message: duplicateNameError,
      flag: 'duplicateName',
    });
    setError(`userFields.${paxIndex}.name.last`, {
      type: 'manual',
      message: duplicateNameError,
      flag: 'duplicateName',
    });
  });
  nonMatchedPax?.forEach((paxIndex) => {
    if (errors?.userFields?.[paxIndex]?.name?.first?.flag === 'duplicateName') {
      clearErrors(`userFields.${paxIndex}.name.first`);
      clearErrors(`userFields.${paxIndex}.name.last`);
    }
    if (errors?.userFields?.[paxIndex]?.name?.last?.flag === 'duplicateName') {
      clearErrors(`userFields.${paxIndex}.name.first`);
      clearErrors(`userFields.${paxIndex}.name.last`);
    }
  });

  if (!cardIndex) {
    return matchedPax.length;
  }
  if (matchedPax.includes(cardIndex)) {
    return duplicateNameError;
  }
  return false;
};

export default checkDuplicateNames;
