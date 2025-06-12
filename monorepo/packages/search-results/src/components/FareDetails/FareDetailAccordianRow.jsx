import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import { formatCurrency } from '../../utils';

const FareDetailAccordianRow = ({ label, amountLabel, amount, currencyCode }) => {
  return (
    <div className="d-flex justify-content-between">
      <Text
        className="body-medium-regular"
        containerClass="text-secondary"
      >{label}
      </Text>
      <Text
        className="body-medium-regular"
        containerClass="text-secondary"
      >
        {amountLabel || formatCurrency(amount, currencyCode)}
      </Text>
    </div>
  );
};

FareDetailAccordianRow.propTypes = {
  amount: PropTypes.any,
  label: PropTypes.any,
  currencyCode: PropTypes.string,
  amountLabel: PropTypes.string,
};

export default FareDetailAccordianRow;
