/* eslint-disable sonarjs/cognitive-complexity */
import { useContext } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import {
  ALL_GENDERS,
  ALL_SEATS,
  ARMED_FORCE_ID_CODE,
  ARMED_FORCE_ID_LABEL,
  DOUBLE_SEAT,
  // DOUBLE_SEAT_LABEL,
  HOSPITAL_ID_LABEL,
  INSTITUTION_ID_LABEL,
  MEDICAL_LABEL,
  PASSENGER_TYPE,
  SRCT_ID,
  SRCT_ID_FIELD_NAME,
  STUDENT_ID_CODE,
  STUDENT_ID_LABEL,
  TRIPLE_SEAT,
  // TRIPLE_SEAT_LABEL,
  // dateFormats,
  LAST_FIELD_NAME,
  DOB_FIELD_LABEL,
  FIRST_AND_MIDDLE_FIELD_NAME,
  ETRA_SEATS_LABEL,
  EXTRA_SEATS_RADIOS,
  DATE_FORMAT_INFO_LABEL,
  UMNR_ID_CODE,
  ALL_CONSENT,
  SME_ADMIN,
  SME_USER,
  PERSONA_AGENT,
} from '../../../../constants/constants';
import { AppContext } from '../../../../context/appContext';
import {
  getPaxLabels,
  getSpecialFareCodeLabels,
} from '../../../../functions/getPassengersFormLabels';
import {
  convertToDDMMYYYY,
  isValidAndNotFutureDate,
} from '../../../../functions/checkFutureOrValidDate';

