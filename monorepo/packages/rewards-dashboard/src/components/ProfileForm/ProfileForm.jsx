import React, { useState } from 'react';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import RadioBoxGroup from 'skyplus-design-system-app/dist/des-system/RadioBoxGroup';

function ProfileForm() {
  const [gender, setGender] = useState('');

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

  return (
    <>
      <div
        className="my-profile-heading bg-primary-main rounded-bottom-2 d-flex justify-content-center"
        style={{ height: '276px' }}
      >
        <div className="h5 text-white pt-7">My Profile</div>
      </div>

      <div className="shadow rounded m-9 p-6">
        <div className="sh7">
          Please Complete <span style={{ color: '#209326' }}>Your Profile</span>
        </div>
        <div className="mt-5 py-12 px-10 gradient-secondary rounded">
          <div className="body-small-regular">
            Fill your Date of Birth and More...
          </div>
          <div className="h5 mt-8">
            Complete your profile and{' '}
            <span style={{ color: '#209326' }}>Earn 150 points</span>
          </div>
        </div>
      </div>

      <div className="shadow rounded m-9 mt-12 p-6">
        <div className="sh7 mb-6">Basic Details</div>

        <RadioBoxGroup
          className="mt-5"
          items={items}
          onChange={(val) => {
            setGender(val);
          }}
          selectedValue={gender}
          containerClassName="radio-input-gender"
        />

        <div className="body-small-regular text-secondary my-12">
          Name should be given as per govt ID
        </div>

        <Input className="my-profile-input" placeholder="Name" value="Amit" />
        <Input
          className="my-profile-input"
          placeholder="Surname"
          value="Pal"
        />
        <Input
          className="my-profile-input"
          placeholder="Date of Birth (Optional)"
        />

        <div className="body-small-regular text-secondary my-12">
          Passport Details
        </div>

        <Input className="my-profile-input" placeholder="State" />
        <Input className="my-profile-input" placeholder="Nationality" />

        <div className="body-small-regular text-secondary my-12">
          State and Nationality
        </div>

        <Input className="my-profile-input" placeholder="Passport Number" />
        <Input className="my-profile-input" placeholder="Expiry" />
        <Input className="my-profile-input" placeholder="Name" />
      </div>

      <div className="shadow rounded m-9 mt-12 p-6">
        <div className="sh7 mb-6">Contact Details</div>

        <Input
          className="my-profile-input"
          placeholder="Name"
          value="99998 45342"
        />
        <Input
          className="my-profile-input"
          placeholder="Surname"
          value="test@gmail.com"
        />

        <div className="body-small-regular text-secondary my-12">
          GST Details
        </div>

        <Input className="my-profile-input" placeholder="GST Number" />
        <Input className="my-profile-input" placeholder="Company Name" />
        <Input className="my-profile-input" placeholder="Company email id" />
      </div>
    </>
  );
}

ProfileForm.propTypes = {};

export default ProfileForm;
