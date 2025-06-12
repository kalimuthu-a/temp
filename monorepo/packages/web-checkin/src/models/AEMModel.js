class AEMModel {
  dangerousGoods = {
    restrictedItemList: [],
    restrictedGoodsTitle: '',
    restrictedGoodsDescription: {
      plaintext: '',
    },
    termsAndConditions: {
      title: '',
    },
    noticeDescription: {
      html: '',
    },
  };

  boardingPass = {
    boardingPassTitle: '',
    dangerousGoods: {
      restrictedItemList: [],
      restrictedGoodsDescription: {
        plaintext: '',
      },
      noticeDescription: {
        html: '',
      },
      disclaimerDescription: {
        html: '',
      },
      boardingPassTitle: '',
      restrictedGoodsTitle: {
        html: '',
      },
    },
    disclaimerTitle: '',
    disclaimerDescription: {
      html: '',
    },
    saveShareOptions: [],
  };

  checkinHome = {
    selectPassengersForWebCheckin: {
      html: '',
    },
    selectPassengersForUndoWebCheckin: {
      html: '',
    },
    webCheckinDoneTitle: {
      html: '<p>Web Check-in is <span class="text-green">Done</span></p>\n',
    },
    pnrLabel: 'PNR',
    pnrStatus: {
      confirmed: 'Confirmed',
      pending: 'Pending',
    },
    paxLabel: 'Pax',
    selectAllPassengers: 'Select All Passengers',
    kgLabel: 'Kg Extra',
    passengerLabel: 'Passenger',
    mealType: {
      veg: 'Veg',
      nonVeg: 'Non Veg',
    },
    wheelChairPassengerDescription: {
      html: '<p>Checkin will be done at the airport counter for wheelchair user</p>\n',
    },
    webCheckInLabel: 'Web Check-in',
    webCheckInStatus: {
      done: 'Done',
    },
    webCheckInStatusDescription: 'Directly Check-in at the Airport',
    checkinCtaTitle: 'Check in now',
    checkinCtaLink: '#',
    undoCheckInCtaTitle: 'Undo web check-in',
    undoCheckInCtaLink: '#',
    viewBoardingPassCtaTitle: 'View Boarding Pass',
    viewBoardingPassCtaLink: '#',
    smartWebCheckInCtaTitle: 'Smart Web Check-in',
    smartWebCheckInCtaLink: '#',
    addonList: [],
    smartWebCheckInHeading: {
      html: '',
    },
    mealLabel: 'Meal',
    checkinNotAvailablePopup: {
      heading: 'Details submitted succesfully',
      description: {
        html: '',
      },
      ctaLabel: 'OK',
      ctaPath: '#',
    },
  };

  checkinPassenger = {
    webCheckInTitle: {
      html: '',
    },
    flightDetailsLabel: 'Flight Details',
    flightStatus: {
      nonStop: 'Nonstop',
      stop: 'Stop',
      connecting: 'Connect',
      via: 'Through',
    },
    hourLabel: 'h',
    minuteLabel: 'm',
    checkinClosesLabel: 'Checkin closes {time}',
    addPassengerDetailsLabel: {
      html: '<p>Add <span class="text-green">Passenger Detail</span></p>\n',
    },
    addPassengerDetailsDescLabel:
      'The boarding pass with your allotted seat will be sent to your email id',
    mandatoryFieldLabel: 'All fields are mandatory ',
    countryCode: '+91',
    passportDetailsLabel: 'Passport Details',
    firstName: 'First & Middle Name*',
    lastName: 'Last Name',
    dateOfBirth: 'Date Of Birth',
    gender: 'Gender',
    countryOfBirth: 'Country Of Birth',
    nationality: 'Nationality',
    countryOfResidence: 'Country Of Residence',
    passportNumber: 'Passport Number',
    dateOfExpiration: 'Date Of Expiration',
    passportCountry: 'Passport Country',
    declarationMessages: [],
    visaDetailsLabel: 'Visa Details',
    visaDetailsDescription: {
      html: null,
    },
    emailLabel: 'Email',
    mobileNoLabel: 'Mobile No.',
    copyPassengersLabel: 'Copy for all passengers',
    journeyTitle: '',
    journeyDescription: '',
    selectedServicesLabel: 'Selected Services',
    checkoutOtherAddonsLabel: {
      html: '',
    },
    addonOptions: [],
    seatTitle: 'Seats will be assigned automatically',
    seatDescription:
      'Most seats are paid seat, you could either opt to buy a seat or system will auto assign seats for you',
    addYourSeat: 'ADD YOUR SEAT',
    nextLabel: 'Next',
    nextLink: '',
    eligibilityCheck: null,
    passengerDetails: [
      {
        discountCode: null,
        typeCode: 'ADT',
        paxLabel: 'Adult',
      },
      {
        discountCode: null,
        typeCode: 'CHD',
        paxLabel: 'Children',
      },
      {
        discountCode: 'SRCT',
        typeCode: 'ADT',
        paxLabel: 'Senior Citizen',
      },
      {
        discountCode: null,
        typeCode: 'INFT',
        paxLabel: 'Infant',
      },
    ],
  };

  checkin = {
    checkInTitle: 'Check-in',
    bookingTitle: 'ADD YOUR BOOKING',
    loaderImagePath: null,
    pnrBookingPlaceholder: 'PNR / Booking Reference',
    emailNamePlaceholder: 'Email ID / Last Name',
    getStartedCTALabel: 'Get Started',
    getStartedCtaLink:
      'https://aem-s6web-dev-skyplus6e.goindigo.in/content/skyplus6e/in/en/checkin/view.html',
    loginSubHeading: 'Access your bookings quickly',
    loginHeading: 'Login to choose from your existing bookings on IndiGo App',
    loginText: 'Login Now',
    loginLink: '',
    loginIconImage: {
      _publishUrl:
        'https://aem-s6web-dev-skyplus6e.goindigo.in/content/dam/s6app/in/en/assets/offers2.jpg',
    },
    tripToCityTitle: 'Round Trip to {city}',
    pnrLabel: 'PNR',
    pnrStatus: { confirmed: 'confirmed' },
    onTimeLabel: 'On Time',
    onTimeBoardingGateAndTime:
      'On time, Boarding at Gate No. {gateNumber} - closes in {time} mins',
    flightType: {
      nonStop: 'Nonstop',
      connecting: 'Connect',
      via: 'Through',
    },
    hourLabel: 'h',
    minuteLabel: 'm',
    viewBoardingPassLabel: 'View Boarding Pass',
    viewBoardingPassLink: '#',
    undoWebCheckInLabel: 'Undo Web Check-In',
    undoWebCheckInLink: '#',
    webCheckInNowCTALabel: 'Web Check-in Now',
    webCheckInNowCtaLink: 'https://www.google.com',
    webCheckInLabel: 'Web Check-in',
    webCheckInDetails: 'Starts on {time}, {date}',
    paxLabel: 'pax',
    smartCheckInCTALabel: 'Schedule Smart Check-in',
    smartCheckInCtaLink: 'https://www.google.com',
    minorCheckInDescription:
      'Checkin will be done at the airport counter for unaccompanied minor.',
    smartCheckInScheduledLabel: 'Smart Check-in Scheduled',
    smartCheckInScheduledDescription:
      'Your boarding pass will be generated automatically.',
  };

  constructor(obj) {
    Object.assign(this, obj);
  }
}

export default AEMModel;
