import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { useSelector } from 'react-redux';
import FareSummaryTable from './FareSummaryTable';
import { convertNumberWithCommaSep, formatCurrencyFunc } from '../../utils';
import { CONSTANTS } from '../../constants';

const BurnTaxesSection = ({ priceObj, currencyCode, converObj,
}) => {
  const { taxAmountList, redeemptionFee, convenienceFee, infantFee = 0, refundList, seatAmount } = priceObj;
  const hasNonZeroRefundAmount = refundList?.some((item) => parseFloat(item.amount) !== 0);
  const { FEECODE_CONFIG_LIST: { CANCEL_FEE_CODE, LOYALTY_CANCEL_FEE_IN_POINTS } } = CONSTANTS;
  const mfAdditionalDatav2Obj = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};

  const totalAmoutRefund = refundList?.find((i) => i.currency === currencyCode)?.amount;
  const totalPointsRefund = refundList?.find((i) => i.currency === 'PTE')?.amount;

  const bookingObj = useSelector((state) => state.itinerary?.apiData?.bookingDetails) || {};
  const isModifyFlow = bookingObj?.hasModification;
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const { itineraryMainByPath } = mfData;
  const { paymentDetails } = itineraryMainByPath && itineraryMainByPath.item;
  const totalTax = taxAmountList.reduce((total, item) => total + item.value, 0);
  const totalAmount = hasNonZeroRefundAmount ? null : (totalTax + convenienceFee + infantFee + seatAmount);
  // let totalAmountLabelForBooking;
  // if(hasNonZeroRefundAmount) {
  //   // for cancel refund flow
  //   const cashUsedText = priceObj?.totalAmount && formatCurrencyFunc({
  //     price: priceObj?.totalAmount,
  //     currencycode: currencyCode,
  //   });
  //    totalAmountLabelForBooking = priceObj?.airfareChargesInPoints ?
  // `${convertNumberWithCommaSep(priceObj?.airfareChargesInPoints)} ${paymentDetails?.milesLabel}` : '';
  //   if (totalAmountLabelForBooking && cashUsedText) {
  //     totalAmountLabelForBooking = `${totalAmountLabelForBooking} + `;
  //   }
  //   if (cashUsedText) {
  //     totalAmountLabelForBooking = `${totalAmountLabelForBooking}${cashUsedText}`;
  //   }
  // }
  const cancelFeeInPoints = taxAmountList?.find((i) => i.feeCode === LOYALTY_CANCEL_FEE_IN_POINTS);
  const getBurnFlowParams = () => {
    let totalBookingLabelBurn;
    let totalBookingAmount = 0;

    let totalBookingPoints = 0;
    if (hasNonZeroRefundAmount) {
      // for cancel refund flow
      totalBookingAmount += totalAmoutRefund;
      totalBookingPoints += totalPointsRefund;
    }
    const cancelFeeExceptPoints = taxAmountList?.filter((i) => i.feeCode !== LOYALTY_CANCEL_FEE_IN_POINTS);
    let cancelFeeFromAmount = cancelFeeExceptPoints.reduce((sum, fee) => sum + fee.value, 0);
    cancelFeeFromAmount += (priceObj?.convenienceFee || 0);
    const cancelFeeFromPoints = taxAmountList?.find((i) => i.feeCode === LOYALTY_CANCEL_FEE_IN_POINTS)?.value;
    totalBookingPoints += Number(cancelFeeFromPoints || 0);
    totalBookingAmount += Number(cancelFeeFromAmount || 0);

    // total Booking Amount - START
    totalBookingLabelBurn = totalBookingPoints
      ? `${convertNumberWithCommaSep(totalBookingPoints)} ${paymentDetails?.milesLabel}`
      : '';
    if (totalBookingLabelBurn && totalBookingAmount) {
      totalBookingLabelBurn = `${totalBookingLabelBurn} + `;
    }
    if (totalBookingAmount) {
      totalBookingLabelBurn = `${totalBookingLabelBurn}${formatCurrencyFunc({
        price: totalBookingAmount,
        currencycode: currencyCode,
      })
      } `;
    }
    // total Booking Amount - END

    return { totalBookingLabelBurn };
  };
  const { totalBookingLabelBurn } = getBurnFlowParams();
  let matchedCancellationFeeCodeIx = taxAmountList?.findIndex((tI) => tI.feeCode?.includes(CANCEL_FEE_CODE));
  let cancelFeeObjNotFound = false;
  if (matchedCancellationFeeCodeIx < 1) {
    matchedCancellationFeeCodeIx = taxAmountList?.findIndex((tI) => tI.feeCode?.includes(LOYALTY_CANCEL_FEE_IN_POINTS));
    cancelFeeObjNotFound = true;
  }

  let hideDeductionSection = false;
  if (bookingObj?.bookingStatus === CONSTANTS.BOOKING_STATUS.CANCELLED) {
    hideDeductionSection = true;
  }

  return (
    <FareSummaryTable {...{ priceObj, currencyCode, totalAmount, customFooterContent: '' }}>
      {
            // we dont have to show total booking in summary section
            !!(totalBookingLabelBurn && isModifyFlow && 0) && (
            <li className="price-summary__list__list-item" key={uniq()}>
              <span className="price-summary__list__heading">
                {paymentDetails?.totalBookingLabel || 'Total Booking'}
              </span>
              <span className="price-summary__list__price">
                {totalBookingLabelBurn}
              </span>
            </li>
            )
        }
      {
                (!!redeemptionFee && !!paymentDetails?.milesRedemptionCharges) && (
                <li className="price-summary__list__list-item" key={uniq()}>
                  <span className="price-summary__list__heading">
                    {paymentDetails?.milesRedemptionCharges}
                  </span>
                  <span className="price-summary__list__price">
                    {formatCurrencyFunc({
                      price: redeemptionFee || 0,
                      currencycode: currencyCode || 'INR',
                    })}
                  </span>
                </li>
                )
            }
      {
                 totalAmoutRefund && (
                 <li className="price-summary__list__list-item" key={uniq()}>
                   <span className="price-summary__list__heading">
                     {mfAdditionalDatav2Obj?.refundAmountLabel}
                   </span>
                   <span className="price-summary__list__price">
                     {
                        totalPointsRefund ? `${totalPointsRefund} ${paymentDetails?.milesLabel} + ` : ''
                     }
                     {formatCurrencyFunc({
                       price: totalAmoutRefund,
                       currencycode: currencyCode || 'INR',
                     })}
                   </span>
                 </li>
                 )
            }
      {
                (convenienceFee > 0) && !hideDeductionSection && (
                <li className="price-summary__list__list-item" key={uniq()}>
                  <span className="price-summary__list__heading">
                    {paymentDetails?.convenienceFee || 'Convenience Fee'}
                  </span>
                  <span className="price-summary__list__price">
                    {formatCurrencyFunc({
                      price: convenienceFee || 0,
                      currencycode: currencyCode || 'INR',
                    })}
                  </span>
                </li>
                )
            }
      {seatAmount > 0 ? (
        <li className="price-summary__list__list-item">
          <span className="price-summary__list__heading">
            {paymentDetails?.seatFeeLabel || 'Seat Amount'}
          </span>
          <span className="price-summary__list__price">
            {formatCurrencyFunc({
              price: seatAmount,
              currencycode: currencyCode,
            })}
          </span>
        </li>
      ) : null}
      {
                (infantFee > 0) && (
                <li className="price-summary__list__list-item" key={uniq()}>
                  <span className="price-summary__list__heading">
                    {paymentDetails?.infantFeeLabel}
                  </span>
                  <span className="price-summary__list__price">
                    {formatCurrencyFunc({
                      price: infantFee || 0,
                      currencycode: currencyCode || 'INR',
                    })}
                  </span>
                </li>
                )
            }
      {!hideDeductionSection && taxAmountList.map((tAmount, index) => {
        const isPointsItem = [LOYALTY_CANCEL_FEE_IN_POINTS].includes(tAmount.feeCode);
        let valString = !isPointsItem && tAmount.value && formatCurrencyFunc({
          price: tAmount?.value || 0,
          currencycode: currencyCode || 'INR',
        });
        if (matchedCancellationFeeCodeIx === index && cancelFeeInPoints?.value) {
          const pointStr = `${convertNumberWithCommaSep(cancelFeeInPoints?.value)} ${paymentDetails?.milesLabel}`;
          valString = valString ? `${pointStr} + ${valString}` : pointStr;
        }
        if (!tAmount?.isHiddenInUI && valString && (cancelFeeObjNotFound || !isPointsItem)) {
          return (
            <li className="price-summary__list__list-item" key={uniq()}>
              <span className="price-summary__list__heading">
                {converObj[tAmount?.feeCode] || tAmount?.feeCodeName || tAmount?.feeName}
              </span>
              <span className="price-summary__list__price">
                {valString}
              </span>
            </li>
          );
        }
        return null;
      })}

    </FareSummaryTable>
  );
};

BurnTaxesSection.propTypes = {
  priceObj: PropTypes.object,
  converObj: PropTypes.object,
  taxAmountList: PropTypes.array,
  currencyCode: PropTypes.string,
};

export default BurnTaxesSection;
