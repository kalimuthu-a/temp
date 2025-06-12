/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import PropTypes from 'prop-types';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
// eslint-disable-next-line import/no-named-as-default
import ProfileContext from './ProfileContext';
import { BROWSER_STORAGE_KEYS } from '../../constants';

import './country-flag.scss';

const ContactDetails = ({ data, onChange, validateField, isMember, enableEditing }) => {
  const { state } = useContext(ProfileContext);
  const { myProfileAemData, error } = state;
  const authUser = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
  const isLoyaltyMember = !!(authUser?.loyaltyMemberInfo
    && (authUser.loyaltyMemberInfo.FFN || authUser.loyaltyMemberInfo.ffn));

  // Set maxContacts based on phoneNumbers only, capped at 2
  const maxContacts = Math.min(data?.phoneNumbers?.length || 1, 2);
  const indexArray = Array.from({ length: maxContacts }, (_, index) => index);

  // const personasType = Cookies.get(COOKIE_KEYS.ROLE_DETAILS, true);

  const handleFieldChange = (field, subfield, value, index) => {
    onChange(field, subfield, value, index);
    validateField(field, subfield, value, index); // Pass the index to validateField
  };

  const handleAddAnotherContact = () => {
    if (data?.phoneNumbers?.length < 2) {
      onChange('phoneNumbers', 'number', '', data.phoneNumbers.length); // Add a new phone number field
    }
  };
  return (
    <div className="shadow shadow-specific rounded m-9 mt-12 p-6 p-md-8 bg-white">
      <div className="mb-6 text-primary m-fs-14">
        {myProfileAemData?.contactDetailsLabel}
      </div>
      {indexArray?.map((count, index) => (
        <PhoneComponent
          phonePlaceholder={
            index === 0
              ? myProfileAemData?.primaryContactPlaceholder
              : myProfileAemData?.secondaryContactPlaceholder
          }
          value={data?.phoneNumbers?.[index]?.number}
          getValues={() => {}}
          className={`
            mob-num-profile ${
              enableEditing || index === 0 || isMember
                ? 'pointer-none'
                : index === 0 || isMember
            }
          `}
          showCrossIcon
          showFlag="true"
          initialCountryCode={data?.phoneNumbers?.[index]?.countryCode}
          onChangeCountryCode={(countryInitials, item) => {
            handleFieldChange(
              'phoneNumbers',
              'countryCode',
              item?.phoneCode,
              index,
            );
          }}
          onChangePhoneNumber={(value) => handleFieldChange('phoneNumbers', 'number', value, index)}
          name="mobilePhone"
          countryCodeName="countryCode"
          isDisabled={
            enableEditing || index === 0 ? true : index === 0 || isMember
          }
          errors={{ mobilePhone: { message: error.number?.[index] } }}
        />
      ))}
      <Input
        type="email"
        className="email-data body-small-light p-6 mt-4"
        placeholder={myProfileAemData?.emailIdLabel}
        onChange={(e) => handleFieldChange('emailAddresses', 'email', e.target.value, 0)}
        value={data.emailAddresses?.[0]?.email}
        customErrorMsg={error?.email?.[0]}
        disabled={
          enableEditing
            ? true
            : isLoyaltyMember && (data.emailAddresses?.[0]?.Default || isMember)
        }
      />

      {!enableEditing && data?.phoneNumbers?.length < 2 && (
        <div className="text-end">
          <a
            onClick={handleAddAnotherContact}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleAddAnotherContact();
              }
            }}
            role="button"
            tabIndex="0"
            className="skyplus-text text-primary-main text-end link add-another-contact"
          >
            {myProfileAemData?.addAnotherContactLabel}
          </a>
        </div>
      )}
    </div>
  );
};

export default ContactDetails;

ContactDetails.propTypes = {
  countryCode: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  validateField: PropTypes.func,
  isMember: PropTypes.string,
  enableEditing: PropTypes.bool,
};
