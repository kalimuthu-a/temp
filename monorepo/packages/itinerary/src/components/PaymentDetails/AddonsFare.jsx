import React from 'react';
import PropTypes from 'prop-types';
// import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { useSelector } from 'react-redux';
import FareSummaryTable from './FareSummaryTable';
import { formatCurrencyFunc } from '../../utils';
import { CONSTANTS, PRIM, PRIMV } from '../../constants/index';

// const getDiscountFare = (ssrItem) => {
//   try {
//     const originalAmt = ssrItem.originalAmount || ssrItem.originalValue;
//     return originalAmt ? Number(originalAmt) - Number(ssrItem.value) : '';
//   } catch (error) {
//     /* eslint-disable-next-line no-console */
//     console.error('Error in getDiscountFare:', error);
//   }
//   return 0;
// };

const AddonsFare = ({ ssrAmountList, converSSRObj, currencyCode }) => {
  const mfDataObj = useSelector((state) => state.itinerary?.mfDatav2) || {};
  // const isBurnFlow = useSelector((state) => state.itinerary?.isBurnFlow);
  const item = mfDataObj?.itineraryMainByPath?.item;
  const { paymentDetails } = item;
  const journeyDetail = useSelector((state) => state.itinerary?.apiData?.journeysDetail) ?? [];
  const priceBreakdownDetails = useSelector((state) => state.itinerary?.apiData?.priceBreakdown) ?? {};
  let discountAmount = 0;
  const addonsItems = [];
  const discountItems = [];
  const primItems = [];
  const primVItems = [];
  const otherItems = [];

  ssrAmountList.forEach((ssrItem) => {
    if (ssrItem?.ssrCode === PRIM) {
      primItems.push(ssrItem);
    } else if (ssrItem?.ssrCode === PRIMV) {
      primVItems.push(ssrItem);
    } else {
      otherItems.push(ssrItem);
    }
  });

  const sortedSsrAmountList = [...otherItems, ...primItems, ...primVItems];
  sortedSsrAmountList.forEach((ssrItem) => {
    const voucherDiscountAmount = ssrItem?.ssrCode === PRIMV && ssrItem?.value;
    // const discountAmountVal = isBurnFlow && !voucherDiscountAmount
    //   ? getDiscountFare(ssrItem) : voucherDiscountAmount;
    const isCPMLAddOn = ssrItem?.ssrCode === 'CPML';
    const productClass = journeyDetail?.[0]?.productClass;
    const xlPremium = isCPMLAddOn && CONSTANTS?.SAVER_FARE_TYPES.includes(productClass);
    addonsItems.push(
      <li className="price-summary__list__list-item">
        <span className={`price-summary__list__heading ${xlPremium ? 'green-text' : ''}`}>
          {ssrItem?.multiplier}{' '}{converSSRObj[ssrItem?.ssrCode] || ssrItem?.ssrName}
        </span>
        <span className={`price-summary__list__price ${xlPremium ? 'green-text' : ''}`}>
          {formatCurrencyFunc({ price: (ssrItem?.value)
            ? (ssrItem?.value) : 0,
          currencycode: currencyCode })}
        </span>
      </li>,
    );
    if (voucherDiscountAmount) {
      discountAmount += voucherDiscountAmount;
    }
  });

  const feeCount = priceBreakdownDetails?.lyd_DiscountDetails?.feeCount ?? 0;
  const feeLoyalDiscount = priceBreakdownDetails?.lyd_DiscountDetails?.totalDiscount ?? 0;
  if (feeCount > 0) {
    discountItems.push(
      <li className="price-summary__list__list-item green-text">
        <span className="price-summary__list__heading">
          {paymentDetails?.primeVoucher}
        </span>
        <span className="price-summary__list__price">
          <span className="green-text">{feeCount} {paymentDetails?.eatFreeLabel}</span>
        </span>
      </li>,
    );
  }
  if (discountAmount || (feeLoyalDiscount > 0)) {
    discountItems.push(
      <li className="price-summary__list__list-item">
        <span className="price-summary__list__heading">
          {paymentDetails?.loyaltySaving}
        </span>
        <span className="price-summary__list__price">
          <span className="green-text"> - {formatCurrencyFunc({
            price: feeLoyalDiscount + discountAmount, currencycode: currencyCode,
          })}
          </span>
        </span>
      </li>,
    );
  }
  const handleTotal = () => {
    const totalListVal = ssrAmountList
      .reduce(
        (total, ssr) => total + (ssr.ssrCode === PRIMV
          ? -ssr.value
          : ssr.value),
        0,
      );
    return (totalListVal - (feeCount ? feeLoyalDiscount : 0)).toString();
  };

  return (
    <FareSummaryTable {...{
      totalAmount: handleTotal(),
      currencyCode,
    }}
    >
      {addonsItems}
      {discountItems}
    </FareSummaryTable>
  );
};

AddonsFare.propTypes = {
  ssrAmountList: PropTypes.array,
  converSSRObj: PropTypes.object,
  currencyCode: PropTypes.string,
};

export default AddonsFare;
