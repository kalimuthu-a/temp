import React from 'react';
import PropTypes from 'prop-types';

function FilterSwitch(props) {
  const { label, selected, onClickHandler, preIcon, postIcon } = props;

  return (
    <button
      type="button"
      className={`skyplus-filter-btn ${
        selected && 'skyplus-filter-btn--selected'
      }`}
      onClick={onClickHandler}
    >
      {!!preIcon && preIcon}
      <div className="skyplus-filter-btn__label tags-small">{label}</div>
      {!!postIcon && postIcon}
    </button>
  );
}

FilterSwitch.propTypes = {
  label: PropTypes.string,
  selected: PropTypes.bool,
  onClickHandler: PropTypes.func,
  preIcon: PropTypes.element,
  postIcon: PropTypes.element,
};

export default FilterSwitch;
