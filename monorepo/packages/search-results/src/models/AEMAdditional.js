import { FARE_CLASSES } from '../constants';

/* eslint-disable max-len */
class AEMAdditional {
  fareTypesLabel = 'Fare Types';

  knowMoreLabel = 'Know More';

  filterValues = [];

  carbon = 'Show carbon emmissions';

  resetButtonLabel = 'Reset';

  applyButtonLabel = 'Apply';

  sortTitle = 'SORT';

  sortFilterList = [];

  servicesTitle = [];

  // Creating a map for fare type to get fare type using get Only
  fareTypeMap = new Map();

  fareTypeList = [];

  // Creating a map for Codeshare to get flight image using get Only
  codeShareData = new Map();

  codeShare = [];

  okLabel = 'OK';

  flightDetailsDesc = 'Want to know more? View Flight Details';

  flightDetailsLabel = 'Flight Details';

  fareAppliedLabel = '3467 fare applied';

  copyCodeLabel = 'Copy Code';

  codeLabel = 'Code';

  offerDetailsLabel = 'OFFER DETAILS';

  redeemCode =
    'Use this code and redeem it at the time of payment to avail discount.';

  offersDescription = [];

  layoverLabel = 'Layover details';

  layoverTimeInfo = '40 mins layover Mumbai';

  changeOfAircraftLabel = 'Change of aircraft';

  layoverNote = 'You may be asked to deboard';

  airportFacilities = [];

  airportFacilityLabel = 'Airport facilities at Mumbai';

  earnPointInfo = 'Earn +350 pts';

  travelTimeLabel = 'Travel Time';

  includedLabel = 'Included with your fare';

  showMoreLabel = 'Show More';

  upgradeTitle = 'Note: Both flights will be upgraded to Super6E';

  upgradeDescription = 'Upgrade your trip at only Rs650';

  savedDescription = 'Nice, you have saved only Rs500';

  upgradeLabel = 'Upgrade';

  changeButtonLabel = 'Change';

  fareLabel = '6E fare';

  newFareLabel = 'Changed fare for departing flight DEL-BOM ';

  confirmUpgradeLabel = 'Are you sure you want to change your trip to';

  specialFaresList = [];

  specialFaresMap = new Map();

  baggageDetailLabel = 'Baggage details';

  baggageInfo = [];

  cancelFeeLabel = 'Cancellation fee';

  dateChangeLabel = 'Date Change fee';

  viewDetailsLabel = 'View details';

  durationLabel = null;

  paxDescription = [];

  stopsLabel = '2 stops';

  seatLeftLabel = '2 Seats left';

  addNowButtonLabel = 'Add Now';

  holidayList = {
    dates: [],
  };

  fareSummaryMock = {
    baseAirfareLabel: 'Base Airfare',
    paxList: [],
    extraSeatData: [],
    userDevelopmentFeeLabel: 'Development fee',
    regionalConnectivityChargeLabel: 'Regional connectivity charge ',
    cuteChargeLabel: 'CUTE charge ',
    airportSecurityFeesLabel: 'GST for Karnataka',
    gstLabel: 'GST for',
    totalFareLabel: 'TOTAL FARE',
    convenienceFeeLabel: 'Zero Convenience Fee',
    disclaimerLabel: 'Disclaimer:',
    disclaimerDescription: {
      html: '<p>GST comprises of both Central GST &amp; State GST. For details, kindly refer the tax invoice shared on your email id.&nbsp;<br>\n</p>\n<p>A Non-refundable convenience fee of INR 350 per pax sector for Domestic and INR 550 per pax per sector for international has been levied on all online payments mode except Credit Shell. For payment in currencies other than INR, refer to the fare breakdown in the price summary.</p>\n',
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value:
                'GST comprises of both Central GST & State GST. For details, kindly refer the tax invoice shared on your email id. ',
            },
            {
              nodeType: 'line-break',
              content: [],
            },
          ],
        },
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value:
                'A Non-refundable convenience fee of INR 350 per pax sector for Domestic and INR 550 per pax per sector for international has been levied on all online payments mode except Credit Shell. For payment in currencies other than INR, refer to the fare breakdown in the price summary.',
            },
          ],
        },
      ],
    },
    journeyOriginToDestination: '{originCityName} to {destinationCityName}',
  };

  fareCategoryData = {
    fareCategoryDisclaimer: '',
    fareCategoryColumns: [],
    fareTypeLabel: '',
  };

  departureFlightUpgradedlabel =
    'Your departure flight has been updated to {fareType}';

  arrivalFlightUpgradedlabel =
    'Your arrival flight has been updated to {fareType}';

  layoverNotDeboarding = 'Note: Deboarding may not be allowed';

  layoverTitle = 'Layover';

  atrTripleSeatError = {
    html: '',
  };

  codeShareDoubleTripeSeatError = {
    html: '',
  };

  umnrCodeShareError = {
    html: '',
  };

  yourDepartureFlightUpgraded =
    'Your departure flight has upgraded to {fareType}';

  nextServiceImages = [];

  pleaseSelectFlightLabel = 'Please select flight to proceed';

  doubleOrTripleSeatNote = '';

  baggageDetailsLink = '';

  cancelFeeDetailsLink = '';

  dateChangeDetailsLink = '';

  copiedToClipboard = 'Copied to clipboard';

  departureFlightLabel = 'Departure Flight';

  filterLabel = 'Filters';

  overlappingFlightError =
    'The selected flights are overlapping. Please select some other flights.';

  domesticCheckinCloserTime = '60';

  internationalCheckinCloserTime = '75';

  constructor(obj) {
    const {
      codeShare = [],
      specialFaresList = [],
      fareTypeList = [],
      fareSummary,
    } = obj;

    Object.assign(this, obj);

    codeShare.forEach((code) => {
      const { equipmentType, carrierCode, carrierCodePopupIcon, ...rest } =
        code;
      const key = `${equipmentType}-${carrierCode}`;
      this.codeShareData.set(key, {
        equipmentType,
        image: carrierCodePopupIcon?._publishUrl || '',
        carrierCode,
        ...rest,
      });
    });

    specialFaresList.forEach((fare) => {
      const { specialFareCode } = fare;
      this.specialFaresMap.set(specialFareCode, fare);
    });

    fareTypeList.forEach((fareType) => {
      const { productClass, fareClass } = fareType;
      if (
        window?.disableProjectNext &&
        fareClass &&
        fareClass !== FARE_CLASSES.ECONOMY
      ) {
        return;
      }
      this.fareTypeMap.set(productClass, fareType);
    });

    this.fareSummary = {
      ...this.fareSummaryMock,
      ...fareSummary?.[0],
    };
    if (this.fareSummary) {
      const extraSeatData = this.fareSummary.extraSeatData.map((row) => ({
        ...row,
        paxLabel: row.addSeatLabel,
        typeCode: 'ADT',
      }));
      this.fareSummary.paxList = this.fareSummary.paxList.concat(extraSeatData);
    }
  }

  codeShareIcon = ({ equipmentType, carrierCode }) => {
    const key = `${equipmentType}-${carrierCode}`;
    const equipmentData = this.codeShareData.get(key);
    return equipmentData || {};
  };
}

export default AEMAdditional;
