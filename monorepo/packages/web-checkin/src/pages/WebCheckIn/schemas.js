/* eslint-disable sonarjs/no-duplicate-string */
import subYears from 'date-fns/subYears';
import addYears from 'date-fns/addYears';

import { PASSPORT_MAX_LEMGTH, regexConstant, HOME_ADDRESSS } from '../../constants';
import { isAdult, isChildren, isInfant, isSeniorCitizen } from '../../utils/functions';
import { formatDateForPost } from './utils';

const requiredFieldError = 'This field is required';
const issualMaxDate = new Date();
issualMaxDate.setDate(issualMaxDate.getDate() - 1);

export const formSchema = {
  passportFirstName: {
    type: ['required'],
    fieldType: 'text',
    placeholder: 'First & Middle Name',
    errors: {
      required: 'First Name is required',
    },
  },
  passportLastName: {
    type: ['required'],
    fieldType: 'text',
    placeholder: 'Last Name',
    errors: {
      required: 'Last Name is required',
    },
  },
  passportGender: {
    type: ['required'],
    fieldType: 'gender',
    placeholder: 'Gender',
    errors: {
      required: 'Gender is required',
    },
  },
  passportDOB: {
    type: ['required'],
    fieldType: 'date',
    placeholder: 'Date of Birth',
    errors: {
      required: 'Date of Birth is required',
    },
    maxDate: new Date(),
    minDate: subYears(new Date(), 130),
  },
  passportCountry: {
    type: ['required'],
    fieldType: 'country',
    placeholder: 'Country of Birth',
    errors: {
      required: 'Passport Country is required',
    },
  },
  passportNationality: {
    type: ['required'],
    fieldType: 'country',
    placeholder: 'Nationality',
    errors: {
      required: 'Nationality is required',
    },
  },
  residenceCountry: {
    type: ['required'],
    fieldType: 'country',
    placeholder: 'Country of Residence',
    errors: {
      required: 'Nationality is required',
    },
  },
  passportNumber: {
    type: ['required'],
    fieldType: 'text',
    placeholder: 'Passport Number',
    errors: {
      required: 'Passport Number is required',
    },
    maxLength: PASSPORT_MAX_LEMGTH,
  },
  expirationDate: {
    type: ['required'],
    fieldType: 'date',
    placeholder: 'Expiration Date',
    errors: {
      required: 'Passport Number is required',
    },
    maxDate: new Date(),
    minDate: addYears(new Date(), 5),
  },
  passportIssuingCountry: {
    type: ['required'],
    fieldType: 'country',
    placeholder: 'Passport issuing country',
    errors: {
      required: 'Passport Number is required',
    },
  },
  passportIssuingDate: {
    type: ['required'],
    fieldType: 'date',
    placeholder: 'Issuing Date',
    errors: {
      required: requiredFieldError,
    },
  },
  visa: {
    type: ['required'],
    fieldType: 'radio',
    errors: {
      required: 'Please choose option',
    },
  },
};

