/* eslint-disable indent */
import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import { paxCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { PayWithModes, specialFareCodes } from 'skyplus-design-system-app/src/functions/globalConstants';
import SeatInput from './SeatInput';
import useAppContext from '../../../hooks/useAppContext';
import { FormContext } from '../FormContext';
import { formActions } from '../formReducer';
import { paxInfoAfterChangeSeat } from './paxSelectionUtils';
import { COOKIE_KEYS } from '../../../constants';

const PaxSelection = ({ setShowNomineeMessage }) => {
  const {
    state: { additional, widgetsModel, isLoyaltyEnabled, nomineeDetails, authUser },
  } = useAppContext();
  const authUserCookie = authUser || Cookies.get(COOKIE_KEYS.USER, true, true);
  const {
    formState: { paxInfo, selectedSpecialFare, isInternational, payWith, LOYALTY_NOMINEE_COUNT },
    dispatch,
  } = useContext(FormContext);
  const maxPAxSelectionCount = useMemo(() => {
    return payWith === PayWithModes.CASH ? widgetsModel?.maxSeatCount : additional?.maximumLoyaltyTravellers;
  }, [payWith]);

  /**
   *
   * @param {any} key
   * @param {*} value
   */
  const calculateSeatCount = (pax) => pax.Count + pax.ExtraDoubleSeat + 2 * pax.ExtraTripleSeat;

  const calculateTotalSeatCount = (paxData) => {
    return (
      calculateSeatCount(paxData.ADT) +
      calculateSeatCount(paxData.CHD) +
      calculateSeatCount(paxData.SRCT)
    );
  };

  const adjustPaxInfoForNominee = (currentPaxData, key) => {
    const adjustedPaxInfo = { ...paxInfo };

    if (currentPaxData.ADT.Count + currentPaxData.SRCT.Count === 0) {
      adjustedPaxInfo.CHD.Count = 0;
    }

    if (key === 'ADT' && currentPaxData.ADT.Count === 1) {
      adjustedPaxInfo.ADT.Count = 1;
      adjustedPaxInfo.SRCT.Count = 0;
      adjustedPaxInfo.CHD.Count = 0;
      adjustedPaxInfo.INFT.maxCount = 1;
    } else if (key === 'SRCT' && currentPaxData.SRCT.Count === 1) {
      adjustedPaxInfo.ADT.Count = 0;
      adjustedPaxInfo.SRCT.Count = 1;
      adjustedPaxInfo.CHD.Count = 0;
      adjustedPaxInfo.INFT.maxCount = 1;
    } else if (key === 'CHD' && currentPaxData.CHD.Count === 1) {
      adjustedPaxInfo.ADT.Count = 0;
      adjustedPaxInfo.SRCT.Count = 0;
      adjustedPaxInfo.CHD.Count = 1;
      adjustedPaxInfo.INFT.Count = 0;
      adjustedPaxInfo.INFT.maxCount = 0;
    }

    return adjustedPaxInfo;
  };

  const onChangeSeats = (key, value) => {
    const currentPaxData = { ...paxInfo, [key]: value };

    if (
      isLoyaltyEnabled &&
      authUserCookie?.loyaltyMemberInfo?.FFN &&
      payWith !== PayWithModes.CASH
      // && key !== paxCodes.infant.code
    ) {
      const totalSeatCount = calculateTotalSeatCount(currentPaxData);

      if (
        selectedSpecialFare?.specialFareCode === specialFareCodes.UMNR &&
        LOYALTY_NOMINEE_COUNT.CHD_COUNT < totalSeatCount
      ) {
        setShowNomineeMessage(true);
        return;
      }

      if (nomineeDetails?.length < totalSeatCount - 1 &&
        !(selectedSpecialFare?.specialFareCode === specialFareCodes.UMNR)) {
        setShowNomineeMessage(true);
        if (!selectedSpecialFare && nomineeDetails?.length === 0) {
          const adjustedPaxInfo = adjustPaxInfoForNominee(currentPaxData, key);
          dispatch({
            type: formActions.CHANGE_PAX_INFO,
            payload: adjustedPaxInfo,
          });
        }
        return;
      }

      setShowNomineeMessage(false);
    }

    const paxData = paxInfoAfterChangeSeat({
      key,
      value,
      paxInfo,
      maxPAxSelectionCount,
      selectedSpecialFare,
    });

    const totalSeatCount = calculateTotalSeatCount(paxData);

    if (totalSeatCount > maxPAxSelectionCount) {
      return;
    }

    dispatch({
      type: formActions.CHANGE_PAX_INFO,
      payload: paxData,
    });
  };

  return (
    <div className="pax-fare-selection-popover--pax-selction">
      {widgetsModel.paxType.map(({ paxKey, ...pax }) => (
        <SeatInput
          showDouTripContainer={paxKey !== paxCodes.infant.code}
          payWith={payWith}
          seats={paxInfo[paxKey]}
          statsKey={paxKey}
          key={paxKey}
          {...pax}
          onChangeSeats={onChangeSeats}
          addExtraSeatLabel={additional.addExtraSeatLabel}
          extraSeatsData={additional.extraSeatsData}
          {...(selectedSpecialFare &&
            paxKey === paxCodes.seniorCitizen.discountCode && {
              disabled: true,
              error: formattedMessage(additional.seniorCitizenErrorText, {
                specialFare: selectedSpecialFare?.specialFareLabel,
              }),
            })}
          {...(payWith !== PayWithModes.CASH &&
            !isInternational &&
            paxKey === paxCodes.seniorCitizen.discountCode &&
            paxInfo[paxKey].Count >= 1 && {
              error:
                pax?.loyaltyFareInfo ||
                'Senior Citizen fare is not applicable for redemption bookings, Adult fare will apply',
            })}
          {...(payWith !== PayWithModes.CASH &&
            paxKey === paxCodes.children.code &&
            paxInfo[paxKey].Count >= 1 && {
              error:
                pax?.loyaltyFareInfo ||
                'Children fare is not applicable for redemption bookings, Adult fare will apply',
            })}
          {...(isInternational &&
            paxKey === paxCodes.seniorCitizen.discountCode && {
              disabled: true,
              error: 'Senior Citizen discount is not available for international flights',
            })}
          {...(payWith !== PayWithModes.CASH &&
            paxKey === paxCodes.infant.code &&
            paxInfo[paxKey].Count >= 1 && {
              error:
                pax?.loyaltyFareInfo || 'Infant fare is to be charged in cash',
            })}
        />
      ))}
    </div>
  );
};

PaxSelection.propTypes = {
  setShowNomineeMessage: PropTypes.func,
};

export default PaxSelection;
