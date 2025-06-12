import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import TooltipPopover from 'skyplus-design-system-app/dist/des-system/TooltipPopover';
import Cockpit from '../Cockpit/Cockpit';
import DragHandleInputRange from '../DragHandleInputRange';
import Seat from '../Seat';
import ExitRow from '../ExitRow';
import { useSeatMapContext } from '../../store/seat-map-context';
import { setSeatmMapDimentions, getSeatProps, getSeatColumnToCheck, isSeatsAvailable } from '../../utils';
import {
  SEAT_HEIGHT,
  SEAT_WIDTH,
  SEAT_SPACE_PROPORTION,
  NEXT_SEATING_SPACE,
  NEXT_COMPARTMENT_DESIGNATOR,
  ECHO_COMPARTMENT_DESIGNATOR,
  NEXT_SEAT_SPACE_PROPORTION_BOTTOM,
  NEXT_SEAT_SPACE_PROPORTION_LEFT,
} from '../../constants/seatConfig';
import {
  AIRCRAFT_BORDER_RIGHT,
  AIRCRAFT_PREVIEW_SCALES_FIGMA,
  CONSTANTS,
  M_AIRCRAFT_PREVIEW_SCALES_FIGMA,
  SEATMAP_WRAPPER_CLASS,
  SEATMAP_WRAPPER_ORIGINAL_CLASS,
} from '../../constants';
import WavySaperator from '../wavy-saperator/wavy-saperator';
import './SeatMap.scss';

