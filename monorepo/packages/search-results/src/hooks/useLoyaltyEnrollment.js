import { useCallback } from 'react';
import find from 'lodash/find';

import useAppContext from './useAppContext';

import { srpActions } from '../context/reducer';
import { paxCodes, UPDATE_FLIGHT_SEARCH } from '../constants';
import { formattedMessage } from '../utils';

const getSelectedPaxInfo = (searchContext, additional) =>
  searchContext?.selectedPaxInformation?.types?.reduce?.(
    (acc, val) => {
      if (val?.type === paxCodes?.infant?.code) {
        return acc;
      }

      const label = find(additional?.fareSummary?.paxList, {
        typeCode: val?.type,
        ...(val?.discountCode && { discountCode: val?.discountCode }),
      })?.paxLabel || '';
      const icon = `icon-${val?.type === paxCodes?.children?.code ? 'Child' : 'adult'}-filled`;

      return { count: acc.count + val.count, paxDetails: [...acc.paxDetails, { ...val, label, icon }] };
    },
   { count: 0, paxDetails: [] },
  ) || { count: 0, paxDetails: [] };

function useLoyaltyEnrollment() {
  const {
    state: {
      searchContext,
      isBurn,
      authUser: user,
      nomineeDetails: nominee,
      additional,
      flightSearchData,
      isChangeFlightFlow,
    },
    dispatch,
  } = useAppContext();

  const { FFN, tier, pointRedeemEligibilityFlag } = user?.loyaltyMemberInfo || {};
  const isLoyaltyUser = FFN || tier;
  const { insufficientPointBalance } = flightSearchData?.configSettings || {};

  const showEnrollmentPopUp = (popupData) => {
    dispatch({
      type: srpActions.SET_ENROLLMENT_POPUP,
      payload: {
        show: true,
        data: popupData,
      },
    });
  };

  const closeEnrollmentPopUp = () => {
    dispatch({
      type: srpActions.SET_ENROLLMENT_POPUP,
      payload: {
        show: false,
        data: null,
      },
    });
  };

  const enrollmentBenefits = (triggerEnrollmentEvent) => {
    const memberBenefitsData = additional?.loyaltyMemberBenefitsPopup || {};
    const enrollmentBenefitsData = {
      ...memberBenefitsData,
      onClick: () => {
        triggerEnrollmentEvent();
        closeEnrollmentPopUp();
      },
      onClickSecondary: UPDATE_FLIGHT_SEARCH.withCash,
    };

    showEnrollmentPopUp(enrollmentBenefitsData);
  };

  //  minimum points required is 500
  const isNewLoyaltyUser = () => {
    const minNumberOfPointsPopup = additional?.minNumberOfPointsPopup || {};
    const minNumberOfPointsData = {
      ...minNumberOfPointsPopup,
      onClick: UPDATE_FLIGHT_SEARCH.withCash,
    };

    if (!pointRedeemEligibilityFlag) showEnrollmentPopUp(minNumberOfPointsData);

    return pointRedeemEligibilityFlag;
  };

  //  minimum percentage of points required is 10%
  const isMinPercentPoints = () => {
    if (!flightSearchData || !Object.keys(flightSearchData).length) {
      return false;
    }

    const minPercentageOfPointsPopup = additional?.minPercentageOfPointsPopup || {};
    const minPercentPointsData = {
      ...minPercentageOfPointsPopup,
      onClick: UPDATE_FLIGHT_SEARCH.withCash,
      ...(isChangeFlightFlow && {
        note: minPercentageOfPointsPopup?.changeFlowNote,
        ctaLabel: minPercentageOfPointsPopup?.changeFlowCtaLabel,
        onClick: () => { window.history.go(-1); },
      }),
    };

    if (insufficientPointBalance) showEnrollmentPopUp(minPercentPointsData);

    return !insufficientPointBalance;
  };

  const isNomineeEligible = () => {
    const nomineeCount = nominee?.length || 0;
    const { count: paxCount } = getSelectedPaxInfo(searchContext, additional);
    const isMultiPax = paxCount > 1;
    const allowedPaxCount = nomineeCount + 1;

    if (isMultiPax && (paxCount > allowedPaxCount)) {
      // if nominee is < than the selected passenger
      const addNomineePopup = additional?.addNomineePopup || {};
        const note = formattedMessage(addNomineePopup?.note, {
          requiredNomineesNumber: (paxCount - allowedPaxCount) || '',
        });

      dispatch({
        type: srpActions.SET_TOAST,
        payload: {
          show: true,
          variation: 'Error',
          description: note,
        },
      });

      setTimeout(() => { window.history.go(-1); }, 5000);

      return false;
    }

    return true;
  };

  // will be checked only for loyalty user
  const redeemEligibilityCheck = useCallback(() => {
    if (!isBurn || !isLoyaltyUser) {
      return true;
    }

    if (isChangeFlightFlow) return isMinPercentPoints();

    if (isNewLoyaltyUser()) return isMinPercentPoints() && isNomineeEligible();

    return false;
  }, [isBurn, isLoyaltyUser, nominee, flightSearchData?.configSettings, isChangeFlightFlow]);

  return { closeEnrollmentPopUp, enrollmentBenefits, redeemEligibilityCheck };
}

export default useLoyaltyEnrollment;
