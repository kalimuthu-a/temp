import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';

import format from 'date-fns/format';
import {
  cityWithTerminal,
  flightDurationFormatter,
} from '../../utils/functions';
import { dateFormats } from '../../constants';
import useAppContext from '../../hooks/useAppContext';

const BannerHeading = ({ boardingPass }) => {
  const { aemLabel } = useAppContext();
  const {
    segments: { designator, legs },
    passenger,
  } = boardingPass;

  const {
    UtcArrival,
    UtcDeparture,
    arrival,
    arrivalTerminal,
    departure,
    departureTerminal,
    destination,
    destinationStationName,
    origin,
    originStationName,
  } = designator;

  const [isMobile] = useIsMobile();

  const aemLabels = useMemo(() => {
    return {
      departsDateLabel: aemLabel('boardingPass.departsDateLabel'),
      arrivesDateLabel: aemLabel('boardingPass.arrivesDateLabel'),
      departsLabel: aemLabel('boardingPass.departsLabel'),
      arrivesLabel: aemLabel('boardingPass.arrivesLabel'),
      flightType: aemLabel('checkinHome.flightType', {
        stop: 'Stops',
        nonStop: 'Non - Stop',
      }),
    };
  }, [aemLabel]);

  return (
    <div className="banner-heading__banner">
      <div className="banner-heading__journey-detail">
        <div className="banner-heading__journey-detail__from">
          <span>{cityWithTerminal(originStationName, departureTerminal)}</span>
          <h2>{origin}</h2>
        </div>
        <div className="banner-heading__journey-detail__duration">
          <p>{flightDurationFormatter(UtcDeparture, UtcArrival)}</p>
          <p className="pt-2">
            {legs.length > 1
              ? `${legs.length} ${aemLabels?.flightType?.stop}`
              : aemLabels?.flightType?.nonStop}
          </p>
        </div>
        <div className="banner-heading__journey-detail__to">
          <span>
            {cityWithTerminal(destinationStationName, arrivalTerminal)}
          </span>
          <h2>{destination}</h2>
        </div>
      </div>
      <div className="banner-heading__journey-date-detail pb-12 pt-12">
        <div className="banner-heading__journey-date-detail__date">
          <span>{aemLabels.departsDateLabel}</span>
          <h5>{format(departure, dateFormats.ddMMMYY)}</h5>
        </div>
        <div className="banner-heading__journey-date-detail__date text-end">
          <span>{aemLabels.arrivesDateLabel}</span>
          <h5>{format(arrival, dateFormats.ddMMMYY)}</h5>
        </div>
      </div>
      <div className="banner-heading__journey-date-detail">
        <div className="banner-heading__journey-date-detail__time">
          <span>{aemLabels.departsLabel}</span>
          <h5>{format(departure, dateFormats.HHmm)}</h5>
        </div>
        <div className="banner-heading__journey-date-detail__time text-end">
          <span>{aemLabels.arrivesLabel}</span>
          <h5>{format(arrival, dateFormats.HHmm)}</h5>
        </div>
      </div>
      {isMobile && (
        <div className="banner-heading__boarding-image">
          <img src={passenger.barCodeBase64} alt="qr code" />
        </div>
      )}
    </div>
  );
};

BannerHeading.propTypes = {
  boardingPass: PropTypes.any,
};

export default BannerHeading;
