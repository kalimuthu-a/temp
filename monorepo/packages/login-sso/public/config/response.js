/* eslint-disable quote-props */
/* eslint-disable quotes */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
export const checkuserMockResponse = {
  data: {
    isSignUp: false,
    isMigrated: false,
    isLoyaltyMember: false,
    isMobileNumberverified: true,
    isEmailIdVerified: false,
    isActivated: true,
    isCoBrandMember: false,
    iframeUrl:
      'https://igaciamsandbox.b2clogin.com/IGACIAMSANDBOX.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_WITHOUTLOYALTYSIGNINWITHPHONENOOTP&client_id=9b5f309c-73a8-4fa0-abff-b7cf3cbe7f6c&nonce=defaultNonce&redirect_uri=https%3A%2F%2Faem-s6web-qa-skyplus6e.goindigo.in%2Fmsal-login-success.html&scope=openid&response_type=id_token&prompt=login&login_hint=%2b919023029150',
    userDetails: {
      userObjectId: '001e2037-ba03-42db-96d7-dc19fdf533df',
      firstName: 'sarthak',
      lastName: 'bansal',
      mobileNumber: '+919023029150',
      emailId: 'sarthak.tiet@gmail.com',
      ffNumber: null,
      dob: '11-11-1999',
      gender: 'Female',
      countryCode: '+91',
    },
  },
  errors: null,
};

export const checkExistenceMockResponse = {
  data: {
    isMobileExist: true,
    isEmailExist: true,
  },
  errors: null,
};

export const sendOtpMockResponse = {
  data: {
    success: true,
  },
  error: null,
};

export const validateOtpSuccessMockResponse = {
  data: {
    success: true,
    mobileVerified: true,
    emailVerified: true,
  },
  errors: null,
};

export const validateOtpFailMockResponse = {
  data: {
    success: false,
    mobileVerified: true,
    emailVerified: false,
  },
  errors: {
    type: 'Error',
    code: 'Email Verification:Failed',
    message: 'Email verification failed',
    subType: 'BadRequest',
  },
};

export const signupSuccesMockResponse = {
  data: {
    success: true,
    isCreatedinCIAM: true,
    isCreatedinLoyalty: true,
    isCreatedinNavitaire: true,
  },
  errors: null,
};

export const mockValidTokenAPIResponse = {
  data: {
    otpRequired: false,
    token: {
      token: '',
      idleTimeoutInMinutes: 15,
    },
    strToken: '',
    passwordChangeRequired: false,
    roleCode: 'WWWM',
    roleName: 'Member',
    person: {
      personKey: 'MTg0NjMzMDE-',
      name: {
        personNameKey: 'MTg0NjMzMDEhMTg0NjA1NjQ-',
        first: 'sarthak',
        middle: null,
        last: 'bansal',
        title: null,
        suffix: null,
      },
      customerNumber: '917009269255',
      type: 1,
      emailAddresses: [
        {
          personEmailKey: 'MTg0NjMzMDEhVw--',
          type: 'W',
          email: 'sarthakb@adobe.com',
          default: true,
        },
      ],
      status: 0,
      createdDate: '2024-08-14T11:44:32.977',
      phoneNumbers: [
        {
          personPhoneNumberKey: 'MTg0NjMzMDEhMTQyNzQ-',
          default: true,
          type: 1,
          number: '+917009269255',
        },
      ],
      details: {
        gender: 0,
        dateOfBirth: '1999-11-11T00:00:00',
        nationality: null,
        residentCountry: null,
        passengerType: null,
        preferredCultureCode: null,
        preferredCurrencyCode: null,
        nationalIdNumber: null,
      },
      addresses: [],
      notificationPreference: 0,
      storedPayments: [],
      travelDocuments: [],
      programs: [],
      comments: [],
      preferences: [],
      aliases: null,
      affiliates: [],
      loyaltyMemberInfo: null,
    },
    accountDetails: {
      data: {
        collection: null,
        accountKey: null,
        currencyCode: null,
        totalAvailable: 0,
        owner: 0,
        type: 0,
        status: 0,
        totalAmount: 0,
        foreignAvailable: 0,
        foreignCurrencyCode: null,
      },
    },
  },
  metadata: null,
  errors: null,
};

export const registerAPIMock = {
  data: {
    loyaltyMemberInfo: {
      tier: 'Gold',
      FFN: 18,
      pointBalance: 73940,
      pointRedeemEligibilityFlag: true,
    },
  },
  errors: null,
};

export const registerMOckss = {
  data: {
    loyaltyMemberInfo: {
      tier: 'Base',
      ffn: '000011362',
      pointBalance: 0,
      pointRedeemEligibilityFlag: 'true',
    },
  },
  errors: null,
};
