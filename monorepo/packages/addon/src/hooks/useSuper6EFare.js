import { useEffect, useContext } from 'react';

import get from 'lodash/get';
import { AppContext } from '../context/AppContext';
import { addonActions } from '../store/addonActions';
import { categoryCodes } from '../constants/index';

import { newAddonData } from '../functions/utils';
import eventService from '../services/event.service';
import SSRObject from '../models/SSRObject';

/**
 *
 * A react hook to prerender server side addon.
 *
 * @description
 *
 */
const useSuper6EFare = () => {
  let {
    state: {
      containerConfigData,
      getPassengerDetails,
      setGetSelectedAddon,
      categories,
      istravelAssistanceAddedFromPE,
      ...state
    },
    dispatch,
  } = useContext(AppContext);

  const getAddonData = state.getAddonData || [];
  let newSelectedAddonData = [];

  useEffect(() => {
    if (
      getAddonData.length === 0 ||
      getAddonData?.Passengers.length === 0 ||
      getAddonData?.ssr.length === 0
    ) {
      return;
    }

    const segmentCatToCheck = [
      categoryCodes.meal,
      categoryCodes.goodNight,
      categoryCodes.lounge,
      categoryCodes.bar,
    ];

    const categoriesToCheck = [
      categoryCodes.ifnr,
      categoryCodes.brb,
      categoryCodes.baggage,
      categoryCodes.prot,
      categoryCodes.abhf,
      categoryCodes.ffwd,
      categoryCodes.prbg,
      categoryCodes.speq,
    ];

    let sliderConfiguration = [];

    try {
      const mfData = containerConfigData?.mfData?.data?.addOnsMainByPath?.item;

      // Old Code:
      // sliderConfiguration = mfData.categoriesList;
      const categoriesList = [...mfData.mainAddonsList, ...mfData.extaAddonsList];
      sliderConfiguration = categoriesList;
    } catch (error) {
      // intentional
    }

    const itemsConfiguration = get(
      containerConfigData,
      'configJson.data.addonAdditionalByPath.item.sliderConfiguration',
      [],
    );
    // get journies for SSRObject
    SSRObject.prototype.setJournies(getAddonData.ssr, itemsConfiguration);

    getAddonData.ssr.forEach((_ssr, index) => {
      const { journeyKey } = _ssr;
      const journeySSRs = _ssr.journeySSRs.filter((_s) => {
        const takenssr = _s?.takenssr || [];
        const category = _s?.category ?? '';


        return categoriesToCheck.includes(category) && takenssr?.length > 0;
      });

      const ssrCategories = [];

      _ssr.segments.forEach((_s) => {
        const { segmentSSRs, segmentKey } = _s;
        const segments = segmentSSRs.filter((_s) => {
          const takenssr = _s?.takenssr || [];
          return (
            segmentCatToCheck.includes(_s?.category) && takenssr?.length > 0
          );
        });

        const otherMeta = {
          segmentKey,
          bundles: getAddonData.bundles,
          itemsConfiguration,
        };

        const extractedData = _extractSSRData(
          segments,
          sliderConfiguration,
          getPassengerDetails,
          journeyKey,
          newSelectedAddonData,
          otherMeta,
        );
        ssrCategories.push(...extractedData.categories);
        newSelectedAddonData = extractedData.addonData;
      });

      const otherMeta = {
        segmentKey: '',
        bundles: getAddonData.bundles,
        itemsConfiguration,
      };

      const extractedData = _extractSSRData(
        journeySSRs,
        sliderConfiguration,
        getPassengerDetails,
        journeyKey,
        newSelectedAddonData,
        otherMeta,
      );
      ssrCategories.push(...extractedData.categories);
      newSelectedAddonData = extractedData.addonData;

      setGetSelectedAddon = newAddonData(
        setGetSelectedAddon,
        ssrCategories,
        [index],
        newSelectedAddonData,
      );
    });

    eventService.updateReviewSummary();

    dispatch({
      type: addonActions.SET_CONTEXT_AT_MOUNT_ONLY,
      payload: {
        setGetSelectedAddon,
      },
    });
  }, [getAddonData]);
};

/**
 *
 * @param {*} ssrs
 * @param {*} sliderConfiguration
 * @param {*} passengerDetails
 * @param {*} journeyKey
 * @param {*} addonData
 * @param {{segmentKey: null|string, bundles: Array<*>, itemsConfiguration: Array<*>}} otherMeta
 * @returns {{categories: Array<string>, addonData: *}}
 */
const _extractSSRData = (
  ssrs,
  sliderConfiguration,
  passengerDetails,
  journeyKey,
  addonData,
  otherMeta,
) => {
  const ssrCategories = [];
  addonData = addonData.filter((row) => row.journeyKey === journeyKey);

  const includedBundleCodes = [categoryCodes.prim, categoryCodes.mlst];

  ssrs?.forEach((ssr) => {
    const { category } = ssr;

    const addOnCategory = sliderConfiguration.find(
      (cat) => cat.categoryBundleCode === category,
    );

    if (addOnCategory) {
      ssrCategories.push(addOnCategory.title);
      passengerDetails.forEach((passenger) => {
        const takenSsrsFound = ssr.takenssr?.filter(
          (item) => item.passengerKey === passenger.passengerKey,
        );

        takenSsrsFound.forEach((takenSsrFound) => {
          const { ssrCode, name, price, canBeRemoved, takenCount, bundleCode } =
            takenSsrFound;
          const includedWithBundle = false;

          if (includedBundleCodes.includes(bundleCode)) {
            if (category === categoryCodes.meal) {
              const bundle = otherMeta.bundles.find(
                (row) => row.bundleCode === bundleCode,
              );

              if (bundle) {
                const canBeRemoved = get(
                  bundle,
                  'pricesByJourney.0.canBeRemoved',
                );
                const totalPrice = get(bundle, 'pricesByJourney.0.totalPrice');

                const bundleCategory = sliderConfiguration.find(
                  (cat) => cat.categoryBundleCode === bundleCode,
                );

                addonData.push({
                  passengerKey: passenger?.passengerKey,
                  addonName: bundleCategory.title,
                  journeyKey,
                  multiplier: takenCount,
                  ssrCode: bundleCode,
                  name: bundleCategory.title,
                  price: totalPrice,
                  category: bundleCode,
                  canBeRemoved,
                  segmentKey: otherMeta.segmentKey,
                });
              }
            }
            /* If have bundleCode then no need to add ssr object */
            return;
          }

          addonData.push({
            passengerKey: passenger?.passengerKey,
            addonName: addOnCategory.title,
            journeyKey,
            multiplier: takenCount,
            ssrCode,
            name,
            price,
            category,
            canBeRemoved,
            segmentKey: otherMeta.segmentKey,
            includedWithBundle,
          });
        });
      });
    }
  });

  return { categories: ssrCategories, addonData };
};

export default useSuper6EFare;
