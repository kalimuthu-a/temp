import PropTypes from 'prop-types';
import React from 'react';

const FilterControlCheckbox = ({ checked, setChecked, label }) => {
  return (
    <div className="filter-control-checkbox">
      <input
        type="checkbox"
        name="checkboxFilter"
        id="checked"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <span className="filter-control-checkbox-span body-medium-regular">
        {label}
      </span>
    </div>
  );
};

FilterControlCheckbox.propTypes = {
  checked: PropTypes.any,
  setChecked: PropTypes.func,
  label: PropTypes.string,
};

export default FilterControlCheckbox;
