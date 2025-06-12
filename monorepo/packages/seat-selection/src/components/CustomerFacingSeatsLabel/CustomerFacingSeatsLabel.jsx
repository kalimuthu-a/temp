import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSeatMapContext } from '../../store/seat-map-context';

import './CustomerFacingSeatsLabel.scss';

const CustomerFacingSeatsLabel = ({ clickedSeats }) => {
  const {
    seatAdditionalAemData: {
      customerFacingSeatLabel = '',
      customerFacingFlightTypes = [],
      customerFacingSeats = {},
    } = {},
    seatMapData,
    selectedSeatMap,
  } = useSeatMapContext();

  const equivalentTyp = useMemo(() => {
    const { data: { seatMaps } } = seatMapData;

    const [{ seatMap: { equipmentType } = {} } = {}] = seatMaps.filter(
      ({ seatMap }) => seatMap.seatmapReference === selectedSeatMap,
    );

    return equipmentType;
  }, [seatMapData, selectedSeatMap]);

  const checkIfSeatIsFacingCustomer = (seat) => {
    return customerFacingSeats[equivalentTyp]?.includes(seat);
  };

  const isAnySeatFacingCustomer = clickedSeats.some((seat) => checkIfSeatIsFacingCustomer(seat));

  return (
    customerFacingFlightTypes?.includes(equivalentTyp)
    && isAnySeatFacingCustomer
      && (
      <div className="customerfacing__label">
        <div className="customerfacing__label__icon">
          <span className="icon-customer-facing-seats-1" />
          <span className="icon-customer-facing-seats-2" />
        </div>
        <div className="customerfacing__label__text">
          {customerFacingSeatLabel}
        </div>
      </div>
      )
  );
};

CustomerFacingSeatsLabel.propTypes = {
  clickedSeats: PropTypes.array,
};

CustomerFacingSeatsLabel.defaultProps = {
  clickedSeats: [],
};

export default CustomerFacingSeatsLabel;
