import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';

const { XPLORE } = Pages;

const SwitchLegPill = ({ label, active = false, icon, onClick, index, pageType }) => {
  const onClickHandler = () => {
    onClick(index);
  };

  return (
    <div
      className={`city-selection-header-pill-item rounded-4 ${
        active ? 'active' : ''
      }`}
      role="presentation"
      onClick={onClickHandler}
    >
      {label}
      {pageType !== XPLORE && <Icon className={icon} />}
    </div>
  );
};

SwitchLegPill.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.string,
  index: PropTypes.any,
  label: PropTypes.string,
  onClick: PropTypes.func,
  pageType: PropTypes.string,
};

export default SwitchLegPill;
