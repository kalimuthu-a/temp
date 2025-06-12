import PropTypes from 'prop-types';
import React from 'react';

import useIsMobile from '../../../functions/hooks/useIsMobile';

const Heading = ({
  children,
  containerClass = '',
  heading = 'h1',
  mobileHeading = '',
}) => {
  const [isMobile] = useIsMobile();

  return (
    <div
      className={`skyplus-heading ${containerClass} ${
        isMobile && mobileHeading ? mobileHeading : heading
      }`}
    >
      {children}
    </div>
  );
};

Heading.propTypes = {
  children: PropTypes.any,
  containerClass: PropTypes.string,
  heading: PropTypes.string,
  mobileHeading: PropTypes.string,
};

export default Heading;
