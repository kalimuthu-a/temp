import React, { useState } from 'react';
import ProfileCompletion from './ProfileCompletion';
import BasicDetails from './BasicDetails';
import ContactDetails from './ContactDetails';
import PreferencesDetails from './PreferencesDetails';

export const MyProfile = () => {
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDOB] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [email, setContactEmail] = useState('');
  const [state, setState] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [passportName, setPassportName] = useState('');

  const basicDetailsProps = { gender,
    setGender,
    name,
    setName,
    surname,
    setSurname,
    dob,
    setDOB,
    state,
    setState,
    nationality,
    setNationality,
    passportNumber,
    setPassportNumber,
    passportExpiry,
    setPassportExpiry,
    passportName,
    setPassportName,
  };
  const contactProps = { countryCode, setCountryCode, contactNum, setContactNum, email, setContactEmail };
  return (
    <div className="my-profile">
      <ProfileCompletion />
      <div className="page-title desktop">My Account & Preferences</div>
      <div className="page-title mobile">Edit passenger details</div>
      <BasicDetails {...basicDetailsProps} />
      <ContactDetails {...contactProps} />
      <PreferencesDetails />
    </div>
  );
};

export default MyProfile;
