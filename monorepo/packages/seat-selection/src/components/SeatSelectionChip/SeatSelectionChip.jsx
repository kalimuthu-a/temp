import React from 'react';
import PropTypes from 'prop-types';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';

import './SeatSelectionChip.scss';

const SeatSelectionChip = ({ children, containerClass, ...rest }) => {
  return (
    <Chip containerClass={`seat-selection--chip ${containerClass}`} size="xs" {...rest}>
      {children}
    </Chip>
  );
};

SeatSelectionChip.propTypes = {
  children: PropTypes.node.isRequired,
  containerClass: PropTypes.string,
};

SeatSelectionChip.defaultProps = {
  containerClass: '',
};

export default SeatSelectionChip;
