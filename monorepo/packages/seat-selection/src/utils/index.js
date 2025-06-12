/* eslint-disable no-param-reassign */
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { COOKIE_KEYS } from 'skyplus-design-system-app/src/constants';
import formatCurrency from 'skyplus-design-system-app/src/functions/formatCurrency';
import {
  SEAT_HEIGHT,
  SEAT_SPACE_PROPORTION,
  SEAT_TYPE,
  WING_HEIGHT,
  SEAT_AVAILABILITY,
  NEXT_COMPARTMENT_DESIGNATOR,
  NEXT_EXIT_GATE_COMPENSATOR,
} from '../constants/seatConfig';

import { CONSTANTS } from '../constants';
import { seatPlacement } from '../constants/analytics';

const personasType = [CONSTANTS.ANONYMOUS, CONSTANTS.MEMBER].includes(Cookies.get(COOKIE_KEYS.PERSONA_TYPE) || '');

// write the utility methods related to MF
export function getMaxWidthOfSeatMap(children) {
  let maxWidth = 0;

  children.forEach((child) => {
    const childRightPosition = child.offsetLeft + child.offsetWidth;
    if (childRightPosition > maxWidth) {
      maxWidth = childRightPosition;
    }
  });
  return maxWidth;
}

export function getMaxHeightOfSeatMap(children, scale = 1) {
  const bottom = [];
  const top = [];
  children.forEach((child) => {
    const boundingClientRect = child.getBoundingClientRect();
    bottom.push(boundingClientRect.bottom);
    top.push(boundingClientRect.top);
  });
  const largestBottomVal = Math.max(...bottom);
  const smallestTopVal = Math.min(...top);
  return (largestBottomVal - smallestTopVal) / scale + 36;
}

export const isSeatType = (item, seatType) => item.properties?.some(
  ({ code, value }) => code?.toLowerCase() === seatType
      && value?.toLowerCase() === SEAT_TYPE.STRING_TRUE,
);

function addExitGateToNextCompartment(compartmentDataArray) {
  const newNextSeatData = [];
  compartmentDataArray.forEach((data) => {
    if (data.designator.includes('1')) {
      data.properties.push({ code: 'EXITROW', value: 'True' });
    }
    newNextSeatData.push(data);
  });
  return newNextSeatData;
}

export function getSeatMapDetails(seatMapData, selectedSeatmapRef) {
  if (!seatMapData) return {};
  const {
    data: { seatMaps },
  } = seatMapData;

  const [{ seatMap: selectedSeatmap = {} } = {}] = seatMaps.filter(
    ({ seatMap }) => seatMap.seatmapReference === selectedSeatmapRef,
  );

  let allSeats = selectedSeatmap?.decks?.[1]?.compartments?.Y?.units;
  let allNextSeats = selectedSeatmap?.decks?.[1]?.compartments?.C?.units || [];
  const isFlightHaveNext = allNextSeats.length > 0 && !window.disableProjectNext;
  if (isFlightHaveNext) {
    allNextSeats = addExitGateToNextCompartment(allNextSeats);
    allSeats = [...allNextSeats, ...allSeats];
  }
  const validSeats = allSeats?.filter((item) => item.assignable) || [];
  const minX = Math.min(...validSeats.map((item) => item.x));
  const minY = Math.min(...validSeats.map((item) => item.y));
  /** Normalizing the seat positions to fix the layout */

  const wingsData = [];
  const exitRowData = [];

  let currentY;
  let seatCountPerRow = 0;
  let maxSeatsPerRow = 0;
  let currentRow = [];
  let rowWithMostSeats;
  const rowLayoutData = [];
  const seatColNames = [];
  let journeyIndex = 0;
  const {
    data: { journeysDetail },
  } = seatMapData;



  const { filters = {} } = seatMapData?.data ?? {};

  const destinationToggledIndex = seatMaps?.findIndex(
    ({ seatMap }) => seatMap?.seatmapReference === selectedSeatmapRef,
  );

  const xlFreeMealSeats = filters?.xlSeatWithFreeMeal?.map((item) => {
    const values = Object.values(item);
    return values.length > 0 ? values[0] : null;
  }) ?? [];
  const singleSeatValues = destinationToggledIndex >= 0 && xlFreeMealSeats?.[destinationToggledIndex]
    ? [...xlFreeMealSeats[destinationToggledIndex].split(',')]
    : [];

  const values = personasType
    ? singleSeatValues.join(',') ?? null : null;
  if (journeysDetail.length > 1) {
    journeysDetail.forEach((journey, index) => {
      journey.segments.forEach((segment) => {
        if (segment.seatmapReference === selectedSeatmapRef) {
          journeyIndex = index;
        }
      });
    });
  }

  return {
    validSeatsData: validSeats.map((item) => {
      const data = {
        ...item,
        x: item.x - minX + 1,
        y: item.y - minY + 1,
        aircraftMap: selectedSeatmap?.name,
        xlSeatFreemeal: values?.includes(item.designator) || false, 
      };

      // seat types
      if (isSeatType(item, SEAT_TYPE.SEATTYPE_WING)) {
        wingsData.push(data.y * SEAT_HEIGHT * SEAT_SPACE_PROPORTION);
      }
      if (isSeatType(item, SEAT_TYPE.SEATTYPE_EXITROW)) {
        if (item.compartmentDesignator === NEXT_COMPARTMENT_DESIGNATOR) {
          exitRowData.push(+data.y - NEXT_EXIT_GATE_COMPENSATOR);
        } else {
          exitRowData.push(data.y);
        }
      }

      // seat row details
      if (currentY !== item.y) {
        if (seatCountPerRow > maxSeatsPerRow) {
          maxSeatsPerRow = seatCountPerRow;
          rowWithMostSeats = currentRow;
        }
        currentY = item.y;
        seatCountPerRow = 0;
        currentRow = [];

        rowLayoutData.push({
          y: item.y,
          height: item.height,
          rowNum: parseInt(item.designator, 10),
        });
      }
      seatCountPerRow += 1;
      currentRow.push(item);

      // seat column details
      const colName = item?.designator?.replace(/[^a-z]/gi, '')?.toUpperCase();
      if (!seatColNames.some((col) => col?.colName === colName)) {
        seatColNames.push({ colName, colPosition: item.x });
      }

      return data;
    }),
    wingsData,
    exitRowData: [...new Set(exitRowData)],
    aircraft: selectedSeatmap?.name || 'A321-222',
    rowWithMostSeats,
    rowLayoutData,
    maxSeatsPerRow,
    seatColNames: [...seatColNames]
      .sort((a, b) => a.colPosition - b.colPosition)
      ?.map((item) => item.colName),
    isFlightHaveNext,
    journeyIndex,
  };
}

