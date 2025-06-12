import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import classnames from 'classnames';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';

import FareDetailAccordianRow from './FareDetailAccordianRow';

const FareDetailAccordian = ({ total, heading, rows = [], currencyCode, loyaltyBurnInfo }) => {
  const [expanded, setExpanded] = useState(true);

  const onClickHandler = () => {
    setExpanded((prev) => !prev);
  };

  const className = classnames('srp-fare-details-accordian', {
    expanded,
  });

  return (
    <div className={className}>
      <div
        className="srp-fare-details-accordian-header"
        onClick={onClickHandler}
        role="presentation"
      >
        <div className="heading">{heading}</div>
        <Icon className={`icon-accordion-${expanded ? 'up' : 'down'}-simple`} />
      </div>
      <div className="fare-border" />

      <div className="srp-fare-details-accordian--body d-flex flex-column gap-4">
        {rows.map((row) => (
          <FareDetailAccordianRow
            key={row.id}
            {...row}
            currencyCode={currencyCode}
          />
        ))}
      </div>
      <div className="srp-fare-details-accordian-footer">
        {loyaltyBurnInfo?.formattedPointsPlusCash || formatCurrency(total, currencyCode)}
      </div>
    </div>
  );
};

FareDetailAccordian.propTypes = {
  currencyCode: PropTypes.string,
  heading: PropTypes.any,
  rows: PropTypes.array,
  total: PropTypes.number,
  loyaltyBurnInfo: PropTypes.array,
};

export default FareDetailAccordian;
