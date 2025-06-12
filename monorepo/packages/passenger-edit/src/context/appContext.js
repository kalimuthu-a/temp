import React from 'react';
import {
  progressSteps,
  progressStepsKeys,
} from 'skyplus-design-system-app/src/functions/globalConstants';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import passengerEditReducer from './passengerEditReducer';
import passengerEditActions from './actions';
import { BROWSER_STORAGE_KEYS } from '../constants';

// JSON.stringyfy - avoid -- structuredClone

const AppContext = React.createContext();

const roleDetails = Cookies.get(BROWSER_STORAGE_KEYS.ROLE_DETAILS, true);

/** context initial state * */
const passengerEditInitailState = {
  loader: true,
  // isAuthenticated: Cookies.get('auth_user', true, true) || {
  //   customerNumber: '7879196651',
  //   details: {
  //     dateOfBirth: '1996-07-23T00:00:00',
  //     passengerType: null,
  //     preferredCurrencyCode: null,
  //   },
  //   FFN:"123456780",
  //   name: { first: 'Pranit', last: 'Chandel', title: "MR" },
  // },
  isAuthenticated: Cookies.get('auth_user', true, true) || false,
  isLoyaltyAuthenticated: false,
  loggedInUser: {},
  savedPassengers: [],
  paxData: {
    bookingcontacts: [
      {
        OtherPhone: '',
        emailAddress: '',
        MobilePhone: '',
        OtherPhoneCountryCode: '',
        MobilePhoneCountryCode: '',
      },
    ],
    agentAccountInfo: {
      otherPhone: '',
      emailAddress: '',
      mobilePhone: '',
      otherPhoneCountryCode: '',
      mobilePhoneCountryCode: '',
    },
  },
  gstDetails: {
    companyName: {
      value: '',
      error: '',
    },
    companyEmail: {
      value: '',
      error: '',
    },
    companyGstNum: {
      value: '',
      error: '',
    },
  },
  nextFlagForGst: true,
  isGstComplete: false,
  isGstTouched: false,
  userRoleName: roleDetails?.roleName,
  isSMEUser: false,
  isAgentUser: false,
  passengers: [],
  modificationFlow: false,
  aemMainData: {
    privacyDescription: [],
  },
  specialFareCode: '',
  allSteps: progressSteps,
  currentStep: progressStepsKeys.passengerDetails,
  toggleModal: false,
  bookingContext: {},
  selectedSavedPassengers: [],
  onClickNext: false,
  postApiPayload: {},
  disableLoyalty: window.disableLoyalty ?? true,
  isBurnFlow: false,
  passengerEditError: null,
  adultMinorConsent: 'No',
  adultConsentData: [],
};
const AppProvider = AppContext.Provider;
const AppConsumer = AppContext.Consumer;

export {
  AppContext,
  AppProvider,
  AppConsumer,
  passengerEditReducer,
  passengerEditActions,
  passengerEditInitailState,
};