export function setSeatMapBorderWidth(seatMapElem, aircraftName) {
  const seatMapBorders = [...document.querySelectorAll('.seat-map-border')];
  const seatsWrapper = seatMapElem.querySelector('.seats-wrapper');
  let aircraftBodyType = 'regular';
  let cockpitWidth = 250;
  if (aircraftName?.toLowerCase()?.includes('531')) {
    aircraftBodyType = 'big';
    cockpitWidth = 350;
  }
  if (aircraftName?.toLowerCase()?.includes('atr')) {
    aircraftBodyType = 'small';
    cockpitWidth = 180;
  }
  seatMapBorders.forEach((elem) => {
    if (elem.classList?.contains('seat-map-border--right')) {
      elem.style.left = `${cockpitWidth + (seatsWrapper?.scrollWidth || 0)}px`;
    } else {
      elem.classList.remove('small', 'big', 'regular');
      elem.classList.add(aircraftBodyType);
      elem.style.width = `${seatsWrapper?.scrollWidth || 0}px`;
    }
  });
}

export function setSeatmMapDimentions(
  seatMapElem,
  seatMapWrapperElem,
  preview,
  setPreviewWrapperDimentions,
  scale,
  aircraftName,
) {
  /** Setting the max width (visible it is height as the seatmap is rotated 270degree) */
  const children = seatMapElem?.querySelectorAll('.seats-wrapper button');
  const seatMapMaxHeight = getMaxHeightOfSeatMap(children, 1);
  // eslint-disable-next-line no-param-reassign
  seatMapElem.style.height = `${seatMapMaxHeight}px`;
  setSeatMapBorderWidth(seatMapElem, aircraftName);
  // eslint-disable-next-line no-param-reassign
  seatMapWrapperElem.style.height = `${seatMapMaxHeight + WING_HEIGHT * 2}px`;

  if (preview) {
    const seatMapMaxHeightPrev = scale[aircraftName] || scale['A321-222'];
    seatMapElem.style.height = `${seatMapMaxHeightPrev}px`;
    seatMapWrapperElem.style.height = `${seatMapMaxHeightPrev + WING_HEIGHT}px`;

    const scaleX = scale.width / seatMapElem.scrollWidth;
    const scaleY = scale.height / seatMapWrapperElem.scrollHeight;

    setPreviewWrapperDimentions(
      seatMapElem.scrollWidth,
      seatMapWrapperElem.scrollHeight,
      scaleX,
      scaleY,
    );

    seatMapWrapperElem.style.transform = `scale(${scaleX}, ${scaleY})`;
  }
}

export function getFormattedSeats(seats) {
  if (seats?.length) {
    const numberAndAlphabetsList = seats.toString().match(/\D+|\d+/g);
    return [...new Set(numberAndAlphabetsList)].join(' ');
  }
  return '';
}

export function getFee(fareData, group, groupFee) {
  const seatFareData = groupFee?.[0] || fareData?.groups[group]?.fees?.[0];
  const potentialPoints = seatFareData?.potentialPoints || '';
  const originalPrice = seatFareData?.originalPrice || 0;
  const fees = seatFareData?.serviceCharges;
  const seatFees = fees?.find((item) => item.type === 6) || {};
  return { ...seatFees, originalPrice, potentialPoints };
}

function getSeatTypeObject(seatTypeArr, segmentKey) {
  return seatTypeArr?.find((seatTypeObject) => (seatTypeObject ? seatTypeObject[segmentKey] : null));
}

function setDisableClass(premiumSeatData, xlSeatData, segmentKey, seatData) {
  let seatBtnClasses = '';
  if (
    premiumSeatData
    && premiumSeatData[segmentKey]?.seats
      ?.split(',')
      ?.includes(seatData.designator)
  ) {
    seatBtnClasses = CONSTANTS.SEAT_CLASS_PREMIUM + CONSTANTS.SEAT_CLASS_DISABLED;
  } else if (
    xlSeatData
    && xlSeatData[segmentKey]?.seats?.split(',')?.includes(seatData.designator)
  ) {
    seatBtnClasses = `${CONSTANTS.SEAT_CLASS_XL} ${CONSTANTS.SEAT_CLASS_DISABLED}`;
  } else {
    seatBtnClasses = CONSTANTS.SEAT_CLASS_DISABLED;
  }

  return seatBtnClasses;
}

function checkInfant(
  allPassenger,
  seatData,
  premiumSeatData,
  xlSeatData,
  segmentKey,
) {
  let seatBtnClasses = '';
  const isInfant = Object.values(allPassenger)?.some(
    ({ hasInfant }) => !!hasInfant !== false,
  );

  const isWheelChair = Object.values(allPassenger)?.some(
    ({ isWheelChairOpted }) => !!isWheelChairOpted !== false,
  );

  const EXITROW = isSeatType(seatData, SEAT_TYPE.SEATTYPE_EXITROW);

  if ((isInfant || isWheelChair) && EXITROW) {
    seatBtnClasses = setDisableClass(
      premiumSeatData,
      xlSeatData,
      segmentKey,
      seatData,
    );
  }
  return seatBtnClasses;
}

