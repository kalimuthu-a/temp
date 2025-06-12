/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import subMinutes from 'date-fns/subMinutes';
import isFuture from 'date-fns/isFuture';

import format from 'date-fns/format';
import { dateFormats } from '../../constants';
import { flightDurationFormatter } from '../../utils/functions';
import useAppContext from '../../hooks/useAppContext';
import PassengerSelection from '../PassengerSelection/PassengerSelection';
import FlightStatusInfo from './FlightStatusInfo';

const FlightCheckin = ({
  booking,
  isUndoCheckin = false,
  onUndoCheckin,
  selectedIndex,
}) => {
  const {
    recordLocator,
    journeydetail,
    stops,
    segments = [],
    journeyKey,
    isSchedule,
    isUMNR = false,
    underCheckInWindow,
  } = booking;

  const {
    origin,
    originCityName,
    destination,
    destinationCityName,
    arrival,
    departure,
    identifier,
    utcarrival,
    utcdeparture,
    checkinStartTime,
  } = journeydetail;

  const { aemLabel, formattedAEMLabel } = useAppContext();

  const duration = flightDurationFormatter(utcdeparture, utcarrival);

  const { dTermninal, aTermninal } = useMemo(() => {
    let dtermninal = null;
    let atermninal = null;
    const _aircrafts = segments.map((seg, index) => {
      if (index === 0) {
        dtermninal = seg?.legs?.[0]?.legInfo?.departureTerminal;
      }

      if (index === segments.length - 1) {
        atermninal = seg?.legs?.[seg.legs.length - 1]?.legInfo?.arrivalTerminal;
      }

      return '';
    });

    return {
      aircrafts: _aircrafts,
      dTermninal: dtermninal,
      aTermninal: atermninal,
    };
  }, [segments]);

  const isInternational = segments.some((seg) => seg?.international);

  const aemLabels = useMemo(() => {
    const [segment] = segments;

    const carrierCode =
      segment?.externalIdentifier?.carrierCode &&
      segment?.legs?.[0]?.legInfo?.operatingCarrier
        ? segment?.externalIdentifier?.carrierCode
        : identifier?.carrierCode;

    const minutes = isInternational
      ? aemLabel('checkinHome.internationalCheckinCloserTime')
      : aemLabel('checkinHome.domesticCheckinCloserTime');

    const codeShareData = aemLabel('checkinHome.codeShare', []);

    const codeShareObj = codeShareData?.find((data) => {
      return data.carrierCode === carrierCode;
    });

    const webCheckInStatusMessages = {};

    aemLabel('checkinHome.webCheckInStatusMessage', []).forEach((r) => {
      const { key } = r;
      webCheckInStatusMessages[key] = r;
    });

    return {
      pnrLabel: aemLabel('checkinHome.pnrLabel', 'PNR'),
      onTimeLabel: aemLabel('checkinHome.onTimeLabel', 'On Time'),
      checkinCtaTitle: aemLabel('checkinHome.checkinCtaTitle'),
      selectAllPassengers: aemLabel('checkinHome.selectAllPassengers'),
      webCheckInLabel: aemLabel('checkinHome.webCheckInLabel'),
      flightDetailsLabel: aemLabel('checkinHome.flightDetailsLabel'),
      webCheckOpenStatus: aemLabel(
        'checkinHome.webCheckOpenStatus',
        'Web check-in window for your flight is now open',
      ),
      checkInCloses: formattedAEMLabel(
        'checkinHome.checkInCloses',
        'Checkin closes {time}',
        {
          time: format(
            subMinutes(new Date(departure), minutes),
            dateFormats.HHmm,
          ),
        },
      ),
      paxLabel: aemLabel('checkinHome.paxLabel', 'Pax'),
      flightType: aemLabel('checkinHome.flightTypessss', {
        stop: 'Stops',
        nonStop: 'Non-Stop',
      }),
      flightIcon: {
        carrierCode: identifier.carrierCode,
        identifier: identifier.identifier,
        ...codeShareObj,
        image: codeShareObj?.carrierCodeIcon?._publishUrl,
      },
      webCheckInStatusMessages,
    };
  }, [selectedIndex, aemLabel, formattedAEMLabel]);

  const isWebCheckinDoneForAnyPassenger = booking.passengers.some(
    (passenger) => passenger.showPrintBoardingPass,
  );

  const smartCheckinDoneCount = booking.passengers.reduce((a, passenger) => {
    return passenger.isAutoCheckedin ? a + 1 : a;
  }, 0);

  const isFlightFlown = useMemo(() => !isFuture(utcdeparture));

  return (
    <div className="wc-flight-checkin">
      <div className="wc-flight-checkin__container">
        <div className="wc-flight-checkin__container__pnr">
          <p className="date">{format(departure, dateFormats.iiiddMMM)}</p>
          <p className="pnr">
            {aemLabels.pnrLabel}:&nbsp;<b>{recordLocator}</b>
          </p>
        </div>
        <div className="wc-flight-checkin__container__flight-details-container">
          <div className="wc-flight-checkin__container__flight-details">
            <div className="d-flex gap-4 align-items-center pt-10">
              {segments?.map((seg)=>(
                  <div className="flight-number">
                    <img
                      src={aemLabels?.flightIcon?.image}
                      alt="flight icon"
                      width="12px"
                      height="12px"
                    />
                    {`${seg?.segmentDetails?.identifier?.carrierCode} ${seg?.segmentDetails?.identifier?.identifier}`}
                  </div>
                ))}
            </div>

            <div className="wc-flight-checkin__journey-detail">
              <div className="wc-flight-checkin__journey-detail__from">
                <span>{format(departure, dateFormats.HHmm)}</span>
                <div className="from-details">
                  <h4>{origin}</h4>
                  <span>
                    {originCityName} {dTermninal ? `, T${dTermninal}` : ''}
                  </span>
                </div>
              </div>
              <div className="wc-flight-checkin__journey-detail__duration d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="9"
                    height="10"
                    viewBox="0 0 9 10"
                    fill="none"
                  >
                    <path
                      d="M3.78831 0.66517L5.68104 4.31317L7.89594 4.31317C8.23019 4.31317 8.5 4.61946 8.5 4.99888C8.5 5.37831 8.23019 5.6846 7.89594 5.6846L5.68104 5.6846L3.78831 9.3326C3.71582 9.47888 3.57487 9.57031 3.42587 9.57031C3.14398 9.57031 2.94262 9.26403 3.01914 8.95774L3.86482 5.6846L1.65395 5.6846L1.1103 6.71774C1.07405 6.78631 1.00559 6.82746 0.937133 6.82746L0.735779 6.82746L0.703562 6.82746C0.570668 6.82746 0.474018 6.68574 0.506235 6.54403L0.800212 5.20917L0.848537 4.99888L0.812293 4.82517L0.767995 4.63317L0.574695 3.7646L0.506235 3.45831C0.474018 3.31203 0.570668 3.17488 0.703562 3.17488L0.852564 3.17488L0.937133 3.17488C1.00962 3.17488 1.07405 3.21603 1.1103 3.2846L1.65395 4.31317L3.86885 4.31317L3.02316 1.04003C2.94262 0.733741 3.14398 0.427455 3.42587 0.427455C3.57487 0.427455 3.71582 0.518884 3.78831 0.66517Z"
                      fill="#E2EBF2"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="37"
                    height="2"
                    viewBox="0 0 37 2"
                    fill="none"
                  >
                    <path
                      d="M0.5 1H36.5"
                      stroke="#E2EBF2"
                      strokeLinecap="round"
                      strokeDasharray="0.1 2"
                    />
                  </svg>
                </div>
                <div>
                  <p>{duration}</p>
                  <p className="pt-2 duration">
                    {stops > 0
                      ? `${stops} ${aemLabels?.flightType?.stop}`
                      : aemLabels?.flightType?.nonStop}
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="37"
                    height="2"
                    viewBox="0 0 37 2"
                    fill="none"
                  >
                    <path
                      d="M0.5 1H36.5"
                      stroke="#E2EBF2"
                      strokeLinecap="round"
                      strokeDasharray="0.1 2"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="5"
                    height="6"
                    viewBox="0 0 5 6"
                    fill="none"
                  >
                    <path
                      d="M4.5 3C4.5 1.89543 3.60457 1 2.5 1C1.39543 1 0.5 1.89543 0.5 3C0.5 4.10457 1.39543 5 2.5 5C3.60457 5 4.5 4.10457 4.5 3Z"
                      stroke="#E2EBF2"
                    />
                  </svg>
                </div>
              </div>
              <div className="wc-flight-checkin__journey-detail__to">
                <span>{format(arrival, dateFormats.HHmm)} </span>
                <div className="from-details">
                  <span>
                    {destinationCityName} {aTermninal ? `, T${aTermninal}` : ''}
                  </span>
                  <h4>{destination}</h4>
                </div>
              </div>
            </div>
            <div className="wc-flight-checkin__dotted" />
            <div className="wc-flight-checkin__date-pax">
              <div className="align-items-center d-flex pax-info">
                <i className="icon-Passenger icon-size-sm mx-2" />
                <span className="text-capitalize">
                  {booking.passengers.length} {aemLabels.paxLabel}
                </span>
              </div>
              <div className="checkin-closes">{aemLabels.checkInCloses}</div>
            </div>

            <FlightStatusInfo
              isSchedule={isSchedule}
              webCheckInLabel={aemLabels.webCheckInLabel}
              webCheckOpenStatus={aemLabels.webCheckOpenStatus}
              passengers={booking.passengers}
              isWebCheckinDoneForAnyPassenger={isWebCheckinDoneForAnyPassenger}
              webCheckInStatusMessages={aemLabels.webCheckInStatusMessages}
              isUMNR={isUMNR}
              checkinClosed={underCheckInWindow === false}
              checkinStartTime={checkinStartTime}
              smartCheckinDoneCount={smartCheckinDoneCount}
              isFlightFlown={isFlightFlown}
            />

            <PassengerSelection
              passengersList={booking.passengers}
              journeyKey={journeyKey}
              isSchedule={isSchedule}
              isUndoCheckin={isUndoCheckin}
              onUndoCheckin={onUndoCheckin}
              selectedIndex={selectedIndex}
              isUMNR={isUMNR}
              checkinClosed={underCheckInWindow === false}
              isInternational={isInternational}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

FlightCheckin.propTypes = {
  booking: PropTypes.any.isRequired,
  isUndoCheckin: PropTypes.any,
  onUndoCheckin: PropTypes.func,
  selectedIndex: PropTypes.number,
};

export default FlightCheckin;
