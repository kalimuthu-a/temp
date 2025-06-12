/* eslint-disable sonarjs/cognitive-complexity */
import { useCallback, useMemo, useState, useEffect, memo } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';

import SeatDetails from '../SeatDetails';
import SeatSelectPopover from '../SeatSelectPopover/SeatSelectPopover';

import { useSeatMapContext } from '../../store/seat-map-context';
import {
  getComputedSeatType, getExtraSeatPax, getFormattedSeats, getSeatColumnToCheck, getSeatType,
  getSelectedSeatsFee, isSeatsAvailable,
} from '../../utils';
import { SEAT_TYPE, DISCOUNT_CODE } from '../../constants/seatConfig';
import { pushAnalytic } from '../../utils/analyticEvents';
import { PASSENGER_TYPE, SEAT_SELECTION_KEYS } from '../../constants';
import premiumSeatIcon from '../../images/premium-seat.svg';
import selectedPremiumSeatIcon from '../../images/selected-premium-seat.svg';
import filterAppliedPremiumIcon from '../../images/filter-applied-premium.svg';
import femalePremiumIcon from '../../images/female-premium.svg';
import femaleSelectedPremiumIcon from '../../images/female-selected-premium.svg';

import './Seat.scss';

const Seat = ({
  preview,
  customClass,
  style,
  tabIndex,
  seat,
  paxInitials,
  seatMapLayoutData,
  validSeats,
  isExitRowSeat,
  femaleSelectedSeats,
  isTouchScreen,
  equipmentType,
  classType,
}) => {
  const { designator, x, y, properties } = seat;
  const [hoverPopUp, setHoverPopUp] = useState(false);
  const [recRemoved, setRecRemoved] = useState(false);
  const [showSeatDetails, setShowSeatDetails] = useState(false);
  const [clickedSeat, setClickedSeat] = useState(null);
  const [extraSeatPopUp, setExtraSeatPopUp] = useState(false);
  const [showExtraSeatPopUp, setShowExtraSeatPopUp] = useState(false);
  const [seatType, setSeatType] = useState('');
  const [seatDetailsPos, setSeatDetailsPos] = useState({});
  const {
    isSeatDisabled,
    isSeatSelected,
    seatStatus,
    typeOfSeat,
    isFree,
    isNonRecline,
    isFemale,
    isPremium,
    isFemaleOccupiedSeat,
  } = useMemo(() => getComputedSeatType(customClass), [customClass]);

  const {
    selectedPassenger,
    selectedSegment,
    segmentData,
    setSegmentData,
    fareData,
    selectedSeatsList,
    setRemoveRecSeats,
    extraSeatKeysData,
    seatAdditionalAemData: { extraSeatNotAvailable, freeMealConformationText } = {},
    passengerData,
    updatePassengerSelected,
    updateSelectedSegment,
    updateSelectedSeatMap,
    isModifyFlow,
    addedRecommededSeats,
    filters,
  } = useSeatMapContext();

  const [isFemaleFriendlyText, setIsFemaleFriendlyText] = useState(false);
  const [selectedPremium, setSelectedPremium] = useState(false);
  const [premiumIcon, setPremiumIcon] = useState(premiumSeatIcon);
  const [xlFreeMealPopUp, setXlFreeMealPopUp] = useState(false);
  const [xlFreeMealDesignator, setxlFreeMealDesignator] = useState('');
  const [toastProps, setToastProps] = useState({});
  const xlSeatFreeMealNoData = filters?.xlSeatWithFreeMeal;

  const showToast = (description) => {
    setToastProps({
      flag: true,
      title: 'Information',
      position: 'top-bottom',
      description,
      variation: 'notifi-variation--Success',
      onClose: () => {
        setToastProps(null);
      },
      autoDismissTimeer: window?._msdv2?.autoToastDismissTimer ?? 2000,
    });
  };

  const {
    name: { first = '', last = '' } = {},
    info: { gender } = {},
    passengerTypeCode,
    extraSeatTag = '',
  } = selectedPassenger || {};
  const passengerName = `${first} ${last}`;
  const selectedPaxInitials = `${first?.charAt(0) ?? ''}${last?.charAt(0) ?? ''}`;
  const { rowWithMostSeats } = seatMapLayoutData;

  const isDoubleSeat = extraSeatTag?.toUpperCase() === SEAT_TYPE.EXTRASEATTAG_DOUBLE;
  const isTripleSeat = extraSeatTag?.toUpperCase() === SEAT_TYPE.EXTRASEATTAG_TRIPLE;
  const extraSeatToastMsg = extraSeatNotAvailable?.replace(/{seatCount}/g, isDoubleSeat ? '2' : '3') || '';
  const isRecommendationsAdded = !!(addedRecommededSeats && addedRecommededSeats[selectedSegment]);
  const [extraSeatPopUpTriggered, setExtraSeatPopUpTriggered] = useState(false);

  const checkForFemaleFriendlyText = (seatDesignator) => {
    const [seatNumber, seatCol] = seatDesignator.toUpperCase().match(/\D+|\d+/g);
    const seatColumnToCheck = getSeatColumnToCheck(seatCol, seatNumber, rowWithMostSeats);
    const clickedSeatIndex = seatColumnToCheck.indexOf(seatDesignator);
    const isFemaleSeatHovered = femaleSelectedSeats.includes(seatDesignator);
    let femaleFriendlyText = !isFemaleSeatHovered;

    if (!isFemaleSeatHovered) {
      const besideSeatCheck = (index) => {
        const besideSeat = seatColumnToCheck[index] || '';

        if (!selectedSeatsList?.length) {
          return !femaleSelectedSeats.includes(besideSeat);
        }

        // is beside seat already selected
        const { unitKey: besideSeatUnitKey = '' } = validSeats.find((item) => item?.designator === besideSeat) || {};
        const selectedListUnitKeys = selectedSeatsList?.map((sl) => sl.seats[0]);

        if (!selectedListUnitKeys.includes(besideSeatUnitKey)) {
          return !femaleSelectedSeats.includes(besideSeat);
        }

        return false;
      };

      switch (clickedSeatIndex) {
        case 0: femaleFriendlyText = besideSeatCheck(clickedSeatIndex + 1);
          break;

        case seatColumnToCheck.length - 1: femaleFriendlyText = besideSeatCheck(clickedSeatIndex - 1);
          break;

        default: {
          const prevSeat = besideSeatCheck(clickedSeatIndex - 1);
          const nextSeat = besideSeatCheck(clickedSeatIndex + 1);
          femaleFriendlyText = !(!prevSeat || !nextSeat);

          break;
        }
      }
    }

    setIsFemaleFriendlyText(femaleFriendlyText);
  };

  const showHidePopup = (seatNum) => {
    if (seatNum !== xlFreeMealDesignator || isSeatSelected === '') {
      setxlFreeMealDesignator(seatNum);
      showToast(freeMealConformationText);
      setXlFreeMealPopUp(true);
    } else if (isSeatSelected) {
      setxlFreeMealDesignator('');
      setXlFreeMealPopUp(false);
    }
  };

  useEffect(() => {
    setIsFemaleFriendlyText(false);
  }, [selectedPassenger?.passengerKey]);

  useEffect(() => {
    if (((extraSeatPopUp && isExitRowSeat) || showExtraSeatPopUp)) {
      pushAnalytic({
        data: {
          _event: 'warning',
          warning: false,
          isModifyFlow: isModifyFlow.enable,
          warningMessage: extraSeatToastMsg,
          component: 'button',
        },
        event: 'warning',
      });
    }
  }, [extraSeatPopUp, isExitRowSeat, showExtraSeatPopUp]);

  useEffect(() => {
    if (extraSeatPopUp) {
      setExtraSeatPopUpTriggered(true); // Mark as triggered when extraSeatPopUp becomes true
    }
  }, [extraSeatPopUp]);

  const getSeatDetailsPos = (seatElem) => {
    const seatRect = seatElem?.getBoundingClientRect();
    const seatMapWrapper = document.querySelector('.seat-map-wrapper.original');
    const seatMapWrapperRect = seatMapWrapper?.getBoundingClientRect();
    const container = document.querySelector('.seat-map-wrapper.original .seat-map');
    const containerRect = container?.getBoundingClientRect();
    const seatsWrapper = document.querySelector('.seat-map-wrapper.original .seats-wrapper');
    const seatsWrapperRect = seatsWrapper.getBoundingClientRect();
    const POPOVER_HEIGHT = 190;
    const POPOVER_WIDTH = 160;
    let top = seatRect.top - seatsWrapperRect.top + 10;
    let topFemaleOccupiedSeat = seatRect.top - seatsWrapperRect.top + 10;
    let left = seatRect.left - seatsWrapperRect.left + seatRect.width + 10;

    // Adjust if tooltip goes beyond container edges
    if (seatRect.top + POPOVER_HEIGHT > containerRect.top + containerRect.height) {
      top = seatRect.top - seatsWrapperRect.top + 10 - POPOVER_HEIGHT;
      topFemaleOccupiedSeat = seatRect.top - seatsWrapperRect.top - 50;
      if (top < 0) {
        top = 10;
        topFemaleOccupiedSeat = 10;
      }
    }
    if (seatRect.left + POPOVER_WIDTH > seatMapWrapperRect.left + seatMapWrapperRect.width) {
      left = seatRect.left - seatsWrapperRect.left - POPOVER_WIDTH;
    }

    return {
      left, top, topFemaleOccupiedSeat,
    };
  };

  const onHover = (e) => {
    const pos = getSeatDetailsPos(e.target);
    setSeatDetailsPos(pos);
    setHoverPopUp(true);
  };

  const onHoverRemove = () => {
    setHoverPopUp(false);
  };

  const handleDoubleSeat = (seatClickedArr, clickedSeatTyp, clickedSeatIndex, seatColumnToCheck) => {
    let seats = seatClickedArr;
    let seatTyp = clickedSeatTyp;
    let isExtraSeatPopUp;

    switch (clickedSeatIndex) {
      case 0: {
        const availableSeats = isSeatsAvailable(
          validSeats,
          selectedSeatsList,
          [seatColumnToCheck[1]],
        );

        if (availableSeats) {
          const [availableSeat] = availableSeats;
          const availableSeatType = getSeatType(availableSeat?.properties) || SEAT_TYPE.SEATTYPE_MIDDLE;
          seats = [...seats, ...availableSeats];
          seatTyp = seatTyp === SEAT_TYPE.SEATTYPE_AISLE
            ? `${availableSeatType}${seatTyp}` : `${seatTyp}${availableSeatType}`;
        } else {
          isExtraSeatPopUp = true;
          setExtraSeatPopUp(isExtraSeatPopUp);
        }

        break;
      }

      case seatColumnToCheck.length - 1: {
        const availableSeats = isSeatsAvailable(
          validSeats,
          selectedSeatsList,
          [seatColumnToCheck[seatColumnToCheck.length - 2]],
        );

        if (availableSeats) {
          const [availableSeat] = availableSeats;
          const availableSeatType = getSeatType(availableSeat?.properties) || SEAT_TYPE.SEATTYPE_MIDDLE;
          seats = [...availableSeats, ...seats];
          seatTyp = seatTyp === SEAT_TYPE.SEATTYPE_AISLE
            ? `${availableSeatType}${seatTyp}` : `${seatTyp}${availableSeatType}`;
        } else {
          isExtraSeatPopUp = true;
          setExtraSeatPopUp(isExtraSeatPopUp);
        }

        break;
      }

      default: {
        const availableSeatLeft = isSeatsAvailable(
          validSeats,
          selectedSeatsList,
          [seatColumnToCheck[clickedSeatIndex - 1]],
        );
        const availableSeatRight = isSeatsAvailable(
          validSeats,
          selectedSeatsList,
          [seatColumnToCheck[clickedSeatIndex + 1]],
        );

        if (availableSeatLeft || availableSeatRight) {
          const [availableSeat] = availableSeatRight || availableSeatLeft;
          const availableSeatType = getSeatType(availableSeat?.properties) || SEAT_TYPE.SEATTYPE_MIDDLE;
          seats = availableSeatRight
            ? [...seats, ...availableSeatRight]
            : [...availableSeatLeft, ...seats];
          seatTyp = availableSeatType === SEAT_TYPE.SEATTYPE_AISLE
            ? `${seatTyp}${availableSeatType}` : `${availableSeatType}${seatTyp}`;
        } else {
          isExtraSeatPopUp = true;
          setExtraSeatPopUp(isExtraSeatPopUp);
        }

        break;
      }
    }

    return { seats, seatTyp, isExtraSeatPopUp };
  };

  const handleTripleSeat = (seatClickedArr, clickedSeatIndex, seatColumnToCheck) => {
    let seats = seatClickedArr;
    let isExtraSeatPopUp;

    switch (clickedSeatIndex) {
      case 0: {
        const availableSeats = isSeatsAvailable(
          validSeats,
          selectedSeatsList,
          [seatColumnToCheck[1], seatColumnToCheck[2]],
        );

        if (availableSeats && availableSeats.length === 2) {
          seats = [...seats, ...availableSeats];
        } else {
          isExtraSeatPopUp = true;
          setExtraSeatPopUp(isExtraSeatPopUp);
        }

        break;
      }

      case seatColumnToCheck.length - 1: {
        const availableSeats = isSeatsAvailable(
          validSeats,
          selectedSeatsList,
          [
            seatColumnToCheck[seatColumnToCheck.length - 3],
            seatColumnToCheck[seatColumnToCheck.length - 2],
          ],
        );

        if (availableSeats && availableSeats.length === 2) {
          seats = [...availableSeats, ...seats];
        } else {
          isExtraSeatPopUp = true;
          setExtraSeatPopUp(isExtraSeatPopUp);
        }
        break;
      }

      default: {
        const availableSeatLeft = isSeatsAvailable(
          validSeats,
          selectedSeatsList,
          [seatColumnToCheck[clickedSeatIndex - 1]],
        );
        const availableSeatRight = isSeatsAvailable(
          validSeats,
          selectedSeatsList,
          [seatColumnToCheck[clickedSeatIndex + 1]],
        );

        if (availableSeatRight) {
          if (seatColumnToCheck?.length > 3) {
            const availableSeatRightNext = isSeatsAvailable(
              validSeats,
              selectedSeatsList,
              [seatColumnToCheck[clickedSeatIndex + 2]],
            );

            if (availableSeatRightNext) {
              seats = [
                ...seats,
                ...availableSeatRight,
                ...availableSeatRightNext,
              ];
            } else if (availableSeatLeft) {
              seats = [
                ...availableSeatLeft,
                ...seats,
                ...availableSeatRight,
              ];
            } else {
              isExtraSeatPopUp = true;
              setExtraSeatPopUp(isExtraSeatPopUp);
            }
          } else if (availableSeatLeft) {
            seats = [
              ...availableSeatLeft,
              ...seats,
              ...availableSeatRight,
            ];
          } else {
            isExtraSeatPopUp = true;
            setExtraSeatPopUp(isExtraSeatPopUp);
          }
        } else if (availableSeatLeft && seatColumnToCheck?.length > 3) {
          const availableSeatLeftBefore = isSeatsAvailable(
            validSeats,
            selectedSeatsList,
            [seatColumnToCheck[clickedSeatIndex - 2]],
          );
          if (availableSeatLeftBefore) {
            seats = [
              ...availableSeatLeftBefore,
              ...availableSeatLeft,
              ...seats,
            ];
          } else {
            isExtraSeatPopUp = true;
            setExtraSeatPopUp(isExtraSeatPopUp);
          }
        } else {
          isExtraSeatPopUp = true;
          setExtraSeatPopUp(isExtraSeatPopUp);
        }

        break;
      }
    }

    return { seats, isExtraSeatPopUp };
  };

  const setSeatInfo = useCallback((seatClicked) => {
    const isAdult = passengerTypeCode?.toUpperCase() === PASSENGER_TYPE.ADULT;
    const isFemale = Number(gender) === 2;
    // checks only for adult female traveler
    if (isFemale && isAdult && femaleSelectedSeats) {
      checkForFemaleFriendlyText(seatClicked?.designator);
    }

    let seats = [seatClicked];
    let seatTyp = getSeatType(seatClicked.properties) || SEAT_TYPE.SEATTYPE_MIDDLE;
    let isExtraSeatPopUp;

    // doubleTriple seats
    if (extraSeatTag && seatClicked?.designator) {
      const [seatNumber, seatCol] = seatClicked.designator.toUpperCase().match(/\D+|\d+/g);
      const seatColumnToCheck = getSeatColumnToCheck(seatCol, seatNumber, rowWithMostSeats);
      const clickedSeatIndex = seatColumnToCheck.indexOf(seatClicked.designator);

      // reset extraSeatPopUp
      if (extraSeatPopUp) {
        setExtraSeatPopUp(false);
      }

      if (isDoubleSeat) {
        const {
          seats: doubleSeats, seatTyp: doubleSeatType, isExtraSeatPopUp: isEDSPopup,
        } = handleDoubleSeat(seats, seatTyp, clickedSeatIndex, seatColumnToCheck);
        seats = doubleSeats;
        seatTyp = doubleSeatType;
        isExtraSeatPopUp = isEDSPopup;
      }

      if (isTripleSeat) {
        const {
          seats: tripleSeats, isExtraSeatPopUp: isETSPopup,
        } = handleTripleSeat(seats, clickedSeatIndex, seatColumnToCheck);
        seats = tripleSeats;
        seatTyp = seatTyp === SEAT_TYPE.SEATTYPE_NWINDOW ? 'nwindowtripleseat' : 'tripleseat';
        isExtraSeatPopUp = isETSPopup;
      }
    }

    setClickedSeat(seats);
    setSeatType(seatTyp);

    return isExtraSeatPopUp;
  }, [
    setClickedSeat, setSeatType, extraSeatTag, isDoubleSeat, isTripleSeat, handleDoubleSeat,
    handleTripleSeat, getSeatColumnToCheck, extraSeatPopUp, setExtraSeatPopUp, passengerTypeCode, gender,
  ]);

  // Seat select popUp show/close logic
  const handleSeatClick = useCallback((_, seatClicked) => {
    if (isFemaleOccupiedSeat) {
      return;
    }

    let isExtraSeatPopUp;

    if (seatClicked) {
      // set clicked seat details
      isExtraSeatPopUp = setSeatInfo(seatClicked);
    }

    if (isTouchScreen && hoverPopUp) {
      setHoverPopUp(false);
    }

    return isExtraSeatPopUp;
  }, [setSeatInfo, setShowSeatDetails, isExitRowSeat, addedRecommededSeats, selectedSegment]);

  const addAnalytics = () => {
    try {
      pushAnalytic({
        data: {
          _event: 'clickAdd',
          isModifyFlow: isModifyFlow.enable,
        },
        event: 'secondaryClick',
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error on analytics addSeat ', err);
    }
  };

  // add/remove seats logic
  const updateSegmentData = useCallback((seatArray) => {
    const { passengerKey } = selectedPassenger;
    const updatedSegments = segmentData?.reduce((acc, val) => {
      if (val.segmentKey !== selectedSegment) return [...acc, val];

      let res = val;
      let paxSegment = val.passengerSegment;

      // removing recommendations seats if selected already
      if (isRecommendationsAdded) {
        // code to uncheck recommeded seats radio buttons
        setRemoveRecSeats(true);

        paxSegment = Object.keys(paxSegment).reduce((accu, pasengKey) => {
          let result = accu;
          result = { ...result, [pasengKey]: { ...paxSegment[pasengKey], seats: [] } };
          return result;
        }, {});
      }

      if (selectedPassenger?.extraSeatTag) {
        const discountCode = DISCOUNT_CODE[selectedPassenger?.extraSeatTag.toUpperCase()];
        const extraSeatPax = getExtraSeatPax(extraSeatKeysData, selectedPassenger, discountCode);
        const pax = [selectedPassenger, ...extraSeatPax];

        pax.forEach(({ passengerKey: key }, i) => {
          paxSegment = {
            ...paxSegment, [key]: { ...paxSegment[key], seats: seatArray.length ? [seatArray[i]] : seatArray },
          };
        });

        res = { ...res, passengerSegment: { ...paxSegment } };
      } else {
        res = {
          ...res,
          passengerSegment: { ...paxSegment, [passengerKey]: { ...paxSegment[passengerKey], seats: seatArray } },
        };
      }

      return [...acc, res];
    }, []);

    setSegmentData(updatedSegments);

    return updatedSegments;
  }, [
    segmentData, setSegmentData, selectedSegment, selectedPassenger, getExtraSeatPax,
    isRecommendationsAdded, setRemoveRecSeats,
  ]);

  const getPassengerWithNoSeat = useCallback((passengerSegment) => passengerData.find(
    ({ passengerKey: pasKey }) => passengerSegment[pasKey]?.seats?.length === 0,
  ), [passengerData]);

  // for auto segment/passenger navigation
  const autoNavigation = useCallback((addSeatsToSelectedSegment) => {
    addSeatsToSelectedSegment.forEach((seg, idx) => {
      if (seg.segmentKey === selectedSegment) {
        const { passengerSegment } = seg;
        // Check if seats are empty in the current passengerSegment
        const passengerWithNoSeat = getPassengerWithNoSeat(passengerSegment);

        if (!passengerWithNoSeat && segmentData[idx + 1]) {
          const { segmentKey, seatmapReference, passengerSegment: pasSeg } = segmentData[idx + 1];
          const nextSegPaxWithNoSeat = getPassengerWithNoSeat(pasSeg) || passengerData[0];
          updateSelectedSegment(segmentKey);
          updateSelectedSeatMap(seatmapReference);
          updatePassengerSelected(nextSegPaxWithNoSeat);
        } else if (passengerWithNoSeat && passengerData.length > 1) {
          updatePassengerSelected(passengerWithNoSeat);
        }
      }
    });
  }, [
    selectedSegment, segmentData, passengerData, updatePassengerSelected, updateSelectedSegment, updateSelectedSeatMap,
    getPassengerWithNoSeat,
  ]);

  // Seat add logic
  const addSeat = useCallback((seatSelected) => {
    const seats = seatSelected && [...seatSelected];

    addAnalytics();
    const addSeatsToSelectedSegment = updateSegmentData(seats);

    // for auto segment/passenger navigation
    if (!xlSeatFreeMealNoData?.length || xlSeatFreeMealNoData?.some((value) => value?.[selectedSegment] === '')) {
      autoNavigation(addSeatsToSelectedSegment);
    }
  }, [updateSegmentData, autoNavigation, addAnalytics, setRemoveRecSeats]);

  useEffect(() => {
    if (recRemoved && !selectedSeatsList?.length) {
      handleSeatClick(recRemoved, seat);
    }
  }, [recRemoved, selectedSeatsList]);

  useEffect(() => {
    setExtraSeatPopUp(false);
    setShowExtraSeatPopUp(false);
    setHoverPopUp(false);
  }, [isTouchScreen]);

  const [designators, fee, formattedOriginalPriceVal] = useMemo(() => {
    if (clickedSeat) {
      const seatDescription = getFormattedSeats(clickedSeat.map((cs) => cs.designator));
      const { formattedFee, formattedOriginalPrice } = getSelectedSeatsFee(clickedSeat, fareData) || {};

      return [seatDescription, formattedFee, formattedOriginalPrice];
    }

    return ['', 0];
  }, [clickedSeat]);

  // currently add and close only used for exitRow pop ups
  const popUpProps = {
    onClose: () => {
      if (isExitRowSeat) {
        setShowSeatDetails(!showSeatDetails);
      } else {
        handleSeatClick();
      }
    },
    onAdd: () => {
      addSeat(clickedSeat);
      // close pop up
      if (isExitRowSeat) {
        setShowSeatDetails(!showSeatDetails);
      } else {
        handleSeatClick();
      }
    },
    passengerName,
    designators,
    fee,
    formattedOriginalPrice: formattedOriginalPriceVal,
    seatType,
    clickedSeats: clickedSeat?.map((cs) => cs.designator),
    isFemaleFriendlyText,
    pos: seatDetailsPos,
    hoverPopUp,
    isTouchScreen,
    isXlSeatFreeMeal: seat?.xlSeatFreemeal,
    isFemaleOccupiedSeat,
    equipmentType,
    classType,
  };

  const seatLabel = paxInitials || designator;
  const seatTypes = getSeatType(properties) || SEAT_TYPE.SEATTYPE_MIDDLE;
  const isPopOver = showSeatDetails && !isExitRowSeat;
  const dataAvailability = (isSeatDisabled || (isSeatSelected === SEAT_SELECTION_KEYS.SELECTED));

  useEffect(() => {
    setSelectedPremium(isPremium);
  }, [isPremium]);

  const renderPremiumIcon = () => {
    let pSeatIcon = premiumSeatIcon;
    if (!isSeatDisabled) {
      if (!isFemale && isSeatSelected) {
        pSeatIcon = selectedPremiumSeatIcon;
      } else if (isFemale && !isSeatSelected) {
        pSeatIcon = femalePremiumIcon;
      } else if (isFemale && isSeatSelected) {
        pSeatIcon = femaleSelectedPremiumIcon;
      }
    } else if (isSeatDisabled) {
      pSeatIcon = filterAppliedPremiumIcon;
    }
    setPremiumIcon(pSeatIcon);
  };

  useEffect(() => {
    renderPremiumIcon();
  }, [isSeatSelected, isSeatDisabled, isFemale]);

  return (
    <>
      <button
        type="button"
        aria-label={
          `${seatTypes} ${typeOfSeat} ${isNonRecline} ${isFree} ${isFemale} Seat 
          ${designator} ${isSeatSelected || seatStatus}`
        }
        className={`seatmap-seat ${customClass} ${preview ? 'preview' : ''}`}
        disabled={isSeatDisabled && !isFemaleOccupiedSeat}
        data-availability={!dataAvailability}
        data-designator={designator}
        data-seat-props={JSON.stringify(properties)}
        style={style}
        tabIndex={tabIndex}
        data-coords={`(${x}, ${y})`}
        key={designator}
        {...(!paxInitials && !isPopOver && {
          ...(!isTouchScreen && {
            onMouseEnter: (e) => {
              handleSeatClick(e, seat);
              onHover(e);
            },
          }),
          onMouseLeave: onHoverRemove,
        })}
        onClick={(e) => {
          if (isFemaleOccupiedSeat) {
            return;
          }

          if (seat?.xlSeatFreemeal) {
            showHidePopup(designator);
          }
          if (paxInitials) {
            // update segmentData with empty seats/removing seats
            if (paxInitials === selectedPaxInitials) {
              updateSegmentData([]);

              if (isRecommendationsAdded && !clickedSeat) {
                setRecRemoved(true);
              }
            }
          } else if (clickedSeat && !isExitRowSeat && !isTouchScreen) {
            // add seat for non exit row seats
            setHoverPopUp(false);

            if (!extraSeatPopUp) {
              addSeat(clickedSeat);
            } else {
              setShowExtraSeatPopUp(true);
            }
          } else if (!showSeatDetails && !hoverPopUp) {
            // open seatDetails pop up foe exitSeat
            const isExtraSeatPopUp = handleSeatClick(e, seat);

            if (isTouchScreen && !isExitRowSeat && !isExtraSeatPopUp) {
              // open hoverPopUp
              onHover(e);
            }
          }
          if (isExitRowSeat) {
            setShowSeatDetails((prev) => !prev);
            setHoverPopUp(false);
          }
        }}
      >
        { (!preview && selectedPremium) && <img src={premiumIcon} alt="premiumSeatIcon" className="premiumSeatIcon" />}
        {preview ? '' : <span className="seatLabel">{seatLabel}</span>}
      </button>

      {showSeatDetails && isExitRowSeat
        && ReactDOM.createPortal(
          <SeatDetails {...popUpProps} />,
          document.body,
        )}

      {(hoverPopUp || isPopOver) && <SeatSelectPopover {...popUpProps} />}

      {((extraSeatPopUp && (isTouchScreen || isExitRowSeat)) || showExtraSeatPopUp)
        && ReactDOM.createPortal(
          <Toast
            variation="notifi-variation--Warning"
            mainToastWrapperClass="seat-selection--toast-wrapper"
            containerClass="seat--toast"
            description={extraSeatToastMsg}
            onClose={() => {
              setExtraSeatPopUp(false);
              setShowExtraSeatPopUp(false);
            }}
          />,
          document.body,
        )}

      {(toastProps?.flag === true && xlFreeMealPopUp && !extraSeatPopUp && !extraSeatPopUpTriggered) ? (

        <Toast
          position={toastProps.position}
          renderToastContent={toastProps.renderToastContent}
          onClose={toastProps.onClose}
          variation={toastProps.variation}
          containerClass={toastProps.containerClass}
          description={toastProps.description}
          autoDismissTimeer={toastProps.autoDismissTimeer}
          infoIconClass="icon-check text-forest-green"
        />
      ) : null}
    </>
  );
};

Seat.propTypes = {
  preview: PropTypes.bool,
  customClass: PropTypes.string,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  seat: PropTypes.shape({
    designator: PropTypes.string.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    properties: PropTypes.array,
    unitKey: PropTypes.string,
    xlSeatFreemeal: PropTypes.bool,
  }).isRequired,
  paxInitials: PropTypes.string,
  seatMapLayoutData: PropTypes.shape({
    rowWithMostSeats: PropTypes.arrayOf(PropTypes.shape({})),
    rowLayoutData: PropTypes.arrayOf(PropTypes.shape({})),
    maxSeatsPerRow: PropTypes.number,
    seatColNames: PropTypes.arrayOf(PropTypes.string),
  }),
  validSeats: PropTypes.arrayOf(PropTypes.shape({
    designator: PropTypes.string.isRequired,
  })),
  isExitRowSeat: PropTypes.bool.isRequired,
  femaleSelectedSeats: PropTypes.any,
  isTouchScreen: PropTypes.bool,
  xlSeatFreemeal: PropTypes.any,
  isXlSeatFreeMeal: PropTypes.bool,
  equipmentType: PropTypes.string,
  classType: PropTypes.string
};

Seat.defaultProps = {
  preview: false,
  customClass: '',
  seatMapLayoutData: {},
  validSeats: [],
  femaleSelectedSeats: '',
  isTouchScreen: false,
  isXlSeatFreeMeal: false,
  classType: '',
  equipmentType: '',
};

export default memo(Seat);
