import PropTypes from 'prop-types';
import React from 'react';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import { a11y } from 'skyplus-design-system-app/dist/des-system/globalConstants';

const ChipControl = ({
  chipData = [],
  selectedFilters,
  handleClick,
  groupType,
  size,
}) => {
  const onKeyUpHandler = (e, data) => {
    if ([a11y.keyCode.enter, a11y.keyCode.space].includes(e.keyCode)) {
      handleClick(groupType, data);
    }
  };

  return (
    <div className="filter-control-group-controlls">
      {chipData.map((data) => {
        const checked = selectedFilters?.includes(data.value);
        return (
          <Chip
            onClick={() => handleClick(groupType, data)}
            variant="filled"
            size={size}
            border={checked ? 'secondary-main' : 'secondary-light'}
            color={checked ? 'secondary-light' : 'white'}
            txtcol={checked ? 'text-primary' : 'text-secondary'}
            key={data.value}
            tabIndex={0}
            role="button"
            onKeyUp={(e) => {
              onKeyUpHandler(e, data);
            }}
            aria-label={`Filter Applied ${data.name}`}
            aria-pressed={checked}
          >
            {data.name}
          </Chip>
        );
      })}
    </div>
  );
};

ChipControl.propTypes = {
  chipData: PropTypes.array,
  groupType: PropTypes.any,
  handleClick: PropTypes.func,
  selectedFilters: PropTypes.any,
  size: PropTypes.string,
};

export default ChipControl;
