import React from 'react';
import NoFlightImage from '../../assets/images/no-flights-found.svg';
import useAppContext from '../../hooks/useAppContext';

const NoResultsFound = () => {
  const {
    state: { isBurn, main },
  } = useAppContext();

  return (
    <div className="d-flex align-items-center flex-column gap-10 mt-10 mb-10">
      <img
        src={NoFlightImage}
        alt="no flight found"
        width="100px"
        height="100px"
      />
      <div
        className="h3"
        dangerouslySetInnerHTML={{
                __html: main?.noFlightsFoundLabel?.html || '',
              }}
      />

      {isBurn && <div className="no-results-desc-loyalty">{main?.noFlightsForLoyaltyMessage}</div>}
    </div>
  );
};

export default NoResultsFound;