/* eslint-disable sonarjs/cognitive-complexity */
function getSeatButtonClasses({
  buttonIndex,
  category,
  seatData,
  segmentKey,
  allPassenger,
}) {
  let seatBtnClasses = '';

  const { freeSeat, premiumSeat, xlSeat } = category || {};

  const premiumSeatData = getSeatTypeObject(premiumSeat, segmentKey);
  const xlSeatData = getSeatTypeObject(xlSeat, segmentKey);
  const freeSeatData = getSeatTypeObject(freeSeat, segmentKey);
  const nonReclineSeats = isSeatType(seatData, SEAT_TYPE.SEATTYPE_RECLINE);
  const isNextSeat = seatData.compartmentDesignator === NEXT_COMPARTMENT_DESIGNATOR;

  if (nonReclineSeats) {
    seatBtnClasses = CONSTANTS.SEAT_CLASS_NON_RECLINE;
  }
  if (
    freeSeatData
    && freeSeatData[segmentKey]?.seats?.split(',')?.includes(seatData.designator)
  ) {
    seatBtnClasses = CONSTANTS.SEAT_CLASS_FREE;
  }
  if (
    premiumSeatData
    && premiumSeatData[segmentKey]?.seats
      ?.split(',')
      ?.includes(seatData.designator)
  ) {
    seatBtnClasses = CONSTANTS.SEAT_CLASS_PREMIUM;
  }
  if (
    xlSeatData
    && xlSeatData[segmentKey]?.seats?.split(',')?.includes(seatData.designator)
  ) {
    seatBtnClasses = `${CONSTANTS.SEAT_CLASS_XL} ${
      nonReclineSeats ? CONSTANTS.SEAT_CLASS_NON_RECLINE : ''
    }`;
  }
  // as part of WEB-3843, we do not need to show female friendly seat, so commenting below code.
  // if (
  //   femaleFriendlySeats
  //   && femaleFriendlySeats.includes(seatData.designator)
  // ) {
  //   seatBtnClasses = `${seatBtnClasses} ${CONSTANTS.SEAT_CLASS_FEMALE}`;
  // }

  // for infant and wheel chair condition
  const seatBtnClassesInfant = checkInfant(
    allPassenger,
    seatData,
    premiumSeatData,
    xlSeatData,
    segmentKey,
  );
  seatBtnClasses = seatBtnClassesInfant || seatBtnClasses;

  const filteredSeats = buttonIndex?.reduce((acc, sType) => {
    if (category[sType]) {
      const categorySeat = getSeatTypeObject(category[sType], segmentKey);
      if (categorySeat) {
        acc = `${acc}${acc ? ',' : ''}${categorySeat[segmentKey]?.seats}`;
      }
    }
    return acc;
  }, '');

  if (
    (!isNextSeat && !filteredSeats)
    || (filteredSeats && !filteredSeats.split(',')?.includes(seatData.designator))
  ) {
    seatBtnClasses += CONSTANTS.SEAT_CLASS_DISABLED;
  }

  if (isNextSeat) {
    seatBtnClasses += CONSTANTS.SEAT_CLASS_XL + CONSTANTS.SEAT_CLASS_NEXT;
  }

  return seatBtnClasses;
}
/* eslint-enable sonarjs/cognitive-complexity */
function getDisabledSeatButtonClasses(category, seatData, segmentKey, isFemaleSelectedSeat) {
  let seatBtnClasses = '';
  const { premiumSeat, xlSeat } = category || {};

  const premiumSeatData = getSeatTypeObject(premiumSeat, segmentKey);
  const xlSeatData = getSeatTypeObject(xlSeat, segmentKey);
  const nonReclineSeats = isSeatType(seatData, SEAT_TYPE.SEATTYPE_RECLINE);
  const isNextSeat = seatData.compartmentDesignator === NEXT_COMPARTMENT_DESIGNATOR;

  if (
    premiumSeatData
    && premiumSeatData[segmentKey]?.seats
      ?.split(',')
      ?.includes(seatData.designator)
  ) {
    seatBtnClasses = CONSTANTS.SEAT_CLASS_PREMIUM + CONSTANTS.SEAT_CLASS_DISABLED;
  } else if (
    xlSeatData
    && xlSeatData[segmentKey]?.seats?.split(',')?.includes(seatData.designator)
  ) {
    seatBtnClasses = `${CONSTANTS.SEAT_CLASS_XL} ${CONSTANTS.SEAT_CLASS_DISABLED}`;
  } else if (nonReclineSeats) {
    seatBtnClasses = CONSTANTS.SEAT_CLASS_NON_RECLINE + CONSTANTS.SEAT_CLASS_DISABLED;
  } else {
    seatBtnClasses = CONSTANTS.SEAT_CLASS_DISABLED;
  }

  if (isNextSeat) {
    seatBtnClasses += ` ${CONSTANTS.SEAT_CLASS_XL}${CONSTANTS.SEAT_CLASS_NEXT}`;
  }

  if (isFemaleSelectedSeat) {
    seatBtnClasses = `${seatBtnClasses} ${CONSTANTS.SEAT_CLASS_FEMALE_SELECTED}`;
  }

  return seatBtnClasses;
}

