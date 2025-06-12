import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import formatCurrency from 'skyplus-design-system-app/src/functions/formatCurrency';
import { useSeatMapContext } from '../../store/seat-map-context';
import './RecommendedSeats.scss';
import { pushAnalytic } from '../../utils/analyticEvents';

const RecommendedSeats = ({ passengers, seatMapData }) => {
  const {
    seatMainAemData,
    seatAdditionalAemData,
    selectedSegment,
    segmentData,
    setSegmentData,
    recommendedSeatsData,
    removeRecSeats,
    setRemoveRecSeats,
    extraSeatKeysData,
    addedRecommededSeats,
    setAddedRecommededSeats,
    updateSelectedSegment,
    updateSelectedSeatMap,
    updatePassengerSelected,
    passengerData,
    isModifyFlow,
  } = useSeatMapContext();
  const initalActiveIndexes = [0, 1];
  const [activeIndex, setActiveIndex] = useState(0);
  const [recommendedSeatsList, setRecommendedSeatsList] = useState(null);
  const [isRecSeatsAdded, setIsRecSeatsAdded] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(true);
  const radiosRef = useRef(null);

  const segmentKeysList = segmentData?.map((segment) => segment.segmentKey);

  // destrucring aem data
  const { recommendedSeats } = seatMainAemData || {};
  const { moreLabel, allTogetherLabel, seatType, addedRecommendation } = seatAdditionalAemData || {};
  const { free, standard } = seatType || {};
  const firstLetter = allTogetherLabel?.charAt(0).toUpperCase() || {};
  const restOfTheString = allTogetherLabel?.slice(1).toLowerCase() || {};
  const allTogetherLabelFormatted = firstLetter + restOfTheString;

  // recommeded seats data destructing
  const newRecData = recommendedSeatsData?.data?.recommendationsBySegments;

  const [recsBySeg] = recommendedSeatsList || [];
  const { currencyCode: currCode } = recsBySeg?.find((item) => item.currencyCode) || {};

  // new code for recommended seats radios
  const getSegmentBasedRecommend = () => {
    const obj = {};
    const segKey = selectedSegment;
    newRecData?.forEach((element) => {
      const segmentKey = Object.keys(element)[0];
      const paxArray = element[segmentKey];
      if (!obj[segmentKey]) obj[segmentKey] = [];
      obj[segmentKey].push(paxArray);
    });

    return obj[segKey];
  };

  useEffect(() => {
    setRecommendedSeatsList(getSegmentBasedRecommend());
  }, [selectedSegment]);

  // use of uniq for radios
  const radioName = uniq();

  // select recommended seats in seatmap logic
  const handleRadioChange = (seats, id) => {
    const recSeatsList = Object.values(seats).map((seat) => ({
      passengerKey: seat.passengerKey,
      extraSeatTag: seat.extraSeatTag,
      unitKey: seat.unitKey,
      designator: seat.designator,
    }));
    // setting state to keep radios checked for segment
    setAddedRecommededSeats((prevState) => ({
      ...prevState,
      [selectedSegment]: id,
    }));

    const passengersWithExtraSeatTags = recSeatsList?.filter(
      (passenger) => passenger.extraSeatTag,
    );

    const unitKeys = recSeatsList?.map((passenger) => passenger.unitKey);

    // find rec seats in seatMapData
    let seatsData = unitKeys.map((unitKey) => seatMapData.find(({ unitKey: key }) => key === unitKey));
    if (
      seatsData
      && seatsData.some((seat) => seat === null || seat === undefined)
    ) {
      seatsData = [];
    }

    // adding recommended seats to segement
    const addSeatsToSelectedSegment = segmentData?.reduce((acc, val) => {
      if (val.segmentKey !== selectedSegment) return [...acc, val];
      let res = { ...val };
      let paxSegment = val.passengerSegment;
      let otherPassengers = [];

      const filterExtraSeats = recSeatsList.filter((passenger) => {
        const isInExtraSeatKeys = extraSeatKeysData.some(
          (extraPassenger) => extraPassenger.passengerKey === passenger.passengerKey,
        );

        const isInPassengersWithExtra = passengersWithExtraSeatTags.some(
          (extraPassenger) => extraPassenger.passengerKey === passenger.passengerKey,
        );

        return !(isInExtraSeatKeys || isInPassengersWithExtra);
      });

      otherPassengers = [...filterExtraSeats];

      const extraSeatPax = [
        ...passengersWithExtraSeatTags,
        ...otherPassengers,
        ...extraSeatKeysData,
      ];

      extraSeatPax.forEach((passenger) => {
        const { passengerKey: key } = passenger;
        const matchingIndex = recSeatsList.findIndex(
          (p) => p.passengerKey === key,
        );
        if (matchingIndex !== -1) {
          const seatToAdd = seatsData[matchingIndex];
          const updatedPassenger = {
            ...passenger,
            seats: [seatToAdd],
          };
          paxSegment = {
            ...paxSegment,
            [key]: { ...paxSegment[key], ...updatedPassenger },
          };
        }
      });

      res = { ...res, passengerSegment: { ...paxSegment } };

      return [...acc, res];
    }, []);

    setSegmentData(addSeatsToSelectedSegment);

    // handle toast state
    if (seatsData.length > 0) {
      setIsRecSeatsAdded(true);
      setRemoveRecSeats(false);
      const selectedIndex = segmentKeysList.indexOf(selectedSegment);

      if (selectedIndex > -1 && selectedIndex < segmentKeysList.length - 1) {
        const nextSegmentKey = segmentKeysList[selectedIndex + 1];
        const { seatmapReference } = segmentData[selectedIndex + 1];
        const nextSegPaxWithNoSeat = passengerData[0];
        setTimeout(() => {
          updateSelectedSegment(nextSegmentKey);
          updateSelectedSeatMap(seatmapReference);
          updatePassengerSelected(nextSegPaxWithNoSeat);
        }, 2000);
      }
    }
  };

  // function to remove added recommeded seats
  const removeRecommendedSeats = () => {
    // Remove the selected radio button ID for the selected segment
    setAddedRecommededSeats((prevSelected) => ({
      ...prevSelected,
      [selectedSegment]: null,
    }));

    setIsRecSeatsAdded(false);
  };

  useEffect(() => {
    if (removeRecSeats) {
      removeRecommendedSeats();
    }
  }, [removeRecSeats]);

  // toast setup
  const toastMessage = addedRecommendation;
  const toastProps = {
    onClose: () => {
      setIsRecSeatsAdded(false);
    },
    position: 'bottom-top',
    variation: 'notifi-variation--Success',
    description: toastMessage,
    containerClass: 'recommeded-seats-toast',
    infoIconClass: 'icon-check',
    autoDismissTimeer: 2000,
  };

  useEffect(() => {
    if (isRecSeatsAdded) {
      pushAnalytic({
        data: {
          _event: 'warning',
          warning: false,
          isModifyFlow: isModifyFlow.enable,
          warningMessage: toastProps.description,
          component: 'button',
        },
        event: 'warning',
      });
    }
  }, [isRecSeatsAdded]);

  const renderAccordionContent = () => {
    // Using map and slice to get the name of the passenger at index 0
    const passengerName = passengers?.slice(0, 1).map((passenger) => {
      return `${passenger?.name?.first} ${passenger?.name?.last}`;
    });
    const generateUniqueId = (idx) => `radio_${idx}`;

    return (
      <div className="recommended-seats-accordian">
        <div className="recommended-seats-accordian-passenger-name">
          {passengerName}
          <span className="recommended-seats-accordian-more">
            {passengers && passengers.length > 1
              ? `+ ${passengers.length - 1} ${moreLabel}`
              : ''}
          </span>
        </div>
        <fieldset role="group">
          {recommendedSeatsList?.map((radioItem, idx) => {
            const seatList = [];
            const unitKeys = [];
            const seatCounts = { free: 0, standard: 0, premium: 0 };
            let totalPrice = 0;

            radioItem.forEach((paxItem) => {
              const { passengerKey, extraSeatTag, units, actualTotalPrice } = paxItem;
              totalPrice += actualTotalPrice;

              units.forEach((unit) => {
                const { unitKey, designator, seatTag } = unit;
                const seatTagLower = seatTag.toLowerCase();

                if (unitKey !== 0) {
                  // Exclude elements with a value of 0
                  seatList[designator] = {
                    passengerKey,
                    extraSeatTag,
                    unitKey,
                    designator,
                  }; // Assign object to designator key in seatList

                  // Add unitKey to unitKeys array
                  unitKeys.push(unitKey);

                  // Update seatCounts based on seatTag
                  if (seatTagLower === 'free') {
                    seatCounts.free += 1;
                  } else if (seatTagLower === 'standard') {
                    seatCounts.standard += 1;
                  } else if (seatTagLower === 'premium') {
                    seatCounts.premium += 1;
                  }
                }
              });
            });

            let seatCategoryDisplay = '';
            if (seatCounts.free > 0) {
              seatCategoryDisplay += `${seatCounts.free} ${free}`;
            }
            if (seatCounts.standard > 0) {
              if (seatCategoryDisplay.length > 0) seatCategoryDisplay += ' | ';
              seatCategoryDisplay += `${seatCounts.standard} ${standard}`;
            }
            if (seatCounts.premium > 0) {
              if (seatCategoryDisplay.length > 0) seatCategoryDisplay += ' | ';
              seatCategoryDisplay += `${seatCounts.premium} premium`;
            }
            const radiosUniqueId = generateUniqueId(idx);

            const isActive = addedRecommededSeats[selectedSegment]
              === `${selectedSegment}_${radiosUniqueId}`;

            const formattedFee = formatCurrency(totalPrice, currCode);
            return (
              <div
                className={`recommended-seats-radios-radio-button ${
                  isActive ? 'active' : ''
                }`}
                key={unitKeys}
                role="button"
                tabIndex="0"
                onClick={() => handleRadioChange(
                  seatList,
                  `${selectedSegment}_${radiosUniqueId}`,
                )}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === 'Space') {
                    handleRadioChange(
                      seatList,
                      `${selectedSegment}_${radiosUniqueId}`,
                    );
                  }
                }}
                {...(idx === 0 && { ref: radiosRef })}
              >
                <input
                  aria-label={`${Object.keys(seatList).join(
                    ', ',
                  )} radio button`}
                  type="radio"
                  name={radioName}
                  id={`${selectedSegment}_${radiosUniqueId}`}
                  className="recSeatsBtns"
                  checked={isActive}
                  tabIndex="-1"
                  readOnly
                />
                <span
                  className="custom-radio-btn"
                  aria-label={`${Object.keys(seatList).join(
                    ', ',
                  )} radio button`}
                />
                <label
                  htmlFor={`${selectedSegment}_${radiosUniqueId}`}
                  className="recommended-seats-radios-label"
                >
                  <div>
                    <div className="recommended-seats-radios-label-seats-info">
                      <span className="recommended-seats-radios-label-seat-numbers">
                        {Object.keys(seatList).join(', ')}
                      </span>
                      {passengers.length === 1
                        ? null
                        : <span className="recommended-seats-radios-label-seat-tag">{allTogetherLabelFormatted}</span>}
                    </div>
                    <div className="recommended-seats-radios-label-seat-type">
                      {seatCategoryDisplay}
                    </div>
                  </div>
                  <div className="recommended-seats-radios-label-price">
                    {formattedFee || ''}
                  </div>
                </label>
              </div>
            );
          })}
        </fieldset>
      </div>
    );
  };

  // accordion setup
  const accordionData = [
    {
      title: recommendedSeats,
      renderAccordionContent: renderAccordionContent(),
    },
  ];

  // radio focus when accordion expanded
  const ariaProps = { 'aria-label': 'recommeded seats accordion' };

  const onClickAccordianHeader = () => {
    setShouldFocus(!shouldFocus);
  };

  useEffect(() => {
    if (shouldFocus && radiosRef.current) {
      radiosRef.current.focus();
      setShouldFocus(true);
    }
  }, [shouldFocus]);

  const accordianProps = {
    initalActiveIndexes,
    accordionData,
    activeIndex,
    setActiveIndex,
    ariaProps,
    onClickAccordianHeader,
  };

  return (
    <>
      <div className="recommended-seats">
        {recommendedSeatsList && <Accordion {...accordianProps} />}
      </div>
      {isRecSeatsAdded && (
        <Toast
          {...toastProps}
          variation="notifi-variation--Success"
          mainToastWrapperClass="recommended-seats-selected--toast-wrapper"
        />
      )}
    </>
  );
};

RecommendedSeats.propTypes = {
  passengers: PropTypes.array.isRequired,
  seatMapData: PropTypes.array,
};

export default RecommendedSeats;
