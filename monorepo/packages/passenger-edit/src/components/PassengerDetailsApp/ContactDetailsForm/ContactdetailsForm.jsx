import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import AltContactButton from 'skyplus-design-system-app/dist/des-system/AltContactButton';
import PhoneComponentPE from 'skyplus-design-system-app/dist/des-system/PhoneComponentPE';
import EmailComponentPE from 'skyplus-design-system-app/dist/des-system/EmailComponentPE';
import { AppContext, passengerEditActions } from '../../../context/appContext';
import Heading from '../../../common/HeadingComponent/Heading';
import RemoveContactModal from './RemoveContactModal/RemoveContactModal';
import {
  COUNTRY_CODE_ELEMENT_NAME,
  PRIMARY_CONTACT_ELEMENT_NAME,
  EMAIL_ADDRESS_ELEMENT_NAME,
  ALT_EMAIL_ELEMENT_NAME,
  ALT_CONTACT_ELEMENT_NAME,
  ALT_COUNTRY_CODE_ELEMENT_NAME,
  ALT_CONTACT_LABEL,
} from '../../../constants/constants';
import './ContactDetailsForm.scss';
import './CountryPicker.scss';

const ContactDetailsForm = ({ setContactValues }) => {
  const {
    state: { isSMEUser, aemMainData, modificationFlow },
    dispatch,
  } = useContext(AppContext);
  const {
    contactDetailsTitle,
    contactDetailsNote,
    primaryContactLabel,
    invalidPhoneMsg,
    invalidMailIdLabel,
    emailIdLabel,
    altEmailLabel,
    addAnotherContact,
    removeLabel,
    invalidAltPhoneMsg,
    secondaryContactDescription,
    alternateContactLabel,
  } = aemMainData;

  const methods = useFormContext();
  const {
    formState: { errors },
    getValues,
  } = methods;
  const [showModal, toggleModal] = useState(false);
  const [showAltContact, setAltContact] = useState(false);
  const contactFormValues = getValues();
  const { email, countryCode, altContact, primaryContact, altCountryCode, isWhatsAppSubscribed } = contactFormValues;

  const onToggleModal = (state) => {
    toggleModal(state);
  };

  const onRemoveClickHandler = () => {
    setContactValues(ALT_CONTACT_ELEMENT_NAME, '');
    setContactValues(ALT_EMAIL_ELEMENT_NAME, '');
    setAltContact(false);
    onToggleModal(false);
  };

  // Here we are setting the contact from the context
  const setContactDetails = (name, value) => {
    setContactValues(name, value);
  };

  const onChangeCountryCode = (countryCode, item, name, countryCodeField) => {
    setContactValues(countryCodeField, item?.phoneCode);
    setContactValues(name, '');
  };

  const modalContent = (
    <RemoveContactModal
      onToggleModal={onToggleModal}
      removeContactHandler={onRemoveClickHandler}
    />
  );

  return (
    <div className="contact-form-wrapper">
      <Heading
        headingTitle={contactDetailsTitle}
        headingSubTitle={contactDetailsNote}
      />
      <div className="contact-form-input-wrapper d-flex flex-column">
        <div className="d-flex flex-column flex-md-row">
          <PhoneComponentPE
            name={PRIMARY_CONTACT_ELEMENT_NAME}
            countryCodeName={COUNTRY_CODE_ELEMENT_NAME}
            phonePlaceholder={primaryContactLabel}
            isDisabled={modificationFlow || (isSMEUser && primaryContact)}
            setContactValues={setContactDetails}
            onChangeCountryCode={(countryCode, item) => onChangeCountryCode(countryCode, item, PRIMARY_CONTACT_ELEMENT_NAME, COUNTRY_CODE_ELEMENT_NAME)}
            invalidPhoneMsg={invalidPhoneMsg}
            selectedCode={countryCode}
            value={primaryContact}
            errors={errors}
            initialCountryCode={countryCode}
            {...methods}
          />
          <EmailComponentPE
            name={EMAIL_ADDRESS_ELEMENT_NAME}
            setContactValues={setContactDetails}
            invalidEmailMsg={invalidMailIdLabel}
            emailPlaceholder={emailIdLabel}
            isDisabled={modificationFlow || (isSMEUser && email)}
            errors={errors}
            value={email}
            {...methods}
          />
        </div>
        {modificationFlow && altContact ? (
          <>
            <h3 className="alt-contact-subHeading">{secondaryContactDescription}</h3>
            <div className="d-flex flex-column flex-md-row">
              <PhoneComponentPE
                name={ALT_CONTACT_ELEMENT_NAME}
                countryCodeName={ALT_COUNTRY_CODE_ELEMENT_NAME}
                phonePlaceholder={alternateContactLabel || ALT_CONTACT_LABEL}
                isDisabled={modificationFlow || (isSMEUser && altContact)}
                setContactValues={setContactDetails}
                onChangeCountryCode={(countryCode, item) => onChangeCountryCode(countryCode, item, PRIMARY_CONTACT_ELEMENT_NAME, COUNTRY_CODE_ELEMENT_NAME)}
                invalidPhoneMsg={invalidPhoneMsg}
                selectedCode={altCountryCode}
                value={altContact}
                errors={errors}
                initialCountryCode={altCountryCode}
                {...methods}
              />
              <EmailComponentPE
                name={EMAIL_ADDRESS_ELEMENT_NAME}
                setContactValues={setContactDetails}
                invalidEmailMsg={invalidMailIdLabel}
                emailPlaceholder={emailIdLabel}
                isDisabled={modificationFlow || (isSMEUser && email)}
                errors={errors}
                value={email}
                {...methods}
              />
            </div>
          </>
        ) : null}
        {!modificationFlow ? (
          <AltContactButton
            toggleModal={showModal}
            onToggleModal={onToggleModal}
            setAltContact={setAltContact}
            showAltContact={showAltContact}
            formProps={{ errors, ...methods }}
            modalContentProps={{ modalContent }}
            phoneLabels={{
              phonePlaceholder: alternateContactLabel || ALT_CONTACT_LABEL,
              invalidPhoneMsg,
            }}
            altEmailLabels={{
              emailPlaceholder: altEmailLabel,
              invalidEmailMsg: invalidMailIdLabel,
            }}
            phoneNumber={altContact}
            selectedCode={altCountryCode}
            addAltContactLabel={addAnotherContact}
            removeAltContactLabel={removeLabel}
            setContactValues={setContactDetails}
            onChangeCountryCode={onChangeCountryCode}
            altContactHeading={secondaryContactDescription}
            invalidAltPhoneMsg={invalidAltPhoneMsg}
            plusSymbol
            initialCountryCode={altCountryCode}
          />
        ) : null}
      </div>
    </div>
  );
};

ContactDetailsForm.propTypes = {
  formProps: PropTypes.shape({}),
  setContactValues: PropTypes.func,
};

export default ContactDetailsForm;
