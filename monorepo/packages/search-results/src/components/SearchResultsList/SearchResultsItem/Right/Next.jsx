import PropTypes from 'prop-types';
import React from 'react';

import EconomyClass from './EconomyClass';
import BusinessClass from './BusinessClass';

const Next = ({
  onClick,
  FareClass = '',
  passengerFares,
  economyLabel,
  nextLabel,
  startsAtLabel,
  nextBackground,
  currencyCode,
}) => {
  return (
    <div className="d-flex fare-card-right-container">
      <BusinessClass
        onClick={onClick}
        FareClass={FareClass}
        passengerFares={passengerFares}
        nextLabel={nextLabel}
        nextBackground={nextBackground}
        currencyCode={currencyCode}
      />
      <EconomyClass
        onClick={onClick}
        FareClass={FareClass}
        passengerFares={passengerFares}
        economyLabel={economyLabel}
        startsAtLabel={startsAtLabel}
        currencyCode={currencyCode}
      />
    </div>
  );
};

Next.propTypes = {
  economyLabel: PropTypes.string,
  FareClass: PropTypes.any,
  nextLabel: PropTypes.string,
  onClick: PropTypes.func,
  passengerFares: PropTypes.array,
  startsAtLabel: PropTypes.string,
  currencyCode: PropTypes.string,
  nextBackground: PropTypes.any,
};

export default Next;
