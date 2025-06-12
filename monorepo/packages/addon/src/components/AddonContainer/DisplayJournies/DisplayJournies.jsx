import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FlightJourneyTabs from 'skyplus-design-system-app/dist/des-system/FlightJourneyTab';
import { AppContext } from '../../../context/AppContext';
import { CONSTANTS } from '../../../constants';

const DisplayJournies = ({
  setTripIndex,
  journeydetails,
}) => {
  const {
    state: { tripIndex },
  } = React.useContext(AppContext);
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    const sectorList = [];
    journeydetails?.forEach((ssrObj, ssrIndex) => {
      const sectorObj = {
        origin: ssrObj?.journeydetail?.origin,
        destination: ssrObj?.journeydetail?.destination,
        key: ssrIndex,
      };
      sectorList.push(sectorObj);
    });

    if (window.pageType === CONSTANTS.ADDON_SEAT_SELECTION_CHECKIN) {
      setSectors([sectorList[0]]);
    } else {
      setSectors(sectorList);
    }
  }, [journeydetails]);

  return (
    <FlightJourneyTabs
      sectors={sectors}
      onChangeCallback={(ssrIndex) => (ssrIndex !== tripIndex ? setTripIndex(ssrIndex) : '')}
      selectedIndex={tripIndex}
    />
  );
};

DisplayJournies.propTypes = {
  setTripIndex: PropTypes.func,
  journeydetails: PropTypes.array,
};

export default DisplayJournies;