export function getSeatProps(
  seatData,
  isModification,
  isSeatAssignedToPax,
  buttonIndex,
  category,
  segmentKey,
  allPassenger,
  selectedPassenger,
  femaleFriendlySeats,
  femaleSelectedSeats,
  femalePassengerCount,
) {
  let seatBtnClasses = '';
  const keyBoarAccessibility = 0;
  const isSeatAvailableForEdit = ((isModification || isSeatAssignedToPax)
      && SEAT_AVAILABILITY.ReservedForPnr === seatData.availability)
    || SEAT_AVAILABILITY.HeldForThisSession === seatData.availability;
  const isInfantProp = seatData.properties.find(
    (pax) => pax.code.toLowerCase() === SEAT_TYPE.SEATTYPE_INFANT
      && pax.value.toLowerCase() === SEAT_TYPE.STRING_TRUE,
  );
  const isFemaleSelectedSeat = femalePassengerCount > 0
    && femaleSelectedSeats?.length > 0
    && femaleSelectedSeats.indexOf(seatData.designator) > -1
    && isModification;

  if (
    (!selectedPassenger.infant || (selectedPassenger.infant && isInfantProp))
    && (SEAT_AVAILABILITY.Open === seatData.availability || isSeatAvailableForEdit)
  ) {
    seatBtnClasses = getSeatButtonClasses({
      buttonIndex,
      category,
      seatData,
      segmentKey,
      allPassenger,
      femaleFriendlySeats,
    });
  } else {
    seatBtnClasses = getDisabledSeatButtonClasses(
      category,
      seatData,
      segmentKey,
      isFemaleSelectedSeat,
    );
  }

  return {
    seatBtnClasses,
    keyBoarAccessibility,
  };
}

export const getComputedSeatType = (customClass) => {
  let isDisabled = '';
  let isSelected = '';
  let seatStatus = 'available';
  let typeOfSeat = '';
  let isFree = 'standard';
  let isNonRecline = '';
  let isFemale = '';
  let isPremium = false;
  let isFemaleOccupiedSeat = '';

  if (customClass) {
    isDisabled = customClass.includes('disabled');
    isSelected = customClass.includes('selected') ? 'selected' : '';
    seatStatus = isDisabled ? 'Not available' : 'available';

    const {
      SEAT_CLASS_NON_RECLINE,
      SEAT_CLASS_FEMALE,
      SEAT_CLASS_FREE,
      SEAT_CLASS_PREMIUM,
      SEAT_CLASS_XL,
      SEAT_CLASS_FEMALE_SELECTED,
    } = CONSTANTS;

    typeOfSeat = (customClass.includes(SEAT_CLASS_PREMIUM) && SEAT_CLASS_PREMIUM)
      || (customClass.includes(SEAT_CLASS_XL) && SEAT_CLASS_XL)
      || '';
    isFree = customClass.includes(SEAT_CLASS_FREE)
      ? SEAT_CLASS_FREE
      : 'standard';

    isNonRecline = customClass.includes(SEAT_CLASS_NON_RECLINE)
      ? SEAT_CLASS_NON_RECLINE
      : '';
    isFemale = customClass.includes(SEAT_CLASS_FEMALE) ? SEAT_CLASS_FEMALE : '';
    isPremium = typeOfSeat === SEAT_CLASS_PREMIUM;
    isFemaleOccupiedSeat = customClass.includes(SEAT_CLASS_FEMALE_SELECTED) ? SEAT_CLASS_FEMALE_SELECTED : '';
  }

  return {
    isSeatDisabled: isDisabled,
    isSeatSelected: isSelected,
    seatStatus,
    typeOfSeat,
    isFree,
    isNonRecline,
    isFemale,
    isPremium,
    isFemaleOccupiedSeat,
  };
};

const getColSetsInRow = (rowWithMostSeats) => {
  const sortedRowSeats = rowWithMostSeats?.sort((a, b) => a.x - b.x);
  let prevItem;
  let singleSet = [];
  const colSet = [];

  sortedRowSeats?.forEach((item, idx) => {
    if (prevItem && item.x - prevItem.x > prevItem.width) {
      colSet.push(singleSet);
      singleSet = [];
    }

    singleSet.push({
      colName: item.designator?.toUpperCase().replace(/[^a-z]/gi, ''),
    });

    if (rowWithMostSeats.length - 1 !== idx) {
      prevItem = item;
    }
  });

  colSet.push(singleSet);

  return colSet;
};

export const getSeatColumnToCheck = (seatCol, seatNumber, rowWithMostSeats) => {
  const colSets = getColSetsInRow(rowWithMostSeats);
  const setsToCheck = colSets?.filter((set) => set.some((el) => el.colName === seatCol));

  return setsToCheck?.flatMap((el) => el.map((item) => seatNumber + item.colName));
};

export const isSeatsAvailable = (
  validSeats,
  selectedSeatsList,
  availableSeats,
) => {
  const selectedList = selectedSeatsList.map((sl) => sl.seats[0]);
  const availableSeatsList = validSeats?.filter((item) => availableSeats?.includes(item?.designator));
  const { Open, ReservedForPnr } = SEAT_AVAILABILITY;

  if (availableSeatsList.some((el) => selectedList?.includes(el.unitKey))) {
    return false;
  }

  if (
    availableSeatsList?.length
    && availableSeatsList.every(
      ({ availability }) => availability === Open || availability === ReservedForPnr,
    )
  ) {
    return availableSeatsList;
  }

  return false;
};

export const getSelectedSeatsFee = (seats = [], fareData = {}) => {
  const { currency, addedFee, originalPrice } = seats.reduce(
    (acc, val) => {
      const feeObj = getFee(fareData, val?.group, val?.groupFee);
      const addedAmount = acc.addedFee + feeObj.amount;
      const totalOriginalPrice = acc.originalPrice + feeObj.originalPrice;

      return {
        currency: feeObj.currencyCode,
        addedFee: addedAmount,
        originalPrice: totalOriginalPrice,
      };
    },
    { currency: '', addedFee: 0, originalPrice: 0 },
  );

  const formattedFee = formatCurrency(addedFee, currency, {
    minimumFractionDigits: 0,
  });
  const formattedOriginalPrice = formatCurrency(originalPrice, currency, {
    minimumFractionDigits: 0,
  });

  return { formattedFee, formattedOriginalPrice };
};

