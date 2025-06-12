import React from 'react';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField';
import { PREFFERED_COUNTRY } from '../../common/Constants/constants';

const Front = (props) => {
  const {
    toggleModal,
    setToggleModal,
    inputRegisterProps,
    showFlag = true,
    showPhoneCode = true,
    showCountryCode = false,
    useRegisterInput = false,
    showCountryName = false,
    selectedCountry = PREFFERED_COUNTRY,
    countryDropdownField,
    showToggler = false,
    isDisabled = false,
    setToggleModalSecond = () => {},
  } = props;

  const renderInputForRegisterProps = () => {
    const {
      countryCodeName,
      register = () => {},
      getValues = () => {},
    } = inputRegisterProps;
    return (
      <InputField
        type="text"
        name={countryCodeName}
        register={register}
        inputWrapperClass="d-none"
        value={getValues(countryCodeName)}
      />
    );
  };

  const renderContent = () => {
    return (
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => { setToggleModal(true); setToggleModalSecond(true); }}
        onClick={() => { setToggleModal(true); setToggleModalSecond(true); }}
        className="skyplus-design-system-country-dropdown-wrapper mb-6"
      >
        {useRegisterInput ? renderInputForRegisterProps() : null}
        <div className={`selected-country-box-wrapper ${countryDropdownField} ${isDisabled ? 'disable-country-dropdown' : ''}`}>
          <div
            className="d-flex align-items-center gap-4"
            title={`${selectedCountry.countryName}: ${selectedCountry.phoneCode}`}
          >
            {showFlag ? (
              <span
                className={`Cfflag ${selectedCountry.countryCode?.toLowerCase()} ff-md ff-wave`}
              />
            ) : null}
            {showPhoneCode ? (
              <span className="country-phone-code">{`+${selectedCountry.phoneCode}`}</span>
            ) : null}
            {showCountryName ? (
              <span className="country-phone-code">{`${selectedCountry.countryName}`}</span>
            ) : null}
            {showCountryCode ? (
              <span className="country-phone-code">{`${selectedCountry.countryCode}`}</span>
            ) : null}
          </div>
          {showToggler && (
            <div>
              {!toggleModal ? (
                <span className="icon-accordion-down-simple" />
              ) : (
                <span className="icon-accordion-up-simple" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderContent();
};

Front.propTypes = {
  version: PropTypes.string,
  toggleModal: PropTypes.bool,
  setToggleModal: PropTypes.func,
  selectedCountry: { name: 'IN' },
  versionProps: PropTypes.shape({
    name: '',
    register: () => {},
    getValues: () => {},
  }),
  showFlag: true,
  showPhoneCode: true,
  showCountryCode: false,
  useRegisterInput: false,
  setToggleModalSecond: PropTypes.func,
};

export default Front;
