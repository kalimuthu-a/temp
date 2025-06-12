import sortBy from 'lodash/sortBy';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import format from 'date-fns/format';
import minBy from 'lodash/minBy';
import isEqual from 'lodash/isEqual';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';

import BaseModel from '../utils/BaseModel';
import {
  FARE_CLASSES,
  dateFormats,
  templateString,
  discountCodes,
} from '../constants';
import {
  formatCurrency,
  flightDurationFormatter,
  getDynamicFlightIdentifier,
} from '../utils';

const { DOUBLE_SEAT, TRIPLE_SEAT } = discountCodes;

class JourneyItemModel extends BaseModel {
  passengerFares = [];

  flightDurationInSec = 0;

  startsAtFormatted;

  startsAt;

  startsAtPublishFare;

  startsAtTotalPublishFare;

  startsAtTotalTax;

  startsAtLoyaltyPoints;

  highestFare;

  highestFareFormatted;

  highestLoyaltyPoints;

  origin;

  originTerminal = '';

  destination;

  destinationTerminal = '';

  specialFare = '';

  aircrafts = [];

  flightNumbers = '';

  isSaleFare = false;

  flightDetailsDescriptiona11y = '';

  priority = 0;

  fareTag = '';

  aircraftNumbers = [];

  /**
   *
   * @param {*} obj
   * @param {import("./AEMAdditional")} additional
   */
  constructor(
    obj,
    additional,
    currencyCode,
    combinabilityMap,
    firstTimeLoad,
    selectedTripIndex,
  ) {
    super(obj);

    const { designator, passengerFares, segments, flightType } = obj;

    this.passengerFares = sortBy(passengerFares, 'totalFareAmount');

    const filteredPaxFare = this.passengerFares?.[0]?.paxFares?.filter(
      (r) => ![DOUBLE_SEAT, TRIPLE_SEAT].includes(r.passengerDiscountCode),
    );
    const startsAtObj = minBy(filteredPaxFare, 'fareAmount');
    this.startsAt = startsAtObj?.fareAmount;

    this.startsAtFormatted = formatCurrency(this.startsAt, currencyCode);

    this.origin = designator.origin;
    this.destination = designator.destination;

    this.aircrafts = segments.map((segment) => {
      const {
        identifier: { carrierCode, identifier: iden },
      } = segment;
      const icon = getDynamicFlightIdentifier(segment, additional);

      return {
        carrierCode,
        identifier: iden,
        ...icon,
      };
    });

    this.flightNumbers = this.aircrafts
      .map((aircraft) => {
        this.aircraftNumbers.push(aircraft.identifier);
        return formattedMessage(templateString.flightNumbers, {
          carrierCode: aircraft.carrierCode,
          identifier: aircraft.identifier,
          icon: aircraft.image,
        });
      })
      .join('<span class="mx-2"></span>');

    this.flightDurationInSec = differenceInSeconds(
      designator.arrival,
      designator.departure,
    );

    this.designator = {
      ...designator,
      departureF: format(new Date(designator.departure), dateFormats.HHMM),
      arrivalF: format(new Date(designator.arrival), dateFormats.HHMM),
      duration: flightDurationFormatter(
        designator.utcDeparture,
        designator.utcArrival,
      ),
    };

    segments.forEach((segment, index) => {
      if (index === 0) {
        this.originTerminal =
          get(segment, ['legs', 0, 'legInfo', 'departureTerminal'], '') || '';
      }

      if (index === segments.length - 1) {
        this.destinationTerminal =
          get(
            segment,
            ['legs', segment.legs.length - 1, 'legInfo', 'arrivalTerminal'],
            '',
          ) || '';
      }
    });

    // Special Fare Logic
    this.setPassengerFares(additional, combinabilityMap, currencyCode);

    // loyalty variables
    const { totalPublishFare, totalTax, PotentialPoints } = this.passengerFares?.[0] || {};
    this.startsAtPublishFare = startsAtObj?.publishedFare;
    this.startsAtTotalPublishFare = totalPublishFare;
    this.startsAtTotalTax = totalTax;
    this.startsAtLoyaltyPoints = PotentialPoints;

    this.highestPassengerFare = orderBy(this.passengerFares, 'totalFareAmount', 'desc')?.find(
      (row) => row.isActive,
    );
    const highestFarePaxObj = this.highestPassengerFare?.paxFares?.filter(
      (r) => ![DOUBLE_SEAT, TRIPLE_SEAT].includes(r.passengerDiscountCode),
    );
    const highestFarePaxMin = minBy(highestFarePaxObj, 'fareAmount');
    this.highestFare = highestFarePaxMin?.fareAmount;
    this.highestFareFormatted = formatCurrency(this.highestFare, currencyCode);
    this.highestLoyaltyPoints = this.highestPassengerFare?.PotentialPoints;
    // loyalty variables ends

    if (segments.length > 0) {
      const { carrierCode, identifier } = segments[0].identifier;
      const flightNumber = `${carrierCode} ${identifier}`;
      this.flightDetailsDescriptiona11y =
        additional?.flightDetailsDesc?.html?.replace(
          '<a title="Alt text"',
          `<a title="View details of flight ${flightNumber}" aria-label="View details of flight ${flightNumber}"`,
        );
    }

    this.priority = this.setPriority(
      flightType,
      firstTimeLoad,
      selectedTripIndex,
    );

    this.fareTag = this.fillingFast ? 'Filling Fast' : '';
  }
}

