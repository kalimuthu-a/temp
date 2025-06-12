import React, { useState } from 'react';
import parse from 'html-react-parser';
import PopupModalWithContent from './PopupModalWithContent';
import FareCategory from '../FareCategory/FareCategory';
import NationalityPopup from '../NationalityPopup/NationalityPopup';
import FlightnFare from '../FlightnFare/FlightnFare';
import ContactDetails from '../ContactDetails/ContactDetails';
import TerminalChange from '../TerminalChange/TerminalChange';
import FlexiPlus from '../FlexiPlus/FlexiPlus';
import ImportantInformation from '../ImportantInformation/ImportantInformation';
import MultiCity from '../MultiCity/MultiCity';
import VaccinationInformation from '../VaccinationInformation/VaccinationInformation';
import ArmedForces from '../ArmedForces/ArmedForces';
import StudentID from '../StudentID/StudentID';
import { DoctorAndNurse } from '../DoctorAndNurse';
import { SessionTimeoutModal } from '../SessionTimeoutModal';

export default {
  component: PopupModalWithContent,
  title: 'Popup Modal With Content',
};

export const Default = (args) => {
  const [popupCloseHandler, setPopupCloseHandler] = useState(true);
  const onCloseHandler = (event) => {
    event.stopPropagation();
    setPopupCloseHandler((popupCloseHandler) => !popupCloseHandler);
  };

  const child = 'This is some child content that would be rendered inside Popup Modal With Content component.';
  return (
    popupCloseHandler && (
      <PopupModalWithContent
        className={args.className}
        onCloseHandler={onCloseHandler}
        modalTitle={args.title}
        customPopupContentClassName={args.customPopupContentClassName}
      >
        {args.children || child}
      </PopupModalWithContent>
    )
  );
};

export const FareCategoryModal = (args) => {
  const title = 'Fare Category Description';

  const scrollHandler = (pos) => {
    console.log(pos);
  };

  return (
    <Default title={title}>
      <FareCategory title={title} scrollHandler={scrollHandler} />
    </Default>
  );
};

export const Nationality = (args) => {
  const countrySelection = [
    {
      countryCode: 'IN',
      inActive: false,
      label: 'India',
      value: 'India',
      provinceCountryCode: 'IN',
      shortName: 'India',
    },
    {
      countryCode: 'SINGAPORE',
      inActive: false,
      label: 'Singapore',
      value: 'Singapore',
      provinceCountryCode: 'SINGAPORE',
      shortName: 'SINGAPORE',
    },
    {
      countryCode: 'Malaysia',
      inActive: false,
      label: 'Malaysia',
      value: 'Malaysia',
      provinceCountryCode: 'Malaysia',
      shortName: 'Malaysia',
    },
    {
      countryCode: 'Malaysia',
      inActive: false,
      label: 'Malaysia',
      value: 'Malaysia',
      provinceCountryCode: 'Malaysia',
      shortName: 'Malaysia',
    },
    {
      countryCode: 'Malaysia',
      inActive: false,
      label: 'Malaysia',
      value: 'Malaysia',
      provinceCountryCode: 'Malaysia',
      shortName: 'Malaysia',
    },
    {
      countryCode: 'Malaysia',
      inActive: false,
      label: 'Malaysia',
      value: 'Malaysia',
      provinceCountryCode: 'Malaysia',
      shortName: 'Malaysia',
    },
    {
      countryCode: 'Malaysia',
      inActive: false,
      label: 'Malaysia',
      value: 'Malaysia',
      provinceCountryCode: 'Malaysia',
      shortName: 'Malaysia',
    },
    {
      countryCode: 'Malaysia',
      inActive: false,
      label: 'Malaysia',
      value: 'Malaysia',
      provinceCountryCode: 'Malaysia',
      shortName: 'Malaysia',
    },
    {
      countryCode: 'Malaysia',
      inActive: false,
      label: 'Malaysia',
      value: 'Malaysia',
      provinceCountryCode: 'Malaysia',
      shortName: 'Malaysia',
    },
    {
      countryCode: 'Malaysia',
      inActive: false,
      label: 'Malaysia',
      value: 'Malaysia',
      provinceCountryCode: 'Malaysia',
      shortName: 'Malaysia',
    },
    {
      countryCode: 'Malaysia',
      inActive: false,
      label: 'Malaysia',
      value: 'Malaysia',
      provinceCountryCode: 'Malaysia',
      shortName: 'Malaysia',
    },
  ];

  const onProceedHandler = (e, country) => {
    console.log('selected e and country is', e, country);
  };
  const nationalityProps = {
    title: 'Select your Nationality',
    paragraph:
      '<p>Citizens of Nepal and Maldives are eligible for tax exemption/reduction, as per applicable laws, on the airfare. In order to avail such tax exemption/reduction, passengers must declare their correct nationality at the time of booking. In case citizens of Nepal or Maldives intend to travel with any foreign nationals, such citizen (passenger) are requested to kindly book tickets for accompanying foreign national (passengers) in a separate PNR/ticket. Once selected, the nationality cannot be changed at any point during the booking process.</p>',
    countryListApiData: countrySelection,
    ctaLabel: 'Proceed',
    onProceedHandler,
  };

  return (
    <Default>
      <NationalityPopup {...nationalityProps} />
    </Default>
  );
};

