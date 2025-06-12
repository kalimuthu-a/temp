import React, { useEffect, useMemo, useState } from 'react';
import get from 'lodash/get';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { delay } from 'skyplus-design-system-app/dist/des-system/utils';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import PropTypes from 'prop-types';
import { specialFareCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import SearchResultItem from './SearchResultItem';
import OfferList from '../OfferList/OfferList';
import { srpActions } from '../../context/reducer';
import { selectedTripAvailableJourney } from '../../utils/flight';
import useAppContext from '../../hooks/useAppContext';
import SpecialFareApplied from '../SpecialFareApplied/SpecialFareApplied';
import { setViewItemListGtm } from '../../utils/analyticsUtils';
import { onExpandItem } from './searchResultsUtils';
import NoResultsFound from '../NoResults/NoResultsFound';
import { isDoubleTripleSeatsNotAllowed } from '../../utils/continueHandler';
import { FARE_CLASSES, ANALTYTICS } from '../../constants';

const SearchResultsList = ({ metaFlight, viewMoreFlights, setViewMoreFlights, setFlightExist, flightExist }) => {
  const {
    state: {
      trips,
      selectedTripIndex,
      selectedFares,
      sort,
      filters,
      additional,
      flightSearchData,
      analyticsContext,
      searchContext,
      googleAnalyticsContext,
      combinabilityMap,
      main,
      firstTimeLoad,
      isEarn,
    },
    dispatch,
  } = useAppContext();
  const btnlabel = main?.moreOptionsText;

  const [toastProps, setToastProps] = useState({});
  const [flightStatus, setFlighStatus] = useState(false);
  const showToast = (description) => {
    setToastProps({
      flag: true,
      title: 'Information',
      position: 'top-bottom',
      description,
      variation: 'notifi-variation--Information',
      onClose: () => {
        setToastProps(null);
      },
      autoDismissTimeer: window?._msdv2?.autoToastDismissTimer ?? 5000,
    });
  };
  const [selectedJourney, setSelectedJourney] = useState(null);
  const viewMore = () => {
    setViewMoreFlights(!viewMoreFlights);
  };
  const metaFlightNumbersArray = new URLSearchParams(window.location.search)
  .get('flightNumber')
  ?.split(',')
  .flat() ?? [];
  const { rows, appliedSpecCount, specialFare } = useMemo(() => {
    const journiesAvailable = trips[selectedTripIndex]?.journeysAvailable || [];

    if (journiesAvailable.length === 0) {
      return {
        rows: [],
        appliedSpecCount: 0,
        specialFare: null,
      };
    }

    const {
      journies,
      recommended,
      appliedSpecialfareCount,
      appliedSpecialFare,
      isProjectNext,
    } = selectedTripAvailableJourney(
      journiesAvailable,
      sort,
      filters,
      additional,
      flightSearchData.currencyCode,
      combinabilityMap,
      firstTimeLoad[selectedTripIndex] ?? true,
      selectedTripIndex,
      isEarn,
    );
    if (metaFlightNumbersArray?.length) {
      const selectedFlight = metaFlightNumbersArray[selectedTripIndex];
      const selectedFlightNumbers = selectedFlight.split('_');

      const allFlightsExist = journies.some((item) =>
        selectedFlightNumbers.every((flightNumber) => {
          return item?.aircraftNumbers?.includes(flightNumber);
        }),
      );
      setFlighStatus(allFlightsExist);
      setFlightExist(allFlightsExist);
      if (!allFlightsExist) {
        showToast(main?.flightAvailabilityStatus || 'The selected flight is not available ');
      }
    }
    setTimeout(() => {
      dispatch({
        type: srpActions.SET_RECOMMENDED_FARES,
        payload: {
          recommended,
          isProjectNextEnabled: !window.disableProjectNext && isProjectNext,
        },
      });
    }, 200);

    return {
      rows: journies,
      appliedSpecCount: appliedSpecialfareCount,
      specialFare: appliedSpecialFare,
    };
  }, [selectedTripIndex, sort, filters, trips]);

  const onExpand = (journeyKey, selected) => {
    const { selectedPaxInformation, selectedSpecialFare } = searchContext;
    let { fare } = selected;
    const { FareClass } = selected;

    const segments = searchContext.getSegment();

    if (
      searchContext.payloadPromotionCode === specialFareCodes.UMNR &&
      FareClass === FARE_CLASSES.BUSINESS
    ) {
      dispatch({
        type: srpActions.SET_TOAST,
        payload: {
          variation: 'Error',
          show: true,
          description: main.nextDisableForUMNR,
          analyticsData: {
            component: 'Select',
            action: ANALTYTICS.INTERACTION.LINK_BUTTON_CLICK,
          },
        },
      });
      fare = null;
    }

    const { variation, error } = isDoubleTripleSeatsNotAllowed(
      selectedPaxInformation.types,
      selected,
      selectedSpecialFare,
      additional,
    );

    if (error) {
      dispatch({
        type: srpActions.SET_TOAST,
        payload: {
          variation,
          show: true,
          description: error,
          analyticsData: {
            component: 'Select',
            action: ANALTYTICS.INTERACTION.LINK_BUTTON_CLICK,
          },
        },
      });
      fare = null;
    }

    if (segments && segments[selectedTripIndex]) {
      let _error = false;
      const { nextDeparture, prevArrival } = segments[selectedTripIndex];
      if (nextDeparture) {
        const flightArrival = selected.designator.arrival;
        const timeDiff = differenceInMinutes(nextDeparture, flightArrival);

        _error = timeDiff < 60;
      }
      if (prevArrival) {
        const flightDeparture = selected.designator.departure;
        const timeDiff = differenceInMinutes(flightDeparture, prevArrival);

        _error = timeDiff < 60 || error;
      }

      if (_error) {
        dispatch({
          type: srpActions.SET_TOAST,
          payload: {
            variation,
            show: true,
            description: additional.overlappingFlightError,
            analyticsData: {
              component: 'Select',
              action: 'Link/ButtonClick',
            },
          },
        });
        fare = null;
        return;
      }
    }

    if (fare) {
      onExpandItem({
        journeyKey,
        selected,
        selectedJourney,
        selectedFares,
        searchContext,
        analyticsContext,
        dispatch,
        selectedTripIndex,
        pleaseSelectFlightLabel: additional.pleaseSelectFlightLabel,
      });
    }

    setSelectedJourney(journeyKey);
  };

  const onClickFareType = (passengerFare) => {
    dispatch({
      type: srpActions.SET_SELECTED_FARES,
      payload: passengerFare,
    });
  };

  const selectedJounery = get(selectedFares, [selectedTripIndex], null);

  useEffect(() => {
    async function pushGTAECommerce() {
      if (selectedJounery) {
        setSelectedJourney(selectedJounery.journeyKey);
      }

      await delay(1.5);

      const segments = searchContext.getSegment();
      const { selectedDate } = segments[selectedTripIndex] || {};

      setViewItemListGtm(
        rows,
        googleAnalyticsContext,
        selectedTripIndex,
        selectedDate,
      );
    }

    pushGTAECommerce();
  }, [selectedTripIndex]);

  if (rows.length === 0) {
    return <NoResultsFound />;
  }

  return (
    <div className="srp__search-result-list" role="rowgroup">
      {appliedSpecCount > 0 && (
        <SpecialFareApplied
          count={appliedSpecCount}
          fareByResponse={specialFare}
        />
      )}
      {(metaFlight?.includes('metasearch') || metaFlight?.includes('MetaSearch')) && flightExist ? (
        <>
          {rows.slice(0, 1).map((row, index) => (
            <SearchResultItem
              item={row}
              onClick={onExpand}
              expanded={row.journeyKey === selectedJourney}
              key={row.journeyKey}
              selectedJounery={selectedJounery}
              onClickFareType={onClickFareType}
              index={index + 1}
              currencyCode={flightSearchData.currencyCode}
              metaFlight={metaFlight}
              flightExist={flightExist}
              flightStatus={flightStatus}
            />
      ))}
          {viewMoreFlights && rows.slice(1).map((row, index) => (
            <SearchResultItem
              item={row}
              onClick={onExpand}
              expanded={row.journeyKey === selectedJourney}
              key={row.journeyKey}
              selectedJounery={selectedJounery}
              onClickFareType={onClickFareType}
              index={index + 3}
              currencyCode={flightSearchData.currencyCode}
              flightExist={flightExist}
              flightStatus={flightStatus}
            />
      ))}
          {!viewMoreFlights && (
          <div
            className="body-small-medium cursor-pointer
                        text-primary-main
                        text-center srp__search-result-list__explore-btn"
            onClick={viewMore}
            role="presentation"
          ><span className="srp__search-result-list__explore-btn__label">{btnlabel}</span>
            <Icon
              tabIndex="0"
              role="button"
              onClick={viewMore}
              className="icon-accordion-down-simple srp__search-result-list__explore-btn__arrow"
            />
          </div>
)}
        </>
) : (
  <>
    {rows.slice(0, 2).map((row, index) => (
      <SearchResultItem
        item={row}
        onClick={onExpand}
        expanded={row.journeyKey === selectedJourney}
        key={row.journeyKey}
        selectedJounery={selectedJounery}
        onClickFareType={onClickFareType}
        index={index + 1}
        currencyCode={flightSearchData.currencyCode}
        flightExist={flightExist}
        flightStatus={flightStatus}
      />
      ))}
    {additional.offersDescription.length > 0 && (
    <OfferList offers={additional.offersDescription} />
      )}
    {rows.slice(2).map((row, index) => (
      <SearchResultItem
        item={row}
        onClick={onExpand}
        expanded={row.journeyKey === selectedJourney}
        key={row.journeyKey}
        selectedJounery={selectedJounery}
        onClickFareType={onClickFareType}
        index={index + 3}
        currencyCode={flightSearchData.currencyCode}
        flightExist={flightExist}
        flightStatus={flightStatus}
      />
      ))}
  </>
) }
      {toastProps?.flag ? (
        <Toast
          position={toastProps.position}
          renderToastContent={toastProps.renderToastContent}
          onClose={toastProps.onClose}
          variation={toastProps.variation}
          containerClass={toastProps.containerClass}
          description={toastProps.description}
          autoDismissTimeer={toastProps.autoDismissTimeer}
        />
      ) : null}
    </div>
  );
};

SearchResultsList.propTypes = {
  metaFlight: PropTypes.any,
  viewMoreFlights: PropTypes.bool,
  setViewMoreFlights: PropTypes.func,
  setFlightExist: PropTypes.bool,
  flightExist: PropTypes.bool,
};
export default SearchResultsList;