JourneyItemModel.prototype.getArrival = function (
  template = '{destination}{destinationTerminal}',
) {
  return formattedMessage(template, {
    destination: this.destination,
    destinationTerminal: this.destinationTerminal
      ? `, T${this.destinationTerminal}`
      : '',
  });
};

JourneyItemModel.prototype.getDeparture = function (
  template = '{origin}{originTerminal}',
) {
  return formattedMessage(template, {
    origin: this.origin,
    originTerminal: this.originTerminal ? `, T${this.originTerminal}` : '',
  });
};

JourneyItemModel.prototype.setPriority = function (
  val,
  firstTimeLoad,
  selectedTripIndex,
) {
  const metaFlightNumber =
    new URLSearchParams(window.location.search)
      .get('flightNumber')
      ?.split(',')
      .map((row) => row.split('_')) ?? [];

  const metaFlight = metaFlightNumber[selectedTripIndex] || null;

  if (isEqual(metaFlight, this.aircraftNumbers)) {
    return -1;
  }

  if (val === 'NonStop') {
    return 0;
  }
  if (val === 'Connect') {
    return 1;
  }

  return 2;
};

JourneyItemModel.prototype.setPassengerFares = function (
  additional,
  combinabilityMap,
  currencyCode,
) {
  // Special Fare Logic
  this.passengerFares = this.passengerFares
    .map((row) => {
      let specialFare = '';
      const { specialFareCode, paxDiscountCode, productClass } = row;

      const aemFare = additional.fareTypeMap.get(productClass);
      if (specialFareCode) {
        specialFare = additional.specialFaresMap.get(specialFareCode);
        this.specialFare = specialFare;
      }

      if (paxDiscountCode) {
        const specialFarePax = additional.paxDescription.find(
          (rowP) => rowP.discountCode === paxDiscountCode,
        );
        if (specialFarePax) {
          specialFare = {
            specialFareCode: paxDiscountCode,
            specialFareLabel: specialFarePax.paxLabel,
          };

          this.specialFare = specialFare;
        } else {
          specialFare = {};
        }
      }

      const combinabilityRow = combinabilityMap.get(productClass) || {
        combinabilityData: [],
      };

      return {
        FareClass: FARE_CLASSES.ECONOMY,
        ...row,
        ...combinabilityRow,
        specialFare,
        aemFare,
        formattedTotalFareAmount: formatCurrency(
          row.totalFareAmount,
          currencyCode,
        ),
      };
    })
    .filter((row) => additional.fareTypeMap.has(row.productClass));
};

export default JourneyItemModel;