export const getExtraSeatPax = (
  extraSeatKeys,
  selectedPassenger,
  discountCode,
) => extraSeatKeys?.filter(
  (extSeat) => extSeat.discountCode === discountCode
      && extSeat.name?.first === selectedPassenger?.name?.first
      && extSeat.name?.title === selectedPassenger?.name?.title
      && extSeat.name?.last === selectedPassenger?.name?.last,
);

export const getPaxByNameKey = (passengerSegment = {}) => {
  const paxByNameKey = {};

  Object.keys(passengerSegment).forEach((key) => {
    const passenger = passengerSegment[key];
    const { first, title, last } = passenger.name;
    const nameKey = `${title}_${first}_${last}`;

    if (!paxByNameKey[nameKey]) {
      paxByNameKey[nameKey] = [];
    }

    paxByNameKey[nameKey].push(passenger);
  });

  return paxByNameKey;
};

export const getSelectedSeatDetails = (passengerSegment) => Object.keys(passengerSegment)?.reduce((acc, val) => {
  const passengerObj = passengerSegment[val];
  let res = acc;

  if (passengerObj?.seats?.length) {
    const seats = passengerObj.seats.map(({ unitKey }) => unitKey);
    res = [...res, { ...passengerObj, seats }];
  }

  return res;
}, []);

let seatRemoveRequests = [];
const checkForSameSeats = (soldSeats, passengerKey, journeyKey, unitKey) => {
  if (!soldSeats) return false;

  /*
   * Check to remove sold seat from post object in case of assigned to same pax.
   * And maintaining removed seat in 'removedSeats' array if seat is getting resold i.e assigned to other pax.
   */
  return soldSeats.some((s) => {
    const isSameSeats = s?.seats.some((ss) => ss?.unitKey === unitKey);

    if (s.passengerKey !== passengerKey && isSameSeats) {
      seatRemoveRequests.push({
        journeyKey,
        passengerKey: s.passengerKey,
        unitKey,
      });
    }

    return s.passengerKey === passengerKey && isSameSeats;
  });
};

// To check Aisle / Middle / Window seat type
export const getSeatType = (seatProps) => {
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { code: seatType = '' } = seatProps?.find((prop) => {
    const code = prop.code?.toLowerCase();
    const value = prop.value?.toLowerCase();
    const isAisle = code === SEAT_TYPE.SEATTYPE_AISLE && value === SEAT_TYPE.STRING_TRUE;
    const isMiddle = code === SEAT_TYPE.SEATTYPE_MIDDLE && value === SEAT_TYPE.STRING_TRUE;
    const isWindow = code === SEAT_TYPE.SEATTYPE_WINDOW && value === SEAT_TYPE.STRING_TRUE;
    const isNWindow = code === SEAT_TYPE.SEATTYPE_NWINDOW && value === SEAT_TYPE.STRING_TRUE;

    return isAisle || isMiddle || isWindow || isNWindow;
  }) || {};

  return seatType?.toLowerCase();
};

export const getSeats = ({
  passengerSegment,
  journeyKey,
  feesObj,
  soldSeats,
  filters,
  segmentKey,
}) => Object.values(passengerSegment).reduce((acc, passengerObj) => {
  if (passengerObj?.seats?.length) {
    const {
      passengerKey,
      name,
      seats: [seat],
    } = passengerObj;
    const {
      group,
      unitKey,
      designator,
      unitDesignator,
      seatInformation,
      properties,
    } = seat;
    let type = SEAT_TYPE.SEATTYPE_MIDDLE;

    const groupCode = seat?.group;
    if (seat?.seatInformation) {
      const { AISLE, WINDOW, NWINDOW } = seat?.seatInformation?.propertyList || {};
      const window = WINDOW ? SEAT_TYPE.SEATTYPE_WINDOW : null;
      const aisle = AISLE ? SEAT_TYPE.SEATTYPE_AISLE : null;
      const nwindow = NWINDOW ? SEAT_TYPE.SEATTYPE_NWINDOW : null;
      type = window || aisle || nwindow || SEAT_TYPE.SEATTYPE_MIDDLE;
    }
    if (seat?.properties) {
      type = getSeatType(seat.properties) || type;
    }

    if (!journeyKey && feesObj) {
      const fareObj = getFee(feesObj[passengerKey], group);
      // review summary format
      acc = [
        ...acc,
        {
          ...seat,
          unitDesignator: unitDesignator || designator,
          price: fareObj?.amount,
          properties: seatInformation?.propertyList || properties,
          passengerKey,
          type,
          name,
          originalPrice: fareObj?.originalPrice,
          potentialPoints: fareObj?.potentialPoints,
          groupCode,
        },
      ];
    } else {
      // modification flow - false by default
      const checkForSameSeat = checkForSameSeats(
        soldSeats,
        passengerKey,
        journeyKey,
        unitKey,
      );

      if (!checkForSameSeat) {
        const femaleSeatObj = getSeatTypeObject(
          filters?.femaleSeat,
          segmentKey,
        );
        const isFemaleSeat = femaleSeatObj
            && femaleSeatObj[segmentKey]?.split(',')?.includes(designator);

        // sell seats format
        acc = [
          ...acc,
          {
            journeyKey,
            passengerKey,
            unitKey,
            designator,
            name,
            xlSeat: isSeatType(
              passengerObj.seats[0],
              SEAT_TYPE.SEATTYPE_LEGROOM,
            ),
            femaleSeat: Boolean(isFemaleSeat),
            segmentKey,
            groupCode,
          },
        ];
      }
    }
  }

  return acc;
}, []);

