import { categoryCodes } from '../../constants/index';

const getFlatMealFromContextMeals = (contextMeals) => {
  const meals = [];
  for (const tripkey in contextMeals) {
    for (const segmentKey in contextMeals[tripkey]) {
      for (const passengerKey in contextMeals[tripkey][segmentKey]) {
        for (const item in contextMeals[tripkey][segmentKey][passengerKey]) {
          const mealItem =
            contextMeals[tripkey][segmentKey][passengerKey][item];

          meals.push({
            ...mealItem.meal,
            tripkey,
            journeyKey: mealItem.journeyKey,
            segmentKey,
            passengerKey,
            ssrCategory: mealItem.ssrCategory,
            takenSsrKey: mealItem.passengerSSRKey.takenSsrKey,
          });
        }
      }
    }
  }

  return meals;
};

export const removeSoldSsrForTiffinPrimMlst = (
  confirmedMeals,
  takenMeals,
  sellBundlePostData,
) => {
  const cmeals = getFlatMealFromContextMeals(confirmedMeals);
  let tmeals = getFlatMealFromContextMeals(takenMeals);

  const bndrJourneyArry = sellBundlePostData.map((sellBundleItem) => {
    return sellBundleItem.bundleCode === 'BNDR'
      ? sellBundleItem.journeyKey
      : null;
  });

  if (bndrJourneyArry.length) {
    tmeals = tmeals.filter((_tmeal) => {
      const bndrJourney = bndrJourneyArry.find((_bndrJourney) => {
        return _bndrJourney === _tmeal.journeyKey;
      });

      return !bndrJourney;
    });
  }

  if (sellBundlePostData.length) {
    tmeals = tmeals.filter((_tmeal) => {
      const bundledata = sellBundlePostData.find((_bundledata) => {
        return (
          _bundledata.journeyKey === _tmeal.journeyKey &&
          ((_bundledata.bundleCode === categoryCodes.prim &&
            _tmeal.ssrCategory === categoryCodes.mlst) ||
            (_bundledata.bundleCode === categoryCodes.mlst &&
              _tmeal.ssrCategory === categoryCodes.prim))
        );
      });

      return !bundledata;
    });
  }

  return tmeals.filter((tmeal) => {
    const cmeal = cmeals.find(
      (_cmeal) => _cmeal.tripkey === tmeal.tripkey &&
        _cmeal.segmentKey === tmeal.segmentKey &&
        _cmeal.passengerKey === tmeal.passengerKey &&
        _cmeal.ssrCode === tmeal.ssrCode,
    );

    return !cmeal; // do not send meals related to BNDR jorney and bundle change;
  });
};

export default removeSoldSsrForTiffinPrimMlst;
