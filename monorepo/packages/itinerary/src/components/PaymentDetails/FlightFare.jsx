import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { useSelector } from 'react-redux';
import FareSummaryTable from './FareSummaryTable';
import { formatCurrencyFunc } from '../../utils';

const FlightFare = ({ priceObj, converObj, creditShellDetails,
  taxAmountList, isShowDiscountLabel,
  currentItinerarySaleObj, currencyCode,
}) => {
  const { airfareCharges, convenienceFee, seatAmount,
    totalRefundAmount } = priceObj;
  const totalAmount = airfareCharges + convenienceFee + seatAmount + priceObj.infantFee
  + taxAmountList.reduce((a, b) => a + b.value, 0);
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const mfAdditionalData = useSelector((state) => state.itinerary?.mfAdditionalDatav2) || {};
  const { itineraryMainByPath } = mfData;
  const { paymentDetails } = itineraryMainByPath && itineraryMainByPath.item;
  const { itineraryAdditionalByPath } = mfAdditionalData;
  const { refundAmountLabel } = (itineraryAdditionalByPath && itineraryAdditionalByPath.item) || '';
  return (
    <FareSummaryTable {...{ priceObj, currencyCode, totalAmount }}>
      {totalRefundAmount > 0 && (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {refundAmountLabel}
          </span>
          <span className="price-summary__list__price">
            {formatCurrencyFunc({
              price: totalRefundAmount || 0,
              currencycode: currencyCode,
            })}
          </span>
        </li>
      )}

      {creditShellDetails?.cSBalanceAmount > 0 ? (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {paymentDetails?.pnrCreditShell || 'PNR Credit Shell'}
          </span>
          <span className="price-summary__list__price">
            {formatCurrencyFunc({
              price: creditShellDetails?.cSBalanceAmount,
              currencycode: currencyCode,
            })}
          </span>
        </li>
      ) : null}

      {priceObj?.airfareCharges > 0 ? (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {paymentDetails?.airFareChargeLabel || 'Airfare Charges'}
          </span>
          <span className="price-summary__list__price">
            {formatCurrencyFunc({
              price: priceObj?.airfareCharges,
              currencycode: currencyCode,
            })}
          </span>
        </li>
      ) : null}
      {priceObj?.convenienceFee > 0 ? (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {paymentDetails?.convenienceFee || 'Convenience Fee'}
          </span>
          <span className="price-summary__list__price">
            {formatCurrencyFunc({
              price: priceObj?.convenienceFee,
              currencycode: currencyCode,
            })}
          </span>
        </li>
      ) : null}
      {priceObj?.seatAmount > 0 ? (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {paymentDetails?.seatFeeLabel || 'Seat Amount'}
          </span>
          <span className="price-summary__list__price">
            {formatCurrencyFunc({
              price: priceObj?.seatAmount,
              currencycode: currencyCode,
            })}
          </span>
        </li>
      ) : null}
      {priceObj?.infantCount && (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {`${priceObj?.infantCount} ${paymentDetails?.infantFeeLabel || 'Infant fee'}`}
          </span>
          <span className="price-summary__list__price">
            {formatCurrencyFunc({
              price: priceObj?.infantFee,
              currencycode: currencyCode,
            })}
          </span>
        </li>
      )}
      {taxAmountList.map((tAmount) => {
        if (!tAmount?.isHiddenInUI) {
          return (
            <li className="price-summary__list__list-item" key={uniq()}>
              <span className="price-summary__list__heading">
                {converObj[tAmount?.feeCode] || tAmount?.feeCodeName || tAmount?.feeName}
                {/* Added when Fee API Fails */}
              </span>
              <span className="price-summary__list__price">
                {formatCurrencyFunc({
                  price: tAmount?.value || 0,
                  currencycode: currencyCode || 'INR',
                })}
              </span>
            </li>
          );
        }
        return null;
      })}
      {priceObj?.IndigoCash > 0 ? (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {paymentDetails?.indigoCashLabel || 'Indigo Cash'}
          </span>
          <span className="price-summary__list__price">
            {`-${formatCurrencyFunc({
              price: priceObj?.IndigoCash,
              currencycode: currencyCode,
            })}`}
          </span>
        </li>
      ) : null}
      {isShowDiscountLabel
        && currentItinerarySaleObj?.discountedPriceLabel
        && priceObj?.totalDiscount > 0 && (
          <li className="price-summary__list__list-item">
            <span className="price-summary__list__heading">
              {currentItinerarySaleObj?.discountedPriceLabel}
            </span>
            <span className="price-summary__list__price">
              {formatCurrencyFunc({
                price: priceObj?.totalDiscount,
                currencycode: currencyCode,
              })}
            </span>
          </li>
      )}
    </FareSummaryTable>
  );
};

FlightFare.propTypes = {
  priceObj: PropTypes.object,
  converObj: PropTypes.object,
  creditShellDetails: PropTypes.object,
  taxAmountList: PropTypes.array,
  isShowDiscountLabel: PropTypes.bool,
  currentItinerarySaleObj: PropTypes.object,
  currencyCode: PropTypes.string,
};

export default FlightFare;