export const getReviewSummaryData = (
  journeysDetail,
  segmentData,
  feesDetails,
  discountPercent,
  combinedArray,
  selectedSeatdesignator,
  seatMapData,
  selectedSegment,
) => journeysDetail?.reduce((acc, { journeyKey, segmentKeys }) => {
  const seats = segmentData
    ?.filter((seg) => segmentKeys?.includes(seg.segmentKey))
    .flatMap(({ passengerSegment, seatmapReference }) => {
      return getSeats({
        passengerSegment,
        feesObj: feesDetails[seatmapReference],
      });
    });

  const segmentWiseData = segmentKeys?.reduce((segmentAcc, segmentKey) => {
    const seatData = seatMapData?.data?.filters?.xlSeatWithFreeMeal?.find(
      (item) => item?.hasOwnProperty(segmentKey)
    );
    const seatArray = seatData?.[segmentKey]
      ?.split(',')
      ?.filter((seat) => seat.trim() !== '');

    const selectedSeatUnitDesignators = segmentData
      ?.filter((seg) => seg.segmentKey === segmentKey)
      .flatMap(({ passengerSegment }) =>
        Object.values(passengerSegment)
          .flatMap(passenger => passenger?.seats?.map(seat => (seat?.unitDesignator || seat?.designator)) || [])
      );

    return {
      ...segmentAcc,
      [segmentKey]: {
        cpmlSeats: seatArray?.length ? seatArray : [],
        hasCpmlSeat: seatArray?.length > 0,
        selectedSeat: selectedSeatUnitDesignators,
      },
    };
  }, {});
  return {
    ...acc,
    [journeyKey]: {
      seats,
      discountPercent,
      combinedArray,
      selectedSeatdesignator,
      segmentKey: selectedSegment?.segmentKey,
      ...segmentWiseData,
    },
  };
}, {});

export const constructRemoveSeatRequest = (
  journeyKey,
  currentSegments,
  updatedSegments,
) => {
  updatedSegments.forEach((seg) => {
    Object.values(seg?.passengerSegment ?? {}).forEach((pax) => {
      const previousSelectedSeats = currentSegments[seg?.segmentKey]?.passengerSegment[pax?.passengerKey]
        ?.seats;
      if (previousSelectedSeats?.length > 0 && pax?.seats?.length >= 0) {
        previousSelectedSeats?.forEach((paxSeat, index) => {
          if (paxSeat?.unitKey !== pax?.seats[index]?.unitKey) {
            seatRemoveRequests.push({
              journeyKey,
              passengerKey: pax?.passengerKey || '',
              unitKey: paxSeat?.unitKey,
            });
          }
        });
      }
    });
  });
};

export const getPostSeatData = (
  journeysDetail,
  segmentData,
  filters,
) => {
  seatRemoveRequests = [];

  const aircraftMapName = segmentData?.reduce((accumulator, segment) => {
    const passengerSegment = segment?.passengerSegment;
    const aircraftMap = passengerSegment
      ? Object.values(passengerSegment)?.[0]?.seats?.[0]?.aircraftMap
      : null;
    if (aircraftMap) {
      accumulator[segment.segmentKey] = aircraftMap; // Map aircraft to segmentKey for lookup
    }
    return accumulator;
  }, {});

  const seatRequests = journeysDetail?.reduce(
    (acc, { journeyKey, segmentKeys, segments }) => {
      const seats = segmentData
        ?.filter((seg) => segmentKeys?.includes(seg.segmentKey))
        .flatMap(({ segmentKey, passengerSegment }) => {
          const soldSeats = Object.values(
            segments[segmentKey].passengerSegment,
          ).filter((s) => s.seats.length);
          if (soldSeats.length) {
            const seatData = getSeats({
              passengerSegment,
              journeyKey,
              soldSeats,
              filters,
              segmentKey,
            });
            return seatData?.map?.((seat) => ({
              ...seat,
              aircraftName: aircraftMapName[segmentKey] || '',
            }));
          }

          const seatData = getSeats({
            passengerSegment,
            journeyKey,
            soldSeats,
            filters,
            segmentKey,
          });
          return seatData?.map?.((seat) => ({
            ...seat,
            aircraftName: aircraftMapName[segmentKey] || '',
          }));
        });
      constructRemoveSeatRequest(journeyKey, segments, segmentData);
      return [...acc, ...seats];
    },
    [],
  );

  return { data: { seatRequests, seatRemoveRequests } };
};

export const checkSeatSelectedForAllPax = (segmentData) => segmentData?.some(
  ({ passengerSegment }) => Object.values(passengerSegment).some(
    ({ seats }) => seats.length === 0,
  ),
);

export const checkSeatSelectedForExtraSeatKeys = (
  segmentData,
  passengerKeysWithExtraSeats,
) => segmentData?.some(({ passengerSegment }) => Object.values(passengerSegment).some(
  ({ seats, passengerKey }) => passengerKeysWithExtraSeats.includes(passengerKey)
        && seats.length === 0,
));

export const checkIsSeatAssignedToPax = (journeys = []) => journeys?.some(
  ({ segments }) => segments.some(
    ({ passengerSegment }) => Object.values(passengerSegment).some(
      ({ seats }) => seats.length,
    ),
  ),
);

// Error code for mandatory seats, code is assgined only when the seats are not assignrd to pax
export const getErrorCodeForMandatorySeat = (journeysDetail, segmentData) => {
  let isSeatMandetoryFlag = false;
  let code;
  let discountPercent;
  let isExtraSeatsEmpty = false;
  journeysDetail?.some(
    ({ mandatorySeatJourneyList, segmentKeys, extraSeatKeys }) => {
      const [{ isSeatMandetory, discountReason, discountPercent: dP }] = mandatorySeatJourneyList || [];

      if (isSeatMandetory) {
        isSeatMandetoryFlag = isSeatMandetory;
        const isSeatsEmpty = checkSeatSelectedForAllPax(
          segmentData?.filter((seg) => segmentKeys?.includes(seg.segmentKey)),
        );

        if (isSeatsEmpty) {
          code = discountReason?.split(':')?.[1];
          discountPercent = dP;
          return true;
        }
      } else if (extraSeatKeys?.length) {
        isExtraSeatsEmpty = checkSeatSelectedForExtraSeatKeys(
          segmentData?.filter((seg) => segmentKeys?.includes(seg.segmentKey)),
          extraSeatKeys.map(({ passengerKey }) => passengerKey),
        );
      }

      return false;
    },
  );

  return {
    isMandatorySeat: isSeatMandetoryFlag,
    code,
    discountPercent,
    isExtraSeatsEmpty,
  };
};

