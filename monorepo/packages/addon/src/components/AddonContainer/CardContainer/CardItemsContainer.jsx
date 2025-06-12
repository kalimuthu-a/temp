import PropTypes from 'prop-types';
import React from 'react';
import NoAddOnFound from './NoAddOnFound';

/**
 * @type {React.FC<*>}
 * @returns {React.FunctionComponentElement}
 */
const CardItemsContainer = ({ children, addonsContainer }) => {
  const count = React.Children.toArray(children).filter(Boolean).length;

  return count > 0 ? (
    children
  ) : (
    <NoAddOnFound
      image={addonsContainer.noAddonFoundImage?._publishUrl}
      label={addonsContainer.noAddonFoundLabel}
    />
  );
};

CardItemsContainer.propTypes = {
  addonsContainer: PropTypes.any,
  children: PropTypes.any,
};

export default CardItemsContainer;
