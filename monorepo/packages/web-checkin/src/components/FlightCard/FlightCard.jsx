/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import format from 'date-fns/format';
import { dateFormats, GTM_ANALTYTICS, localStorageKeys } from '../../constants';
import { flightDurationFormatter } from '../../utils/functions';
import { webcheckinActions } from '../../context/reducer';
import useAppContext from '../../hooks/useAppContext';
import { getItinerary } from '../../services';
import LocalStorage from '../../utils/LocalStorage';
import gtmEvent from '../../utils/gtmEvents';

const FlightCard = ({ booking }) => {
  const {
    recordLocator,
    journeyDetail,
    webCheckinInfo,
    numberOfPassengers,
    stops,
    segment,
    lastName,
    journeyKey,
  } = booking;

  const {
    origin,
    originCityName,
    destination,
    destinationCityName,
    arrival,
    departure,
    utcArrival,
    utcDeparture,
  } = journeyDetail;

  const {
    state: { aemModel },
  } = useAppContext();

  const aemLabels = aemModel?.checkin;

  const {
    isWebCheckinStatus,
    checkinStartTime,
    isSmartCheckin,
    isAllPaxCheckedIn,
  } = webCheckinInfo;

  const scheduleSmartCheckin = isSmartCheckin && isWebCheckinStatus === 'CLOSE';
  const webCheckOpen = isWebCheckinStatus === 'OPEN';

  const duration = flightDurationFormatter(utcDeparture, utcArrival);

  const { aircrafts, dTermninal, aTermninal } = useMemo(() => {
    let dtermninal = null;
    let atermninal = null;
    const _aircrafts = segment.map((seg, index) => {
      const {
        identifier: { identifier, carrierCode },
        externalIdentifier = null,
      } = seg;

      if (index === 0) {
        dtermninal = seg?.legs?.[0]?.legInfo?.departureTerminal;
      }

      const codeShareData = aemLabels?.codeShare || [];

      if (index === segment.length - 1) {
        atermninal = seg?.legs?.[seg.legs.length - 1]?.legInfo?.arrivalTerminal;
      }

      const codeShareObj = codeShareData?.find((data) => {
        const code = externalIdentifier?.carrierCode || carrierCode;
        return data.carrierCode === code;
      });

      return {
        label: externalIdentifier?.identifier
          ? `${externalIdentifier.carrierCode} ${externalIdentifier.identifier}`
          : `${carrierCode} ${identifier}`,
        img: codeShareObj?.carrierCodeIcon?._publishUrl,
      };
    });

    return {
      aircrafts: _aircrafts,
      dTermninal: dtermninal,
      aTermninal: atermninal,
    };
  }, [aemLabels]);

  const { dispatch } = useAppContext();

  const onClickCheckin = async () => {
    const airlines = [];
    const flightSectors = [];

    segment.forEach((seg) => {
      const {
        identifier: { carrierCode },
        international,
      } = seg;

      airlines.push(carrierCode);
      flightSectors.push(international ? 'International' : 'Domestic');
    });

    gtmEvent({
      event: GTM_ANALTYTICS.EVENTS.CHECK_IN_INITIATE,
      data: {
        PNR: recordLocator,
        Airline: airlines.join('|'),
        click_text: isSmartCheckin ? 'Smart Check-in' : 'Check-in',
        OD: `${origin}-${destination}`,
        trip_type: 'One Way',
        pax_details: '',
        departure_date: format(new Date(departure), dateFormats.ddMMyyyy),
        special_fare: '',
        flight_sector: flightSectors.join('|'),
        days_until_departure: differenceInCalendarDays(
          departure,
          new Date(),
        ).toString(),
      },
    });

    try {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: true });
      await getItinerary({ recordLocator, lastName, processFlag: 'checkin' });
      window.location.href = aemLabels?.getStartedCtaLink;
    } catch (error) {
      dispatch({
        type: webcheckinActions.SET_TOAST,
        payload: {
          variation: 'Error',
          show: true,
          description: 'Something Went Wrong',
        },
      });
    }
    dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
  };

  const onViewBoardingPass = async () => {
    try {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: true });
      await getItinerary({ recordLocator, lastName, processFlag: 'checkin' });
      const payload = {
        journeyKey,
        segmentKeys: [],
        passengerKeys: [],
      };

      LocalStorage.set(localStorageKeys.b_d_p, payload);

      window.location.href = aemLabels.viewBoardingPassLink;
    } catch (error) {
      dispatch({
        type: webcheckinActions.SET_TOAST,
        payload: {
          variation: 'Error',
          show: true,
          description: 'Something Went Wrong',
        },
      });
    }
    dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
  };
  const departureDateTime = new Date(departure)
  const currentDateTime = new Date()

  return (
    departureDateTime > currentDateTime && 
      <div className="wc-flight-checkin my-10">
        <div className="wc-flight-checkin__container">
          <div className="wc-flight-checkin__container__pnr">
            <HtmlBlock
              tagName="h5"
              html={formattedMessage(aemLabels?.flightTo?.html || '', {
                destination: destinationCityName,
              })}
            />
            <Chip
              size="sm"
              containerClass="wc-flight-checkin__container__pnr-chip p-0"
            >
              <div className="d-flex align-items-center justify-content-center ">
                <i className="icon-tick-filled icon-size-sm p-0" />
                <Text containerClass="ps-4 wc-flight-checkin__container__pnr__chip-text">
                  {aemLabels?.pnrStatus?.confirmed}
                </Text>
              </div>
            </Chip>
          </div>
          <div className="wc-flight-checkin__container__flight-details-container">
            <div className="wc-flight-checkin__container__flight-details">
              <div />
              <div className="wc-flight-checkin__container__flight-details-pnr pb-5">
                <div className="align-items-center justify-content-center d-flex">
                  <div className="d-flex gap-4">
                    {aircrafts.map((aircraft) => {
                      return (
                        <div
                          className="d-flex  align-items-center"
                          key={aircraft?.label}
                        >
                          <img
                            src={aircraft?.img}
                            alt="flight icon"
                            width="12px"
                            height="12px"
                          />
                          <Text containerClass="wc-flight-checkin__container__flight-details-pnr-flight ps-4">
                            {aircraft?.label}
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Text containerClass="wc-flight-checkin__container__flight-details-pnr-number">
                  {aemLabels?.pnrLabel}: <span>{recordLocator}</span>
                </Text>
              </div>
              <div className="wc-flight-checkin__journey-detail">
                <div className="wc-flight-checkin__journey-detail__from">
                  <span>{format(departure, dateFormats.HHmm)}</span>
                  <div className="from-details">
                    <h4>{origin}</h4>
                    <span>
                      {originCityName}, {dTermninal ? `T${dTermninal}` : ''}
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
                    <p className="pt-2">
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
                      {destinationCityName}, {aTermninal ? `T${aTermninal}` : ''}
                    </span>
                    <h4>{destination}</h4>
                  </div>
                </div>
              </div>
              <div className="wc-flight-checkin__dotted" />
              <div className="wc-flight-checkin__date-pax">
                <div className="align-items-center d-flex">
                  <i className="icon-calender  icon-size-lg" />
                  <span>{format(departure, dateFormats.ddMMMYY)}</span>
                </div>
                <div className="align-items-center d-flex">
                  <i className="icon-Passenger  icon-size-lg" />
                  <span>
                    {numberOfPassengers} {aemLabels?.paxLabel}
                  </span>
                </div>
              </div>
              <div className="wc-flight-checkin__dotted" />
              {scheduleSmartCheckin && (
                <div className="wc-flight-checkin__start-detail">
                  <p>{aemLabels?.webCheckInLabel}</p>
                  <span>
                    {aemLabels?.webCheckInDetails?.replace(
                      '{time}, {date}',
                      format(checkinStartTime, dateFormats?.webcheckinstarts),
                    )}
                  </span>
                </div>
              )}
              {scheduleSmartCheckin && (
                <Button
                  containerClass="my-8 "
                  color="primary"
                  variant="filled"
                  block
                  onClick={onClickCheckin}
                >
                  {aemLabels?.smartCheckInCTALabel}
                </Button>
              )}

              {webCheckOpen && !isAllPaxCheckedIn && (
                <Button
                  containerClass="my-8 "
                  color="primary"
                  variant="filled"
                  block
                  onClick={onClickCheckin}
                >
                  {aemLabels?.webCheckInLabel}
                </Button>
              )}
              {isAllPaxCheckedIn && webCheckOpen && (
                <Button
                  containerClass="my-8 "
                  color="primary"
                  variant="outlined"
                  block
                  onClick={onViewBoardingPass}
                >
                  <span>{aemLabels?.viewBoardingPassLabel}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

  );
};

FlightCard.propTypes = {
  booking: PropTypes.any,
};

export default FlightCard;
