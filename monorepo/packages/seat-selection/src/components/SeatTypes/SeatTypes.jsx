import PropTypes from 'prop-types';
import FreeMealButton from 'skyplus-design-system-app/dist/des-system/FreeMealButton';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { COOKIE_KEYS } from 'skyplus-design-system-app/src/constants';
import { CONSTANTS } from '../../constants';
import { useSeatMapContext } from '../../store/seat-map-context';

import Filter from './filter';
import Legend from './legend';
import './SeatTypes.scss';

const SeatTypes = ({ validSeats, isNext = false }) => {
  const { seatAdditionalAemData: { xlSeatIdentifier },
    seatMainAemData, category, seatMapData, selectedSegment,
  } = useSeatMapContext();

  const xlSeatWithFreeMealArr = seatMapData?.data?.filters?.xlSeatWithFreeMeal || [];

  const hasNonEmptyXlSeatForKey = () => {
    const entry = xlSeatWithFreeMealArr?.find((obj) => Object.prototype.hasOwnProperty.call(obj, selectedSegment));
    if (!entry) return false;

    const value = entry[selectedSegment];
    return typeof value === 'string' && value?.trim().length > 0;
  };

  const isCategory = Boolean(category && Object.keys(category).length);
  const isBoeingFlight = seatMapData?.data?.seatMaps?.[0]?.seatMap?.name?.startsWith(CONSTANTS.BOEING_FLIGHT);
  const personasType = [CONSTANTS.ANONYMOUS, CONSTANTS.MEMBER].includes(Cookies.get(COOKIE_KEYS.PERSONA_TYPE) || '');

  const handleSelect = () => {
    const xlFreeMealSeats = seatMapData?.data?.filters?.xlSeatWithFreeMeal?.reduce((acc, currentObj) => {
      return { ...acc, ...currentObj };
    }, {});

    const seatsWrapper = document.querySelectorAll(`.${CONSTANTS.SEAT_WRAPPER}`);
    const existingHighlights = seatsWrapper?.[1]?.querySelectorAll(`.${CONSTANTS.FREE_MEAL_HIGHLIGHTER_CLASS}`);
    existingHighlights?.forEach((highlight) => highlight.remove());

    const buttons = seatsWrapper?.[1]?.querySelectorAll('button');
    let rowHighlighted = false;

    buttons?.forEach((button) => {
      const dataDesignator = button.getAttribute('data-designator');

      const seats = xlFreeMealSeats[selectedSegment]?.split(',');
      if (seats.includes(dataDesignator) && !rowHighlighted) {
        const rect = button.getBoundingClientRect();
        const rectLeft = rect?.left ?? 0;
        const seatsLeft = seatsWrapper?.[1]?.getBoundingClientRect()?.left ?? 0;
        const distanceFromLeft = rectLeft - seatsLeft;
        if (seatsWrapper?.length > 1 && seatsWrapper?.[1]) {
          const newElement = document.createElement('div');
          newElement.classList.add(CONSTANTS.FREE_MEAL_HIGHLIGHTER_CLASS);
          newElement.style.left = `${distanceFromLeft - 7}px`;
          seatsWrapper?.[1]?.insertAdjacentElement('afterbegin', newElement);
          rowHighlighted = true;
        }
      }
    });
  };

  return (
    <>
      {isCategory && (
        <>
          <h3 className="seat-type-header">
            {seatMainAemData?.seatTypesHeading}
          </h3>
          {!isNext
          && (
          <Filter
            category={category}
            validSeats={validSeats}
            freeMealHighlighterClass={CONSTANTS.FREE_MEAL_HIGHLIGHTER_CLASS}
          />
          )}
          {personasType && !isBoeingFlight && hasNonEmptyXlSeatForKey() ? (
            <FreeMealButton
              btnText={xlSeatIdentifier || ''}
              infoIconClass="sky-icons icon-arrow-top-right sm"
              onSelect={() => {
                handleSelect();
              }}
            />
          ) : null}
        </>
      )}
      <Legend isNext={isNext} />
    </>
  );
};

SeatTypes.propTypes = {
  validSeats: PropTypes.array.isRequired,
  isNext: PropTypes.bool,
};

export default SeatTypes;
