/* eslint-disable sonarjs/cognitive-complexity */
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';

import Text from 'skyplus-design-system-app/dist/des-system/Text';
import NextChip from 'skyplus-design-system-app/dist/des-system/NextChip';
import Fee from './Fee/Fee';
import Baggage from './Baggage/Baggage';
import FareRules from './FareRules/FareRules';
import useAppContext from '../../../hooks/useAppContext';
import { FARE_CLASSES } from '../../../constants';
import { handleNorseFlights } from '../../../utils/norseFlights';

const FareDetails = ({ fare, isInternational, flightData }) => {
  const { productClass, baggageData } = fare;

  const [show, setShow] = useState(false);

  const onclickHandler = () => {
    setShow(!show);
  };

  const onKeyUpHandler = (e) => {
    if (e.key === 'Enter') setShow(!show);
  };

  const {
    state: { additional },
  } = useAppContext();

  const fareType = additional.fareTypeMap.get(productClass);
  const {
    values = [],
    secondaryValues = [],
  } = handleNorseFlights(flightData?.segments[0], fareType?.servicesWithFleetType);
  const fareTypeServices = values?.length > 0 ? values : fareType?.services;

  const fleetFareType = secondaryValues?.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {}) || {};

  const changeCharges1 = isInternational
    ? fareType?.internationalChangeCharges1
    : fareType?.domesticChangeCharges1;

  const cancellationCharges1 = isInternational
    ? fareType?.internationalCancellationCharges1
    : fareType?.domesticCancellationCharges1;

  const changeCharges2 = isInternational
    ? fareType?.internationalChangeCharges2
    : fareType?.domesticChangeCharges2;

  const cancellationCharges2 = isInternational
    ? fareType?.internationalCancellationCharges2
    : fareType?.domesticCancellationCharges2;

  // Norse Flight change/cancellation
  const fleetTypeChangeCharges1 = isInternational ?
    fleetFareType?.internationalChangeCharges1
    : fleetFareType?.domesticChangeCharges1;

  const fleetTypeCancellationCharges1 = isInternational ?
    fleetFareType?.internationalCancellationCharges1
    : fleetFareType?.domesticCancellationCharges1;

  const fleetTypeChangeCharges2 = isInternational ?
    fleetFareType?.internationalChangeCharges2
    : fleetFareType?.domesticChangeCharges2;

  const fleetTypeCancellationCharges2 = isInternational ?
    fleetFareType?.internationalCancellationCharges2
    : fleetFareType?.domesticCancellationCharges2;

  const mappedData = {
    ...fareType,
    cabinBaggage: baggageData?.handBaggageWeight,
    checkinBaggage: baggageData?.checkinBaggageWeight,
    changeCharges1,
    cancellationCharges1,
  };

  const fleetTypeMappedData = {
    ...fareType,
    cabinBaggage: baggageData?.handBaggageWeight,
    checkinBaggage: baggageData?.checkinBaggageWeight,
    changeCharges1: fleetTypeChangeCharges1,
    cancellationCharges1: fleetTypeCancellationCharges1,
  };

  const services = useMemo(() => {
    const formattedServices = [];
    fareTypeServices.forEach((item) => {
      const { description } = item;
      const value = formattedMessage(description?.html ?? '', values?.length > 0 ? fleetTypeMappedData : mappedData);
      formattedServices.push({ ...item, value });
    });
    return formattedServices;
  }, []);

  return (
    <div className="fare-details">
      <div className="d-flex justify-content-between align-items-center fare-details__heading">
        <Heading heading="h5" mobileHeading="h5">
          {additional?.includedLabel}
        </Heading>

        {fare.FareClass === FARE_CLASSES.BUSINESS ? (
          <NextChip tabIndex={-1}>{fareType.fareLabel}</NextChip>
        ) : (
          <Text
            containerClass="pts"
            variation="tags-medium"
            mobileVariation="tags-small"
          >
            {fareType.fareLabel}
          </Text>
        )}
      </div>

      <div className="fare-details__card">
        <FareRules services={services} />
        {show ? (
          <div className="show-more-wrapper">
            <div className="fare-details__baggage">
              <div className="fare-details__baggage__head d-flex justify-content-between align-items-end">
                <Text variation="sh8" containerClass="left text-text-primary">
                  {additional?.baggageDetailLabel}
                </Text>
                <a
                  className="fare-details__baggage__head__view-detail"
                  href={additional?.baggageDetailsLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {additional?.viewDetailsLabel}
                </a>
              </div>
              <div className="fare-details__baggage_content">
                {additional.baggageInfo.map((r) => (
                  <Baggage
                    key={r.title}
                    item={r}
                    baggageData={baggageData}
                    fareType={fareType}
                  />
                ))}
              </div>
            </div>
            <Fee
              label={additional?.cancelFeeLabel}
              viewDetailsLabel={additional?.viewDetailsLabel}
              viewDetailsLink={additional?.cancelFeeDetailsLink}
              durationLabel={additional?.durationLabel}
              withBorder
              charge1={values?.length > 0 ? fleetTypeCancellationCharges1 : cancellationCharges1}
              charge2={values?.length > 0 ? fleetTypeCancellationCharges2 : cancellationCharges2}
            />
            <Fee
              label={additional?.dateChangeLabel}
              viewDetailsLabel={additional?.viewDetailsLabel}
              viewDetailsLink={additional?.dateChangeDetailsLink}
              durationLabel={additional?.durationLabel}
              isInternational={isInternational}
              charge1={values?.length > 0 ? fleetTypeChangeCharges1 : changeCharges1}
              charge2={values?.length > 0 ? fleetTypeChangeCharges2 : changeCharges2}
            />
          </div>
        ) : (
          ''
        )}
        <div className={`show-more-btn ${show ? 'down' : 'up'} text-center`}>
          <span
            role="button"
            tabIndex="0"
            className="link body-small-regular"
            onClick={onclickHandler}
            onKeyDown={onKeyUpHandler}
          >
            {show ? additional?.showLessLabel : additional?.showMoreLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

FareDetails.propTypes = {
  fare: PropTypes.any,
  isInternational: PropTypes.bool,
  flightData: PropTypes.object,
};

export default FareDetails;
