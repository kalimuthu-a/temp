/* eslint-disable max-len */

class AEMAdditionalModel {
  startTypingLabel = 'Start typing...';

  flyingFromAppLabel = 'Where are you flying from?';

  goingToAppLabel = 'Where are you going to?';

  selectDepartureDateLabel = 'Select Departure Date';

  useCurrentLocationLabel = 'Use Current Location';

  noAirportsFoundLabel = 'No airports found in {{city}}';

  nearestAirportLabel = 'Nearest Airports';

  centreLabel = 'from Centre';

  travellingWithLabel = 'Who are you travelling with?';

  payWithLabel = 'Pay with?';

  paxLabel = 'Passenger';

  passengersLabel = "Passenger's";

  extraSeatsLabel = 'Extra';

  addExtraSeatLabel = 'Add Double/Triple Seat';

  chooseCurrencyLabel = 'Choose your currency';

  popularLable = 'Popular';

  seniorCitizenErrorText =
    '{{specialFare}} fares cannot be clubbed with senior citizens';

  specialFareLabel = 'SPECIAL FARE';

  specialFaresList = [];

  extraAssistanceLabels = {
    html: '<p>For group bookings (more than 9 passengers) visit&nbsp;<a href="https://groupbooking.goindigo.in/UI/DirectPassenger/CreateBooking.aspx?linkNav=CreateBooking_www.goindigo.in~booking-widget%5C" target="_blank">Indigo Group Bookings</a></p>\n',
  };

  paxList = [];

  extraSeatsData = [
    {
      seatType: 'double',
      discountCode: 'EXT2',
      addSeatLabel: 'Double Seat',
      addSeatDescription: '1 + 1 Seat',
    },
    {
      seatType: 'triple',
      discountCode: 'EXT',
      addSeatLabel: 'Triple Seat',
      addSeatDescription: '1 + 2 Seat',
    },
  ];

  nationalityData = {
    title: 'Select Nationality',
    note: 'Nationality declaration required for this location',
    description: {
      html: '<p>Citizens of Nepal and Maldives are eligible for tax exemption/reduction, as per applicable laws, on the airfare. In order to avail such tax exemption/reduction, passengers must declare their correct nationality at the time of booking. In case citizens of Nepal or Maldives intend to travel with any foreign nationals, such citizen (passenger) are requested to kindly book tickets for accompanying foreign national (passengers) in a separate PNR/ticket. Once selected, the nationality cannot be changed at any point during the booking process</p>\n',
    },
  };

  airportsData = [];

  addFlightLabel = 'Add a flight';

  flightLabel = 'Flight';

  nationalityLabel = 'Nationality';

  offersTitle = 'All Offers';

  offersDescription = 'Enjoy exciting discounts and save with Inidgo Payments';

  promoCodePlaceholder = 'Enter Promo code';

  promoCodeCtaLabel = 'Apply';

  promoCodeApplyText = 'Applied';

  promoCodeErrorLabel = 'Code entered does not exist or is expired';

  offerApplyLabel = 'Apply';

  offerRemoveLabel = 'Remove';

  availableOffersLabel = 'Available Offers';

  continueCtaLabel = 'Continue';

  holidayLabel = 'Holiday';

  holidayList = { dates: [] };

  multicityMaxCountError = 'You can only add up to 5 flights.';

  beforeWeek6EExclusiveError = { html: '' };

  identicalDestinationsErrorMessage =
  'Their are identical destinations in your search query.';

  nationalityDeclarationLabel =
    'Nationality declaration required for this destination';

  landmarkMapping = [];

  cityMapping = [];

  returnDomesticLabel = { html: "" }

  constructor(obj) {
    Object.assign(this, obj);
  }
}

export default AEMAdditionalModel;
