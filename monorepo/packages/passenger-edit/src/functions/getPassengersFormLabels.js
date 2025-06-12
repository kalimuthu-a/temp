const getPaxLabels = (passengerDetails, paxTypeCode) => {
  const labels = passengerDetails?.filter((pax) => paxTypeCode === pax.discountCode || pax.typeCode === paxTypeCode);
  if (labels?.length) return labels[0];
  return {};
};

const getSpecialFareCodeLabels = (specialFareDetail, specialFareCode) => {
  const labels = specialFareDetail?.filter((pax) => pax.specialFareCode === specialFareCode);
  if (labels?.length) return labels[0];
  return {};
};

export { getPaxLabels, getSpecialFareCodeLabels };