export const visaFormSchema = {
  visaFirstName: {
    fieldType: 'text',
    placeholder: 'First & Middle Name',
    errors: {
      required: 'First Name is required',
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaLastName: {
    fieldType: 'text',
    placeholder: 'Last Name',
    errors: {
      required: 'Last Name is required',
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaGender: {
    fieldType: 'gender',
    placeholder: 'Gender',
    errors: {
      required: 'Gender is required',
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaDateOfBirth: {
    fieldType: 'date',
    placeholder: 'Date of Birth',
    errors: {
      required: 'Date of Birth is required',
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaCountry: {
    fieldType: 'country',
    placeholder: 'Country of Birth',
    errors: {
      required: 'Birth Country is required',
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaNationality: {
    fieldType: 'text',
    placeholder: 'Nationality',
    errors: {
      required: 'Nationality is required',
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaCountryOfResidence: {
    fieldType: 'country',
    placeholder: 'Country of Residence',
    errors: {
      required: 'Country of Residence is required',
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaUidNumber: {
    fieldType: 'text',
    placeholder: 'Visa/UID Number',
    errors: {
      required: 'Visa/UID Number is required',
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaExpirationDate: {
    fieldType: 'date',
    placeholder: 'Expiration Date',
    errors: {
      required: 'Expiration Date is required',
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaIssuingCountry: {
    fieldType: 'country',
    placeholder: 'Visa issuing country',
    errors: {
      required: requiredFieldError,
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
  visaIssuingDate: {
    fieldType: 'date',
    placeholder: 'Issuing Date',
    errors: {
      required: requiredFieldError,
    },
    type: ['safe'],
    conditions: [
      {
        key: 'visa',
        operator: 'equal',
        value: 'yes',
        type: ['required'],
      },
      {
        key: 'visa',
        operator: 'notequal',
        value: 'yes',
        type: ['safe'],
      },
    ],
  },
};

export const contactInfoSchema = {
  country: {
    type: ['required'],
    fieldType: 'countrycode',
    placeholder: 'Visa issuing country',
    errors: {
      required: 'Visa issuing country is required',
    },
    className: 'col-2',
  },
  mobile: {
    type: ['required', 'match'],
    fieldType: 'text',
    placeholder: 'Primary Contact Number',
    regex: regexConstant.MOBILE10,
    errors: {
      required: 'Contact Number is required',
      match: 'Invalid Number',
    },
    className: 'col-5',
    conditions: [
      {
        key: 'country',
        operator: 'equal',
        value: '91',
        type: ['required', 'match'],
        rules: {
          regex: regexConstant.MOBILE10,
        },
      },
      {
        key: 'country',
        operator: 'notequal',
        value: '91',
        type: ['required', 'match'],
        rules: {
          regex: regexConstant.ONLYDIGIT,
        },
      },
    ],
  },
  email: {
    type: ['required', 'email'],
    fieldType: 'text',
    placeholder: 'Email Id',
    errors: {
      required: 'Email is required',
      email: 'Not a Valid Email',
    },
    className: 'col-5',
  },
};

export const generateContactInfoAemSchema = (aemData) => {
  const { mobileNoLabel, emailLabel } = aemData;
  return {
    country: {
      type: ['required'],
      fieldType: 'countrycode',
      placeholder: '',
      errors: {
        required: '',
      },
      className: 'col-2',
    },
    mobile: {
      type: ['required', 'match'],
      fieldType: 'text',
      placeholder: mobileNoLabel,
      regex: regexConstant.MOBILE10,
      errors: {
        required: requiredFieldError,
        match: 'Invalid Number',
      },
      className: 'col-5',
      conditions: [
        {
          key: 'country',
          operator: 'equal',
          value: '91',
          type: ['required', 'match'],
          rules: {
            regex: regexConstant.MOBILE10,
          },
        },
        {
          key: 'country',
          operator: 'notequal',
          value: '91',
          type: ['required', 'match'],
          rules: {
            regex: regexConstant.ONLYDIGIT,
          },
        },
      ],
    },
    email: {
      type: ['required', 'email'],
      fieldType: 'text',
      placeholder: emailLabel,
      errors: {
        required: 'Email is required',
        email: requiredFieldError,
      },
      className: 'col-5',
    },

  };
};

export const generateEmergencyContactInfoAemSchema = (aemData, data) => {
  const { mobileNoLabel } = aemData;
  const mobileData = data?.phone?.split('*') || [];
  const phoneValue = mobileData[1] || null;
  const countryValue = mobileData[0] || null;
  const disable = !(phoneValue || data?.lineOne);
  return {
    country: {
      type: ['required'],
      fieldType: 'countrycode',
      placeholder: '',
      errors: {
        required: '',
      },
      className: 'col-2',
      value: countryValue || null,
      disabled: !disable,
    },
    emergencyPhoneNumber: {
      type: ['required', 'match'],
      fieldType: 'text',
      placeholder: mobileNoLabel,
      regex: regexConstant.MOBILE10,
      errors: {
        required: requiredFieldError,
        match: 'Invalid Number',
      },
      value: phoneValue || null,
      disabled: !disable,
      className: 'col-5',
      conditions: [
        {
          key: 'country',
          operator: 'equal',
          value: '91',
          type: ['required', 'match'],
          rules: {
            regex: regexConstant.MOBILE10,
          },
        },
        {
          key: 'country',
          operator: 'notequal',
          value: '91',
          type: ['required', 'match'],
          rules: {
            regex: regexConstant.MOBILE10,
          },
        },
      ],
    },
    emergencyAddress: {
      type: ['match'],
      fieldType: 'text',
      placeholder: 'Home Address',
      suggestionField: disable && 'Max 128 characters',
      regex: regexConstant.CHARCT10,
      errors: {
        match: 'Enter at least 10 characters',
      },
      className: 'col-5',
      maxLength: HOME_ADDRESSS,
      value: data?.lineOne || null,
      disabled: !disable,
    },
  };
};

export const generatePassportFormSchema = (
  aemData,
  departureDate,
  passenger,
) => {
  const {
    firstName,
    passportNumber,
    lastName,
    gender,
    dateOfBirth,
    countryOfBirth,
    passportCountry,
    countryOfResidence,
    dateOfExpiration,
    nationality,
  } = aemData;

  let passportDOBprops = {};
  const dobInISO  = passenger?.passportDOB ? formatDateForPost(passenger?.passportDOB) : "" ;

  if (isChildren(passenger)) {
    passportDOBprops = {
      maxDate: subYears(new Date(departureDate), 2),
      minDate: subYears(new Date(departureDate), 12),
    };
  } else if (isSeniorCitizen(passenger)) {
    passportDOBprops = {
      maxDate: subYears(new Date(departureDate), 70),
      minDate: subYears(new Date(departureDate), 130),
    };
  } else if (isInfant(passenger)) {
    passportDOBprops = {
      maxDate: subYears(new Date(departureDate), 0),
      minDate: subYears(new Date(departureDate), 2),
    };
  } else {
    passportDOBprops = {
      maxDate: subYears(new Date(departureDate), 12),
      minDate: subYears(new Date(departureDate), 70),
    };
  }

  return {
    passportFirstName: {
      type: ['required'],
      fieldType: 'text',
      placeholder: firstName,
      errors: {
        required: requiredFieldError,
      },
    },
    passportLastName: {
      type: ['required'],
      fieldType: 'text',
      placeholder: lastName,
      errors: {
        required: requiredFieldError,
      },
    },
    passportGender: {
      type: ['required'],
      fieldType: 'gender',
      placeholder: gender,
      errors: {
        required: requiredFieldError,
      },
    },
    passportDOB: {
      type: ['required', 'date'],
      fieldType: 'date',
      placeholder: dateOfBirth,
      errors: {
        required: requiredFieldError,
      },
      fieldProps: passportDOBprops,
    },
    passportCountry: {
      type: ['required'],
      fieldType: 'country',
      placeholder: countryOfBirth,
      errors: {
        required: requiredFieldError,
      },
    },
    passportNationality: {
      type: ['required'],
      fieldType: 'country',
      placeholder: nationality,
      errors: {
        required: requiredFieldError,
      },
    },
    residenceCountry: {
      type: ['required'],
      fieldType: 'country',
      placeholder: countryOfResidence,
      errors: {
        required: requiredFieldError,
      },
    },
    passportNumber: {
      type: ['required'],
      fieldType: 'text',
      placeholder: passportNumber,
      errors: {
        required: requiredFieldError,
      },
      maxLength: PASSPORT_MAX_LEMGTH,
    },
    expirationDate: {
      type: ['required', 'date'],
      fieldType: 'date',
      placeholder: dateOfExpiration,
      errors: {
        required: requiredFieldError,
      },
      fieldProps: {
        minDate: new Date(departureDate),
      },
    },
    passportIssuingCountry: {
      type: ['required'],
      fieldType: 'country',
      placeholder: passportCountry,
      errors: {
        required: requiredFieldError,
      },
    },
    passportIssuingDate: {
      type: ['required', 'date'],
      fieldType: 'date',
      placeholder: aemData?.passportIssuingDate ?? 'Issuing Date*',
      errors: {
        required: requiredFieldError,
      },
      fieldProps: {
        minDate: new Date(dobInISO),
        maxDate: issualMaxDate,
      },
    },
  };
};

export const generateVisaFormSchema = (aemData, departureDate, passenger) => {
  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    countryOfResidence,
    dateOfExpiration,
    nationality,
  } = aemData;
  

  let visaDOBprops = {};
  const dobInISO  = passenger?.visaDateOfBirth ? formatDateForPost(passenger?.visaDateOfBirth) : "";

  if (isAdult(passenger)) {
    visaDOBprops = {
      maxDate: subYears(new Date(departureDate), 12),
      minDate: subYears(new Date(departureDate), 70),
    };
  } else if (isSeniorCitizen(passenger)) {
    visaDOBprops = {
      maxDate: subYears(new Date(departureDate), 70),
      minDate: subYears(new Date(departureDate), 130),
    };
  } else if (isChildren(passenger)) {
    visaDOBprops = {
      maxDate: subYears(new Date(departureDate), 2),
      minDate: subYears(new Date(departureDate), 12),
    };
  }

  return {
    visaFirstName: {
      fieldType: 'text',
      placeholder: firstName,
      errors: {
        required: requiredFieldError,
      },
      type: ['safe'],
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
    },
    visaLastName: {
      fieldType: 'text',
      placeholder: lastName,
      errors: {
        required: requiredFieldError,
      },
      type: ['safe'],
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
    },
    visaGender: {
      fieldType: 'gender',
      placeholder: gender,
      errors: {
        required: requiredFieldError,
      },
      type: ['safe'],
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
    },
    visaDateOfBirth: {
      fieldType: 'date',
      placeholder: dateOfBirth,
      errors: {
        required: requiredFieldError,
      },
      type: ['safe', 'date'],
      fieldProps: visaDOBprops,
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
    },
    visaCountry: {
      fieldType: 'country',
      placeholder: aemData?.visaCountry ?? 'Visa Country*',
      errors: {
        required: requiredFieldError,
      },
      type: ['safe'],
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
    },
    visaNationality: {
      fieldType: 'country',
      placeholder: nationality,
      errors: {
        required: requiredFieldError,
      },
      type: ['safe'],
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
    },
    visaCountryOfResidence: {
      fieldType: 'country',
      placeholder: countryOfResidence,
      errors: {
        required: requiredFieldError,
      },
      type: ['safe'],
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
    },
    visaUidNumber: {
      fieldType: 'text',
      placeholder: aemData?.visaUIDNumber ?? 'Visa/UID Number',
      errors: {
        required: requiredFieldError,
      },
      type: ['safe'],
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
    },
    visaExpirationDate: {
      fieldType: 'date',
      placeholder: dateOfExpiration,
      errors: {
        required: requiredFieldError,
      },
      type: ['safe', 'date'],
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
      fieldProps: {
        minDate: new Date(departureDate),
      },
    },
    visaIssuingCountry: {
      fieldType: 'country',
      placeholder: aemData?.visaIssuingCountry ?? 'Visa issuing country*',
      errors: {
        required: requiredFieldError,
      },
      type: ['safe'],
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
    },
    visaIssuingDate: {
      fieldType: 'date',
      placeholder: aemData?.visaIssuingDate ?? 'Issuing Date*',
      type: ['safe', 'date'],
      errors: {
        required: requiredFieldError,
      },
      conditions: [
        {
          key: 'visa',
          operator: 'equal',
          value: 'yes',
          type: ['required'],
        },
        {
          key: 'visa',
          operator: 'notequal',
          value: 'yes',
          type: ['safe'],
        },
      ],
      fieldProps: {
        minDate: new Date(dobInISO),
        maxDate: issualMaxDate,
      },
    },
  };
};