const SeatMap = ({
  seatMapData,
  aircraftName,
  preview,
  setPreviewWrapperDimensions,
  isModification,
  isSeatAssignedToPax,
  wingsData,
  exitRowData,
  seatMapLayoutData,
  selectedPassengerSeat,
  setSeatMapScrollRange,
  seatMapScrollRange,
  isNext,
  isFlightHavingNext,
}) => {
  const seatMapRef = useRef();
  const leftRef = useRef(0);
  const seatMapWrapperRef = useRef();
  let nextSeatingSpace = 0;
  const [tooltipPos, setTooltipPos] = useState('');
  const [isTouchScreen, setIsTouchScreen] = useState(window.matchMedia('(pointer: coarse)').matches);
  const {
    selectedSeatsList, selectedSeatTypes, category, selectedSegment, selectedSeatMap, filters, getSelectedSegmentObj,
    isSoloFemalePassenger, selectedPassenger, seatMapData: seatMapApiData, femalePassengerCount,
  } = useSeatMapContext();
  const selectedSeatMapData = seatMapApiData?.data?.seatMaps?.find((x) => x.seatMap?.seatmapReference === selectedSeatMap);
  const nextCompartmentLength = selectedSeatMapData?.seatMap?.decks?.[1]?.compartments?.C?.length;
  const exitSeatingSpace = isFlightHavingNext ? nextCompartmentLength : 0;
  const [keyDownScroll, setKeyDownScroll] = useState(seatMapScrollRange);
  const sepratorStyle = () => {
    return {
      left: `${(nextCompartmentLength || 0)
        + NEXT_SEATING_SPACE}rem`,
    };
  };
  const wingStyle = useMemo(() => {
    if (wingsData?.length) {
      const wingStart = Math.min(...wingsData);
      const wingEnd = Math.max(...wingsData);

      return {
        left: `${wingStart}rem`,
        width: `${wingEnd + SEAT_WIDTH - wingStart}rem`,
      };
    }

    return null;
  }, [wingsData]);

  // selected seats scroll into view on passenger tiles click logic
  const lastSeatLeftValue = useMemo(() => {
    if (seatMapData?.length) {
      const { y } = seatMapData[seatMapData.length - 1];
      return y * SEAT_HEIGHT * SEAT_SPACE_PROPORTION;
    }

    return 100;
  }, [seatMapData]);

  const { femaleSeat = [] } = filters || {};
  // solo female text purpose
  const femaleSelectedSeats = useMemo(() => {
    if (isSoloFemalePassenger && Boolean(femaleSeat?.length)) {
      return femaleSeat.reduce((acc, el) => {
        let res = acc;

        if (el[selectedSeatMap]) {
          res = el[selectedSeatMap];
        }

        return res;
      }, '');
    }

    return '';
  }, [isSoloFemalePassenger, femaleSeat?.length, selectedSegment]);

  const equivalentTyp = useMemo(() => {
    const { data: { seatMaps } } = seatMapApiData;
    const [{ seatMap: { equipmentType } = {} } = {}] = seatMaps.filter(
      ({ seatMap }) => seatMap.seatmapReference === selectedSeatMap,
    );
    return equipmentType;
  }, [seatMapApiData, selectedSeatMap]);

  const femaleFriendlySeats = useMemo(
    () => femaleSelectedSeats?.reduce?.((acc, femaleOccupiedSeat) => {
      const [seatNumber, seatCol] = femaleOccupiedSeat.toUpperCase().match(/\D+|\d+/g);
      const { rowWithMostSeats } = seatMapLayoutData;
      const seatColumnToCheck = getSeatColumnToCheck(seatCol, seatNumber, rowWithMostSeats);
      const femaleSeatIndex = seatColumnToCheck.indexOf(femaleOccupiedSeat);

      const checkAdjacentSeats = (idx) => {
        const availableSeat = isSeatsAvailable(
          seatMapData,
          selectedSeatsList,
          [seatColumnToCheck[idx]],
        );

        if (availableSeat && !acc.includes(availableSeat[0]?.designator)) {
          acc.push(availableSeat[0]?.designator);
        }
      };

      switch (femaleSeatIndex) {
        case 0: checkAdjacentSeats(1); break;

        case seatColumnToCheck.length - 1: checkAdjacentSeats(femaleSeatIndex - 1); break;

        default: {
          checkAdjacentSeats(femaleSeatIndex - 1);
          checkAdjacentSeats(femaleSeatIndex + 1);
          break;
        }
      }

      return acc;
    }, []),
    [femaleSelectedSeats],
  );

  // used to calculate aspect ratio for seatmap preview
  const [isMobile] = useIsMobile();
  const figmaPreviewScales = isMobile ? M_AIRCRAFT_PREVIEW_SCALES_FIGMA : AIRCRAFT_PREVIEW_SCALES_FIGMA;
  const scaleValue = preview ? figmaPreviewScales : 1;

  const handleChange = (e, lastLeftVal) => {
    const val = parseInt(e?.target?.value, 10);
    setKeyDownScroll(val);
    /** Unavoidable dom manipulation to stop infinite loop of scrolling
     * Change of range value makes the seatmap to scroll right
     * Scrolling in turn updates the range value.
     * So to avoid that this dom manipulation is done
     */
    const seatMapWrapper = document.querySelector(
      `.${SEATMAP_WRAPPER_CLASS}.${SEATMAP_WRAPPER_ORIGINAL_CLASS}`,
    );
    const maxScrollLeft = seatMapWrapper.scrollWidth - seatMapWrapper.clientWidth;
    const percentVal = lastLeftVal ?? 100;
    seatMapWrapper.scrollLeft = (val / percentVal) * maxScrollLeft;
  };

  const handleKeyDown = (e) => {
    let newValue = keyDownScroll;
    const step = 1;
    const min = 0;
    const max = 100;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, keyDownScroll - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, keyDownScroll + step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        break;
    }

    const event = {
      target: {
        value: Math.ceil(newValue),
      },
    };

    setKeyDownScroll(newValue);
    handleChange(event);
    e.preventDefault();
  };

  // required for non hover devices of seat pop up
  useEffect(() => {
    const handleWindowSizeChange = () => {
      setIsTouchScreen(window.matchMedia('(pointer: coarse)').matches);
    };
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const handleScroll = (e) => {
    if (!preview) {
      const { scrollLeft } = e.target;
      const { scrollWidth, offsetWidth } = seatMapWrapperRef.current || {};
      const totalScrollWidth = scrollWidth - offsetWidth;
      const scrollPercent = (scrollLeft / totalScrollWidth) * 100;
      setSeatMapScrollRange(parseInt(scrollPercent, 10));
      setKeyDownScroll(parseInt(scrollPercent, 10));
    }
  };

  // selected seats scroll into view on passenger tiles click logic
  useEffect(() => {
    if (selectedPassengerSeat) {
      const selectedSeat = parseInt(selectedPassengerSeat.split(' ')[0], 10);

      const selectedSeatObj = seatMapData.find(({ designator }) => parseInt(designator, 10) === selectedSeat);

      if (selectedSeatObj) {
        leftRef.current = selectedSeatObj.y * SEAT_HEIGHT * SEAT_SPACE_PROPORTION;
      }
      const event = {
        target: {
          value: Math.ceil(leftRef.current),
        },
      };

      handleChange(event, lastSeatLeftValue);
    }
  }, [selectedPassengerSeat]);

  useEffect(() => {
    if (aircraftName) {
      setSeatmMapDimentions(
        seatMapRef.current,
        seatMapWrapperRef.current,
        preview,
        setPreviewWrapperDimensions,
        scaleValue,
        aircraftName,
      );
    }

    seatMapWrapperRef.current.addEventListener('scroll', handleScroll);
    return () => {
      seatMapWrapperRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [aircraftName]);

  const selectedSegmentPax = getSelectedSegmentObj();

  let allPassenger = [];
  if (Object.keys(selectedSegmentPax).length) {
    allPassenger = selectedSegmentPax?.passengerSegment;
  }
  const isPremiumSelected = selectedSeatTypes?.includes(CONSTANTS.PREMIUM_SEAT);
  return (
    <>
      {preview && (
        <DragHandleInputRange
          value={seatMapScrollRange}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          isNext={isNext}
          isFlightHavingNext={isFlightHavingNext}
        />
      )}
      <div
        className={`${SEATMAP_WRAPPER_CLASS} ${preview ? 'preview' : SEATMAP_WRAPPER_ORIGINAL_CLASS
        } ${!preview && isFlightHavingNext && isNext ? 'scroll-disable' : ''}`}
        ref={seatMapWrapperRef}
      >
        <div className="seat-map" ref={seatMapRef}>
          <div className="seat-map-border seat-map-border--top-bottom">
            {
              wingStyle && (
              <>
                <div className="wings wings--top" style={wingStyle} />
                <div className="wings wings--bottom" style={wingStyle} />
              </>
              )
            }
          </div>
          <Cockpit aircraftName={aircraftName} />
          {isFlightHavingNext && (
          <div className="next-compartmenet-separator" style={(sepratorStyle())}>
            <div className="next-compartmenet-separator__top">
              <WavySaperator />
            </div>
            <div className="next-compartmenet-separator__bottom">
              <WavySaperator />
            </div>
          </div>
          )}
          {isPremiumSelected && (
          <div className="premium-seat-wrapper" />
          )}
          <div className="seats-wrapper" data-equipment={equivalentTyp}>
            {exitRowData?.map((item, index) => {
              let leftValue = "0rem";
             if(index !== 0) {
                leftValue = `${item * SEAT_HEIGHT * SEAT_SPACE_PROPORTION + exitSeatingSpace - 2}rem`;
             }
              const style = {
                left: leftValue,
              };
              return <ExitRow style={style} key={item} />;
            })}
            {seatMapData?.map((item) => {
              let seatStyle = {};
              const { seatBtnClasses, keyBoarAccessibility } = getSeatProps(
                item,
                isModification,
                isSeatAssignedToPax,
                selectedSeatTypes,
                category,
                selectedSegment,
                allPassenger,
                selectedPassenger,
                femaleFriendlySeats,
                femaleSelectedSeats,
                femalePassengerCount,
              );
              if (item.compartmentDesignator === NEXT_COMPARTMENT_DESIGNATOR && isFlightHavingNext) {
                seatStyle = {
                  bottom: `${item.x * SEAT_WIDTH * NEXT_SEAT_SPACE_PROPORTION_BOTTOM}rem`,
                  left: `${item.y * SEAT_HEIGHT * NEXT_SEAT_SPACE_PROPORTION_LEFT}rem`,
                };
                nextSeatingSpace = (nextCompartmentLength || 0)
                  + NEXT_SEATING_SPACE;
              }
              if (item.compartmentDesignator === ECHO_COMPARTMENT_DESIGNATOR) {
                seatStyle = {
                  bottom: `${item.x * SEAT_WIDTH * SEAT_SPACE_PROPORTION}rem`,
                  left: `${item.y * SEAT_HEIGHT * SEAT_SPACE_PROPORTION + nextSeatingSpace}rem`,
                };
              }
              const isSelectedSeatObj = selectedSeatsList?.find(({ seats }) => seats.includes(item.unitKey));
              const { name: { first = '', last = '' } = {} } = isSelectedSeatObj || {};
              const isExitRowSeat = item?.y && exitRowData.includes(item?.y);

              return (
                <Seat
                  customClass={seatBtnClasses}
                  style={seatStyle}
                  tabIndex={keyBoarAccessibility}
                  key={item.designator}
                  preview={preview}
                  isExitRowSeat={isExitRowSeat}
                  aircraftName={aircraftName}
                  seat={item}
                  equipmentType={equivalentTyp}
                  classType={item.compartmentDesignator}
                  {
                  ...(isSelectedSeatObj && {
                    customClass: `${seatBtnClasses} selected`,
                    paxInitials: `${first?.charAt(0) ?? ''}${last?.charAt(0) ?? ''}`,
                  })
                  }
                  seatMapLayoutData={seatMapLayoutData}
                  validSeats={seatMapData}
                  femaleSelectedSeats={femaleSelectedSeats}
                  isTouchScreen={isTouchScreen}
                  setTooltipPos={setTooltipPos}
                />
              );
            })}
          </div>
          <div
            className="seat-map-border seat-map-border--right"
            style={{ width: `${AIRCRAFT_BORDER_RIGHT}px` }}
          />
        </div>
      </div>
    </>
  );
};

SeatMap.propTypes = {
  seatMapData: PropTypes.array,
  aircraftName: PropTypes.string,
  preview: PropTypes.bool,
  setPreviewWrapperDimensions: PropTypes.func,
  isModification: PropTypes.bool,
  isSeatAssignedToPax: PropTypes.bool,
  wingsData: PropTypes.array,
  exitRowData: PropTypes.array,
  seatMapLayoutData: PropTypes.shape({
    rowWithMostSeats: PropTypes.array,
  }),
  selectedPassengerSeat: PropTypes.string,
  setSeatMapScrollRange: PropTypes.func,
  seatMapScrollRange: PropTypes.number,
  isNext: PropTypes.bool,
  isFlightHavingNext: PropTypes.bool,
  setPrevSeatData: PropTypes.func,
};

SeatMap.defaultProps = {
  seatMapData: [],
  aircraftName: '',
  preview: false,
  setPreviewWrapperDimensions: null,
  isModification: false,
  isSeatAssignedToPax: false,
  wingsData: [],
  exitRowData: [],
  seatMapLayoutData: {},
  isNext: false,
  isFlightHavingNext: false,
};

export default SeatMap;
