import React from 'react';
import { Pages } from 'skyplus-design-system-app/dist/des-system/globalConstants';

import useAppContext from '../../hooks/useAppContext';

const PNRHeading = () => {
  const {
    state: { pageType, flightSearchData },
  } = useAppContext();

  if (pageType !== Pages.FLIGHT_SELECT_MODIFICATION) {
    return null;
  }

  const pnr = flightSearchData?.bookingDetails?.recordLocator;
  return (
    <div className="srp-mf-container__heading">{pnr ? `PNR: ${pnr}` : ''}</div>
  );
};

export default PNRHeading;
