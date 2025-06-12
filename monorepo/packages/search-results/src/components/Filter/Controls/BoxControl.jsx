import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

const BoxControl = ({ groupType, handleClick, boxData, selectedFilters }) => {
  return (
    <div className="filter-control-group-controlls">
      {boxData.map((data) => (
        <Button
          className={`box-control-button flex-column ${
            selectedFilters?.includes(data.value)
              ? 'filter-control-group-clicked'
              : 'filter-control-group-default'
          }`}
          onClick={() => handleClick(groupType, data)}
          key={data.value}
          tabIndex={0}
          aria-pressed={selectedFilters?.includes(data.value)}
          aria-label={`Filter Applied ${data.name}`}
        >
          <div className="icon">
            <i className={data.icon} />
          </div>
          <Text
            variation="body-small-regular"
            containerClass="box-control-text"
          >
            {data.name}
          </Text>
        </Button>
      ))}
    </div>
  );
};

BoxControl.propTypes = {
  boxData: PropTypes.any,
  groupType: PropTypes.any,
  handleClick: PropTypes.func,
  selectedFilters: PropTypes.any,
};

export default BoxControl;
