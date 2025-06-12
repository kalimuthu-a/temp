import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrencyFunc } from '../../utils';

const FareSummaryTable = ({ currencyCode, totalAmount, children, customFooterContent = '' }) => {
  return (
    <div className="payment-summary-table">
      <ul className="payment-summary">
        {
        children
      }
      </ul>
      {(totalAmount) ? (
        <div className="payment-summary-total">
          {
          formatCurrencyFunc({ price: totalAmount, currencycode: currencyCode })
        }
        </div>
      ) : null}
      {customFooterContent ? (
        <div className="payment-summary-total">
          {customFooterContent}
        </div>
      ) : null}
    </div>
  );
};

FareSummaryTable.propTypes = {
  currencyCode: PropTypes.string,
  totalAmount: PropTypes.number,
  children: PropTypes.any,
  customFooterContent: PropTypes.any,
};

export default FareSummaryTable;