const createPaxFields = (
  fields,
  cardIndex,
  srctIndex,
  paxTypeCode,
  discountCode,
  bookingDetails = {},
  paxAllPersonalDetails = [],
  originalPaxData = {},
) => {
  const {
    state: {
      specialFareCode,
      aemMainData,
      modificationFlow,
      isSMEUser,
      isBurnFlow,
      userRoleName,
      disableLoyalty,
      isLoyaltyAuthenticated,
    },
  } = useContext(AppContext);
  const {
    passengerDetails,
    specialFareDetail,
    mandatoryFieldLabel,
    dateFormatInfo,
    dobErrorMsg,
  } = aemMainData;

  const paxLabels = getPaxLabels(passengerDetails, paxTypeCode, discountCode);

  const shouldEnableFFNForPersona = [SME_ADMIN, SME_USER, PERSONA_AGENT].includes(userRoleName);
  const hideFFNField = disableLoyalty && !shouldEnableFFNForPersona;

  const specialFareLabels = getSpecialFareCodeLabels(
    specialFareDetail,
    specialFareCode,
  );
  const { paxAllAdults, paxAllSRCT, paxAllChild } = paxAllPersonalDetails;
  const { seatWiseSelectedPaxInformation = {} } = bookingDetails;

  const {
    adultCount,
    adultExtraDoubleSeat,
    adultExtraTripleSeat,

    seniorCitizenCount,
    seniorCitizenExtraDoubleSeat,
    seniorCitizenExtraTripleSeat,

    childrenCount,
    childrenExtraDoubleSeat,
    childrenExtraTripleSeat,
  } = seatWiseSelectedPaxInformation;

  const { firstName, lastName, passengerId, dateOfBirthText, passengerIdInfo } = paxLabels;

  const { heading, institutionLabel, idPlaceholderLabel } = specialFareLabels;

  let paxRadioData = [];
  let paxFieldData = [];
  let paxSpecialFareData = [];
  const paxStudentData = [];
  let adultExtraSeatsData = [];
  let srctExtraSeatsData = [];
  let childExtraSeatsData = [];
  let paxInfantTaggedData = [];
  let paxFutureBookingData = [];
  let paxSpecialAssistanceData = [];
  let paxFFNumberData = {};
  let loyaltySignupData = {};
  let paxMinorRadioData = [];

  const extraSeats = {
    type: 'radio',
    fieldName: 'extraSeatTag',
    selectedValue: '',
    className: 'extra-seats-wrapper',
  };
  const extraSeatsAdult = {
    adultExtraDoubleSeat,
    adultExtraTripleSeat,
    ...extraSeats,
  };

  const extraSeatsSRCT = {
    seniorCitizenExtraDoubleSeat,
    seniorCitizenExtraTripleSeat,
    ...extraSeats,
  };

  const extraSeatsCHD = {
    childrenExtraDoubleSeat,
    childrenExtraTripleSeat,
    ...extraSeats,
  };
  fields?.forEach((pax) => {
    const disableWheelChair = pax?.specialAssistance?.options?.wheelchairAlreadyOpt;
    const { extraSeatTag, gender } = originalPaxData;
    const { isInfant, paxGender, infantTaggedWithPaxName, passengerTypeCode } = pax;
    const paxDetails = { ...pax.info, ...pax.name };
    const fieldNamePrefix = `userFields.${cardIndex}.`;
    const isSRCT = pax.discountCode === SRCT_ID;
    const isUMNR = specialFareCode === UMNR_ID_CODE;
    const isChild = passengerTypeCode === PASSENGER_TYPE.CHILD;
    const isDOBRequired = isSRCT || isInfant || isUMNR || isChild ? dobErrorMsg : '';
    const paxKey = pax.passengerKey;
    const dateString = convertToDDMMYYYY(originalPaxData.info.dateOfBirth);
    const DOB = isValidAndNotFutureDate(dateString) ? dateString : '';
    let extraSeatTagKey = modificationFlow ? extraSeatTag : '';
    if (!modificationFlow) {
      switch (extraSeatTag) {
        case 'Double Seat':
          extraSeatTagKey = 'DOUBLE';
          break;
        case 'Triple Seat':
          extraSeatTagKey = 'TRIPLE';
          break;
        default:
          extraSeatTagKey = '';
          break;
      }
    }

    const isLoyaltyBurn = isLoyaltyAuthenticated && isBurnFlow && !isInfant;

    paxRadioData = [
      {
        type: 'radio',
        fieldName: 'gender',
        selectedValue: gender || paxGender,
        items: ALL_GENDERS,
        firstThree: true,
        required: paxGender ? '' : mandatoryFieldLabel,
        disabled:
          originalPaxData?.isFromFavList
          || modificationFlow
          || isSMEUser
          || isLoyaltyBurn,
      },
    ];

    paxFieldData = [
      {
        type: 'text',
        fieldName: FIRST_AND_MIDDLE_FIELD_NAME,
        placeholder: firstName,
        name: `${fieldNamePrefix}name.${FIRST_AND_MIDDLE_FIELD_NAME}`,
        value: paxDetails.first || '',
        title: paxDetails.title,
        firstThree: true,
        disabled:
          originalPaxData?.isFromFavList
          || modificationFlow
          || isSMEUser
          || isLoyaltyBurn,
      },
      {
        type: 'text',
        fieldName: LAST_FIELD_NAME,
        placeholder: lastName,
        inputWrapperClass: 'ms-md-8',
        name: `${fieldNamePrefix}name.${LAST_FIELD_NAME}`,
        value: paxDetails.last || '',
        firstThree: true,
        disabled:
          originalPaxData?.isFromFavList
          || modificationFlow
          || isSMEUser
          || isLoyaltyBurn,
      },
    ];
    paxSpecialFareData = [
      {
        isDOB: true,
        type: 'text',
        fieldName: DOB_FIELD_LABEL,
        placeholder: isDOBRequired
          ? dateOfBirthText?.replace('(Optional)', '')
          : dateOfBirthText,
        name: `${fieldNamePrefix}info.${DOB_FIELD_LABEL}`,
        value: DOB,
        iconType: 'icon-asterik',
        infoMsg: dateFormatInfo || DATE_FORMAT_INFO_LABEL,
        required: isDOBRequired,
        isPrefilled: !!paxDetails.dateOfBirth,
        showCrossIcon: false,
        disabled:
          (dateString.length
            && (originalPaxData?.isFromFavList
              || modificationFlow
              || isSMEUser))
          || isLoyaltyBurn,
        paxTypeCode: pax.paxTypeCode,
      },
    ];
    paxFutureBookingData = [
      {
        id: `${fieldNamePrefix}save`,
        type: 'checkbox',
        name: `${fieldNamePrefix}save`,
        isFromFavList: pax.isFromFavList,
      },
    ];
    if (!isInfant) {
      paxSpecialAssistanceData = [
        {
          name: `${fieldNamePrefix}specialAssistance`,
          optionsName: `${fieldNamePrefix}specialAssistance.options`,
          journeyName: `${fieldNamePrefix}specialAssistance.journey`,
          wheelchairReasonName: `${fieldNamePrefix}specialAssistance.wheelchair.reason`,
          wheelChairAssistanceLevel: `${fieldNamePrefix}specialAssistance.wheelchair.assistencelevel`,
          wheelchairCategoryName: `${fieldNamePrefix}specialAssistance.wheelchair.category`,
          wheelchairSubCategoryName: `${fieldNamePrefix}specialAssistance.wheelchair.subCategory`,
          assistanceRequiredName: `${fieldNamePrefix}specialAssistance.wheelchair.assistanceRequired`,
          consentName: `${fieldNamePrefix}specialAssistance.consent`,
          contactNumberName: `${fieldNamePrefix}specialAssistance.wheelchair.contactNumber`,
          disableWheelChair,
        },
      ];
    }
    if (isSRCT) {
      paxSpecialFareData.push({
        type: 'text',
        fieldName: SRCT_ID_FIELD_NAME,
        placeholder: passengerId,
        infoMsg: passengerIdInfo,
        inputWrapperClass: 'ms-md-8',
        iconType: 'info-msg',
        name: `${fieldNamePrefix}${SRCT_ID_FIELD_NAME}`,
        value: '',
        srctIndex,
        disabled: modificationFlow || isSMEUser,
      });
    }
    if (
      specialFareCode === MEDICAL_LABEL
      && paxTypeCode === PASSENGER_TYPE.ADULT
    ) {
      paxSpecialFareData.push({
        type: 'text',
        fieldName: HOSPITAL_ID_LABEL,
        placeholder: idPlaceholderLabel,
        inputWrapperClass: 'ms-md-8',
        name: `${fieldNamePrefix}${HOSPITAL_ID_LABEL}`,
        value: '',
        disabled: modificationFlow || isSMEUser,
      });
    }
    if (
      specialFareCode === ARMED_FORCE_ID_CODE
      && paxTypeCode === PASSENGER_TYPE.ADULT
    ) {
      paxSpecialFareData.push({
        type: 'text',
        required: '',
        fieldName: ARMED_FORCE_ID_LABEL,
        placeholder: idPlaceholderLabel,
        inputWrapperClass: 'ms-md-8',
        name: `${fieldNamePrefix}${ARMED_FORCE_ID_LABEL}`,
        value: '',
        disabled: modificationFlow || isSMEUser,
      });
    }
    if (specialFareCode === STUDENT_ID_CODE) {
      paxStudentData.push({
        type: 'text',
        required: '',
        heading,
        specialFareCode,
        fieldName: STUDENT_ID_LABEL,
        placeholder: idPlaceholderLabel,
        name: `${fieldNamePrefix}${STUDENT_ID_LABEL}`,
        value: '',
        disabled: modificationFlow || isSMEUser,
      });
      paxStudentData.push({
        type: 'text',
        required: '',
        heading,
        specialFareCode,
        fieldName: INSTITUTION_ID_LABEL,
        placeholder: institutionLabel,
        inputWrapperClass: 'ms-md-8',
        name: `${fieldNamePrefix}${INSTITUTION_ID_LABEL}`,
        value: '',
        disabled: modificationFlow || isSMEUser,
      });
    }
    if (paxTypeCode === PASSENGER_TYPE.ADULT) {
      extraSeatsAdult.paxKey = paxKey;
      extraSeatsAdult.paxAllAdults = paxAllAdults;
      if (extraSeatTagKey) {
        extraSeatsAdult.items = cloneDeep(EXTRA_SEATS_RADIOS[extraSeatTagKey]);
        extraSeatsAdult.selectedValue = {
          [paxKey]: { value: ETRA_SEATS_LABEL[extraSeatTagKey] },
        };
        adultExtraSeatsData = [extraSeatsAdult];
      } else if (adultExtraDoubleSeat && adultExtraTripleSeat) {
        extraSeatsAdult.items = cloneDeep(ALL_SEATS);
        adultExtraSeatsData = [extraSeatsAdult];
        if (adultExtraDoubleSeat + adultExtraTripleSeat === adultCount) {
          extraSeatsAdult.items[2].disabled = true;
        }
      } else if (adultExtraDoubleSeat) {
        extraSeatsAdult.items = cloneDeep(DOUBLE_SEAT);
        adultExtraSeatsData = [extraSeatsAdult];
        if (adultExtraDoubleSeat === adultCount) {
          extraSeatsAdult.items[1].disabled = true;
          extraSeatsAdult.items[2].disabled = true;
        }
      } else if (adultExtraTripleSeat) {
        extraSeatsAdult.items = cloneDeep(TRIPLE_SEAT);
        adultExtraSeatsData = [extraSeatsAdult];
        if (adultExtraTripleSeat === adultCount) {
          extraSeatsAdult.items[0].disabled = true;
          extraSeatsAdult.items[2].disabled = true;
        }
      }
    }
    if (paxTypeCode === PASSENGER_TYPE.SENIOUR) {
      extraSeatsSRCT.paxKey = paxKey;
      extraSeatsSRCT.paxAllSRCT = paxAllSRCT;
      if (extraSeatTagKey) {
        extraSeatsSRCT.items = cloneDeep(EXTRA_SEATS_RADIOS[extraSeatTagKey]);
        extraSeatsSRCT.selectedValue = {
          [paxKey]: { value: ETRA_SEATS_LABEL[extraSeatTagKey] },
        };
        srctExtraSeatsData = [extraSeatsSRCT];
      } else if (seniorCitizenExtraDoubleSeat && seniorCitizenExtraTripleSeat) {
        extraSeatsSRCT.items = cloneDeep(ALL_SEATS);
        srctExtraSeatsData = [extraSeatsSRCT];
        if (
          seniorCitizenExtraDoubleSeat + seniorCitizenExtraTripleSeat
          === seniorCitizenCount
        ) {
          extraSeatsSRCT.items[2].disabled = true;
        }
      } else if (seniorCitizenExtraDoubleSeat) {
        extraSeatsSRCT.items = cloneDeep(DOUBLE_SEAT);
        srctExtraSeatsData = [extraSeatsSRCT];
        if (seniorCitizenExtraDoubleSeat === seniorCitizenCount) {
          extraSeatsSRCT.items[1].disabled = true;
          extraSeatsSRCT.items[2].disabled = true;
        }
      } else if (seniorCitizenExtraTripleSeat) {
        extraSeatsSRCT.items = cloneDeep(TRIPLE_SEAT);
        // if (seniorCitizenCount === seniorCitizenExtraTripleSeat) {
        //   extraSeatsSRCT.selectedValue = {
        //     [paxKey]: { value: TRIPLE_SEAT_LABEL },
        //   };
        // }
        srctExtraSeatsData = [extraSeatsSRCT];
        if (seniorCitizenExtraTripleSeat === seniorCitizenCount) {
          extraSeatsSRCT.items[0].disabled = true;
          extraSeatsSRCT.items[2].disabled = true;
        }
      }
    }
    if (paxTypeCode === PASSENGER_TYPE.CHILD) {
      extraSeatsCHD.paxKey = paxKey;
      extraSeatsCHD.paxAllChild = paxAllChild;
      if (extraSeatTagKey) {
        extraSeatsCHD.items = cloneDeep(EXTRA_SEATS_RADIOS[extraSeatTagKey]);
        extraSeatsCHD.selectedValue = {
          [paxKey]: { value: ETRA_SEATS_LABEL[extraSeatTagKey] },
        };
        childExtraSeatsData = [extraSeatsCHD];
      } else if (childrenExtraDoubleSeat && childrenExtraTripleSeat) {
        extraSeatsCHD.items = cloneDeep(ALL_SEATS);
        childExtraSeatsData = [extraSeatsCHD];
        if (
          childrenExtraDoubleSeat + childrenExtraTripleSeat
          === childrenCount
        ) {
          extraSeatsCHD.items[2].disabled = true;
        }
      } else if (childrenExtraDoubleSeat) {
        extraSeatsCHD.items = cloneDeep(DOUBLE_SEAT);
        childExtraSeatsData = [extraSeatsCHD];
        if (childrenExtraDoubleSeat === childrenCount) {
          extraSeatsCHD.items[1].disabled = true;
          extraSeatsCHD.items[2].disabled = true;
        }
      } else if (childrenExtraTripleSeat) {
        extraSeatsCHD.items = cloneDeep(TRIPLE_SEAT);
        childExtraSeatsData = [extraSeatsCHD];
        if (childrenExtraTripleSeat === childrenCount) {
          extraSeatsCHD.items[0].disabled = true;
          extraSeatsCHD.items[2].disabled = true;
        }
      }
    }
    if (paxTypeCode === PASSENGER_TYPE.INFANT) {
      paxInfantTaggedData = [
        {
          type: 'radio',
          isChecked: true,
          name: `userFields.${cardIndex}.infantTaggedWith`,
          fieldName: 'infantTaggedWith',
          items: [
            {
              label: infantTaggedWithPaxName,
              value: infantTaggedWithPaxName,
              paxKey,
              required: true,
            },
          ],
          selectedValue: infantTaggedWithPaxName,
          className: `d-flex flex-wrap gap-8 gap-md-24 mb-12 justify-content-md-start 
          justify-content-sm-between extra-seats-wrapper`,
        },
      ];
    }

    paxFFNumberData = {
      ffName: `userFields.${cardIndex}.loyaltyInfo.FFN`,
      disabled:
        pax?.loyaltyInfo?.optLoyaltySignup
        || (pax?.isFromFavList && pax?.loyaltyInfo?.selfTravel)
        || pax?.program?.number,
      hidden:
        ['CHD', 'INFT'].includes(paxTypeCode)
        || isLoyaltyBurn
        || hideFFNField,
    };

    loyaltySignupData = {
      loyaltySignupName: `userFields.${cardIndex}.loyaltyInfo.optLoyaltySignup`,
      disabled:
        pax?.loyaltyInfo?.FFN?.length
        || (isLoyaltyAuthenticated
          && pax?.isFromFavList
          && pax?.loyaltyInfo?.selfTravel)
        || pax?.program?.number
        || modificationFlow,
      hidden:
        ['CHD', 'INFT'].includes(paxTypeCode)
        || disableLoyalty
        || isLoyaltyBurn,
    };
  });

  paxMinorRadioData = [
    {
      type: 'radio',
      fieldName: 'minorConsent',
      items: ALL_CONSENT,
    },
  ];
  return {
    paxRadioData,
    paxFieldData,
    paxSpecialFareData,
    paxStudentData,
    adultExtraSeatsData,
    srctExtraSeatsData,
    childExtraSeatsData,
    paxInfantTaggedData,
    paxFutureBookingData,
    paxSpecialAssistanceData,
    paxFFNumberData,
    loyaltySignupData,
    paxMinorRadioData,
  };
};

export default createPaxFields;
