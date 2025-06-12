import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { dateFormats, DOCUMENT_CODES, PAX_NAMES, PAX_SHORT_NAME } from '../../constants';
import { getPaxTitle } from '../../utils/functions';
import { isAfter, isEqual } from 'date-fns';

export const formatDateForPost = (date) => {
  return format(
    parse(date, dateFormats.ddMMyyyy, new Date()),
    dateFormats.yyyyMMdd,
  );
};

export const  isIssueDateAfterDOB = (dobStr, issueDateStr) => {
    try {
      const dob = formatDateForPost(dobStr);
      const issueDate = formatDateForPost(issueDateStr);
      return isAfter(issueDate, dob) || isEqual(issueDate, dob);
    } catch (err) {
      console.error(err.message);
      return false;
    }
  }

export const getPassenderDocumentsData = (formData) => {
  const passengertravelDocuments = [];

  formData.forEach((data) => {
    const {
      visa,
      passportFirstName,
      passportLastName,
      passportGender,
      passportDOB,
      passportNationality,
      passportNumber,
      expirationDate,
      passportIssuingCountry,
      passengerKey,
      passengerTypeCode,
      passportIssuingDate,
      visaFirstName,
      visaLastName,
      visaGender,
      visaDateOfBirth,
      visaCountry,
      visaNationality,
      visaUidNumber,
      visaIssuingCountry,
      visaExpirationDate,
      visaIssuingDate,
    } = data;

    let paxCode= '';
    if(passengerTypeCode === PAX_SHORT_NAME?.ADT){
      paxCode = PAX_NAMES.ADULT
    }else if(passengerTypeCode === PAX_SHORT_NAME?.INFT ){
      paxCode = PAX_NAMES.INFANT
    }
    passengertravelDocuments.push({
      passengerKey,
      passengerTypeCode: paxCode,
      declaratin: visa,
      documentTypeCode: 'P',
      birthCountry: passportNationality,
      issuedByCode: passportIssuingCountry,
      name: {
        first: passportFirstName,
        middle: '',
        last: passportLastName,
        title: passportGender === '1' ? 'MR' : 'MS',
        suffix: null,
      },
      nationality: passportNationality,
      expirationDate: formatDateForPost(expirationDate),
      number: passportNumber,
      issuedDate: formatDateForPost(passportIssuingDate),
      gender: passportGender,
      dateOfBirth: formatDateForPost(passportDOB),
    });

    if (visa === 'valid passport' || visa === 'yes') {
      passengertravelDocuments.push({
        passengerKey,
        passengerTypeCode: paxCode,
        declaratin: visa,
        documentTypeCode: 'V',
        birthCountry: visaCountry,
        issuedByCode: visaIssuingCountry,
        name: {
          first: visaFirstName,
          middle: '',
          last: visaLastName,
          title: visaGender === '1' ? 'MR' : 'MS',
          suffix: null,
        },
        nationality: visaNationality,
        expirationDate: formatDateForPost(visaExpirationDate),
        number: visaUidNumber,
        issuedDate: formatDateForPost(visaIssuingDate),
        gender: visaGender,
        dateOfBirth: formatDateForPost(visaDateOfBirth),
      });
    }
  });

  return passengertravelDocuments;
};

export const getPassengerPostData = (
  formData,
  journeyKey,
  emergencyDetails,
) => {
  return {
    passengerHealthData: formData.map(
      ({ passengerKey, name, email, mobile, country, city = '' }) => ({
        passengerKey,
        journeyKey,
        name,
        email,
        phoneNumber: mobile,
        countryCode: country ?? '91',
        city,
      }),
    ),
    EmergencyDetails: {
      emergencyPhoneNumber: emergencyDetails?.emergencyPhoneNumber || '',
      countryCode: emergencyDetails?.country || '',
      emergencyAddress: emergencyDetails?.emergencyAddress || '',
    },
  };
};

export const prefilledPostData = (
  journeysDetail,
  travelDocuments,
  passengerKeys,
  passengerDetails,
) => {
  const formatDate = (date) => {
    if (!date) {
      return '';
    }
    return format(new Date(date), dateFormats.ddMMyyyy);
  };

  const totalPassengers = journeysDetail?.passengers?.flatMap((ele)=>{
    if(ele?.infant?.dateOfBirth){
      return [ele, {...ele?.infant,passengerKey: ele?.passengerKey, segments: ele?.segments, passengerTypeCode: PAX_SHORT_NAME.INFT, subTitle: ele?.name?.first}]
    }
    return ele
  })

  const totalTravelDocuments = travelDocuments?.data?.passengers?.flatMap((ele)=>{
    if(ele?.infant?.dateOfBirth){
      return [ele, {...ele?.infant,passengerKey: ele?.passengerKey}]
    }
    return ele
  })

  return totalPassengers
    ?.filter((passenger) => {
      return passengerKeys.includes(passenger?.passengerKey);
    })
    ?.map((passenger) => {
      const filledDetails = totalTravelDocuments?.find(
        (value) => ((value?.name?.first === passenger?.name?.first) && (value?.name?.last === passenger?.name?.last))
      );

      const visaDetails = filledDetails?.travelDocuments?.find(
        (doc) => (doc?.documentTypeCode === DOCUMENT_CODES.VISA),
      );

      const passportDetails = filledDetails?.travelDocuments?.find(
        (doc) => (doc?.documentTypeCode === DOCUMENT_CODES.PASSPORT),
      );
      
      const dob = filledDetails?.info ? formatDate(filledDetails?.info?.dateOfBirth) : formatDate(filledDetails?.dateOfBirth) ;
      
      return {
        ...passenger,
        subTitle: getPaxTitle(passengerDetails, passenger),
        visa: visaDetails ? 'yes' : 'no',
        visaCountry: visaDetails?.birthCountry || '',
        visaDateOfBirth: visaDetails ? dob : '',
        visaExpirationDate: formatDate(visaDetails?.expirationDate),
        visaFirstName: visaDetails?.name?.first || '',
        visaGender: visaDetails?.gender || '',
        visaIssuingCountry: visaDetails?.issuedByCode || '',
        visaIssuingDate: formatDate(visaDetails?.issuedDate),
        visaLastName: visaDetails?.name?.last || '',
        visaNationality: visaDetails?.nationality || '',
        visaUidNumber: visaDetails?.number || '',
        passportCountry: passportDetails?.birthCountry ||'',
        passportDOB: passportDetails ? dob : '',
        passportFirstName: passportDetails?.name?.first || '',
        passportGender: passportDetails?.gender || '',
        passportIssuingCountry: passportDetails?.issuedByCode || '',
        passportIssuingDate: formatDate(passportDetails?.issuedDate),
        passportLastName: passportDetails?.name?.last || '',
        passportNationality: passportDetails?.nationality ||  '',
        passportNumber: passportDetails?.number ||  '',
        residenceCountry: passportDetails?.birthCountry ||  '',
        expirationDate: formatDate(passportDetails?.expirationDate)  ,
        mobile: filledDetails?.mobile || '',
        country: '91',
        email: filledDetails?.email || '',
        countryOfResidence: passportDetails?.birthCountry ||  '',
        visaCountryOfResidence: visaDetails?.birthCountry || ''
      };
    });
};
