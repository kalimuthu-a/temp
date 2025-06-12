import PropTypes from 'prop-types';
import React from 'react';

const CoutryMenuItem = ({ onSelect, otherProps, ...item }) => {
  const {
    countryName, // full country name,
    countryCode, // country name code i.e US, IN
    phoneCode, // phone code array ['+91']
  } = item;
  const {
    showPhoneCode = true,
    showCountryCode = false,
    showFlagInDropdown = true,
  } = otherProps;

  const onSelectCountry = () => {
    onSelect({ countryCode, countryName, phoneCode: phoneCode[0] });
    // Dispatch a click Event to Hide Popover
    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 100);
  };

  return (
    <article
      className="country-menu-item"
      key={countryCode}
      onClick={onSelectCountry}
      role="presentation"
      data-dial-code={phoneCode[0]}
      data-country-code={countryCode}
    >
      <span className="fs-14">
        <span className="fw-500">{countryName}</span>
        {showPhoneCode ? <span className="phone-code">{`+${phoneCode[0]}`}</span> : null}
        {showCountryCode ? <span className="phone-code">{`(${countryCode})`}</span> : null}
      </span>
      {showFlagInDropdown ? <span className={`Cfflag ${countryCode?.toLowerCase()} ff-md ff-wave`} /> : null}
    </article>
  );
};

CoutryMenuItem.propTypes = {
  item: PropTypes.shape({ phoneCode: ['+91'], countryCode: 'IN', country: 'India' }),
  otherProps: PropTypes.shape({
    showFlagInDropdown: true,
    showPhoneCode: true,
    showCountryCode: false,
  }),
  country: PropTypes.any,
  onSelect: PropTypes.func,
  showFlag: true,
  showPhoneCode: true,
  showCountryCode: false,
  useRegisterInput: false,
};

export default CoutryMenuItem;
