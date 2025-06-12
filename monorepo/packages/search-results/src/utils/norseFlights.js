// This function checks the flights userFlightData array for a specific route (origin-destination)
export const handleNorseFlights = (userFlightData, equipmentType) => {
  let flightInfo = {};
  flightInfo = {
    origin: userFlightData?.designator?.origin,
    destination: userFlightData?.designator?.destination,
    equipmentType: userFlightData?.identifier?.equipmentType
  };
  const findedValue = equipmentType?.find((item) => {
    return (item?.primaryKey?.includes(flightInfo?.equipmentType) && (
      item?.secondaryKey?.includes(`${flightInfo?.origin}-${flightInfo?.destination}`) ||
      item?.secondaryKey?.includes(`${flightInfo?.destination}-${flightInfo?.origin}`)
    ))
  })
  return findedValue || {};
}