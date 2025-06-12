/* eslint-disable */
import React, { useContext } from 'react';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import PropTypes from 'prop-types';
import PhoneComponent from 'skyplus-design-system-app/dist/des-system/PhoneComponent';
import PassengerContext from './PassengerContext';
import { USER_TYPES } from '../../../constants';
import { AEM_STATIC_DATA } from '../constant';
import { profileActions } from '../ProfileReducer';

const ContactDetails = ({ data, onChange, userType, validateField }) => {
  const { state, dispatch } = useContext(PassengerContext);
  const { savedPassengerAemData, selectedCard, error, showGSTDetails } = state;
  const editPassengerDetails = savedPassengerAemData?.editPassengerDetailsOptions;

  const setShowGSTDetails = () => {
    dispatch({
      type: profileActions.SHOW_GST_DETAILS,
      payload: !showGSTDetails,
    });
  };

  const handleFieldChange = (field, value) => {
    onChange(field, null, value);
    validateField(field, value);
  };
  return (
    <div className="shadow rounded mt-12 p-6 p-md-8 bg-white">
      <div className="mb-6 text-primary">
        {editPassengerDetails?.contactDetailsLabel}
      </div>

      <PhoneComponent
        phonePlaceholder={savedPassengerAemData?.PHONE_NUMBER}
        value={data?.number || ''}
        getValues={() => { }}
        className="mob-num-profile"
        showCrossIcon
        showFlag="true"
        onChangeCountryCode={(value) => handleFieldChange('countryCode', value)}
        onChangePhoneNumber={(value) => handleFieldChange('number', value)}
        name="mobilePhone"
        countryCodeName="countryCode"
      />
      {[USER_TYPES.AGENT, USER_TYPES.SME_ADMIN]?.includes(userType) && (
      <Input
        type="email"
        className="body-small-light p-6"
        placeholder={editPassengerDetails?.emailIdLabel}
        onChange={(e) => handleFieldChange('email', e.target.value)}
        value={data?.email || ''}
        customErrorMsg={error && error?.email}
      />
      )}

      {[USER_TYPES.USER, USER_TYPES.SME_USER]?.includes(userType) && (
      <>
        <div className="dashed-line" />
        <div className="d-flex justify-content-between">
          <div className="text-secondary mb-8 sub-header">
            {AEM_STATIC_DATA?.GST_DETAILS}
          </div>
          <div>
            <i
              onClick={setShowGSTDetails}
              className={showGSTDetails ? 'icon-accordion-up-simple' : 'icon-accordion-down-simple'}
            />
          </div>
        </div>
        {showGSTDetails && (
        <>
          <Input
            placeholder={AEM_STATIC_DATA?.GST_NUMBER}
            className="body-small-light p-6"
            onChange={(e) => handleFieldChange('GSTNumber', e.target.value)}
            value={data?.GSTNumber || ''}
            customErrorMsg={error && error?.GSTNumber}
          />
          <Input
            placeholder={AEM_STATIC_DATA?.COMPANY_NAME}
            className="body-small-light p-6"
            onChange={(e) => handleFieldChange('GSTName', e.target.value)}
            value={data?.GSTName || ''}
            customErrorMsg={error && error?.GSTName}
          />
          <Input
            placeholder={AEM_STATIC_DATA?.COMPANY_EMAIL_ID}
            className="body-small-light p-6"
            onChange={(e) => handleFieldChange('GSTEmail', e.target.value)}
            value={data?.GSTEmail || ''}
            customErrorMsg={error && error?.GSTEmail}
          />
        </>
        )}
      </>
      )}

    </div>
  );
};

export default ContactDetails;

ContactDetails.propTypes = {
  onChange: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
