import { srpActions } from '../../context/reducer';

export const isCombinableClass = (selectedFaresCombinability, pClass) =>
  selectedFaresCombinability?.every((row) => row?.includes(pClass));

export const onExpandItem = ({ selected, dispatch }) => {
  const { FareClass, fare, ...payload } = selected;

  if (!fare) return;

  payload.fare = fare;

  dispatch({
    type: srpActions.SET_SELECTED_FARES,
    payload,
  });
};

export const onClickFareType = ({ passengerFare, dispatch }) => {
  dispatch({
    type: srpActions.SET_SELECTED_FARES,
    payload: passengerFare,
  });
};

export const fareTypeUpgradeCard = ({
  selectedFares,
  selectedTripIndex,
  journeyKey,
  pClassList,
}) => {
  const commulativeFares = {};
  const otherFlight = {};
  let totalJourneyAmount = 0;

  const selectedFaresPrices = selectedFares.filter((row) => Boolean(row));
  const selectedFaresCombinability = selectedFaresPrices.map(
    (row) => row.fare.combinabilityData,
  );

  if (selectedFaresPrices.length > 1) {
    selectedFaresPrices.forEach((r, index) => {
      const { fare, passengerFares, destination, origin } = r;

      const isCombinable = isCombinableClass(
        selectedFaresCombinability,
        fare.productClass,
      );
      if (index === selectedTripIndex || isCombinable) return;

      totalJourneyAmount += fare.totalFareAmount;

      passengerFares.forEach((pfare) => {
        if (!Reflect.has(commulativeFares, pfare.pClassList)) {
          commulativeFares[pfare.pClassList] = 0;
        }
        if (r.journeyKey !== journeyKey) {
          const journeyInfo = `${origin}-${destination}-${r.journeyKey}`;

          if (!Reflect.has(otherFlight, journeyInfo)) {
            Reflect.set(otherFlight, journeyInfo, {});
          }

          otherFlight[journeyInfo][pfare.pClassList] = pfare.totalFareAmount;
          otherFlight[journeyInfo][pfare.pClassList] = pfare.totalFareAmount;
        }

        commulativeFares[pfare.pClassList] += pfare.totalFareAmount;
      });
    });
  }

  const totalFirstJourneyAmount = commulativeFares[pClassList] || 0;

  return {
    totalFirstJourneyAmount,
    totalJourneyAmount,
    selectedFaresCombinability,
    otherFlight,
  };
};
