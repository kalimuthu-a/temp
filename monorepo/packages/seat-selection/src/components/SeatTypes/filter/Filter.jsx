import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSeatMapContext } from '../../../store/seat-map-context';
import { SEAT_AVAILABILITY } from '../../../constants/seatConfig';
import { CONSTANTS } from '../../../constants';
import './Filter.scss';
import premiumSeatFilterIcon from '../../../images/premium-filter.svg';
import selectedPremiumSeatFilterIcon from '../../../images/selected-premium-filter.svg';

const Filter = ({ category, validSeats, freeMealHighlighterClass }) => {
  const { setSeatProps, seatMainAemData, selectedSegment } = useSeatMapContext();

  const totalValidSeat = validSeats?.filter(
    (item) => item.availability === SEAT_AVAILABILITY.Open,
  ) || [];

  const {
    allSeat = '',
    free = '',
    premium = '',
    standard = '',
    xl = '',
  } = seatMainAemData?.seatTypes || {};
  const { availableLabel } = seatMainAemData || {};

  const [selectedButtonsClassName, setSelectedSeatsClassName] = useState([
    CONSTANTS.ALL_SEAT,
  ]);

  let buttonsArray = [];
  const buttonsArrayAsPerConfig = [];
  function getSeatTypeObject(seatTypeArr, segmentKey) {
    return seatTypeArr?.find((seatTypeObject) => (seatTypeObject ? seatTypeObject[segmentKey] : null));
  }

  const createFiltersAndButtons = (filters, segmentKey) => {
    if (!(CONSTANTS.ALL_SEAT in filters)) {
      const allSeatButton = {
        title: allSeat,
        subTitle: `${totalValidSeat.length} ${availableLabel}`,
        className: CONSTANTS.ALL_SEAT,
      };
      buttonsArray.push(allSeatButton);
    }
    // Iterate through each filter key
    let allSeatIndex = -1;
    let premiumSeatIndex = -2;
    // eslint-disable-next-line sonarjs/cognitive-complexity
    Object.keys(filters).forEach((key, index) => {
      let newKey;
      // Rename keys as requested
      switch (key) {
        case CONSTANTS.XL_SEAT:
          newKey = xl;
          break;
        case CONSTANTS.PREMIUM_SEAT:
          newKey = premium;
          break;
        case CONSTANTS.FREE_SEAT:
          newKey = free;
          break;
        case CONSTANTS.ALL_SEAT:
          newKey = allSeat;
          allSeatIndex = index;
          break;
        case CONSTANTS.STANDARd_SEAT:
          newKey = standard;
          break;
        default:
          newKey = key;
      }

      // Extracting data for the current key
      const data = getSeatTypeObject(filters[key], segmentKey) || null;
      if (data && key === CONSTANTS.PREMIUM_SEAT) {
        premiumSeatIndex = index;
      }
      if (data) {
        let subTitle;
        if (newKey === free || newKey === allSeat) {
          subTitle = data[segmentKey]
            ? `${data[segmentKey].count} ${availableLabel}`
            : '';
        } else {
          subTitle = data[segmentKey]
            ? `${data[segmentKey].minPrice}-${data[segmentKey].maxPrice}`
            : '';
        }

        // Constructing the button object
        const buttonObject = {
          title: newKey,
          subTitle,
          className: key,
        };

        // Adding the button object to the buttons array
        buttonsArray.push(buttonObject);
      }
    });

    if (allSeatIndex !== -1) {
      const allSeatButtonObject = buttonsArray.splice(allSeatIndex, 1)[0];
      buttonsArray.unshift(allSeatButtonObject);
    }
    if (premiumSeatIndex !== -2) {
      const premiumButtonObject = buttonsArray.splice(premiumSeatIndex, 1)[0];
      buttonsArray.splice(2, 0, premiumButtonObject);
    }

    // return buttonsArray;

    // Reorder buttonsArray based on seatType order
    Object.values(seatMainAemData?.seatTypes)?.forEach((seatKey) => {
      const matchedButton = buttonsArray?.find((item) => (item.title)?.toLowerCase() === seatKey?.toLowerCase());
      if (matchedButton) {
        buttonsArrayAsPerConfig.push(matchedButton);
      }
    });
    return buttonsArrayAsPerConfig.length ? buttonsArrayAsPerConfig : buttonsArray;
  };

  if (category && selectedSegment) {
    buttonsArray = createFiltersAndButtons(category, selectedSegment);
  }

  // Handle button click
  function handleButtonClick(indexNo, className) {
    const seatsWrapper = document.querySelectorAll(`.${CONSTANTS.SEAT_WRAPPER}`);
    const existingHighlights = seatsWrapper?.[1].querySelectorAll(`.${CONSTANTS.FREE_MEAL_HIGHLIGHTER_CLASS}`);
    existingHighlights.forEach((highlight) => highlight.remove());

    if (indexNo === 0) {
      // If the first button is clicked, deselect all other buttons
      setSelectedSeatsClassName([CONSTANTS.ALL_SEAT]);
    } else {
      setSelectedSeatsClassName((prevSelectedClassName) => {
        if (prevSelectedClassName.includes(className)) {
          return prevSelectedClassName.filter((i) => i !== className);
        }
        return [
          className,
          ...prevSelectedClassName.filter((i) => i !== CONSTANTS.ALL_SEAT),
        ];
      });
    }
  }

  useEffect(() => {
    if (selectedButtonsClassName.length === 0) {
      setSelectedSeatsClassName([CONSTANTS.ALL_SEAT]);
    }
    setSeatProps(selectedButtonsClassName);
    return () => {
      setSeatProps([]);
    };
  }, [selectedButtonsClassName]);

  useEffect(() => {
    const data = getSeatTypeObject(category?.[CONSTANTS.PREMIUM_SEAT], selectedSegment) || null;
    if (!data && selectedButtonsClassName?.includes?.(CONSTANTS.PREMIUM_SEAT)) {
      const newfiltersArr = selectedButtonsClassName.filter((item) => item !== CONSTANTS.PREMIUM_SEAT);
      setSeatProps(newfiltersArr);
      setSelectedSeatsClassName(newfiltersArr);
    }
  }, [selectedSegment]);

  return (
    <div className="filter">
      {buttonsArray.map((button, index) => (
        <button
          type="button"
          className={`${button.className} ${
            selectedButtonsClassName.includes(button.className)
              ? 'selected'
              : ''
          }`}
          onClick={() => handleButtonClick(index, button.className)}
          key={button.title}
          aria-pressed={selectedButtonsClassName.includes(button.className)}
          aria-label={`${button.title} ${button.subTitle} seats`}
        >
          {button.className === CONSTANTS.PREMIUM_SEAT && (
            selectedButtonsClassName.includes(CONSTANTS.PREMIUM_SEAT)
              ? (
                <img
                  src={selectedPremiumSeatFilterIcon}
                  alt="selectedPremiumSeatFilterIcon"
                  className="premiumSeatFilterIcon"
                />
              )
              : <img src={premiumSeatFilterIcon} alt="premiumSeatFilterIcon" className="premiumSeatFilterIcon" />
          )}
          <span className="title">
            {button.title}{' '}
          </span>
          {/* removed part of UI priority changes uncomment if its required in future */}
          {/* <span className="subtitle">{button.subTitle}</span> */}
        </button>
      ))}
    </div>
  );
};

Filter.propTypes = {
  category: PropTypes.object.isRequired,
  validSeats: PropTypes.array.isRequired,
};

export default Filter;
