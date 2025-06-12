const initialState = {
  // To show the user journey path
  isEditable: Boolean, // true | false
  editableFields: Array, // Only special assistance unselected fields are editable ["wheelchair", "speech"],
  isUserLoggedin: Boolean,
  nextButtonEnabled: Boolean, // "true | false", // All form complete

  userJourney: {
    journyType: String, // "Single | Return",
    journySource: String, // "Mumbai",
    journyDestination: String, // "Delhi",
    journeyCounts: {
      adult: {
        count: Number,
        doubleSeat: Number,
        tripleSear: Number,
      },
      infant: Number,
      srCitizen: {
        count: Number,
        doubleSeat: Number,
        tripleSear: Number,
      },
      children: {
        count: Number,
        doubleSeat: Number,
        tripleSear: Number,
      },
    },
  },

  // If user loggedin True
  savedPax: [
    {
      name: 'Sam Patel',
      id: Number,
      edited: false,
      isSearchSuccess: true,
    },
    {
      name: 'Sam Patel',
      id: Number,
      edited: false,
      isSearchSuccess: true,
    },
  ],

  // Form section
  passengerDetails: [
    {
      passengerId: Number,
      savedPaxId: Number,
      isSavedEdited: Boolean,
      type: 'adult | sr citizen | etc',
      isComplete: Boolean,
      isError: Boolean,
      toggleState: 'open | collapsed',
      mandatoryFields: ['gender', 'firstName', 'Lastname'],
      gender: 'Mr | Ms | Mrs',
      firstName: '',
      lastName: '',
      dob: '',
      saveForFuture: Boolean,
      multiSeatSelection: 'double | triple | none',
      multiSeatEligibility: 'double | triple',

      // specialAssistance
      wheelchairAssistance: Boolean,
      speechImpaired: Boolean,
      hearingImpaired: Boolean,
      visuallyImpaired: Boolean,

      wheelchairMandatoryFields: [],
      wheelChairFormDetails: {
        journey: 'All | oneway | return',
        reason: 'medical | wheelchairuser | sr citizen | other',
        medical: {
          medicalType: '',
          medicalSubtype: '',
        },
        wheelchairuser: '',
        other: {
          countryCode: '',
          contactnumber: '',
          reason: '',
        },
      },

      // if sr citizen
      srCitizenId: '',

      // if student
      studentId: '',
      InstitutionName: '',

      // If doctor or nurse
      hospitalId: '',

      // If armed forces
      armedForceId: '',

      // If international
      passportNum: '',
      passportExpDt: '',

      // if Infant
      taggedToAdult: 'Adult Id',
    },
  ],

  contactMandatoryFields: [],
  contactDetails: [
    {
      isPrimary: 'true | false',
      contactNumber: '',
      countryCode: '',
      emailId: '',
    },
    {
      isPrimary: 'true | false',
      contactNumber: '',
      countryCode: '',
      // emailId: ""
    },
  ],
  // listOfContactNumber: [], // to check if contact number already exists
  passportNumbers: [], // to check if passport numbers already exists
  studentIds: [], // to check the studentsIds already exists
  doctorsId: [], // to check if studentsIds already exists
  armedForcesId: [], // to check if armedForce ID already exists

  mandatoryConsent: ['privacyPolicy'],
  consents: {
    privacyPolicy: Boolean,
    tNc: Boolean,
    whatsapp: Boolean,
  },
};
