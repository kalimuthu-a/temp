import React, { useState } from 'react';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';
import PropTypes from 'prop-types';

const BasicDetails = ({ gender, setGender, name, setName, surname, setSurname, dob, setDOB,
  state, setState, nationality, setNationality, passportNumber, setPassportNumber,
  passportExpiry, setPassportExpiry, passportName, setPassportName }) => {
  const [index, setAccordionIndex] = useState(0);
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

  const accordionData = [
    {
      title: 'State and Nationality',
      renderAccordionContent: <>
        <Input
          className="my-profile-input"
          placeholder="State"
          onChangeHandler={(e) => setState(e.target.value)}
          value={state}
          inputWrapperClass="profile-input-container"
        />
        <Input
          className="my-profile-input"
          placeholder="Nationality"
          onChangeHandler={(e) => setNationality(e.target.value)}
          value={nationality}
          inputWrapperClass="profile-input-container"
        />
                              </>,
    },
    {
      title: 'Passport Details',
      renderAccordionContent: <>
        <Input
          className="my-profile-input"
          placeholder="Passport number"
          onChangeHandler={(e) => setPassportNumber(e.target.value)}
          value={passportNumber}
          inputWrapperClass="profile-input-container"
        />
        <Input
          className="my-profile-input"
          placeholder="Expiry"
          onChangeHandler={(e) => setPassportExpiry(e.target.value)}
          value={passportExpiry}
          inputWrapperClass="profile-input-container"
        />
        <Input
          className="my-profile-input"
          placeholder="Name"
          onChangeHandler={(e) => setPassportName(e.target.value)}
          value={passportName}
          inputWrapperClass="profile-input-container"
        />
      </>,
    },
  ];
  return (
    <div className="profile-container">
      <div className="title">Basic Details</div>
      <RadioBoxGroup
        items={items}
        onChange={(val) => { setGender(val); }}
        selectedValue={gender}
        containerClassName="radio-input-gender"
      />
      <div className="subtitle guide-text">Name should be given as per govt ID</div>
      <Input
        className="my-profile-input"
        placeholder="Name"
        onChangeHandler={(e) => setName(e.target.value)}
        value={name}
        inputWrapperClass="profile-input-container"
      />
      <Input
        className="my-profile-input"
        placeholder="Surname"
        onChangeHandler={(e) => setSurname(e.target.value)}
        value={surname}
        inputWrapperClass="profile-input-container"
      />
      <Input
        className="my-profile-input"
        placeholder="Date of birth"
        onChangeHandler={(e) => setDOB(e.target.value)}
        value={dob}
        inputWrapperClass="profile-input-container"
      />
      <Accordion
        activeIndex={index}
        accordionData={accordionData}
        setActiveIndex={setAccordionIndex}
        isMultiOpen
        initalActiveIndexes={[0]}
      />
    </div>
  );
};

export default BasicDetails;

BasicDetails.propTypes = {
  gender: PropTypes.string.isRequired,
  setGender: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  surname: PropTypes.string.isRequired,
  setSurname: PropTypes.func.isRequired,
  dob: PropTypes.string.isRequired,
  setDOB: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  nationality: PropTypes.string.isRequired,
  setNationality: PropTypes.func.isRequired,
  passportNumber: PropTypes.string.isRequired,
  setPassportNumber: PropTypes.func.isRequired,
  passportExpiry: PropTypes.string.isRequired,
  setPassportExpiry: PropTypes.func.isRequired,
  passportName: PropTypes.string.isRequired,
  setPassportName: PropTypes.func.isRequired,
};
