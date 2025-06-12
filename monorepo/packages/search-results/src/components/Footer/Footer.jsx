import React, { useState } from 'react';
import sumBy from 'lodash/sumBy';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { formatCurrency } from '../../utils';
import FareDetailSlider from '../FareDetails/FareDetailSlider';
import { screenLiveAnnouncer } from '../../utils/a11y';

import { srpActions } from '../../context/reducer';
import useAppContext from '../../hooks/useAppContext';
import {
  checkIfFlightOverlap,
  isNextButtonEnable,
  triggerFareDetailsAnalytics,
  triggerNextAnalytics,
} from '../../utils/continueHandler';

import SellPayloadFactory from '../../models/sell/SellPayloadFactory';
import { getAppliedFilters } from '../../utils/analyticsUtils';
import { ANALTYTICS } from '../../constants';
// import RangeSlider from '../RangeSlider/RangeSlider';
import useLoyalty from '../../hooks/useLoyalty';
import useLoyaltyEnrollment from '../../hooks/useLoyaltyEnrollment';

const Footer = () => {
  const {
    state: {
      selectedFares,
      trips,
      selectedTripIndex,
      searchContext,
      additional,
      flightSearchData,
      analyticsContext,
      main,
      isChangeFlightFlow,
      googleAnalyticsContext,
      filters,
      // isBurn,
    },
    dispatch,
  } = useAppContext();

  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    potentialLoyaltyPoints,
    earnPotentialLoyaltyPoints,
    // pointsBalance,
    totalFarePoints,
    loyaltyCtaLabel,
    onClickLoyaltyFlow = () => { },
    // value,
    // setValue,
    loyaltyLabel,
    loyaltyBurnInfo,
    loyaltyAnalyticsData,
  } = useLoyalty();
  const { redeemEligibilityCheck } = useLoyaltyEnrollment();

  const { totalAmount, selectedJourneyFares } = {
    totalAmount: formatCurrency(
      sumBy(
        selectedFares.concat({ fare: { totalFareAmount: 0 } }),
        'fare.totalFareAmount',
      ),
      flightSearchData?.currencyCode,
    ),
    selectedJourneyFares: selectedFares.filter((fare) => Boolean(fare)),
  };

  const onClickNextHandler = async () => {
    if (!redeemEligibilityCheck()) {
      return;
    }

    const shuffle = [
      ...selectedFares.slice(selectedTripIndex + 1),
      ...selectedFares.slice(0, selectedTripIndex + 1),
    ];
    let nextIndex = shuffle.findIndex((row) => !row);

    if (nextIndex !== -1) {
      nextIndex = (nextIndex + 1 + selectedTripIndex) % trips.length;
      dispatch({
        type: srpActions.CHANGE_SELECTED_TRIP_INDEX,
        payload: nextIndex,
      });
    } else {
      const ifFlightOverlap = checkIfFlightOverlap(selectedFares);

      if (ifFlightOverlap) {
        dispatch({
          type: srpActions.SET_TOAST,
          payload: {
            show: true,
            variation: 'Error',
            description: additional.overlappingFlightError,
            analyticsData: {
              component: 'Flight Select',
              action: ANALTYTICS.INTERACTION.LINK_BUTTON_CLICK,
            },
          },
        });

        return;
      }

      const appliedFilters = getAppliedFilters(filters);

      // triggering Analytics Event After All Validation Done
      triggerNextAnalytics(
        selectedFares,
        analyticsContext,
        googleAnalyticsContext,
        flightSearchData,
        appliedFilters,
        loyaltyAnalyticsData,
        searchContext,
      );

      setLoading(true);

      const sellPayload = SellPayloadFactory.createpayload(
        window.pageType,
        searchContext,
        selectedFares,
        loyaltyBurnInfo?.sliderSelectedValues,
        flightSearchData?.configSettings?.isRedeemTransaction,
      );

      const response = await sellPayload.callApi();

      if (response.data) {
        window.location.href = isChangeFlightFlow
          ? main.modificationContinueNextPath
          : main.continueNextPath;
      } else {
        const { errors } = response;
        const error = getErrorMsgForCode(errors?.code);
        screenLiveAnnouncer(error.message);

        dispatch({
          type: srpActions.SET_TOAST,
          payload: {
            variation: 'Error',
            show: true,
            description: error.message,
          },
        });
      }
      setLoading(false);
    }
  };

  const onClickDetails = () => {
    triggerFareDetailsAnalytics(selectedFares);
    setShowDetails(true);
  };

  const onCloseSlider = () => {
    setShowDetails(false);
  };

  const nextButtonEnable = isNextButtonEnable(selectedFares, selectedTripIndex);

  return (
    <div className="srp-footer-wrapper">
      {/* {isBurn && (
        <RangeSlider
          value={value}
          setValue={setValue}
          totalVal={totalFarePoints}
          pointsBalance={pointsBalance}
        />
      )} */}

      <div className="srp-price-footer">
        <span
          tabIndex={0}
          label="dash"
          role="button"
          className="dash"
          onKeyDown={onClickDetails}
          onClick={onClickDetails}
        />
        <div className={`srp-price-footer-left ${loyaltyLabel ? 'loyalty-footer' : ''}`}>
          <p className={`total ${loyaltyLabel ? 'loyaltyLabel' : ''}`}>
            {loyaltyLabel || additional.fareSummary.totalFareLabel}
          </p>
          <Heading heading="h4 total-amount">
            {totalFarePoints ? (
              <div className="bluechip-point-container">
                <Icon className="icon-bluechip-point bluechip-icon" size="xs" />
                {loyaltyBurnInfo?.formattedPointsPlusCashPlusTax}
              </div>
            )
              : totalAmount}{' '}
            {earnPotentialLoyaltyPoints && (
              <span className="earn-potential-points">
                {earnPotentialLoyaltyPoints}
              </span>
            )}
          </Heading>
          {selectedJourneyFares.length > 0 && (
            <div
              className="body-small-medium cursor-pointer text-primary-main view-details"
              onClick={onClickDetails}
              role="presentation"
            >
              {additional.viewDetailsLabel}
            </div>
          )}
        </div>
        <div className="srp-price-footer-right">
          <Button
            onClick={loyaltyCtaLabel ? onClickLoyaltyFlow : onClickNextHandler}
            disabled={!nextButtonEnable}
            loading={loading}
          >
            {loyaltyCtaLabel || main.continueNextCtaLabel}
          </Button>
        </div>
      </div>
      {showDetails && (
        <FareDetailSlider
          onClose={onCloseSlider}
          selectedFares={selectedJourneyFares}
          currencyCode={flightSearchData.currencyCode}
          earnPotentialLoyaltyPoints={earnPotentialLoyaltyPoints}
          loyaltyBurnInfo={loyaltyBurnInfo}
          potentialLoyaltyPoints={potentialLoyaltyPoints}
        />
      )}
    </div>
  );
};

export default Footer;
