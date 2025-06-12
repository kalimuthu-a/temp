import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { paxCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';

import { getPassengerName } from '../../utils/functions';
import Form from './Form';

import {
  generateContactInfoAemSchema,
  generatePassportFormSchema,
  generateVisaFormSchema,
  generateEmergencyContactInfoAemSchema,
} from './schemas';

const FormWrapper = ({
  passengers,
  isInternational,
  departureDate,
  aemData,
  openMinorConsent,
  minorConsentDescription,
  gdprOptions,
  onChangeMinorConsent,
  minorConsentSelection,
  emergencyData,
  gdprGetData,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [accordionData] = useState(() => {
    if(passengers?.length){
      return passengers?.map((passenger, index) => ({
        title: getPassengerName(passenger),
        subTitle: passenger?.subTitle,
        gender: '',
        renderAccordionHeader: null,
        containerClassName:
          passenger?.passengerTypeCode === paxCodes?.adult?.code &&
          passenger?.discountCode === null
            ? 'adult-passenger'
            : 'other',
        renderAccordionContent: (
          <Form
            isInternational={isInternational}
            index={index}
            schema={generatePassportFormSchema(aemData, departureDate, passenger)}
            visaFormSchema={generateVisaFormSchema(
              aemData,
              departureDate,
              passenger,
            )}
            contactInfoSchema={generateContactInfoAemSchema(aemData)}
            passenger={passenger}
            openMinorConsent={openMinorConsent}
            passengers={passengers}
          />
        ),
      }));
    }
  });
  const [showInput, setShowInput] = useState(false);

  const generateEmergencyContactInfoAemSchemaData = generateEmergencyContactInfoAemSchema(aemData, emergencyData);

  useEffect(() => {
    setShowInput(generateEmergencyContactInfoAemSchemaData?.emergencyPhoneNumber?.disabled);
  }, []);

  let isAdultConsent = false;
  if (!gdprGetData?.errors) {
    isAdultConsent = gdprGetData?.some((x) => x.AdultConsent === true &&
      passengers?.some((y) => y.passengerKey === x.PassengerKey)) || false;
  }

  const checkIsAdultPessenger = () => {
    let adultPassengers = passengers?.filter((x) => x.passengerTypeCode === paxCodes?.adult?.code);
    let isSeniorCitizen = adultPassengers?.every((x) => x.segments[0]?.passengerSegment?.seatsAndSsrs?.
      some((item) => item?.ssrCode === paxCodes?.seniorCitizen?.discountCode))
    return !isSeniorCitizen;
  }

  return (
    <>
      <form className="passenger-name passsenger-details-form">
        <Accordion
          accordionData={accordionData}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
        {
          checkIsAdultPessenger() &&
          <div className="gdpr-form">
            <HtmlBlock html={minorConsentDescription} />
            <RadioBoxGroup
              items={gdprOptions}
              onChange={onChangeMinorConsent}
              selectedValue={(minorConsentSelection.size > 0 || isAdultConsent) ? 'Yes' : 'No'}
              name="triptype"
              containerClassName="gdpr-selection"
            />
          </div>
        }
      </form>
      <button
        type="button"
        className="emergency-form border-0 w-100 mb-6"
        aria-label={aemData?.addEmergencyContactDetailsDescription}
      >
        <div
          className={`text-secondary border-0 w-100 gap-6 
      p-6 flex-md-row text-capitalize`}
        >
          <div className="mh-100 d-flex flex-column flex-md-row align-items-md-center w-100 justify-content-between gap-6">
            <div className="d-flex justify-content-between align-items-center w-100 gap-6">
              <div className="text-start link-small">
                {aemData?.addEmergencyContactDetailsDescription || 'Add Emergency Contact Details (Optional)'}
              </div>
              <span
                onClick={() => setShowInput(!showInput)}
                className={`ff-number__label-btn ${showInput ? 'icon-minus' : 'icon-add-circle'}`}
                aria-hidden="true"
              />
            </div>
          </div>
          <div style={{ display: showInput ? 'block' : 'none' }} className="emergency-form-title">
            <Form
              emergencyContactInfoSchema={generateEmergencyContactInfoAemSchemaData}
              isEmergencyContactForm
              emergencyData={emergencyData}
              passenger=""
            />
          </div>
        </div>
      </button>
    </>
  );
};

FormWrapper.propTypes = {
  aemData: PropTypes.any,
  departureDate: PropTypes.any,
  gdprOptions: PropTypes.any,
  isInternational: PropTypes.any,
  minorConsentDescription: PropTypes.any,
  minorConsentSelection: PropTypes.any,
  onChangeMinorConsent: PropTypes.func,
  openMinorConsent: PropTypes.func,
  passengers: PropTypes.array,
  emergencyData: PropTypes.any,
  gdprGetData: PropTypes.any,
};

export default React.memo(FormWrapper, () => false);
