class AEMMainModel {
  bookFlightLabel = 'Book a flight';

  bookHotelLabel = 'Book a Stay';

  whereToLabel = 'Where To';

  journeyType = [];

  defaultCurrencyCode = 'INR';

  currencyLabel = 'Currency';

  fromSectionLabel = 'From';

  flyingFromLabel = 'Flying From?';

  searchByAppLabel = 'Search place/ airport';

  searchByLabel = 'Search by place/ airport';

  toSectionLabel = 'To';

  goingToLabel = 'Going to?';

  departureSectionLabel = 'Departure';

  dateLabel = 'Date';

  departureDateLabel = 'Departure';

  returnSectionLabel = 'Return';

  saveMoreLabel = 'Save More';

  arrivalDateLabel = 'Add Return';

  paxAndSpecialFareLabel = 'Travellers + Special Fares';

  defaultPassengerLabel = '1 Passenger';

  defaultPaxType = 'Adult';

  travellingReasonLabel = 'I am travelling for';

  payModeLabel = 'Pay with';

  travellingReasonAppLabel = 'What are you travelling for?';

  payModeAppLabel = 'Pay with';

  travellingReasons = [
    {
      key: 'Lesiure',
      value: 'Lesiure',
    },
    {
      key: 'Medical',
      value: 'Medical',
    },
    {
      key: 'Work',
      value: 'Work',
    },
  ];

  paymentModes = [
    {
      key: 'Cash',
      value: 'Cash',
    },
    {
      key: 'Points',
      value: 'IndiGo BluChips',
    },
  ];

  promoCodeLabel = 'Add promo code';

  searchCtaLabel = 'Search Flight';

  searchCtaPath = '/content/skyplus6e/in/en/bookings/flight-select.html';

  searchInNewTab = false;

  showRecentSearch = true;

  recentSearchLabel = 'Recent Searches';

  recentSearchCount = 3;

  memberLoginCtaInfo = {
    key: 'memberlogincta',
    value: 'Login /Sign Up Now',
    title: 'Member Discount Available',
    image: {
      _publishUrl: '/content/dam/s6common/in/en/assets/codeshare/images/indigo-plane.svg',
    },
    path: '/content/skyplus6e/in/en/home/homepage.html',
  };

  returnOfferDescriptionLabel = {
    html: ""
  }

  constructor(obj) {
    Object.assign(this, obj);
  }
}

export default AEMMainModel;
