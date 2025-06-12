import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import AddonSlider from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import uniqBy from 'lodash/uniqBy';
import { createPortal } from 'react-dom';
import PassengerListPrime from './PassengerListPrime';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { categoryCodes, CLASS_PREFIX } from '../../../constants/index';
import eventService from '../../../services/event.service';
import {
  getAddReviewSummaryData,
  getRemoveReviewSummaryData,
} from '../../../functions/mealUtils';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';
import { createEventForAddonModification } from '../../../functions';

// TD: - aem variables
const subTitleData = 123;

const PrimeSliderPane = (props) => {
  const {
    slidePaneData,
    isOpen,
    addonData,
    ssrCategory,
    onClose,
    segmentData,
    passengerDetails,
    configData,
    categoryTitle,
    setShowSuccessPopup,
    sliderPaneConfigData,
  } = props || {};

  const {
    heading = 'Your Departure time is less than 12 hours',
    description,
    ctaLabel = 'Ok',
  } = sliderPaneConfigData?.deptTimePopup || {};

  const buttonProps = {
    title: sliderPaneConfigData?.totalPriceLabel,
    subTitle: '', // TD: - api data  sliderPaneConfigData.saveRecommendationLabel.replace('{amount}', 735),
    buttonTitle: slidePaneData.sliderButtonLabel,
  };

  const { state, dispatch } = React.useContext(AppContext);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const primeDataApiObj = addonData?.availableSSR[0]?.ssrs[0];
  //  TD: - check if toast and popup exist in new desing
  // const [openMadatoryToast, setOpenMadatoryToast] = useState(false);
  // const [popupData, setPopupData] = useState(
  //   slidePaneData?.banner?.servicesInformation,
  // );
  const [isOpenSlider, setOpenSlider] = useState(false);
  const passengerCount = passengerDetails && passengerDetails.length;

  // TD: const isBundleMealAdded = !!state.bundleMeals.length && !!Object.values(state.bundleMeals[0]).length;
  const isBundleMealAdded =
    !!state.bundleMeals?.length &&
    openUpgrade &&
    state.bundleMeals[state.tripIndex] &&
    !!Object.values(state.bundleMeals[state.tripIndex])?.length;

  useEffect(() => {
    if (state.seatAdded[state.tripIndex]?.isSelected && isOpen === true) {
      setOpenUpgrade(true);
      dispatch({
        type: addonActions.SET_BUNDLE_MEALS,
        payload: {
          meals: state.confirmedMeals,
          priceAndCount: state.copyTotalMealsPriceCount,
        },
      });
    } else if (
      !state.seatAdded[state.tripIndex]?.isSelected &&
      isOpen === true
    ) {
      setOpenUpgrade(false);
      dispatch({
        type: addonActions.SET_BUNDLE_MEALS,
        payload: {
          meals: state.confirmedMeals.map((tripMeal, index) => {
            if (index === state.tripIndex) {
              return {};
            }
            return tripMeal;
          }),
          priceAndCount: state.copyTotalMealsPriceCount,
        },
      });
    } else {
      setOpenUpgrade(false);
    }
  }, [isOpen]);

  /* Old Code:
  const togglePopup = (id) => {
    let pd = popupData;
    pd = pd?.map((el) => (el.key === id ? { ...el, flag: !el.flag } : el));
    setPopupData(pd);
  };
  useEffect(() => {
    let pd = popupData;
    pd = pd?.map((el) => ({ ...el, flag: false }));
    setPopupData(pd);
  }, []);
  const departureDateWithPaxCount = () => {
    const dateArray = new Date(segmentData.journeydetail.departure)
      .toDateString()
      .split(' ');

    const adultPaxLength = passengerDetails.filter((pax) => {
      return (
        pax.passengerTypeCode === paxCodes.adult.code &&
        paxCodes.adult.discountCode === null
      );
    }).length;
    const seniorPaxLength = passengerDetails.filter((pax) => {
      return (
        pax.passengerTypeCode === paxCodes.seniorCitizen.code &&
        pax.discountCode === paxCodes.seniorCitizen.discountCode
      );
    }).length;
    const childPaxLength = passengerDetails.filter((pax) => {
      return pax.passengerTypeCode === paxCodes.children.code;
    }).length;
    const infantPaxLength = passengerDetails.filter((pax) => {
      return pax.passengerTypeCode === paxCodes.infant.code;
    }).length;

    return `${dateArray[2]} ${dateArray[1]}, ${dateArray[0]} ${
      adultPaxLength > 0
        ? `${adultPaxLength} ${configData.keyValues.ADT} `
        : ''
    }${
      seniorPaxLength > 0
        ? `${seniorPaxLength} ${configData.keyValues.SRCT} `
        : ''
    }${
      childPaxLength > 0
        ? `${childPaxLength} ${configData.keyValues.CHD} `
        : ''
    }${
      infantPaxLength > 0
        ? `${infantPaxLength} ${configData.keyValues.INFT}`
        : ''
    }`;
  }; */

  const handleAddUpgrade = () => {
    setOpenUpgrade(true);
  };

  // TD: - remove functionality is not there as of now
  // const handleRemoveUpgrade = () => {
  //   dispatch({
  //     type: addonActions.REMOVE_BUNDLE_MEALS,
  //   });
  //   setOpenUpgrade(false);
  // };

  const getRelatedAddonCategoryTitle = () => {
    const categoriesList = [
      ...configData.mainAddonsList,
      ...configData.extaAddonsList,
    ];

    // Old Code: const ffwd = configData?.categoriesList?.find((addon) => {
    const ffwd = categoriesList?.find((addon) => {
      return addon.categoryBundleCode === categoryCodes.ffwd;
    });
    // Old Code: const meal = configData?.categoriesList?.find((addon) => {
    const meal = categoriesList?.find((addon) => {
      return addon.categoryBundleCode === categoryCodes.meal;
    });
    return {
      ffwdCatTitle: ffwd.title,
      mealCatTitle: meal.title,
    };
  };

  const setAddonData = () => {
    let selectedAddonPrimeData = [];

    for (const segmentKey in state.bundleMeals[state.tripIndex]) {
      for (const passengerKey in state.bundleMeals[state.tripIndex][
        segmentKey
      ]) {
        for (const item in state.bundleMeals[state.tripIndex][segmentKey][
          passengerKey
        ]) {
          const selectedAddonItem = {
            addonName: categoryTitle,
            passengerKey:
              state.bundleMeals[state.tripIndex][segmentKey][passengerKey][item]
                .passengerSSRKey.passengerKey,
            ssrKey:
              state.bundleMeals[state.tripIndex][segmentKey][passengerKey][item]
                .passengerSSRKey.ssrKey,
            ssrCode:
              state.bundleMeals[state.tripIndex][segmentKey][passengerKey][item]
                ?.passengerSSRKey?.ssrCode,
          };
          selectedAddonPrimeData.push(selectedAddonItem);
        }
      }
    }

    selectedAddonPrimeData = uniqBy(selectedAddonPrimeData, 'passengerKey');

    let selectedAddonData = {};

    if (
      state.setGetSelectedAddon &&
      state.setGetSelectedAddon[state.tripIndex] &&
      state.setGetSelectedAddon[state.tripIndex].selectedAddone.length > 0
    ) {
      selectedAddonData = { ...state.setGetSelectedAddon };

      const nonPrimeAddonData = selectedAddonData[
        state.tripIndex
      ].selectedAddone.filter((oldAddon) => {
        const relatedAddons = getRelatedAddonCategoryTitle();
        return (
          categoryTitle !== oldAddon.addonName &&
          oldAddon.addonName !== relatedAddons.mealCatTitle &&
          oldAddon.addonName !== relatedAddons.ffwdCatTitle
        );
      });
      selectedAddonData[state.tripIndex].selectedAddone = [
        ...nonPrimeAddonData,
        ...selectedAddonPrimeData,
      ];
    } else {
      selectedAddonData = { ...state.setGetSelectedAddon };
      if (!selectedAddonData[state.tripIndex]) {
        selectedAddonData[state.tripIndex] = [];
      }
      if (!selectedAddonData[state.tripIndex].selectedAddone) {
        selectedAddonData[state.tripIndex].selectedAddone = [];
      }

      selectedAddonPrimeData.forEach((keyObj) => {
        selectedAddonData[state.tripIndex].selectedAddone.push(keyObj);
      });
    }

    dispatch({
      type: addonActions.SET_GET_SELECTED_ADDON,
      payload: selectedAddonData,
    });
  };

  const checkBundleMealSelectedForAllPax = () => {
    let count = 0;
    for (const segment in state.bundleMeals[state.tripIndex]) {
      for (const passenger in state.bundleMeals[state.tripIndex]?.[segment]) {
        if (
          state.bundleMeals[state.tripIndex]?.[segment]?.[passenger]?.length > 0
        ) {
          count +=
            state.bundleMeals[state.tripIndex][segment][passenger].length;
        }
      }
    }

    return count === state.limit * passengerDetails.length;
  };

  const handleDonePRIM = () => {
    if (addonData.availableSSR[0].isMandatory) {
      if (checkBundleMealSelectedForAllPax()) {
        setAddonData();

        let addReviewSummaryData = getAddReviewSummaryData(
          state.bundleMeals,
          categoryTitle,
          ssrCategory,
          addonData.availableBundlePriceByJourney.totalPrice,
          state.underTwelveHourFlight,
          {
            passengerDetails,
            segmentData,
          },
        );

        const removeReviewSummaryData = getRemoveReviewSummaryData(
          state.confirmedMeals,
          state.underTwelveHourFlight,
          {
            segmentData,
            passengerDetails,
            ssrCategory,
          },
        );

        dispatch({
          type: addonActions.SEAT_ADDED,
          payload: true,
        });

        dispatch({
          type: addonActions.SET_CONFIRMED_MEALS,
          payload: {
            // meals: [...state.confirmedMeals, ...state.bundleMeals].filter(function( element ) {
            // return element !== undefined;
            // }),
            meals: state.bundleMeals,
            // count: state.copyTotalMealsCount,
            // price: state.copyTotalMealsPrice,
            priceAndCount: state.copyTotalMealsPriceCount,
          },
        });

        const bundlePassengerKeys = [];
        for (const paxDetails in state.getPassengerDetails) {
          bundlePassengerKeys.push({
            keys: state.getPassengerDetails[paxDetails].passengerKey,
          });
        }

        dispatch({
          type: addonActions.PRIM_BUNDLE_FARE_SELECTED,
          payload: {
            isSelected: true,
            journeyKey: segmentData.journeyKey,
            bundleCode: addonData.categoryBundleCode,
            passengerKeys: bundlePassengerKeys,
            title: addonData.title,
          },
        });

        onClose();
        setShowSuccessPopup(true);
        eventService.update(addReviewSummaryData, removeReviewSummaryData);

        const isPrimePurchased = addonData?.availableSSR?.[0]?.takenssr?.find(
          (sr) => sr.bundleCode === 'PRIM',
        );

        const _price =
          addonData?.availableBundlePriceByJourney?.totalPrice || 0;

        addReviewSummaryData = addReviewSummaryData.map((r) => ({
          ...r,
          actualPrice: isPrimePurchased ? 0 : _price,
        }));

        createEventForAddonModification(
          addReviewSummaryData,
          removeReviewSummaryData,
        );
      } else {
        // TD: - check if toast exist in new design
        // setOpenMadatoryToast(true);
        // setTimeout(() => {
        //   setOpenMadatoryToast(false);
        // }, 5000);
      }
    }
  };

  // TD: - does it exist in new design
  // const identifier = segmentData?.segments?.[0]?.segmentDetails
  //   ?.identifier ?? { carrierCode: '', identifier: '' };

  const onAddHandler = () => {
    if (state.underTwelveHourFlight) {
      return;
    }
    handleAddUpgrade();
    setOpenSlider(true);
  };

  const getFlatMealFromContextMeals = (contextMeals) => {
    const meals = [];
    for (const tripkey in contextMeals) {
      for (const segKey in contextMeals[tripkey]) {
        for (const passengerKey in contextMeals[tripkey][segKey]) {
          for (const item in contextMeals[tripkey][segKey][passengerKey]) {
            const mealItem = contextMeals[tripkey][segKey][passengerKey][item];

            meals.push({
              ...mealItem.meal,
              tripkey,
              journeyKey: mealItem.journeyKey,
              segmentKey: segKey,
              passengerKey,
              ssrCode: mealItem.meal.ssrCode,
              ssrCategory: mealItem.ssrCategory,
              takenSsrKey: mealItem.passengerSSRKey.takenSsrKey,
            });
          }
        }
      }
    }

    return meals;
  };

  const getServiceDetails = (categoryBundleCode) => slidePaneData.servicesIncluded.find(
    (service) => service.categoryBundleCode === categoryBundleCode,
  );

  const eatDetails = getServiceDetails(categoryCodes.meal);
  const fastForwardDetails = getServiceDetails(categoryCodes.ffwd);
  const seatDetails = getServiceDetails(categoryCodes.seat);

  const getDietaryCountAndPreference = () => {
    const meals = getFlatMealFromContextMeals(state.bundleMeals);
    const preferenceCount = {};
    if (meals.length) {
      meals.forEach((meal) => {
        if (meal.preference in preferenceCount) {
          preferenceCount[meal.preference] += 1;
        } else {
          preferenceCount[meal.preference] = 1;
        }
      });
    }
    return Object.entries(preferenceCount).map(([key, value], index) => {
      return index < 1 ? `${value} ${key}` : ` | ${value} ${key}`;
    });
  };

  if (state.underTwelveHourFlight) {
    return createPortal(
      <PopupModalWithContent
        onCloseHandler={() => {}}
        closeButtonIconClass="d-none"
      >
        <div className="sh7">{heading}</div>
        <div
          className="body-small-regular skyplus-addon-mf__modal-content mt-4"
          dangerouslySetInnerHTML={{
            __html:
              description?.html ||
              '<p>Your on-board snack is included in the fare. Meal available will be served from inflight menu.</p>',
          }}
        />
        <div className="skyplus-recommended__dialog-btn mt-12">
          <Button color="primary" size="small" onClick={handleDonePRIM}>
            {ctaLabel}
          </Button>
        </div>
      </PopupModalWithContent>,
      document.body,
    );
  }

  return (
    isOpen && (
      <AddonSlider
        overlayCustomClass=""
        onClose={onClose}
        containerClassName="skyplus-offcanvas__addon-mf"
      >
        <div className={`${CLASS_PREFIX}-prime`}>
          <div className={`${CLASS_PREFIX}-prime__title h0  mt-12`}>
            {slidePaneData.sliderTitle}
          </div>
          <Heading heading="h5" containerClass="mt-6">
            <div
              dangerouslySetInnerHTML={{
                __html: slidePaneData.sliderDescription.html,
              }}
            />
          </Heading>
          <Heading heading="sh5" containerClass="mt-12">
            {sliderPaneConfigData?.amentiesLabel?.replace(
              '{numberOfPax}',
              passengerDetails.length,
            )}
          </Heading>
          <div className={`${CLASS_PREFIX}-prime__meal mt-8`}>
            <div className={`${CLASS_PREFIX}-prime__meal-name`}>
              <div className="sh7">{eatDetails.title}</div>
              <btn type="button" onClick={onAddHandler}>
                <i className="icon-edit" />
              </btn>
            </div>
            <div
              className={`${CLASS_PREFIX}-prime__meal-container ${CLASS_PREFIX}-prime__meal-container${
                isBundleMealAdded ? '--selected' : ''
              } mt-4 `}
            >
              <div className={`${CLASS_PREFIX}-prime__meal-container-left`}>
                <div
                  className={`${CLASS_PREFIX}-prime__meal-container-left-title body-small-regular`}
                >
                  {getFlatMealFromContextMeals(state.bundleMeals).length
                    ? `${
                      getFlatMealFromContextMeals(state.bundleMeals).length
                    } Items Added`
                    : eatDetails.addedItemsLabel}
                </div>

                <div
                  className={`${CLASS_PREFIX}-prime__meal-container-left-sub-title body-small-regular`}
                >
                  {getDietaryCountAndPreference()}
                </div>
              </div>
              {isBundleMealAdded && (
                <div className={`${CLASS_PREFIX}-prime__meal-avatar-container`}>
                  {!!passengerDetails.length &&
                    passengerDetails.map((paxDetail) => {
                      const { first, last } = paxDetail.name || {};
                      const nameAbbr =
                        first && last ? `${first[0]}${last[0]}` : '';
                      return (
                        <div
                          className={`${CLASS_PREFIX}-prime__meal-avatar body-extra-small-regular`}
                          key={nameAbbr}
                        >
                          {nameAbbr}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            <PassengerListPrime
              {...props}
              passengerDetails={passengerDetails}
              bundleTotalPrice={
                addonData.availableBundlePriceByJourney.totalPrice
              }
              isOpenSlider={isOpenSlider}
              setOpenSlider={setOpenSlider}
            />
          </div>

          <div className={`${CLASS_PREFIX}-prime__ff mt-6 p-6`}>
            <div className={`${CLASS_PREFIX}-prime__ff-left-section`}>
              <div className={`${CLASS_PREFIX}-prime__ff-icon me-8`}>
                <i className="icon-caution" />
              </div>
              <div>
                <div className={`${CLASS_PREFIX}-prime__ff-title sh7`}>
                  {fastForwardDetails.title}
                </div>
                <div
                  className={`${CLASS_PREFIX}-prime__ff-subtitle body-small-regular`}
                >
                  {fastForwardDetails.description}
                </div>
              </div>
            </div>
            <div>{passengerCount}&nbsp;x</div>
          </div>

          <div className={`${CLASS_PREFIX}-prime__seat mt-6 p-6`}>
            <div className={`${CLASS_PREFIX}-prime__right-section`}>
              <div
                className={`${CLASS_PREFIX}-prime__seat-text-color body-medium-medium`}
              >
                {seatDetails.title}
              </div>
              <div
                className={`${CLASS_PREFIX}-prime__seat-text-color body-small-regular`}
              >
                {seatDetails.description}
              </div>
            </div>
          </div>

          <OffCanvasFooter
            titleData={addonData.availableBundlePriceByJourney.totalPrice}
            currencycode={addonData.availableBundlePriceByJourney.currencyCode}
            subTitleData={subTitleData}
            onSubmit={handleDonePRIM}
            disabled={!isBundleMealAdded}
            postButtonIcon="icon-accordion-left-24"
            {...buttonProps}
          />
        </div>
      </AddonSlider>
    )
  );
};

PrimeSliderPane.propTypes = {
  addonData: PropTypes.shape({
    availableBundlePriceByJourney: PropTypes.shape({
      currencyCode: PropTypes.any,
      currencycode: PropTypes.any,
      totalPrice: PropTypes.any,
    }),
    availableSSR: PropTypes.any,
    categoryBundleCode: PropTypes.any,
  }),
  categoryTitle: PropTypes.any,
  configData: PropTypes.shape({
    addAddonCtaLabel: PropTypes.string,
    addonAddedCtaLabel: PropTypes.string,
    categoriesList: PropTypes.shape({
      find: PropTypes.func,
    }),
    doneCtaLabel: PropTypes.any,
    keyValues: PropTypes.shape({
      ADT: PropTypes.any,
      CHD: PropTypes.any,
      INFT: PropTypes.any,
      SRCT: PropTypes.any,
    }),
    removeAddonCtaLabel: PropTypes.any,
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  passengerDetails: PropTypes.array,
  segmentData: PropTypes.shape({
    journeyKey: PropTypes.any,
    journeydetail: PropTypes.shape({
      departure: PropTypes.any,
      destination: PropTypes.any,
      origin: PropTypes.string,
    }),
    segments: PropTypes.any,
  }),
  setShowSuccessPopup: PropTypes.func,
  slidePaneData: PropTypes.shape({
    banner: PropTypes.shape({
      pricePerPassengerLabel: PropTypes.any,
      servicesInformation: PropTypes.any,
    }),
    indigoLogo: PropTypes.shape({
      _publishUrl: PropTypes.any,
    }),
    pleaseSelectIncludedSsrDescription: PropTypes.shape({
      html: PropTypes.any,
    }),
    pleaseSelectIncludedSsrLabel: PropTypes.any,
    sliderDescription: PropTypes.shape({
      html: PropTypes.any,
    }),
    sliderTitle: PropTypes.any,
    upgradedToBundleLabel: PropTypes.any,
  }),
  ssrCategory: PropTypes.string,
};

export default PrimeSliderPane;
