import React, { useState } from 'react';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import PropTypes from 'prop-types';

const ContactDetails = ({ countryCode, setCountryCode, contactNum, setContactNum, email, setContactEmail }) => {
  return (
    <div className="profile-container">
      <div className="title">Contact Details</div>
      <div className="contact-number">
        <span className="country-code">
          <Input
            className="my-profile-input"
            placeholder="Country code"
            value={countryCode}
            onChangeHandler={(e) => setCountryCode(e.target.value)}
            inputWrapperClass="profile-input-container"
          />
        </span>
        <span className="number">
          <Input
            className="my-profile-input"
            placeholder="Mobile number"
            showCrossIcon
            value={contactNum}
            onChangeHandler={(e) => setContactNum(e.target.value)}
            inputWrapperClass="profile-input-container"
          />
        </span>
      </div>
      <Input
        type="email"
        className="my-profile-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setContactEmail(e.target.value)}
        inputWrapperClass="profile-input-container"
      />
    </div>
  );
};

export default ContactDetails;

ContactDetails.propTypes = {
  countryCode: PropTypes.string.isRequired,
  setCountryCode: PropTypes.func.isRequired,
  contactNum: PropTypes.string.isRequired,
  setContactNum: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setContactEmail: PropTypes.func.isRequired,
};
