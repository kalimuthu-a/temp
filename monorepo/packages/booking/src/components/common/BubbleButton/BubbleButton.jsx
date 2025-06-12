import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import {
  TripTypes,
  paxCodes,
} from 'skyplus-design-system-app/src/functions/globalConstants';
import add from 'date-fns/add';
import format from 'date-fns/format';
import LocalStorage from '../../../utils/LocalStorage';
import { dateFormats, localStorageKeys } from '../../../constants';
import useAppContext from '../../../hooks/useAppContext';

const BubbleButton = ({
  bubbleTitle,
  bubbleDescription,
  bubbleLink,
}) => {
  const {
    state: { sourceCity, main, activeCurrencyModel },
  } = useAppContext();

  const onClickHandler = () => {
    const triptype = { value: TripTypes.ONE_WAY, journeyTypeCode: 'OneWay' };
    const initialBwCntxt = {
      nationality: null,
      seatWiseSelectedPaxInformation: {
        adultCount: 1,
        childrenCount: 0,
        seniorCitizenCount: 0,
        infantCount: 0,
        adultExtraDoubleSeat: 0,
        adultExtraTripleSeat: 0,
        seniorCitizenExtraDoubleSeat: 0,
        seniorCitizenExtraTripleSeat: 0,
        childrenExtraDoubleSeat: 0,
        childrenExtraTripleSeat: 0,
        totalAllowedCount: 0,
        totalCount: 1,
      },
      selectedCurrency: {
        label: activeCurrencyModel?.find((x) => x.currencyCode === main?.defaultCurrencyCode)?.displayPrefix || '₹',
        value: activeCurrencyModel?.find((x) => x.currencyCode === main?.defaultCurrencyCode)?.currencyCode || 'INR',
      },
      selectedDestinationCityInfo: {},
      selectedJourneyType: triptype,
      selectedPromoInfo: '',
      selectedSourceCityInfo: sourceCity?.value
        ? sourceCity?.value
        : main?.defaultCity,
      selectedSpecialFare: null,
      selectedTravelDatesInfo: {
        startDate: format(add(new Date(), { days: 1 }), dateFormats.yyyyMMdd),
      },
      selectedVaccineDose: '',
      selectedPaxInformation: {
        types: [
          {
            count: 1,
            discountCode: '',
            type: paxCodes?.adult?.code,
          },
        ],
      },
      travellingFor: '',
      selectedMultiCityInfo: null,
    };
    LocalStorage.set(localStorageKeys.bw_cntxt_val, initialBwCntxt, true);
    window.location.href = bubbleLink;
  };
  return (
    <div
      className="bubble-button-item"
      onClick={onClickHandler}
      role="presentation"
    >
      <div className="bubble-button-item__left">
        <Text
          containerClass="text-primary-main"
          variation="body-large-medium"
          mobileVariation="body-small-medium"
        >
          {bubbleTitle}
        </Text>
        <div className="button-desc">
          <Text variation="body-medium-regular">{bubbleDescription}</Text>
        </div>
      </div>
      <div className="bubble-button-item__right d-flex justify-content-center align-items-center">
        <Icon className="icon-arrow-top-right" size="sm" />
      </div>
    </div>
  );
};

BubbleButton.propTypes = {
  bubbleTitle: PropTypes.string,
  bubbleDescription: PropTypes.string,
  bubbleLink: PropTypes.any,
};

export default BubbleButton;
