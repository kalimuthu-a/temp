import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';

import format from 'date-fns/format';
import { dateFormats } from '../../constants';

const JourneyInfoPanel = ({
  pnrLabel,
  pnrStatus,
  bookingDetails,
  journeysDetail = [],
  paxLabel,
}) => {
  const { recordLocator, bookingStatus } = bookingDetails;
  const [isMobile] = useIsMobile();
  const passengerCount = journeysDetail[0]?.passengers?.length;

  const journeyTabs = useMemo(() => {
    return journeysDetail.map((journey) => {
      const {
        journeyKey,
        journeydetail: { origin, destination, arrival, departure },
      } = journey;
      return {
        id: journeyKey,
        origin,
        destination,
        arrival: format(arrival, dateFormats.ddMMMYY),
        departure: format(departure, dateFormats.ddMMMYY),
      };
    });
  }, []);
  const departureDate = journeyTabs?.[0]?.departure;
  const arrivalDate = journeyTabs?.[journeyTabs?.length - 1]?.arrival;
  return (
    <div className={isMobile ? 'wc-journey-info-panel' : 'wc-journey-info-panel undo-wc-journey-info-panel'}>
      <div className="wc-journey-info-panel-heading">
        {journeyTabs.map((tab) => {
          const { origin, destination, journeyKey } = tab;
          return (
            <div
              className="wc-journey-info-panel-heading-item"
              key={journeyKey}
            >
              {origin} <span /> {destination}
            </div>
          );
        })}
      </div>
      <div className="wc-journey-info-panel-body">
        {isMobile && (
        <div className="d-flex justify-content-between w-100 top">
          <div className="pnr">
            {pnrLabel}: <span className="pnr-info">{recordLocator}</span>
          </div>
          <Chip
            size="xs"
            variant="filled"
            color="secondary-light"
            border="system-success"
            txtcol="system-success"
          >
            {pnrStatus?.confirmed}
          </Chip>
        </div>
        )}
        <div className="d-flex addon-continer gap-12">
          <div className="d-flex gap-2 justify-content-center date-info">
            <Icon className="icon-calender" />
            {departureDate === arrivalDate
              ? departureDate
              : `${departureDate} - ${arrivalDate}`}
          </div>
          <div className="d-flex gap-2 justify-content-center pax-info">
            <Icon className="icon-Passenger" />
            {passengerCount} {paxLabel}
          </div>
        </div>
        {!isMobile && (
        <div className="d-flex gap-8">
          <div className="pnr">
            {pnrLabel}: <span className="pnr-info">{recordLocator}</span>
          </div>
          <Chip
            size="xs"
            variant="filled"
            color="secondary-light"
            border="system-success"
            txtcol="system-success"
          >
            <Icon className="icon-close-solid" size="sm" />
            <span>{pnrStatus?.confirmed}</span>
          </Chip>
        </div>
        )}
      </div>
    </div>
  );
};

JourneyInfoPanel.propTypes = {
  bookingDetails: PropTypes.shape({
    bookingStatus: PropTypes.any,
    recordLocator: PropTypes.any,
  }),
  journeysDetail: PropTypes.array,
  paxLabel: PropTypes.any,
  pnrLabel: PropTypes.any,
  pnrStatus: PropTypes.any,
};

export default JourneyInfoPanel;
