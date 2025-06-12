import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FareSummaryTable from './FareSummaryTable';
import { convertNumberWithCommaSep, formatCurrencyFunc } from '../../utils';
import { CONSTANTS } from '../../constants';

const { TAB_KEYS } = CONSTANTS;

const BurnFareSection = ({ priceObj, currencyCode,
}) => {
  const { airfareCharges, airfareChargesInPoints, infantFee } = priceObj;
  const paymentsDetails = useSelector((state) => state.itinerary?.apiData?.payments) || [];
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const { itineraryMainByPath } = mfData;
  const { paymentDetails } = itineraryMainByPath && itineraryMainByPath.item;
  const cashUsedText = airfareCharges && formatCurrencyFunc({
    price: airfareCharges,
    currencycode: currencyCode,
  });
  let totalAmountLabel = airfareChargesInPoints
    ? `${convertNumberWithCommaSep(airfareChargesInPoints)} ${paymentDetails?.milesLabel}` : '';
  if (airfareChargesInPoints && cashUsedText) {
    totalAmountLabel = `${totalAmountLabel} + `;
  }
  if (cashUsedText) {
    totalAmountLabel = `${totalAmountLabel}${cashUsedText}`;
  }
  const renderIBCVoucher = () => {
    const paymentCodeDetails = paymentsDetails.find((payment) => payment.code === TAB_KEYS.PYAMENT_CODE);
    if (paymentCodeDetails) {
      const { collectedAmount } = paymentCodeDetails;
      return (
        <li className="price-summary__list__list-item"> * {
          paymentDetails?.ibcVoucherLabel || 'Includes IndiGo BluChip voucher of worth'
          } {collectedAmount.toLocaleString()}
        </li>
      );
    }
    return null;
  };
  return (
    <FareSummaryTable {...{ priceObj, currencyCode, customFooterContent: totalAmountLabel }}>

      {airfareChargesInPoints > 0 ? (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {paymentDetails?.milesRedeemedLabel || 'Miles Redeemed'}
          </span>
          <span className="price-summary__list__price">
            {convertNumberWithCommaSep(airfareChargesInPoints)}{' '}{paymentDetails?.milesLabel}
          </span>
        </li>
      ) : null}
      {cashUsedText ? (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {paymentDetails?.cashUsedLabel || 'Cash Used'}
          </span>
          <span className="price-summary__list__price">
            {cashUsedText}
          </span>
        </li>
      ) : null}
      {renderIBCVoucher()}
      {infantFee && (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {paymentDetails?.infantFeeLabel || 'Infant charge'}
          </span>
          <span className="price-summary__list__price">
            {formatCurrencyFunc({
              price: infantFee,
              currencycode: currencyCode,
            })}
          </span>
        </li>
      )}

    </FareSummaryTable>
  );
};

BurnFareSection.propTypes = {
  priceObj: PropTypes.object,
  currencyCode: PropTypes.string,
};

export default BurnFareSection;
