import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import uniqBy from 'lodash/uniqBy';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import AddonSlider from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import PassengerList from '../Prime/PassengerListPrime';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import {
  categoryCodes,
  // paxCodes,
  CLASS_PREFIX,
} from '../../../constants/index';
import eventService from '../../../services/event.service';
import {
  getAddReviewSummaryData,
  getRemoveReviewSummaryData,
} from '../../../functions/mealUtils';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';
import { createEventForAddonModification } from '../../../functions';

const SeatAndEatSlidePane = (props) => {
  const {
    slidePaneData,
    isOpen,
    segmentData,
    passengerDetails,
    configData,
    addonData,
    categoryTitle,
    ssrCategory,
    onClose,
    setShowSuccessPopup,
    // setOpenMadatoryToast,
    sliderPaneConfigData,
  } = props || {};
  const [isOpenSlider, setOpenSlider] = useState(false);
  const { state, dispatch } = React.useContext(AppContext);
  // Old Code:
  // const [openUpgrade, setOpenUpgrade] = useState(false);

  const [popupData, setPopupData] = useState(
    slidePaneData?.banner?.servicesInformation,
  );

  const {
    heading = 'Your Departure time is less than 12 hours',
    description,
    ctaLabel = 'Ok',
  } = sliderPaneConfigData?.deptTimePopup || {};

  const isBundleMealAdded =
    !!state.bundleMeals.length &&
    state.bundleMeals[state.tripIndex] &&
    !!Object.values(state.bundleMeals[state.tripIndex])?.length;

  useEffect(() => {
    if (state.seatAdded[state.tripIndex]?.isSelected && isOpen === true) {
      // Old Code:
      // setOpenUpgrade(true);
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
      // Old Code:
      // setOpenUpgrade(false);
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
      // Old Code:
      // setOpenUpgrade(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let pd = popupData;
    pd = pd?.map((el) => ({ ...el, flag: false }));
    setPopupData(pd);
  }, []);

  /* Old Code:
  const [openMadatoryToast, setOpenMadatoryToast] = useState(false);
  const togglePopup = (id) => {
    let pd = popupData;
    pd = pd?.map((el) => (el.key === id ? { ...el, flag: !el.flag } : el));
    setPopupData(pd);
  };
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
  };
  const handleAddUpgrade = () => {
    setOpenUpgrade(true);
  };
  const handleRemoveUpgrade = () => {
    dispatch({
      type: addonActions.REMOVE_BUNDLE_MEALS,
    });
    setOpenUpgrade(false);
  };
  const identifier = props?.segmentData?.segments?.[0]?.segmentDetails
  ?.identifier ?? { carrierCode: '', identifier: '' }; */

  const getRelatedAddonCategoryTitle = () => {
    const categoriesList = [
      ...configData.mainAddonsList,
      ...configData.extaAddonsList,
    ];

    // Old Code: const meal = configData?.categoriesList?.find((addon) => {
    const meal = categoriesList?.find((addon) => {
      return addon.categoryBundleCode === categoryCodes.meal;
    });
    return meal.title;
  };

  const setAddonData = () => {
    let selectedAddonSeatEatData = [];

    for (const segmentKey in state.bundleMeals[state.tripIndex]) {
      if (segmentKey) {
        for (const passengerKey in state.bundleMeals[state.tripIndex][
          segmentKey
        ]) {
          if (passengerKey) {
            for (const item in state.bundleMeals[state.tripIndex][segmentKey][
              passengerKey
            ]) {
              if (item) {
                const selectedAddonItem = {
                  addonName: categoryTitle,
                  passengerKey:
                    state.bundleMeals[state.tripIndex][segmentKey][
                      passengerKey
                    ][item]?.passengerSSRKey?.passengerKey,
                  ssrKey:
                    state.bundleMeals[state.tripIndex][segmentKey][
                      passengerKey
                    ][item].passengerSSRKey.ssrKey,
                  ssrCode:
                    state.bundleMeals[state.tripIndex][segmentKey][
                      passengerKey
                    ][item]?.meal?.ssrCode,
                };
                selectedAddonSeatEatData.push(selectedAddonItem);
              }
            }
          }
        }
      }
    }

    selectedAddonSeatEatData = uniqBy(selectedAddonSeatEatData, 'passengerKey');

    let selectedAddonData = {};

    if (
      state.setGetSelectedAddon &&
      state.setGetSelectedAddon[state.tripIndex] &&
      state.setGetSelectedAddon[state.tripIndex].selectedAddone.length > 0
    ) {
      selectedAddonData = { ...state.setGetSelectedAddon };

      const nonSeatEatAddonData = selectedAddonData[
        state.tripIndex
      ].selectedAddone.filter((oldAddon) => {
        return (
          categoryTitle !== oldAddon.addonName &&
          oldAddon.addonName !== getRelatedAddonCategoryTitle()
        );
      });
      selectedAddonData[state.tripIndex].selectedAddone = [
        ...nonSeatEatAddonData,
        ...selectedAddonSeatEatData,
      ];
    } else {
      selectedAddonData = { ...state.setGetSelectedAddon };
      if (!selectedAddonData[state.tripIndex]) {
        selectedAddonData[state.tripIndex] = [];
      }
      if (!selectedAddonData[state.tripIndex].selectedAddone) {
        selectedAddonData[state.tripIndex].selectedAddone = [];
      }

      selectedAddonSeatEatData.forEach((keyObj) => {
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
      if (segment) {
        for (const passenger in state.bundleMeals[state.tripIndex]?.[segment]) {
          if (
            state.bundleMeals[state.tripIndex]?.[segment]?.[passenger]?.length >
            0
          ) {
            count +=
              state.bundleMeals[state.tripIndex][segment][passenger].length;
          }
        }
      }
    }
    return count === state.limit * passengerDetails.length;
  };

  const handleDoneMLST = () => {
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
            meals: state.bundleMeals,
            // count: state.copyTotalMealsCount,
            // price: state.copyTotalMealsPrice,
            priceAndCount: state.copyTotalMealsPriceCount,
          },
        });

        const bundlePassengerKeys = [];
        for (const paxDetails in state.getPassengerDetails) {
          if (paxDetails) {
            bundlePassengerKeys.push({
              keys: state.getPassengerDetails[paxDetails].passengerKey,
            });
          }
        }

        dispatch({
          type: addonActions.MLST_BUNDLE_FARE_SELECTED,
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

        const isAlreadyPurchased = addonData?.availableSSR?.[0]?.takenssr?.find(
          (sr) => sr.bundleCode === 'MLST',
        );

        const _price =
          addonData?.availableBundlePriceByJourney?.totalPrice || 0;

        addReviewSummaryData = addReviewSummaryData.map((r) => ({
          ...r,
          actualPrice: isAlreadyPurchased ? 0 : _price,
        }));

        eventService.update(addReviewSummaryData, removeReviewSummaryData); // Add
        createEventForAddonModification(
          addReviewSummaryData,
          removeReviewSummaryData,
        );
      } else {
        /* Old Code:
        setOpenMadatoryToast(true);
        setTimeout(() => {
          setOpenMadatoryToast(false);
        }, 5000); */
      }
    }
  };

  const toggleTiffinSlidPane = () => {
    if (state.underTwelveHourFlight) {
      return;
    }
    setOpenSlider(!isOpenSlider);
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

  const getServiceDetails = (categoryBundleCode) => slidePaneData.servicesIncluded.find(
    (service) => service.categoryBundleCode === categoryBundleCode,
  );

  const eatDetails = getServiceDetails(categoryCodes.meal);
  const seatDetails = getServiceDetails(categoryCodes.seat);

  const buttonProps = {
    title: sliderPaneConfigData?.totalPriceLabel,
    subTitle: '', // TD: - API data -  sliderPaneConfigData.saveRecommendationLabel.replace('{amount}', 735),
    buttonTitle: slidePaneData?.sliderButtonLabel,
    subTitleData: 123, // TD: API data
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
          <Button color="primary" size="small" onClick={handleDoneMLST}>
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
        modalCustomClass={`${CLASS_PREFIX}-seat-eat-slide-pane`}
        onClose={onClose}
        containerClassName="skyplus-offcanvas__addon-mf"
      >
        <div className={`${CLASS_PREFIX}-seat-eat mt-12`}>
          <div className={`${CLASS_PREFIX}-seat-eat__title h0`}>
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
          <div className={`${CLASS_PREFIX}-seat-eat__meal mt-6`}>
            <div className={`${CLASS_PREFIX}-seat-eat__meal-name`}>
              <div className="sh7">{eatDetails.title}</div>
              <button
                type="button"
                aria-label="open-tiffin"
                onClick={toggleTiffinSlidPane}
              >
                <i className="icon-edit" />
              </button>
            </div>
            <div
              className={`${CLASS_PREFIX}-seat-eat__meal-container ${CLASS_PREFIX}-seat-eat__meal-container${
                isBundleMealAdded ? '--selected' : ''
              } mt-4 `}
            >
              <div className={`${CLASS_PREFIX}-seat-eat__meal-container-left`}>
                <div
                  className={`${CLASS_PREFIX}-seat-eat__meal-container-left-title body-small-regular`}
                >
                  {getFlatMealFromContextMeals(state.bundleMeals).length
                    ? `${
                      getFlatMealFromContextMeals(state.bundleMeals).length
                    } Items Added`
                    : eatDetails.addedItemsLabel}
                </div>
                <div
                  className={`${CLASS_PREFIX}-seat-eat__meal-container-left-sub-title body-small-regular`}
                >
                  {getDietaryCountAndPreference()}
                </div>
              </div>
              {isBundleMealAdded && (
                <div className={`${CLASS_PREFIX}-prime__meal-avatar-container`}>
                  {!!passengerDetails.length &&
                    passengerDetails.map((paxDetail) => {
                      const { first, last } = paxDetail?.name || {};
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
            <PassengerList
              {...props}
              passengerDetails={passengerDetails}
              bundleTotalPrice={
                addonData.availableBundlePriceByJourney.totalPrice
              }
              isOpenSlider={isOpenSlider}
              setOpenSlider={setOpenSlider}
            />
          </div>

          <div className={`${CLASS_PREFIX}-seat-eat__seat mt-6 p-6`}>
            <div className={`${CLASS_PREFIX}-seat-eat__seat-right-section`}>
              <div
                className={`${CLASS_PREFIX}-seat-eat__seat-text-color body-medium-medium`}
              >
                {seatDetails.title}
              </div>
              <div
                className={`${CLASS_PREFIX}-seat-eat__seat-text-color body-small-regular`}
              >
                {seatDetails.description}
              </div>
            </div>
          </div>
          <OffCanvasFooter
            titleData={addonData.availableBundlePriceByJourney.totalPrice}
            currencycode={addonData.availableBundlePriceByJourney.currencyCode}
            onSubmit={handleDoneMLST}
            disabled={!isBundleMealAdded}
            postButtonIcon="icon-accordion-left-24"
            {...buttonProps}
          />

          {/* Old Code: <div className={`${CLASS_PREFIX}-seat-eat__flight`}>
            <div className={`${CLASS_PREFIX}-seat-eat__flight-logo`}>
              <div
                className={`${CLASS_PREFIX}-seat-eat__flight-logo-container`}
              >
                <img src={props.slidePaneData?.indigoLogo._path} alt="flight" />
                <span>{`${identifier.carrierCode} ${identifier.identifier}`}</span>
              </div>
              <div className={`${CLASS_PREFIX}-seat-eat__flight-data`}>
                <h2 className={`${CLASS_PREFIX}-seat-eat__flight-segment`}>
                  {`${props.segmentData.journeydetail.origin} - ${props.segmentData
                    .journeydetail.destination}`}
                </h2>
                <span className={`${CLASS_PREFIX}-seat-eat__flight-time`}>
                  {departureDateWithPaxCount()}
                </span>
              </div>
            </div>
            <div className={`${CLASS_PREFIX}-seat-eat__btn`}>
              {openUpgrade ? (
                <div className={`${CLASS_PREFIX}-seat-eat__btn-head`}>
                  <button
                    className={`${CLASS_PREFIX}-seat-eat__btn-remove re-remove indigoIcon`}
                    onClick={() => handleRemoveUpgrade()}
                  >
                    {props.configData.removeLabel}
                  </button>
                  <button
                    className={`${CLASS_PREFIX}-seat-eat__btn-added re-tick`}
                  >
                    {`${props.configData.addedLabel} `}
                    {formatCurrencyFunc({
                      price:
                        props.addonData.availableBundlePriceByJourney
                          .totalPrice,
                      currencycode:
                        props.addonData.availableBundlePriceByJourney
                          .currencyCode,
                    })}
                  </button>
                </div>
              ) : (
                <button
                  className={`${CLASS_PREFIX}-seat-eat__btn-add re-add re-caret-right`}
                  onClick={() => handleAddUpgrade()}
                >
                  {`${props.configData.addLabel} `}
                  {formatCurrencyFunc({
                    price:
                      props.addonData.availableBundlePriceByJourney.totalPrice,
                    currencycode:
                      props.addonData.availableBundlePriceByJourney
                        .currencyCode,
                  })}
                </button>
              )}
            </div>
          </div>
          {openUpgrade && (
            <div className="d-flex justify-content-end">
              <button
                onClick={() => handleRemoveUpgrade()}
                className={`${CLASS_PREFIX}-seat-eat__btn-remove-btn-mobile`}
              >
                {props.configData.removeLabel}
              </button>
            </div>
          )}
          {openMadatoryToast && (
            <Toast
              onClose={() => setOpenMadatoryToast(false)}
              containerClass=""
              variation="notifi-variation--info"
              description={
                props.slidePaneData.pleaseSelectIncludedSsrDescription.html
              }
            />
          )}

          {openUpgrade && (
            <>
              <div className={`${CLASS_PREFIX}-seat-eat__upgrade`}>
                <h2 className={`${CLASS_PREFIX}-seat-eat__upgrade-label`}>
                  {props.slidePaneData?.upgradedToBundleLabel}
                </h2>
                {!state.underTwelveHourFlight &&
                  !checkBundleMealSelectedForAllPax() && (
                    <p
                      className={`${CLASS_PREFIX}-seat-eat__upgrade-ssr-label`}
                    >
                      {props.slidePaneData?.pleaseSelectIncludedSsrLabel}
                    </p>
                  )}
              </div>

              <PassengerList
                {...props}
                passengerDetails={props.passengerDetails}
                bundleTotalPrice={
                  props.addonData.availableBundlePriceByJourney.totalPrice
                }
              />

              <div className={`${CLASS_PREFIX}-seat-eat__done-btn`}>
                <Button className="" onClick={handleDoneMLST}>
                  {props.configData.doneCtaLabel}
                </Button>
              </div>
            </>
          )} */}
        </div>
      </AddonSlider>
    )
  );
};

SeatAndEatSlidePane.propTypes = {
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
    segments: PropTypes.shape({
      forEach: PropTypes.func,
    }),
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

export default SeatAndEatSlidePane;
