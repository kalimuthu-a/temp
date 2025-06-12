import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import flatMap from 'lodash/flatMap';
import omit from 'lodash/omit';
import FastForward from '../../AddonList/FastForward';
// Old Code:
// import { QuickBoard } from "../../AddonList/QuickBoard";
// import Lounge from "../../AddonList/Lounge/Lounge";
// import eventService from '../../../services/event.service';
import { Tiffin } from '../../AddonList/Tiffin';
import GoodNightKit from '../../AddonList/GoodNightKit/GoodNightKit';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import SportsEquipment from '../../AddonList/SportsEquipment/SportsEquipment';
import SeatAndEat from '../../AddonList/SeatAndEat/SeatAndEat';
import Prime from '../../AddonList/Prime';
import Bar from '../../AddonList/Bar/Bar';
import AddOnListMapper from '../../AddonList/AddOnListMapper';
import {
  categoryCodes,
  paxCodes,
  productClassCodes,
  ssrCodes,
} from '../../../constants/index';
import CardSkeleton from './CardSkeleton';
import CardItemsContainer from './CardItemsContainer';
import LostBaggageProtectionMapper from '../../AddonList/LostBaggageProtection/LostBaggageProtectionMapper';
import ExcessBaggageMapper from '../../AddonList/ExcessBaggage/ExcessBaggageMapper';
import AdditionalBaggageMapper from '../../AddonList/AdditionalBaggage/AdditionalBaggageMapper';

const getBundleSSRData = (bundle, tripIndex) => {
  const includedSsrsCPML = bundle?.pricesByJourney[
    tripIndex
  ]?.includedSsrs?.find((ssr) => {
    return ssr.ssrCode === ssrCodes.cpml;
  });

  return flatMap(includedSsrsCPML?.upgradableSsrs?.segments, (item) => {
    return item.segmentSSRs;
  });
};

/**
 * @param {any} getAddonData
 * @param {*} addonsContainer
 * @param {*} sliderPaneConfigData
 * @param {*} tripIndex
 * @param {Array<*>} getPassengerDetails
 * @returns {*[]}
 */

