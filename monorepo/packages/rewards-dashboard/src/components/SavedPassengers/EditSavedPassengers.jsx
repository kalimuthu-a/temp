import React, { useState } from 'react';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import EmailComponent from 'skyplus-design-system-app/dist/des-system/EmailComponent';
import PreferencesDetails from '../MyProfile/PreferencesDetails';
import ContactDetails from '../MyProfile/ContactDetails';

function EditSavedPassenger() {
  const [countryCode, setCountryCode] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [email, setContactEmail] = useState('');

  const items = [
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'Female',
      value: 'Female',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ];
  const contactProps = { countryCode, setCountryCode, contactNum, setContactNum, email, setContactEmail };

  return (
    // <div className="">
    <div className="my-profile">
      <div>
        <p className="h5">
          Edit passenger details
        </p>
      </div>
      {/* Basic Details Section */}
      <div className="mt-3 p-5">
        <div>
          <div className="title">Basic Details</div>
        </div>
        <div className="mt-3 radio-btn-container">
          <RadioBoxGroup
            items={items}
          />
        </div>
        <div className="mt-3">
          <p className="body-small-regular">Name should be as per govt ID</p>
        </div>
        <div className="rounded-1 p-5 border mt-5">
          <input
            type="text"
            value="Amit"
            placeholder="First Name"
            maxLength="20"
          />
        </div>
        <div className="rounded-1 p-5 border mt-5">
          <input
            type="text"
            value="Pal"
            placeholder="Last Name"
            maxLength="20"
          />
        </div>
        <div className="d-flex rounded-1 p-5 border mt-5 justify-content-between">
          <input
            type="text"
            placeholder="Date of Birth (Optional)"
          />
          <i className="icon-calender me-5" />
        </div>
      </div>

      {/* Contact details section */}
      {/* <div className="mt-5 p-5">
        <div>
          <div className="title">Contact Details</div>
        </div>
        <div className="d-flex flex-column flex-md-row">
          <PhoneComponent
            phonePlaceholder="1234567890"
          />
          <EmailComponent
            emailPlaceholder="test@gmail.com"
          />
        </div>
      </div> */}

      <ContactDetails {...contactProps} />

      <PreferencesDetails />
    </div>
  );
}
EditSavedPassenger.propTypes = {};
export default EditSavedPassenger;
