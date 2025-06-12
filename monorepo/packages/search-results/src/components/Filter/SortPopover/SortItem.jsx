import PropTypes from 'prop-types';
import React from 'react';

const SortItem = ({ onClick, keyProp, value, active }) => {
  const onClickHandler = () => {
    onClick({ keyProp, value });
  };

  return (
    <div
      tabIndex={0}
      aria-label={`Sorted by ${value}`}
      className={`search-results-sort-popover-content--list__item ${
        active ? 'active' : ''
      }`}
      role="presentation"
      onClick={onClickHandler}
    >
      {value}
    </div>
  );
};

SortItem.propTypes = {
  active: PropTypes.any,
  onClick: PropTypes.func,
  value: PropTypes.any,
  keyProp: PropTypes.string,
};

export default SortItem;