export const getSSRData = (
  getAddonData,
  addonsContainer,
  sliderPaneConfigData,
  tripIndex,
  getPassengerDetails,
) => {
  // Check Condition If any Passenger is above 70 Years --- we hide it "PROT"|"IFNR"
  // const ifAbove70Years = getPassengerDetails.some((passenger) => {
  //   const today = moment();
  //   const age = get(passenger, ['info', 'dateOfBirth'], undefined);
  //   return today.diff(age, 'years') >= 70;
  // });

  // const addonToHidehaveAge = [categoryCodes.ifnr, categoryCodes.prot];

  const journeySSRs = getAddonData?.ssr[tripIndex]?.journeySSRs.filter((journeySSR) => {
    // If age is above than 70 years hide cancellation and travel assistance
    // if (addonToHidehaveAge.includes(journeySSR.category) && ifAbove70Years) {
    //   return false;
    // }

    return (journeySSR?.ssrs && journeySSR?.ssrs.length > 0)
      || (journeySSR?.takenssr && journeySSR?.takenssr?.length > 0);
  }) || [];

  const segmentSSRs = flatMap(getAddonData?.ssr[tripIndex]?.segments, (item) => {
    return item.segmentSSRs.filter(
      (items) => items.category === categoryCodes.meal
        || (items?.ssrs && items?.ssrs.length > 0)
        || (items?.takenssr && items?.takenssr?.length > 0),
    );
  }) || [];

  const bundleData = getAddonData?.bundles;

  const addonSliderData = sliderPaneConfigData?.sliderConfiguration;

  const allSSRs = [...journeySSRs, ...segmentSSRs];
  const journeydetail = getAddonData?.ssr[tripIndex]?.journeydetail;
  // const newComibneAddons = addonsContainer?.categoriesList.map((category) => {
  const categoriesList = [...addonsContainer.mainAddonsList, ...addonsContainer.extaAddonsList];
  const newComibneAddons = categoriesList?.map((category) => {
    const categoryData = category;
    if (
      category.categoryBundleCode === categoryCodes.prim
      || category.categoryBundleCode === categoryCodes.mlst
    ) {
      categoryData.availableSSR = [];

      bundleData.forEach((bundle) => {
        if (bundle.bundleCode === categoryData.categoryBundleCode) {
          categoryData.availableBundlePriceByJourney = omit(
            bundle?.pricesByJourney[tripIndex],
            ['includedSsrs', 'journeyKey'],
          );

          const bundleSSRs = getBundleSSRData(bundle, tripIndex);
          bundleSSRs.forEach((bundleSSR) => {
            category.availableSSR.push(bundleSSR);
          });
        }
      });

      categoryData.availableSlidePaneData = addonSliderData
        .filter((ssr) => {
          return (
            ssr.categoryBundleCode === categoryData.categoryBundleCode
            || ssr.categoryBundleCode === categoryCodes.meal
            || ssr.categoryBundleCode === categoryCodes.ffwd
          );
        }).map((row) => ({ ...categoryData, ...row }));
    } else {
      categoryData.availableSSR = allSSRs.filter((ssr) => {
        return ssr.category === categoryData.categoryBundleCode;
      });

      categoryData.availableSlidePaneData = addonSliderData.filter(
        (ssr) => ssr.categoryBundleCode === categoryData.categoryBundleCode,
      );
    }

    categoryData.journeydetail = journeydetail;

    return categoryData;
  });

  newComibneAddons.sort((a) => {
    if (a.categoryBundleCode === categoryCodes.meal) return -1;
    return 0;
  });

  return newComibneAddons.filter((addon) => addon.availableSSR.length > 0);
};