export const getSelectedSeatsGroupedBySegments = (postSeatData) => {
  // Grouping seat requests by segmentKey
  const groupedSeatRequests = postSeatData.data.seatRequests.reduce(
    (acc, seatRequest) => {
      const { segmentKey, ...rest } = seatRequest;
      if (!acc[segmentKey]) {
        acc[segmentKey] = [];
      }
      acc[segmentKey].push(rest);
      return acc;
    },
    {},
  );

  // Formatting seat requests by segmentKey
  let femaleSeat = Object.keys(groupedSeatRequests)
    .map((segmentKey) => {
      return groupedSeatRequests[segmentKey]
        .filter((seats) => seats.femaleSeat)
        .map((seatRequest) => seatRequest.designator)
        .join(':');
    })
    .join('|');

  if (femaleSeat.endsWith('|')) {
    femaleSeat = femaleSeat.slice(0, -1);
  }

  let seatSelected = Object.keys(groupedSeatRequests)
    .map((segmentKey) => {
      return groupedSeatRequests[segmentKey]
        .map((seatRequest) => seatRequest.designator)
        .join(':');
    })
    .join('|');

  if (seatSelected.endsWith('|')) {
    seatSelected = seatSelected.slice(0, -1);
  }

  let XLseatSelected = Object.keys(groupedSeatRequests)
    .map((segmentKey) => {
      return groupedSeatRequests[segmentKey]
        .filter((seats) => seats.xlSeat)
        .map((seatRequest) => seatRequest.designator)
        .join(':');
    })
    .join('|');

  if (XLseatSelected.endsWith('|')) {
    XLseatSelected = XLseatSelected.slice(0, -1);
  }

  return { femaleSeat, seatSelected, XLseatSelected };
};

export const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get('auth_token', true);
    // eslint-disable-next-line no-console
    console.log('getSessionToken  tokenObj', tokenObj);
    return tokenObj.token || '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return '';
  }
};

export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_seat_select';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return defaultObj;
  }
};

export const makePayment = (redirectUrl = '', details = {}) => {
  const token = getSessionToken();
  const dataToPass = {
    ...details,
    from: 'SeatMapApp',
    token,
    refUrl: redirectUrl,
  };
  const event = new CustomEvent('INITIATE_PAYMENT', {
    bubbles: true,
    detail: dataToPass,
  });
  document.dispatchEvent(event);
};

export const getFormattedProductDetails = ({
  productDetails,
  journeysDetail,
}) => {
  let seatsArray = [];
  let srcDest = '';
  let flightNumber = '';

  let finalJourneyArray = [];

  journeysDetail.forEach((journey) => {
    finalJourneyArray = [
      ...finalJourneyArray,
      Object.values(journey?.segments),
    ].flat();
  });

  finalJourneyArray.forEach((journey) => {
    const segmentData = journey?.segmentDetails;
    srcDest = `${srcDest}${srcDest && ':'}${segmentData?.origin}-${
      segmentData?.destination
    }`;
    const { carrierCode, identifier } = segmentData.identifier || {};
    flightNumber = `${flightNumber}${
      flightNumber && ':'
    }${carrierCode}${identifier}`;
  });

  Object.values(productDetails).forEach((sector) => {
    seatsArray.push(sector?.seats);
  });

  seatsArray = [...seatsArray.flat()];
  const passArray = [];
  let legroom = 'Normal';
  let recline = 'No';
  seatsArray.forEach((seat) => {
    if (Array.isArray(seat?.properties)) {
      const seatProperties = seat?.properties?.reduce(
        (acc, property) => {
          if (property?.code === 'LEGROOM' && property?.value === 'True') {
            acc.legroom = 'XL';
          }

          if (property?.code === 'RECLINE' && property?.value === 'True') {
            acc.recline = 'Yes';
          }

          return acc;
        },
        { legroom: 'Normal', recline: 'No' },
      );

      legroom = seatProperties.legroom;
      recline = seatProperties.recline;
    } else {
      legroom = seat?.properties?.LEGROOM === 'TRUE' ? 'XL' : 'Normal';
      recline = seat?.properties?.RECLINE === 'TRUE' ? 'Yes' : 'No';
    }

    const detail = `Seat|${seat?.price ? 'paid' : 'free'};${
      seatPlacement[seat?.type]
    }|${legroom}|${recline};${'Q1'};${
      seat.price
    };;eVar19=${srcDest}|eVar20=${flightNumber}`;
    const matchIndex = passArray.findIndex((pass) => pass?.detail === detail);
    if (matchIndex > 0) {
      passArray[matchIndex].quantity += 1;
    } else {
      passArray.push({ detail, quantity: 1 });
    }
  });

  return passArray
    .map((item) => {
      const quantityStr = `${item?.quantity};`;
      item.detail = item?.detail.replace('Q1;', quantityStr);
      return item.detail;
    })
    .join(',');
};

