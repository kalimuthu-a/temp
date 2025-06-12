import PropTypes from 'prop-types';
import React, {
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import {
  specialFareCodes,
  a11y,
} from 'skyplus-design-system-app/dist/des-system/globalConstants';
import get from 'lodash/get';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import classNames from 'classnames';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

import FlightDetailsSlider from '../FlightDetailsSlider/FlightDetailsSlider';
import JourneyLap from '../common/JourneyLap/JourneyLap';
import LayoverDetails from '../LayoverDetails/LayoverDetails';

import pushAnalytics from '../../utils/analyticsEvent';
import { ANALTYTICS, FARE_CLASSES } from '../../constants';
import { key as keyboardsKey } from '../../utils/a11y';
import Normal from './SearchResultsItem/Right/Normal';
import Next from './SearchResultsItem/Right/Next';
import FareTypeContainer from './FareTypeContainer';
import useAppContext from '../../hooks/useAppContext';
import { isCombinableClass } from './searchResultsUtils';

const SearchResultItem = ({
  onClick,
  selectedJounery,
  item,
  expanded,
  onClickFareType,
  index,
  currencyCode,
  metaFlight,
  flightExist,
  flightStatus,
}) => {
  const ref = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const [layoverDetails, setLayoverDetails] = useState(false);

  const {
    state: {
      additional,
      main,
      analyticsContext,
      isProjectNextEnabled,
      selectedFares,
      selectedTripIndex,
    },
  } = useAppContext();

  const [FareClass, setFareClass] = useState(() => {
    return get(selectedJounery, ['fare', 'FareClass'], FARE_CLASSES.ECONOMY);
  });

  const {
    stops,
    passengerFares,
    journeyKey,
    designator: { departureF, arrivalF, duration },
    startsAtFormatted,
    startsAtPublishFare,
    startsAtLoyaltyPoints,
    specialFare,
    flightNumbers,
    flightDetailsDescriptiona11y,
    segments,
    isSold,
  } = item;

  const soloFareClass = useMemo(() => {
    if (!isProjectNextEnabled) return false;

    const hasBusinessClass = passengerFares?.some?.(
      (row) => row.FareClass === FARE_CLASSES.BUSINESS,
    );
    const hasEconomyClass = passengerFares?.some?.(
      (row) => row.FareClass === FARE_CLASSES.ECONOMY,
    );

    if (hasBusinessClass && hasEconomyClass) return false;

    return hasEconomyClass ? FARE_CLASSES.ECONOMY : FARE_CLASSES.BUSINESS;
  }, [isProjectNextEnabled, passengerFares]);

  const showFlightDetailSlider = (e) => {
    e.preventDefault();
    pushAnalytics({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.POP_UP_OPEN_FLIGHT_DETAILS,
      data: {
        productInfo: {
          airportCodePair: analyticsContext.product.productInfo.airportCodePair,
          sector: analyticsContext.product.productInfo.sector,
        },
      },
    });
    setShowDetails(true);
  };

  const onCloseFlightDetailSlider = () => {
    setShowDetails(false);
  };

  const onClickHandler = (e) => {
    if (Boolean(isSold) && Boolean(main.soldOutLabel)) return;

    if (
      ref.current.contains(e.target) &&
      !expanded &&
      (!isProjectNextEnabled ||
        metaFlight?.includes('metasearch') ||
        metaFlight?.includes('MetaSearch'))
    ) {
      const selectedFaresPrices = selectedFares.filter(
        (row, key) => Boolean(row) && key !== selectedTripIndex,
      );
      const selectedFaresCombinability = selectedFaresPrices.map(
        (row) => row.fare.combinabilityData,
      );

      const fare = passengerFares.find(
        (row) =>
          row.isActive &&
          isCombinableClass(selectedFaresCombinability, row.productClass),
      );
      onClick(journeyKey, {
        ...item,
        fare,
        stops,
        journeyKey,
        index,
      });
    }
  };
  useEffect(() => {
    // Auto-trigger the onClickHandler when the component mounts and is rendered
    if (
      ref.current &&
      (metaFlight?.includes('metasearch') ||
        metaFlight?.includes('MetaSearch')) &&
      flightStatus
    ) {
      ref.current.click(); // Simulates a click event after rendering
    }
  }, [journeyKey, flightExist]);
  /**
   *
   * @param {import("react").KeyboardEvent<HTMLDivElement>} e
   */
  const onKeyUpHandler = (e) => {
    if (e.key === keyboardsKey.enter) {
      e.target.click();
      onClickHandler();
    }
  };

  const onClickFareTypeHandler = (fare) => {
    onClickFareType({
      ...item,
      fare,
      stops,
      journeyKey,
      index,
    });
  };

  const fareAvailabilityKey = get(
    selectedJounery,
    ['fare', 'fareAvailabilityKey'],
    null,
  );

  const onClickLap = (e) => {
    e.stopPropagation();

    pushAnalytics({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.POP_UP_OPEN_LAYOVER_DETAILS,
      data: {
        productInfo: {
          airportCodePair: analyticsContext.product.productInfo.airportCodePair,
          sector: analyticsContext.product.productInfo.sector,
        },
      },
    });

    setLayoverDetails(true);
  };

  const onCloseLayover = (e) => {
    e.stopPropagation();
    setLayoverDetails(false);
  };

  useLayoutEffect(() => {
    if (expanded) {
      setTimeout(() => {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        });
      }, 100);
    }
  }, [expanded]);

  const faiAccordianHeadClassName = classNames('fare-accordion__head', {
    'project-next': isProjectNextEnabled,
    disabled: Boolean(isSold) && Boolean(main.soldOutLabel),
  });

  const onClickFareClassTab = (_FareClass) => {
    if (Boolean(isSold) && Boolean(main.soldOutLabel)) return; // Preventing click events on sold-out flights
    setFareClass(_FareClass);

    const selectedFaresPrices = selectedFares.filter(
      (row, key) => Boolean(row) && key !== selectedTripIndex,
    );
    const selectedFaresCombinability = selectedFaresPrices.map(
      (row) => row.fare.combinabilityData,
    );

    const fare = passengerFares.find(
      (row) =>
        row.isActive &&
        row.FareClass === _FareClass &&
        isCombinableClass(selectedFaresCombinability, row.productClass),
    );

    onClick(journeyKey, {
      ...item,
      fare,
      stops,
      journeyKey,
      index,
      FareClass: _FareClass,
    });
  };

  const isInternational = useMemo(() => {
    return segments.some((row) => row.international);
  }, []);

  const renderFareComponent = () => {
    if (isSold && Boolean(main.soldOutLabel)) {
      return (
        <Chip
          color="secondary-light"
          txtcol="system-information"
          variant="outlined"
          size="md"
          containerClass="sold-out-chip"
        >
          <Icon className="icon-add-ons-6e-xtras" size="xs" />
          {main?.soldOutLabel}
        </Chip>
      );
    }

    if (isProjectNextEnabled) {
      return (
        <Next
          FareClass={expanded && FareClass}
          onClick={onClickFareClassTab}
          passengerFares={passengerFares}
          economyLabel={main.economyLabel}
          nextLabel={main.nextLabel}
          startsAtLabel={main.startsAtLabel}
          nextBackground={main.nextBackground}
          currencyCode={currencyCode}
        />
      );
    }
    return (
      <Normal
        startsAtFormatted={startsAtFormatted}
        startsAtLabel={main.startsAtLabel}
        fillingFast={item.fillingFast}
        fillingFastLabel={main.fillingFastLabel}
        passengerFares={passengerFares}
        additional={additional}
        startsAtLoyaltyPoints={startsAtLoyaltyPoints}
        startsAtPublishFare={startsAtPublishFare}
      />
    );
  };

  // Hide Flight
  if (!main?.soldOutLabel && isSold) return null;

  return (
    <div
      className="srp__search-result-list__item"
      ref={ref}
      data-journey-key={journeyKey}
      onClick={onClickHandler}
      role="row"
      tabIndex={0}
      onKeyUp={onKeyUpHandler}
      {...(soloFareClass && {
        onClick: () => {
          onClickFareClassTab(soloFareClass);
        },
        onKeyUp: (event) => {
          if (event.keyCode === a11y.keyCode.enter) {
            onClickFareClassTab(soloFareClass);
          }
        },
      })}
      aria-selected={expanded}
      aria-label={`Select Flight departing at ${departureF} for ${startsAtFormatted}`}
      aria-expanded={expanded}
    >
      <div className="fare-accordion">
        <div
          className={faiAccordianHeadClassName}
          {...(soloFareClass && {
            style: { cursor: Boolean(isSold) && Boolean(main.soldOutLabel) ? 'disabled' : 'pointer' },
          })}
        >
          <div className="fare-accordion__head__flight-info-pri">
            <div className="flight-number d-flex gap-4 align-items-center">
              <Text variation="body-small-regular">
                <HtmlBlock
                  tagName="div"
                  html={flightNumbers}
                  className="d-flex align-items-center"
                />
              </Text>
              {specialFare &&
                specialFare.specialFareCode === specialFareCodes.VAXI && (
                  <Chip
                    txtcol="system-information"
                    color="secondary-light"
                    variant="filled"
                    size="xs"
                    containerClass="f-w-500"
                  >
                    {specialFare?.specialFareLabel}
                  </Chip>
                )}
            </div>
            <div className="fare-accordion__head__flight-info-pri__flight-details">
              <div className="flight-details__flight-departure">
                <Text variation="sh3" containerClass="time">
                  {departureF}
                </Text>
                <Text variation="body-small-light" containerClass="terminal">
                  {item.getDeparture()}
                </Text>
              </div>
              <JourneyLap
                containerClass="flex-grow-1"
                duration={duration}
                stops={stops}
                onClickLap={onClickLap}
                stopsLabel={main.stopsLabel}
                nonStopLabel={main.nonStopLabel}
              />
              <div className="flight-details__flight-arrival">
                <Text variation="sh3" containerClass="time">
                  {arrivalF}
                </Text>
                <Text variation="body-small-light" containerClass="terminal">
                  {item.getArrival()}
                </Text>
              </div>
            </div>
          </div>

          {renderFareComponent()}
        </div>

        {expanded && (
          <FareTypeContainer
            additional={additional}
            isProjectNextEnabled={isProjectNextEnabled}
            passengerFares={passengerFares}
            flightDetailsDescriptiona11y={flightDetailsDescriptiona11y}
            journeyKey={journeyKey}
            onClickFareTypeHandler={onClickFareTypeHandler}
            fareAvailabilityKey={fareAvailabilityKey}
            showFlightDetailSlider={showFlightDetailSlider}
            FareClass={FareClass}
            isInternational={isInternational}
            segments={segments}
          />
        )}
      </div>

      {showDetails && selectedJounery && (
        <FlightDetailsSlider
          onClose={onCloseFlightDetailSlider}
          flightData={item}
          selectedJounery={selectedJounery}
          isInternational={isInternational}
        />
      )}

      {layoverDetails && (
        <LayoverDetails onClose={onCloseLayover} segments={item.segments} />
      )}
    </div>
  );
};

SearchResultItem.propTypes = {
  onClick: PropTypes.func,
  onClickFareType: PropTypes.func,
  selectedJounery: PropTypes.shape({
    journeyKey: PropTypes.any,
  }),
  item: PropTypes.any,
  expanded: PropTypes.bool,
  index: PropTypes.number,
  currencyCode: PropTypes.string,
  metaFlight: PropTypes.any,
  flightExist: PropTypes.bool,
  flightStatus: PropTypes.any,
};

export default SearchResultItem;
