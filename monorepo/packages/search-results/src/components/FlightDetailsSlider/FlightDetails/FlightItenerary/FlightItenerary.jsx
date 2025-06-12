import React, { useMemo } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import sub from 'date-fns/sub';

import { flightDurationFormatter } from '../../../../utils';
import { dateFormats } from '../../../../constants';
import useAppContext from '../../../../hooks/useAppContext';
import { flightwithCarrierInfo } from '../../../../utils/flight';
import LegInfo from './LegInfo';

const FlightItenerary = ({ data, nextSegment, aircraft, isInternational }) => {
  const {
    designator: { destinationCityName, departure, utcArrival },
    operatedByText,
    identifier: { equipmentType, carrierCode },
  } = data;

  const {
    state: { additional },
  } = useAppContext();

  const minutes = isInternational
    ? parseInt(additional?.internationalCheckinCloserTime || 75, 10)
    : parseInt(additional.domesticCheckinCloserTime || 60, 10);

  const checkinCloseTime = sub(new Date(departure), { minutes });

  const { legs } = data;

  const carrierCodeInfo = useMemo(() => {
    return flightwithCarrierInfo(aircraft);
  }, []);

  const getCarrierInfo = () => {
    return (additional?.codeShare?.find((data) => (
      data.equipmentType === equipmentType && data.carrierCode === carrierCode))
    )?.operatedByAirlinesLabel;
  };

  return (
    <>
      <div className="itenarary-single">
        <div className="itenarary-single__top d-flex justify-content-between flex-column">
          <div className="d-flex justify-content-between w-100">
            <HtmlBlock html={carrierCodeInfo} className="flight-number" />
            <Text
              containerClass="flight-number"
              variation="body-medium-regular"
              mobileVariation="body-small-regular"
            >
              {`${additional.checkInClosesLabel} ${format(
              checkinCloseTime,
              dateFormats.HHMM,
            )}`}
            </Text>
          </div>
          {operatedByText && <p className="flight-operatedBy">{ getCarrierInfo() ?? operatedByText }</p>}
        </div>

        {legs.map((leg, index, allLegs) => (
          <LegInfo
            key={leg.legInfo.departureTimeUtc}
            {...leg}
            additional={additional}
            nextLeg={allLegs[index + 1]}
          />
        ))}
      </div>

      {nextSegment && (
        <div className="itenarary-single__layover mx-8">
          <Text
            variation="body-small-regular"
            mobileVariation="body-extra-small-regular"
            containerClass="duration"
          >
            {flightDurationFormatter(
              utcArrival,
              nextSegment.designator.utcDeparture,
            )}{' '}
            {additional.layoverTimeInfo} {destinationCityName}
          </Text>
          <Text
            containerClass="note"
            variation="body-small-medium"
            mobileVariation="tags-small"
          >
            {additional.deBoardingNotBeAllowed}
          </Text>
        </div>
      )}
    </>
  );
};

FlightItenerary.propTypes = {
  data: PropTypes.any,
  nextSegment: PropTypes.any,
  aircraft: PropTypes.any,
  isInternational: PropTypes.bool,
};

export default FlightItenerary;
