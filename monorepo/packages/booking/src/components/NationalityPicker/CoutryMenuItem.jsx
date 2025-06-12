import PropTypes from 'prop-types';
import React from 'react';
import { a11y } from 'skyplus-design-system-app/src/functions/globalConstants';

const CoutryMenuItem = ({ onSelect, countryCode, name }) => {
  const onSelectCountry = () => {
    onSelect({ countryCode, name });
    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
    }, 100);
  };

  const onKeyUpHandler = (e) => {
    if ([a11y.keyCode.enter, a11y.keyCode.space].includes(e.keyCode)) {
      onSelectCountry();
    }
  };

  return (
    <div
      className="country-menu-item"
      key={countryCode}
      onClick={onSelectCountry}
      role="option"
      tabIndex="0"
      onKeyUp={onKeyUpHandler}
      aria-selected="false"
    >
      <span className="fs-14">
        <u className="fw-500">{name}</u>({countryCode})
      </span>
      <span className={`fflag fflag-${countryCode} ff-md ff-wave`} />
    </div>
  );
};

CoutryMenuItem.propTypes = {
  countryCode: PropTypes.any,
  name: PropTypes.any,
  onSelect: PropTypes.func,
};

export default CoutryMenuItem;
