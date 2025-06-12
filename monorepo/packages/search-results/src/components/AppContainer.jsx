import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import useAppContext from '../hooks/useAppContext';
import FlightItemShimmer from './Shimmer/FlightItemShimmer';
import Filter from './Filter/Filter';
import Recommended from './Recommended/Recommended';
import SearchResultsList from './SearchResultsList/SearchResultsList';
import NoResultsFound from './NoResults/NoResultsFound';
import LoyaltyMessage from './LoyaltyMessage/LoyaltyMessage';
import { srpActions } from '../context/reducer';

const AppContainer = ({ tripforCurrentSegment }) => {
  const {
    state: { appLoading, segmentLoading, main, sort }, dispatch,
  } = useAppContext();
  const metaLabel = main?.yourSelectedFlightText;
  const urlParams = new URLSearchParams(window.location.search);
  const metaFlight = urlParams.get('cid') || urlParams.get('utm_source');
  const flightNumber = urlParams.get('flightNumber');
  const [viewMoreFlights, setViewMoreFlights] = useState(false);
  const [flightExist, setFlightExist] = useState(false);

  useEffect(() => {
    if (flightNumber && flightNumber.length > 0) {
      return;
    }
    // Showing low to high fare flights on load
    const onLoad = { keyProp: 'lowCostFirst', value: 'Lowest fare first' };
    const payload = isEqual(sort, onLoad) ? {} : onLoad;
    dispatch({ type: srpActions.SET_SORT, payload });
  }, []);

  if (segmentLoading || appLoading) {
    return (
      <div>
        {[1, 2, 3, 4].map((i) => (
          <FlightItemShimmer key={i} />
        ))}
      </div>
    );
  }

  const metaLabelData = metaLabel?.split(' ') || [];

  return (
    <>
      {!metaFlight || viewMoreFlights || !flightExist ? <Filter /> : null}
      <LoyaltyMessage />
      {metaFlight && flightExist && (
        <h1 className="my-3 metaLabel">
          {metaLabelData[0]}{' '}
          <span className="text-green">{`${metaLabelData[1]} ${metaLabelData[2]}`}</span>
        </h1>
      )}
      {tripforCurrentSegment.length > 0 ? (
        <>
          {(!metaFlight || !flightExist || viewMoreFlights) &&
            !!main.recommendationsLabel && <Recommended />}

          <SearchResultsList
            metaFlight={metaFlight}
            viewMoreFlights={viewMoreFlights}
            setViewMoreFlights={setViewMoreFlights}
            setFlightExist={setFlightExist}
            flightExist={flightExist}
          />
        </>
      ) : (
        <NoResultsFound />
      )}
    </>
  );
};

AppContainer.propTypes = {
  tripforCurrentSegment: PropTypes.array,
};

export default AppContainer;
