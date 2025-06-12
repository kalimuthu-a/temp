// This function checks the flights userFlightData array for a specific route (origin-destination)
export const handleNorseFlights = (userFlightData, equipmentType) => {
  const flightEquipmentType = userFlightData?.legs?.[0]?.legDetails?.equipmentType;
  const flightInfo = {
    origin: userFlightData?.designator?.origin,
    destination: userFlightData?.designator?.destination,
    equipmentType: flightEquipmentType,
  };
  const findedValue = equipmentType?.find((item) => {
    return (item?.primaryKey?.includes(flightInfo?.equipmentType) && (
      item?.secondaryKey?.includes(`${flightInfo?.origin}-${flightInfo?.destination}`) ||
      item?.secondaryKey?.includes(`${flightInfo?.destination}-${flightInfo?.origin}`)
    ))
  })
  return findedValue || {};
}

export const norsePriceObj = (secondaryValues) => secondaryValues?.reduce((acc, item) => {
  acc[item.key] = item.value;
  return acc;
}, {}) || {};