export const getSelectedSeats = ({ journeySeatData }) => {
  const segmentDesignators = [];
  journeySeatData.forEach((journey) => {
    const { segments } = journey;
    const segmentArray = [];
    Object.values(segments).forEach((journeySegment) => {
      const passengerMap = new Map();
      const { passengerSegment } = journeySegment;
      Object.values(passengerSegment).forEach((passSeg) => {
        const {
          seats,
          name: { first, last },
        } = passSeg;
        const { designator, unitDesignator } = seats?.[0] || {
          unitDesignator: 'Not Opted',
          designator: '',
        };
        const seat = designator || unitDesignator;
        const passengerKey = `${first} ${last}`;
        if (!passengerMap.has(passengerKey)) {
          passengerMap.set(passengerKey, [seat]);
        } else {
          passengerMap.set(passengerKey, [
            ...passengerMap.get(passengerKey),
            seat,
          ]);
        }
      });
      const segmentCombinedDesignators = Array.from(passengerMap.values())
        .map((designators) => designators.join('-'))
        .join(',');

      segmentArray.push(segmentCombinedDesignators);
    });
    segmentDesignators.push(segmentArray.join('~'));
  });
  return segmentDesignators.join('|');
};

export const getRecommendedSeats = ({ isRecommendedSeat, journeysDetail }) => {
  return journeysDetail
    .map((journey) => {
      const tempRecommended = Object.keys(journey.segments).map((segment) => (isRecommendedSeat[segment] ? '1' : '0'));
      return tempRecommended.join('~');
    })
    .join('|');
};

export const getFlightNumber = ({ journeysDetail }) => {
  const flightNumber = [];

  journeysDetail.forEach((journey) => {
    const segments = journey?.segments || [];
    const tempNumber = [];
    segments.forEach((segment) => {
      const { segmentDetails } = segment;
      const { carrierCode, identifier } = segmentDetails?.identifier || {};
      tempNumber.push(`${carrierCode}${identifier}`);
    });
    flightNumber.push(tempNumber.join('~'));
  });

  return flightNumber.join('|');
};

export const getFlightSectors = ({ journies }) => {
  const sectors = [];

  journies.forEach((journey) => {
    const { destinationCity } = journey;
    sectors.push(
      destinationCity?.isInternational ? 'International' : 'Domestic',
    );
  });

  return sectors.join('|');
};

const getCategoryType = ({ category, categoryType, journeySegment }) => {
  const res = category?.[categoryType].find((seat) => {
    const journeyKeyValuePair = Object.entries(seat)?.[0];
    const journeyKey = journeyKeyValuePair?.[0];

    return journeyKey.localeCompare(journeySegment) === 0;
  });

  return res?.[journeySegment]?.seats || '';
};

const getSeatCategorySegments = ({ journeySegment, category }) => {
  let result = {};
  result = {
    xlSeat: getCategoryType({
      journeySegment,
      categoryType: 'xlSeat',
      category,
    }),
    allSeats: getCategoryType({
      journeySegment,
      categoryType: 'allSeats',
      category,
    }),
    freeSeat: getCategoryType({
      journeySegment,
      categoryType: 'freeSeat',
      category,
    }),
    standardSeat: getCategoryType({
      journeySegment,
      categoryType: 'standardSeat',
      category,
    }),
  };

  return result;
};

const getSeatCategory = ({ selectedSeat, segmentSeatWithCategory }) => {
  if (!selectedSeat) {
    return 'Not Opted';
  }
  const { xlSeat, freeSeat, standardSeat } = segmentSeatWithCategory;

  const xlSeatsList = xlSeat?.split(',').map((seat) => seat.trim());
  const freeSeatsList = freeSeat?.split(',').map((seat) => seat.trim());
  const standardSeatsList = standardSeat?.split(',').map((seat) => seat.trim());

  const seat = String(selectedSeat)?.trim();

  if (xlSeatsList.includes(seat)) {
    return 'XL';
  }
  if (freeSeatsList.includes(seat)) {
    return 'F';
  }
  if (standardSeatsList.includes(seat)) {
    return 'S';
  }

  return 'ALL';
};

export const getSeatTypes = ({ journeySeatData, category }) => {
  const segmentDesignators = [];
  journeySeatData.forEach((journey) => {
    const { segments } = journey;
    const segmentArray = [];
    Object.keys(segments).forEach((journeySegment) => {
      const segmentSeatWithCategory = getSeatCategorySegments({
        journeySegment,
        category,
      });
      const passengerMap = new Map();
      const { passengerSegment } = segments[journeySegment];
      Object.values(passengerSegment).forEach((passSeg) => {
        const {
          seats,
          name: { first, last },
        } = passSeg;

        const { unitDesignator, designator } = seats?.[0] || {
          unitDesignator: '',
          designator: '',
        };
        const selectedSeat = unitDesignator || designator;
        const seatCategory = getSeatCategory({
          selectedSeat,
          segmentSeatWithCategory,
        });
        const passengerKey = `${first} ${last}`;
        if (!passengerMap.has(passengerKey)) {
          passengerMap.set(passengerKey, [seatCategory]);
        } else {
          passengerMap.set(passengerKey, [
            ...passengerMap.get(passengerKey),
            seatCategory,
          ]);
        }
      });
      const segmentCombinedDesignators = Array.from(passengerMap.values())
        .map((designators) => designators.join('-'))
        .join(',');

      segmentArray.push(segmentCombinedDesignators);
    });
    segmentDesignators.push(segmentArray.join('~'));
  });
  return segmentDesignators.join('|');
};

export const getJourneySeatData = ({ journeysDetail, segmentData }) => {
  const tempJourney = JSON.parse(JSON.stringify(journeysDetail));

  tempJourney.forEach((journey, index) => {
    const { segments } = journey;
    const updatedSegments = {};
    Object.keys(segments).forEach((segment) => {
      const segmentDat = segmentData.find((seg) => seg.segmentKey === segment);
      updatedSegments[segment] = { ...segmentDat };
    });
    tempJourney[index] = { ...journey, segments: updatedSegments };
  });
  return tempJourney;
};
