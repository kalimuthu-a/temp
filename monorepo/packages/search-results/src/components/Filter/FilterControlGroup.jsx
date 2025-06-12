import PropTypes from 'prop-types';
import React from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import ChipControl from './Controls/ChipControl';
import BoxControl from './Controls/BoxControl';

const FilterControlGroup = ({
  type = 'chip',
  heading,
  data = [],
  selectedFilters = [],
  handleClick,
  groupType,
  size,
}) => {
  return (
    <div className="filter-control-group">
      <Heading heading="h0 filter-control-group-label">{heading}</Heading>
      {type === 'chip' ? (
        <ChipControl
          chipData={data}
          handleClick={handleClick}
          selectedFilters={selectedFilters}
          groupType={groupType}
          size={size}
        />
      ) : (
        <BoxControl
          boxData={data}
          handleClick={handleClick}
          selectedFilters={selectedFilters}
          groupType={groupType}
        />
      )}
    </div>
  );
};

FilterControlGroup.propTypes = {
  data: PropTypes.array,
  groupType: PropTypes.any,
  handleClick: PropTypes.any,
  heading: PropTypes.any,
  selectedFilters: PropTypes.any,
  type: PropTypes.string,
  size: PropTypes.string,
};

export default FilterControlGroup;
