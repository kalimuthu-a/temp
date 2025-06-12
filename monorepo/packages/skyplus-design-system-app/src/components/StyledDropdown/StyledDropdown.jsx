import React from 'react';
import PropTypes from 'prop-types';
import './StyledDropdown.scss';

function StyledDropdown({
  list,
  containerClass,
  onChange,
  selected,
  setIsSelected,
  isActive,
  setActiveDropdown,
  deactivateDropdown,
}) {
  const handleDropdownClick = (e) => {
    e.stopPropagation();
    if (isActive) {
      deactivateDropdown();
    } else {
      setActiveDropdown();
    }
  };

  return (
    <div
      className="styled-dropdown w-100 position-relative"
      onClick={handleDropdownClick}
      aria-hidden="true"
    >
      <div
        className={`styled-dropdown__btn bg-secondary-light rounded
          d-flex align-text-center justify-content-between align-items-center
          p-5 gap-4 ${containerClass}`}
        aria-hidden="true"
      >
        {selected}
        <span
          className={`${
            !isActive
              ? 'icon-accordion-down-simple'
              : 'icon-accordion-up-simple'
          } icon-accordion-down-simple
       icon-size-sm`}
        />
      </div>
      <ul
        className="styled-dropdown__content overflow-y-scroll position-absolute w-100 z-10 bg-white"
        style={{ display: isActive ? 'block' : 'none' }}
      >
        {list?.map((item) => (
          <li
            key={item}
            className={`styled-dropdown__content-item p-5 text-tertiary body-small-medium ${
              selected === item && 'active'
            }`}
            onClick={(e) => {
              setIsSelected(e.target.textContent);
              onChange(e.target.textContent);
              deactivateDropdown();
            }}
            aria-hidden="true"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

StyledDropdown.propTypes = {
  containerClass: PropTypes.string,
  list: PropTypes.array,
  onChange: PropTypes.func,
  selected: PropTypes.string,
  setIsSelected: PropTypes.func,
  isActive: PropTypes.bool,
  setActiveDropdown: PropTypes.func,
  deactivateDropdown: PropTypes.func,
};

export default StyledDropdown;