const CardContainer = ({
  addonsContainer,
  sliderPaneConfigData,
  passengerDetails,
  passengerKey,
  tripId,
  isModifyFlow,
  activeAccordionIndex,
  fareCategory,
}) => {
  /**
   * @type {[null|Array<*>, React.Dispatch<React.SetStateAction<null|Array<*>>>]}
   */
  const [combineAddonsData, setCombineAddonsData] = React.useState(null);

  /**
   * @type {[{productClass?: string}, React.Dispatch<React.SetStateAction<{productClass: string}>>]}
   */
  const [fareDetails, setfareDetails] = React.useState({});

  /**
   * @type {React.Ref<HTMLDivElement>}
   */
  const containerRef = useRef();
  const {
    state: {
      tripIndex,
      paxIndex,
      getPassengerDetails,
      setAddonIsLoading,
      getAddonData,
      page,
      istravelAssistanceAddedFromPE,
      isAddonNextFare,
      ...state
    },
    dispatch,
  } = React.useContext(AppContext);

  const loyaltyData = getAddonData?.Loyalty?.discount?.[0] || 0;

  const checkFlightUnderTwelveHour = (data) => {
    let lessThan12HrFlight = false;

    data.forEach((addonDetails) => {
      if (addonDetails.categoryBundleCode === categoryCodes.meal) {
        const ssrExists = addonDetails.availableSSR.some((eachSsr) => {
          return eachSsr.ssrs.length > 0;
        });

        if (!ssrExists) {
          lessThan12HrFlight = true;
        }
      }
    });

    if (lessThan12HrFlight) {
      dispatch({
        type: addonActions.UNDER_TWELVE_HOUR_FLIGHT,
        payload: true,
      });
    } else {
      dispatch({
        type: addonActions.UNDER_TWELVE_HOUR_FLIGHT,
        payload: false,
      });
    }
  };

  const getFareTypeDetails = () => {
    // TD: - getting this empty
    return addonsContainer?.fareType?.find(
      (fare) => {
        return (
          fare?.productClass === getAddonData?.ssr[tripIndex]?.productClass
        );
      },
    );
  };

  React.useEffect(() => {
    // if no data found
    if (getAddonData?.Passengers?.length === 0) {
      setCombineAddonsData([]);
    } else if (getAddonData !== undefined) {
      const newComibneAddons = getSSRData(
        getAddonData,
        addonsContainer,
        sliderPaneConfigData,
        tripIndex,
        getPassengerDetails,
        // istravelAssistanceAddedFromPE,
      );
      setCombineAddonsData(newComibneAddons);
      setfareDetails(getFareTypeDetails());
      checkFlightUnderTwelveHour(newComibneAddons);
    }
  }, [getAddonData, tripIndex, getPassengerDetails]);

  useEffect(() => {
    // scroll container
    const elementPosition = containerRef.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.screenY - 60;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // TD:: Santhosh => Moved to AddonContainer
    // return () => {
    //   eventService.reset();
    //   dispatch({ type: addonActions.UNMOUNT_ADDONCONTAINER });
    // };
  }, []);

  const isRecommendedAddon = (addon) => fareCategory.some((fCategory) => fCategory.categoryBundleCode === addon);

  const showAvilableAddons = (
    ssrCategory,
    addonData,
    paxIndexValue,
    passengerKeys,
  ) => {
    const recommendedAddon = isRecommendedAddon(ssrCategory);
    if (recommendedAddon) return null;

    const key = `${tripId}_${passengerKey}_${ssrCategory}`;
    switch (ssrCategory) {
      case categoryCodes.ffwd:
        return (
          <div
            className="skyplus-addon-mf__addon-item fast-forward-addon"
            key={key}
          >
            <FastForward
              segmentData={getAddonData?.ssr[tripIndex]}
              addonData={addonData}
              configData={addonsContainer}
              ssrCategory={ssrCategory}
              passengerDetails={passengerDetails}
              paxIndex={paxIndexValue}
              passengerKey={passengerKeys}
              tripId={tripId}
              key={key}
              sliderPaneConfigData={sliderPaneConfigData}
              loyaltyData={loyaltyData}
            />
          </div>
        );

      case categoryCodes.prbg:
        /* TD:
          return (
            <div
                className="skyplus-addon-mf__addon-item"
                key={key}
              >
                <QuickBoard
                segmentData={getAddonData?.ssr[tripIndex]}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={ssrCategory}
                passengerDetails={passengerDetails}
                paxIndex={paxIndex}
                passengerKey={passengerKey}
                tripId={tripId}
                sliderPaneConfigData={sliderPaneConfigData}
              />
                QuickBoard
              </div>
          ); */
        return null;

      case categoryCodes.speq:
        return (
          <div
            className="skyplus-addon-mf__addon-item sports-equipment-addon"
            key={key}
          >
            <SportsEquipment
              segmentData={getAddonData?.ssr[tripIndex]}
              addonData={addonData}
              configData={addonsContainer}
              ssrCategory={ssrCategory}
              passengerDetails={passengerDetails}
              paxIndex={paxIndex}
              passengerKey={passengerKey}
              tripId={tripId}
              isModifyFlow={isModifyFlow}
              sliderPaneConfigData={sliderPaneConfigData}
            />
          </div>
        );

      case categoryCodes.bar:
        return (
          passengerDetails
          && passengerDetails[paxIndex[tripIndex]?.paxIndex] &&
          passengerDetails[paxIndex[tripIndex]?.paxIndex]
            ?.passengerTypeCode !== paxCodes.children.code &&
          passengerDetails[paxIndex[tripIndex]?.paxIndex]
            ?.passengerTypeCode !== paxCodes.infant.code && (
            <div
              className="skyplus-addon-mf__addon-item"
              key={key}
            >
              <Bar
                segmentData={getAddonData?.ssr[tripIndex]}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={ssrCategory}
                passengerDetails={passengerDetails}
                paxIndex={paxIndex}
                passengerKey={passengerKey}
                tripId={tripId}
                isModifyFlow={isModifyFlow}
                sliderPaneConfigData={sliderPaneConfigData}
              />
            </div>
          )
        );

      case categoryCodes.lounge:
        /* TD:
          return (
            <div
              className="skyplus-addon-mf__addon-item"
              key={key}
            >
              <Lounge
                segmentData={getAddonData?.ssr[tripIndex]}
                passengerDetails={passengerDetails}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={ssrCategory}
                paxIndex={paxIndex}
                passengerKey={passengerKey}
                tripId={tripId}
                isModifyFlow={isModifyFlow}
                sliderPaneConfigData={sliderPaneConfigData}
              />
              Lounge
            </div>
          ); */
        return null;

      case categoryCodes.goodNight:
        return (
          <div
            className="skyplus-addon-mf__addon-item"
            key={key}
          >
            <GoodNightKit
              segmentData={getAddonData?.ssr[tripIndex]}
              passengerDetails={passengerDetails}
              addonData={addonData}
              configData={addonsContainer}
              ssrCategory={ssrCategory}
              paxIndex={paxIndex}
              passengerKey={passengerKey}
              tripId={tripId}
              isModifyFlow={isModifyFlow}
              sliderPaneConfigData={sliderPaneConfigData}
            />
          </div>
        );

      case categoryCodes.meal: {
        // Checks if atleast one segment has ssr
        const ssrExists = addonData.availableSSR.some((eachSsr) => {
          return eachSsr.ssrs.length > 0;
        });
        if (
          ssrExists
          || (state.underTwelveHourFlight
            && state.flexiPlusSuper6ECorpFareForMeal)
          || (state.underTwelveHourFlight
            && state.mlstBundleFare[tripIndex]?.isSelected)
          || (state.underTwelveHourFlight
            && state.primBundleFare[tripIndex]?.isSelected)
        ) {
          return (
            <div
              className="skyplus-addon-mf__addon-item sixetiffin-addon"
              key={key}
            >
              <Tiffin
                segmentData={getAddonData?.ssr[tripIndex]}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={ssrCategory}
                passengerKey={passengerKey}
                passengerDetails={passengerDetails}
                tripId={tripId}
                key={`${passengerKey}_${tripIndex}`}
                selectedPax={passengerDetails[paxIndex[tripIndex].paxIndex]}
                fareDetails={fareDetails}
                isModifyFlow={isModifyFlow}
                sliderPaneConfigData={sliderPaneConfigData}
                activeAccordionIndex={activeAccordionIndex}
              />
            </div>
          );
        }
        return null;
      }

      case categoryCodes.prim:
        if (!state.mlstBundleFare[tripIndex]?.isSelected) {
          return (
            <div
              className="skyplus-addon-mf__addon-item PRIM"
              key={key}
            >
              <Prime
                segmentData={getAddonData?.ssr[tripIndex]}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={ssrCategory}
                passengerKey={passengerKey}
                passengerDetails={passengerDetails}
                tripId={tripId}
                key={`${passengerKey}_${tripIndex}`}
                selectedPax={passengerDetails[paxIndex[tripIndex].paxIndex]}
                fareDetails={fareDetails}
                isModifyFlow={isModifyFlow}
                sliderPaneConfigData={sliderPaneConfigData}
              />
            </div>
          );
        }
        return null;

      case categoryCodes.mlst:
        if (!state.primBundleFare[tripIndex]?.isSelected) {
          return (
            <div
              className="skyplus-addon-mf__addon-item"
              key={key}
            >
              <SeatAndEat
                segmentData={getAddonData?.ssr[tripIndex]}
                addonData={addonData}
                configData={addonsContainer}
                ssrCategory={ssrCategory}
                passengerKey={passengerKey}
                passengerDetails={passengerDetails}
                tripId={tripId}
                key={`${passengerKey}_${tripIndex}`}
                selectedPax={passengerDetails[paxIndex[tripIndex].paxIndex]}
                fareDetails={fareDetails}
                isModifyFlow={isModifyFlow}
                sliderPaneConfigData={sliderPaneConfigData}
              />
            </div>
          );
        }
        return null;

      case categoryCodes.brb: {
        return (
          <LostBaggageProtectionMapper
            ssrCategory={ssrCategory}
            addonData={addonData}
            configData={addonsContainer}
            passengerDetails={passengerDetails}
            paxIndex={paxIndex}
            passengerKey={passengerKey}
            tripId={tripId}
            segmentData={getAddonData?.ssr[tripIndex]}
            key={key}
            sliderPaneConfigData={sliderPaneConfigData}
          />
        );
      }

      case categoryCodes.baggage: {
        return (
          <ExcessBaggageMapper
            ssrCategory={ssrCategory}
            addonData={addonData}
            configData={addonsContainer}
            passengerDetails={passengerDetails}
            paxIndex={paxIndex}
            passengerKey={passengerKey}
            tripId={tripId}
            segmentData={getAddonData?.ssr[tripIndex]}
            key={key}
            sliderPaneConfigData={sliderPaneConfigData}
            loyaltyData={loyaltyData}
          />
        );
      }

      case categoryCodes.abhf: {
        return (
          <AdditionalBaggageMapper
            ssrCategory={ssrCategory}
            addonData={addonData}
            configData={addonsContainer}
            passengerDetails={passengerDetails}
            paxIndex={paxIndex}
            passengerKey={passengerKey}
            tripId={tripId}
            segmentData={getAddonData?.ssr[tripIndex]}
            key={key}
            sliderPaneConfigData={sliderPaneConfigData}
          />
        );
      }

      case categoryCodes.prot:
      case categoryCodes.ifnr: {
        return (
          <AddOnListMapper
            ssrCategory={ssrCategory}
            addonData={addonData}
            configData={addonsContainer}
            passengerDetails={passengerDetails}
            paxIndex={paxIndex}
            passengerKey={passengerKey}
            tripId={tripId}
            segmentData={getAddonData?.ssr[tripIndex]}
            key={key}
            sliderPaneConfigData={sliderPaneConfigData}
            isRecommended={false}
            isModifyFlow={isModifyFlow}
          />
        );
      }
      default:
        return null;
    }
  };

  const setFlexiPlusSuper6ECorpFareForMeal = () => {
    if (
      fareDetails?.productClass === productClassCodes.flexi
      || fareDetails?.productClass === productClassCodes.corp
      || fareDetails?.productClass === productClassCodes.super6e
    ) {
      dispatch({
        type: addonActions.FLEXIPLUS_SUPER6E_CORP_FARE_FOR_MEAL,
        payload: true,
      });
    }
  };

  React.useEffect(() => {
    setFlexiPlusSuper6ECorpFareForMeal();
  }, [fareDetails]);

  const eatsAddonElements = combineAddonsData?.map((addonDetails) => {
    const ssrCategory = addonDetails?.categoryBundleCode;

    return ssrCategory === categoryCodes.meal ? showAvilableAddons(
      ssrCategory,
      addonDetails,
      paxIndex,
      passengerKey,
    ) : null;
  });

  const excessBaggageAddonElements = combineAddonsData?.map((addonDetails) => {
    const ssrCategory = addonDetails?.categoryBundleCode;

    return ssrCategory === categoryCodes.baggage ? showAvilableAddons(
      ssrCategory,
      addonDetails,
      paxIndex,
      passengerKey,
    ) : null;
  });

  const otherBaggageAddonElements = combineAddonsData?.map((addonDetails) => {
    const ssrCategory = addonDetails?.categoryBundleCode;
    return ssrCategory === categoryCodes.abhf || ssrCategory === categoryCodes.speq ||
    ssrCategory === categoryCodes.brb ?
      showAvilableAddons(
        ssrCategory,
        addonDetails,
        paxIndex,
        passengerKey,
      ) : null;
  });

  /* TD: Code for Bundle Addon's
  const bundleAddonElements = combineAddonsData?.map((addonDetails) => {
    const ssrCategory = addonDetails?.categoryBundleCode;

    return ssrCategory === categoryCodes.prim || ssrCategory === categoryCodes.mlst ? showAvilableAddons(
      ssrCategory,
      addonDetails,
      paxIndex,
      passengerKey,
    ) : null;
  }); */

  const moreAddonElements = combineAddonsData?.map((addonDetails) => {
    const ssrCategory = addonDetails?.categoryBundleCode;

    return (ssrCategory !== categoryCodes.meal &&
      ssrCategory !== categoryCodes.baggage &&
      ssrCategory !== categoryCodes.abhf &&
      ssrCategory !== categoryCodes.brb &&
      ssrCategory !== categoryCodes.speq &&
      ssrCategory !== categoryCodes.prim && ssrCategory !== categoryCodes.mlst) ? showAvilableAddons(
        ssrCategory,
        addonDetails,
        paxIndex,
        passengerKey,
      ) : null;
  });

  const isAddonCardAvailable = (elements) => {
    let isAvailable = false;
    elements?.forEach((element) => {
      if (element !== null) isAvailable = true;
    });
    return isAvailable;
  };

  return (
    <div className="skyplus-addon-mf__addon-card-container" ref={containerRef}>
      {setAddonIsLoading && <CardSkeleton />}
      {combineAddonsData && (
        <CardItemsContainer addonsContainer={addonsContainer} page={page}>
          {isAddonCardAvailable(eatsAddonElements) && (
            <div className="skyplus-addon-mf__addon-group">
              <div className="skyplus-addon-mf__addon-list">
                {eatsAddonElements}
              </div>
            </div>
          )}
          {isAddonCardAvailable(excessBaggageAddonElements) && (
            <div className="skyplus-addon-mf__addon-group">
              <div className="skyplus-addon-mf__addon-list">
                {excessBaggageAddonElements}
              </div>
            </div>
          )}
          {isAddonCardAvailable(otherBaggageAddonElements) && (
            <div className="skyplus-addon-mf__addon-group skyplus-addon-mf__addon-group--3">
              <div className="skyplus-addon-mf__addon-list">
                {otherBaggageAddonElements}
              </div>
            </div>
          )}
          {/* TD: Code for Bundle Addon's
          {isAddonCardAvailable(bundleAddonElements) && (
          <div className="skyplus-addon-mf__addon-group skyplus-addon-mf__addon-group--2">
            <h3 className="skyplus-addon-mf__addon-group-title">6E Bundle Addons</h3>
            <div className="skyplus-addon-mf__addon-list">
              {bundleAddonElements}
            </div>
          </div>
          )} */}
          {isAddonCardAvailable(moreAddonElements) && (
            <div className="skyplus-addon-mf__addon-group skyplus-addon-mf__addon-group--4">
              <h3 className="skyplus-addon-mf__addon-group-title mb-6">{addonsContainer?.moreAddonsLabel}</h3>
              <div className="skyplus-addon-mf__addon-list">
                {moreAddonElements}
              </div>
            </div>
          )}
        </CardItemsContainer>
      )}
    </div>
  );
};

CardContainer.propTypes = {
  isModifyFlow: PropTypes.string,
  addonsContainer: PropTypes.any,
  sliderPaneConfigData: PropTypes.any,
  passengerDetails: PropTypes.any,
  passengerKey: PropTypes.any,
  tripId: PropTypes.any,
  activeAccordionIndex: PropTypes.number,
  fareCategory: PropTypes.object,
};

export default CardContainer;
