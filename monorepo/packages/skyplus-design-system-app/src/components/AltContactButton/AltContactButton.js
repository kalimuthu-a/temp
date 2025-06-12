import React from 'react';
import PropTypes from 'prop-types';
import ModalComponent from '../ModalComponent/ModalComponent';
import {
  ALT_CONTACT_ELEMENT_NAME,
  ALT_COUNTRY_CODE_ELEMENT_NAME,
  ALT_EMAIL_ELEMENT_NAME,
} from '../../common/Constants/constants';
import PhoneComponentPE from '../PhoneComponentPE/PhoneComponentPE';
import EmailComponentPE from '../EmailComponentPE/EmailComponentPE';

const AltContactButton = (props) => {
  const {
    formProps,
    toggleModal,
    onToggleModal,
    setAltContact,
    showAltContact,
    modalContentProps,
    addAltContactLabel,
    removeAltContactLabel,
    phoneLabels,
    altEmailLabels,
    selectedCode,
    phoneNumber,
    setContactValues,
    onChangeCountryCode,
    invalidAltPhoneMsg = '',
    altContactHeading = '',
    plusSymbol = false,
    initialCountryCode,
  } = props;

  // @todo Arman - Use Button component from design sysytem!

  const altLink = (label, state) => {
    return (
      <span className="add-contact-button">
        {plusSymbol && state ? <i className="plus-sysmbol icon-add-simple" /> : '' }
        <button
          type="button"
          className="link-variation"
        // variation="link-variation"
          onClick={() => (state ? setAltContact(state) : onToggleModal(true))}
        >
          {label}
        </button>
      </span>
    );
  };
  return (
    <div className="alt-contact-wrapper">
      {showAltContact
        ? <h3 className="alt-contact-subHeading">{altContactHeading}</h3>
        : altLink(addAltContactLabel, true)}

      {showAltContact ? (
        <>
          <div className="d-flex flex-column flex-md-row">
            <PhoneComponentPE
              isAltContact
              value={phoneNumber}
              selectedCode={selectedCode}
              name={ALT_CONTACT_ELEMENT_NAME}
              invalidAltPhoneMsg={invalidAltPhoneMsg}
              countryCodeName={ALT_COUNTRY_CODE_ELEMENT_NAME}
              setContactValues={setContactValues}
              initialCountryCode={initialCountryCode}
              onChangeCountryCode={(countryCode, item) => onChangeCountryCode(countryCode, item, ALT_CONTACT_ELEMENT_NAME, ALT_COUNTRY_CODE_ELEMENT_NAME)}
              required=""
              {...formProps}
              {...phoneLabels}
            />
            <EmailComponentPE
              name={ALT_EMAIL_ELEMENT_NAME}
              setContactValues={setContactValues}
              required=""
              {...formProps}
              {...altEmailLabels}
            />
          </div>
          {altLink(removeAltContactLabel, false)}
        </>
      ) : null}
      {toggleModal ? (
        <ModalComponent
          {...modalContentProps}
        />

      ) : null}
    </div>
  );
};

AltContactButton.propTypes = {
  name: PropTypes.string,
  addAltContactLabel: PropTypes.string,
  removeAltContactLabel: PropTypes.string,
  phonePlaceholder: PropTypes.string,
  invalidPhoneMsg: PropTypes.string,
  altContactHeading: PropTypes.string,
  onToggleModal: PropTypes.func,
  toggleModal: PropTypes.bool,
  showAltContact: PropTypes.bool,
  setAltContact: PropTypes.func,
  selectedCode: PropTypes.string,
  phoneNumber: PropTypes.string,
  primaryContact: PropTypes.string,
  setContactValues: PropTypes.func,
  invalidAltPhoneMsg: PropTypes.string,
  formProps: PropTypes.shape({}),
  emailLabels: PropTypes.shape({}),
  phoneLabels: PropTypes.shape({}),
  altEmailLabels: PropTypes.shape({}),
  modalContentProps: PropTypes.shape({}),
  plusSymbol: PropTypes.string,
  initialCountryCode: PropTypes.string,
};

export default AltContactButton;