export const FlightFare = (args) => {
  const FlightFareProps = {
    fareLabel: 'Flight and Fare Details',
    baggageLabel: 'Baggage Details',
    cancellationLabel: 'Cancellation Details',
    shortSource: 'KOH',
    shortDestination: 'DEL',
    price: '7007',
    currency: '₹',
    fullSource: 'Kohlapur',
    fullDestination: 'Delhi',
    terminal: 'T2',
    flightInfo: '6E - 7169',
    fareType: 'Saver',
    date: 'Wedensday 09',
    startTime: '14:00',
    endTime: '19:35',
    kg: '7',
    cms: '115',
    checkInBaggage: '(Only 1 piece)',
  };
  return (
    <Default>
      <FlightnFare {...FlightFareProps} />
    </Default>
  );
};

export const ContactModal = (args) => {
  const contactProps = {
    data: {
      contactDetailsPopupByPath: {
        item: {
          contactDetailsTitle: 'Contact Details',
          contactDetailsSubtitle:
            '*All notifications will be sent to this mobile number and email address',
          primaryCountryCodeLabel: 'Enter Country Code',
          primaryMobileLabel: 'Enter Mobile No.',
          emailIdLabel: 'Email Id',
          alternateMobileNumberLabel: 'Alternate Mobile Number',
          secondaryCountryCodeLabel: 'Enter Country Code',
          secondaryMobileLabel: 'Alternate Mob. No.',
          descriptionLabels: [
            {
              privacyPolicyDescription: {
                html: parse(
                  '<p>By clicking on the Agree &amp; Contiune button below,&nbsp;you hereby certify that you have read, agree with and consent to the terms of Indigo\'s&nbsp;<a href="/content/skyplus6e/language-masters/en/home/homepage.html">Privacy Policy.</a></p>\n',
                ),
              },
            },
            {
              whatsappLabel: 'WhatsApp',
              whatsappIcon: ['skyplus6e:icons/icon-whatsapp'],
              whatsappDescription: {
                html: parse(
                  '<p>Get itinerary, boarding pass, flight status, and much more on WhatsApp.&nbsp;By subscribing, you agree to WhatsApp&nbsp;<a href="/content/skyplus6e/language-masters/en/home/homepage.html" target="_blank">T&amp;Cs</a></p>\n',
                ),
              },
              whatsappDescriptionwhatsappNoIsSubscribed:
                'The number is already subscribed',
            },
            {
              privacyPolicyDescriptioneeauk: {
                html: parse(
                  '<p>Are you a resident of any member state of the European Union? If yes, please refer to these <a href="/content/skyplus6e/language-masters/en/home/homepage.html" target="_blank">T&amp;Cs</a></p>\n',
                ),
              },
            },
            {
              gstDescription: 'GST Information (Optional)',
              viewAllLabel: 'View All',
              gstNumberLabel: 'GST Number',
              gstEmailLabel: 'GST Email',
              gstCompanyNameLabel: 'GST Company Name',
            },
          ],
          submitLabel: 'Next',
        },
      },
    },
  };

  const carouselDataProps = [
    {
      name: 'Suresh',
      gstno: '08AABCI2726B1Z1',
      gstemail: 'suresh.x.kumar@goindigo.in',
      companyname: 'Suresh Pvt Ltd',
    },
    {
      name: 'Alok',
      gstno: '08AABCI2726C2E1',
      gstemail: 'alok@goindigo.in',
      companyname: 'Alok Pvt Ltd',
    },
    {
      name: 'Nidhi',
      gstno: '08AABCI2725R2E1',
      gstemail: 'nidhi@goindigo.in',
      companyname: 'Nidhi Pvt Ltd',
    },
    {
      name: 'Aditya',
      gstno: '08AABCI2725R2E1',
      gstemail: 'aditya@goindigo.in',
      companyname: 'Aditya Pvt Ltd',
    },
    {
      name: 'Sakshi',
      gstno: '08AABCI2725R2E1',
      gstemail: 'sakshi@goindigo.in',
      companyname: 'Sakshi Pvt Ltd',
    },
    {
      name: 'Shamshad',
      gstno: '08AABCI2725R2E1',
      gstemail: 'Shamshad@goindigo.in',
      companyname: 'Shamshad Pvt Ltd',
    },
  ];
  return (
    <Default className="contact-details-popup">
      <ContactDetails
        contactdetails={contactProps}
        carouselData={carouselDataProps}
        key="Contact Details"
      />
    </Default>
  );
};

