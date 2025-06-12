import { useMemo, useState } from 'react';
import sumBy from 'lodash/sumBy';
import merge from 'lodash/merge';

import useAppContext from './useAppContext';

import { formatCurrency, formatPoints } from '../utils';
import { LOG_IN_POP_UP_EVENT, DEFAULT_TIER } from '../constants';
import useLoyaltyEnrollment from './useLoyaltyEnrollment';

// used only in footer component for loyalty flow
function useLoyalty() {
  const {
    state: {
      main,
      additional,
      selectedFares,
      flightSearchData,
      authUser,
      isEarn,
      isBurn,
      selectedTripIndex,
      // isChangeFlightFlow,
      isLoyalty,
      loyaltyAnalyticsData: initialLoyaltyAnalyticsData,
    },
  } = useAppContext();
  const { enrollmentBenefits } = useLoyaltyEnrollment();

  const isUserLoggedIn = authUser?.customerNumber || authUser?.mobileNumber || authUser?.name;
  const { FFN, tier: isTier } = authUser?.loyaltyMemberInfo || {};
  const isLoyaltyUser = FFN || isTier;
  const defaultSliderValue = 100;
  // const sliderValFromApi = flightSearchData?.configSettings?.sliderPercentagevalue ?? defaultSliderValue;
  // const sliderValue = isChangeFlightFlow ? sliderValFromApi : defaultSliderValue;

  const [value, setValue] = useState(defaultSliderValue);

  // Works for login, SSO login and loyalty enrollment
  const onClickLoyaltyFlow = () => {
    const { name, persona, types: { customerSSO, customerEnrollSSO } } = LOG_IN_POP_UP_EVENT;
    const eventObj = {
      bubbles: true,
      detail: {
        loginType: !isUserLoggedIn ? customerSSO : customerEnrollSSO,
        persona,
      },
    };
    const toggleLoginPopupEvent = () => { document.dispatchEvent(new CustomEvent(name, eventObj)); };

    if (!isUserLoggedIn) {
      toggleLoginPopupEvent();
    } else {
      enrollmentBenefits(toggleLoginPopupEvent);
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const loyaltyData = useMemo(() => {
    let potentialLoyaltyPoints;
    let earnPotentialLoyaltyPoints;
    let pointsBalance;
    let totalFarePoints;
    let totalTaxAmount;
    let loyaltyCtaLabel;

    if (isBurn) {
      totalFarePoints = sumBy(
        selectedFares.concat({ fare: { totalPublishFare: 0 } }),
        'fare.totalPublishFare',
      );
      totalTaxAmount = sumBy(
        selectedFares.concat({ fare: { totalTax: 0 } }),
        'fare.totalTax',
      );

      loyaltyCtaLabel = !isUserLoggedIn
        ? additional.fareSummary.loginToContinueCtaLabel
        : additional.fareSummary.enrollToContinueCtaLabel;
    }

    if (isEarn) {
      const tier = authUser?.loyaltyMemberInfo?.tier?.trim?.() || DEFAULT_TIER;
      const totalLoyaltyPoints = sumBy(
        selectedFares.concat({ fare: { PotentialPoints: { [tier]: 0 } } }),
        `fare.PotentialPoints.${tier}`,
      );
      const totalLoyaltyBonusPoints = sumBy(
        selectedFares.concat({ fare: { PotentialPoints: { [`${tier}Bonus`]: 0 } } }),
        `fare.PotentialPoints.${tier}Bonus`,
      );

      if (totalLoyaltyPoints) {
        const totalLoyaltyPointsPlusBonus = !totalLoyaltyBonusPoints
          ? totalLoyaltyPoints
          : Number(totalLoyaltyPoints) + Number(totalLoyaltyBonusPoints);

        potentialLoyaltyPoints = totalLoyaltyPointsPlusBonus;
      }
    }

    if (isLoyaltyUser) {
      if (isEarn && potentialLoyaltyPoints) {
        earnPotentialLoyaltyPoints = `+ ${main?.earnMilesLabel?.replace(
          /{earningPoints}/g,
          formatPoints(potentialLoyaltyPoints),
        )}`;
      }

      if (isBurn) {
        const avlPoints = authUser?.loyaltyMemberInfo?.pointBalance ?? 0;
        pointsBalance = Number(avlPoints);
        loyaltyCtaLabel = null;
      }
    }

    return {
      potentialLoyaltyPoints,
      earnPotentialLoyaltyPoints,
      pointsBalance,
      totalFarePoints,
      totalTaxAmount,
      loyaltyCtaLabel,
    };
  }, [authUser, isEarn, isBurn, selectedFares[selectedTripIndex]?.fare?.totalPublishFare]);

  // Footer Details
  const { totalFarePoints, earnPotentialLoyaltyPoints, totalTaxAmount } =
    loyaltyData || {};
  const { inftAmount, infantCount, configSettings, currencyCode } = flightSearchData || {};

  const loyaltyLabel = useMemo(() => {
    const { totalFareLabel, totalMilesCashRequiredLabel,
      // infantChargeLabel
    } = additional?.fareSummary || {};
    let label;

    // Earn FLow
    if (earnPotentialLoyaltyPoints) {
      label = `${additional.fareSummary.totalFareLabel} + ${additional?.fareSummary?.milesEarningLabel}`;
    }

    // Burn Flow
    if (totalFarePoints) {
      // const infantLable = infantCount ? `+ ${infantChargeLabel}` : ''; will be removed based on confirmation
      const infantLable = '';
      const totalPointPlusCashLabel = value ? totalMilesCashRequiredLabel : totalFareLabel;
      label = `${totalPointPlusCashLabel} ${infantLable}`;
    }

    return label;
  }, [!!value, totalFarePoints, earnPotentialLoyaltyPoints, infantCount]);

  const loyaltyBurnInfo = useMemo(() => {
    // Not Burn Flow
    if (!totalFarePoints) {
      return {
        sliderSelectedValues: {
          cashPercentage: 100,
          milesPercentage: 0,
        },
      };
    }

    const { pointToCashConversion = [] } = configSettings || {};

    const { conversaionRate = 1 } =
      pointToCashConversion?.find?.(
        ({ sliderValue }) => Number(sliderValue) === Number(value),
      ) || {};

    const selectedPercentage = value / 100;

    const totalPoints = Number(totalFarePoints);
    const pointsSelected = Math.round(totalPoints * selectedPercentage);
    const formattedPointsComponent = pointsSelected
      ? `${formatPoints(pointsSelected)}`
      : '';
    const formattedPointsComponentString = pointsSelected ? `${formattedPointsComponent} + ` : '';

    const remainingPoints = totalPoints - pointsSelected;
    const cashComponent = remainingPoints
      ? Math.round(remainingPoints * Number(conversaionRate))
      : 0;

    const formattedCashComponent = formatCurrency(cashComponent, currencyCode);
    const formattedCashComponentString = cashComponent ? `${
      formattedPointsComponent ? ' + ' : ''}${formattedCashComponent}` : '';

    const formattedPointsPlusCash = `${formattedPointsComponent}${formattedCashComponentString}`;

    const cashPlusTaxComponent = cashComponent + totalTaxAmount;
    const formattedCashPlusTaxComponent = formatCurrency(cashPlusTaxComponent, currencyCode);

    const formattedPointsPlusCashPlusTax = `${formattedPointsComponentString}${formattedCashPlusTaxComponent}`;

    const formattedInfantFare = (!!infantCount && !!inftAmount)
      ? ` + ${formatCurrency((infantCount * inftAmount), currencyCode)}` : '';
    const formattedPointsPlusCashPlusInfant = `${formattedPointsPlusCash}${formattedInfantFare}`;
    const formattedPointsPlusCashPlusTaxPlusInfant = `${formattedPointsPlusCashPlusTax}${formattedInfantFare}`;

    return {
      sliderSelectedVal: value,
      cashComponent,
      formattedCashComponent,
      cashPlusTaxComponent,
      formattedCashPlusTaxComponent,
      pointsSelected,
      formattedPointsComponent,
      formattedPointsPlusCash,
      formattedPointsPlusCashPlusTax,
      formattedPointsPlusCashPlusInfant,
      formattedPointsPlusCashPlusTaxPlusInfant,
      formattedInfantFare: formatCurrency(inftAmount, currencyCode),
      isRedeemTransaction: !isEarn,
      sliderSelectedValues: {
        cashPercentage: 100 - value,
        milesPercentage: value,
      },
    };
  }, [value, totalFarePoints, inftAmount, infantCount, configSettings, currencyCode, isEarn]);

  // Analytics data for loyalty
  const loyaltyAnalyticsData = useMemo(() => {
    if (!isLoyalty) return {};

    const { potentialLoyaltyPoints } = loyaltyData || {};
    const { pointsSelected, sliderSelectedValues: { milesPercentage } } = loyaltyBurnInfo || {};

    return merge(initialLoyaltyAnalyticsData, {
      loyalty: {
        pointsEarned: potentialLoyaltyPoints?.toString?.() || '',
        pointsBurned: pointsSelected?.toString?.() || '',
      },

      productInfo: {
        percentagePointsBurned: milesPercentage ? milesPercentage?.toString?.() : '',
      },
    });
  }, [loyaltyData?.potentialLoyaltyPoints, loyaltyBurnInfo]);

  return {
    ...loyaltyData,
    loyaltyBurnInfo,
    loyaltyLabel,
    onClickLoyaltyFlow,
    value,
    setValue,
    loyaltyAnalyticsData,
  };
}

export default useLoyalty;
