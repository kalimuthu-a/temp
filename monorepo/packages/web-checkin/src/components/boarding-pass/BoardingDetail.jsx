import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import { getFlightName, getPassengerName } from '../../utils/functions';
import { dateFormats } from '../../constants';
import useAppContext from '../../hooks/useAppContext';

const BoardingDetail = ({ boardingPass, recordLocator }) => {
  const { aemLabel } = useAppContext();

  const {
    segments: { designator, identifier, boardingTime, departureGate },
    passenger,
    boardingSequence,
    boardingZone,
    seat,
    ssrs = [],
    isNext,
    productClass,
  } = boardingPass;

  const boardingSequenceFormatted = boardingSequence
    ?.toString()
    ?.padStart(4, '0');

  const { departure } = designator;

  const aemLabels = useMemo(() => {
    return {
      pnrLabel: aemLabel('boardingPass.pnrLabel'),
      flightLabel: aemLabel('boardingPass.flightLabel'),
      gateLabel: aemLabel('boardingPass.gateLabel'),
      boardingLabel: aemLabel('boardingPass.boardingLabel'),
      specialServicesLabel: aemLabel('boardingPass.specialServicesLabel'),
      seatLabel: aemLabel('boardingPass.seatLabel'),
      zoneLabel: aemLabel('boardingPass.zoneLabel'),
      sequenceNumber: aemLabel('boardingPass.sequenceNumber'),
      departsLabel: aemLabel('boardingPass.departsLabel'),
      departureLabel: aemLabel('boardingPass.departureLabel'),
      notvalidForTravelLabel: aemLabel(
        'boardingPass.notvalidForTravelLabel',
        '',
      ),
      tierLabel: aemLabel('boardingPass.tierLabel', 'Tier'),
      ffnLabel: aemLabel('boardingPass.ffnLabel', 'FFN'),
      zone: aemLabel('boardingPass.zone', 'Zone'),
    };
  }, [aemLabel]);

  const productClassLabel = aemLabel('boardingPass.fareTypes', [])?.find(
    (i) => i.productClass === productClass,
  )?.fareBadge;

  return (
    <div className="boarding-detail">
      <div className="boarding-detail__not_valid_for_travel2">
        {aemLabels.notvalidForTravelLabel}
      </div>
      <div className="boarding-detail__passenger-name">
        <div className="boarding-detail__passenger-block">
          <div>
            <h4>{getPassengerName(passenger)}</h4>
            {passenger?.program?.number && (
              <div className="loyalty-tier">
                <span className="tier">
                  {aemLabels.tierLabel}:{' '}
                  <span>{passenger?.program?.displayCode}</span>
                </span>
                <span className="ffn">
                  {aemLabels.ffnLabel}:{' '}
                  <span>{passenger?.program?.number}</span>
                </span>
              </div>
            )}
          </div>

          {isNext && (
            <div className="boarding-check__next-chip-home">
              <p>{productClassLabel}</p>
            </div>
          )}
        </div>
      </div>
      <div className="boarding-detail__airport">
        <div className="boarding-detail__airport__top">
          <div className="boarding-detail__airport__top__pnr continer">
            <span className="heading">{aemLabels.pnrLabel}</span>
            <span className="value">{recordLocator}</span>
          </div>
          <div className="boarding-detail__airport__top__flight continer">
            <span className="heading">{aemLabels.flightLabel}</span>
            <span className="value">{getFlightName(identifier)}</span>
          </div>

          <div className="boarding-detail__airport__top__gate continer">
            <span className="heading">{aemLabels.gateLabel}</span>
            <span className="value">{departureGate ?? '-'}</span>
          </div>
          <div className="boarding-detail__airport__top__zone continer">
            <span className="heading">{aemLabels.zoneLabel}</span>
            <span className="value">
              {aemLabels.zone} {boardingZone}
            </span>
          </div>
        </div>
        <div className="boarding-detail__airport__bottom">
          <div className="boarding-detail__airport__bottom__img">
            <img src={passenger.barCodeBase64} alt="QR CODE" />
          </div>
          <div className="boarding-detail__airport__bottom__right">
            <div className="boarding-detail__airport__bottom__right__top">
              <div className="boarding-detail__airport__top__pnr continer">
                <span className="heading">{aemLabels.boardingLabel}</span>
                <span className="value">
                  {format(boardingTime, dateFormats.HHmm)}
                </span>
              </div>
              <div className="boarding-detail__airport__top__flight continer">
                <span className="heading">{aemLabels.departureLabel}</span>
                <span className="value">
                  {format(departure, dateFormats.HHmm)}
                </span>
              </div>

              <div className="boarding-detail__airport__top__gate continer">
                <span className="heading">{aemLabels.seatLabel}</span>
                <span className="value">{seat}</span>
              </div>
            </div>
            <div className="boarding-detail__airport__bottom__right__bottom">
              <div className="boarding-detail__airport__top__flight continer">
                <span className="heading">{aemLabels.sequenceNumber}</span>
                <span className="value">
                  {boardingSequenceFormatted || '-'}
                </span>
              </div>

              <div className="boarding-detail__airport__top__gate continer">
                <span className="heading">
                  {aemLabels.specialServicesLabel}
                </span>
                <span className="value">{ssrs.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BoardingDetail.propTypes = {
  boardingPass: PropTypes.any,
  recordLocator: PropTypes.string,
};

export default BoardingDetail;
