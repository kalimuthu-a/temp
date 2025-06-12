import PropTypes from 'prop-types';
import React from 'react';
import useIsMobile from '../../../functions/hooks/useIsMobile';

const Text = ({
  children,
  containerClass = '',
  variation = 'sub-heading-1',
  mobileVariation = '',
}) => {
  const [isMobile] = useIsMobile();

  return (
    <div
      className={`skyplus-text ${containerClass} ${
        isMobile && mobileVariation ? mobileVariation : variation
      }`}
    >
      {children}
    </div>
  );
};

Text.propTypes = {
  children: PropTypes.any,
  containerClass: PropTypes.string,
  variation: PropTypes.string,
  mobileVariation: PropTypes.string,
};

export default Text;