export const TerminalChangeModal = (args) => {
  const [terminalCloseHandler, setTerminalCloseHandler] = useState(true);
  const onTerminalChangeHandler = (event) => {
    event.stopPropagation();
    setTerminalCloseHandler((terminalCloseHandler) => !terminalCloseHandler);
  };

  const terminalChangeProps = {
    title: 'Terminal Change Information',
    paragraph:
      'You are booking a connecting flight with a change of terminal at the connection station. Please plan your travel accordingly.',
    proceedLabel: 'Proceed',
    gobackLabel: 'Go back',
    onProceedHandler: onTerminalChangeHandler,
  };
  return (
    <>
      {terminalCloseHandler && (
        <Default>
          <TerminalChange {...terminalChangeProps} />
        </Default>
      )}
      ;
    </>
  );
};

export const FlexiPlusModal = (args) => {
  const FlexiPlusProps = {
    saveLabel: 'Skip & continue with Saver Fare',
    mobSaveLabel: 'Skip',
    flexiPlusLabel: 'Upgrade to Flexi Plus fare',
  };
  return (
    <Default customPopupContentClassName="popupContentClassForSRP">
      <FlexiPlus {...FlexiPlusProps} />
    </Default>
  );
};

export const ImportantInformationModal = (args) => {
  const ImportantInformationProps = {
    onClickHandler: () => {
      console.log('clicked ok');
    },
    title: 'Important Information ',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.This is a test content",
  };
  return (
    <Default>
      <ImportantInformation {...ImportantInformationProps} />
    </Default>
  );
};

export const MultiCityModal = (args) => {
  const options = [
    {
      label: 'One Way',
      value: 'One Way',
      icon_id: 'ONE_WAY',
    },
    {
      label: 'Round Trip',
      value: 'Round Trip',
      icon_id: 'ROUND_TRIP',
    },
    {
      label: 'Multi City',
      value: 'Multi City',
      icon_id: 'MULTI_CITY',
    },
  ];
  const [selected, setSelected] = useState(options[0]);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const dropDownChangeHandler = (obj) => {
    console.log('change handler is called...', obj);
    if (obj.icon_id === 'MULTI_CITY') {
      setShowAddBtn(true);
    } else {
      setShowAddBtn(false);
    }
  };
  const props = {
    options,
    toggleOptionHandler: null,
    changeHandler: dropDownChangeHandler,
    selected,
    setSelected,
  };
  const popupProps = {
    className: 'multicity',
  };
  return (
    <Default {...popupProps}>
      <MultiCity customDropDown={props} showAddBtn={showAddBtn} />
    </Default>
  );
};
export const VaccinationModal = (args) => {
  const doseSelection = [
    {
      doselabel: '1st DOSE',
      value: 'dose1',
      promo: 'Upto 5% OFF*',
    },
    {
      doselabel: '2nd DOSE',
      value: 'dose2',
      promo: 'Upto 10% OFF*',
    },
    {
      doselabel: 'None',
      value: 'none',
      promo: 'Not vaccinated',
    },
  ];
  const VaccinationProps = {
    title: 'Vaccination status',
    content:
      "This discount is applicable only for Indian citizens who've got vaccinated and travelling within the domestic sector.",
    vacciantionApiData: doseSelection,
    note: '#You will be asked about your 14 digit beneficiary id.',
    disclaimer:
      '“The Offer is only available to passengers aged 18 years and above who, at the time of making the booking: (i) are located in India; and (ii) have already received a Covid-19 vaccine in India.',
  };
  return (
    <Default>
      <VaccinationInformation {...VaccinationProps} />
    </Default>
  );
};

export const StudentIdModal = (args) => {
  const [studentIdCloseHandler, setStudentIdCloseHandler] = useState(true);
  const onStudentIdChangeHandler = (event) => {
    event.stopPropagation();
    setStudentIdCloseHandler((studentIdCloseHandler) => !studentIdCloseHandler);
  };

  const studentIDProps = {
    studentName: 'Test Student',
    title: 'Student ID',
    paragraph: 'Please provide ID number(s)',
    proceedLabel: 'Proceed',
    gobackLabel: 'Skip',
    onProceedHandler: onStudentIdChangeHandler,
  };
  return (
    <>
      {studentIdCloseHandler && (
        <Default>
          <StudentID {...studentIDProps} />
        </Default>
      )}
      ;
    </>
  );
};

export const ArmedForcesModal = (args) => {
  const [armedForcesCloseHandler, setArmedForcesCloseHandler] = useState(true);
  const onArmedForcesChangeHandler = (event) => {
    event.stopPropagation();
    setArmedForcesCloseHandler(
      (armedForcesCloseHandler) => !armedForcesCloseHandler,
    );
  };

  const armedForcesProps = {
    armedForcesName: 'Test Armed Forces',
    title: 'Armed Forces Personnel ID',
    paragraph: 'Please provide ID number(s)',
    proceedLabel: 'Done',
    gobackLabel: 'Skip',
    onProceedHandler: onArmedForcesChangeHandler,
  };
  return (
    <>
      {armedForcesCloseHandler && (
        <Default>
          <ArmedForces {...armedForcesProps} />
        </Default>
      )}
      ;
    </>
  );
};

export const DoctorAndNurseModal = (args) => {
  const [doctorAndNurseCloseHandler, setDoctorAndNurseCloseHandler] = useState(true);
  const onDoctorAndNurseChangeHandler = (event) => {
    event.stopPropagation();
    setDoctorAndNurseCloseHandler(
      (doctorAndNurseCloseHandler) => !doctorAndNurseCloseHandler,
    );
  };

  const doctorAndNurseProps = {
    doctorAndNurseName: 'Dheeraj Taneeja',
    title: 'Hospital ID',
    paragraph: 'Please provide a valid registration number*',
    proceedLabel: 'Continue',
    onProceedHandler: onDoctorAndNurseChangeHandler,
  };
  return (
    <>
      {doctorAndNurseCloseHandler && (
        <Default>
          <DoctorAndNurse {...doctorAndNurseProps} />
        </Default>
      )}
      ;
    </>
  );
};

export const SessionTimeoutModalOverlay = (args) => {
  const props = {
    labels: JSON.parse(
      JSON.stringify({
        continueCtaLabel: 'Continue',
        startAfreshCtaLabel: 'Start Afresh',
        noteText: '<p>Fares may get affected..</p>\n',
        titleText: '<p>Still there? Session has timed out</p>\n',
        startAfreshCtaPath:
          '/content/skyplus6e/language-masters/en/home/homepage.html',
        continueCtaPath:
          '/content/skyplus6e/language-masters/en/home/homepage.html',
        timerImage:
          'https://www.goindigo.in/etc/designs/indigo-reservation-v2/clientlibs-react/images/Session-Timed-Out.gif',
      }),
    ),
  };

  return (
    <Default>
      <SessionTimeoutModal {...props} />
    </Default>
  );
};
