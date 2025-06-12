import React from 'react';
import { useSelector } from 'react-redux';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { formatCurrencyFunc } from '../../../../utils';
import { PRIM, PRIMV, CONSTANTS } from '../../../../constants';

const { TAB_KEYS } = CONSTANTS;
// eslint-disable-next-line sonarjs/cognitive-complexity
const PrintFareContact = () => {
  const bookingObj = useSelector((state) => state.itinerary?.apiData?.bookingDetails) || {};
  const priceDetailObj = useSelector(
    (state) => state.itinerary?.apiData?.priceBreakdown,
  );
  const gstDetails = useSelector((state) => state.itinerary?.apiData?.gstInformation) || {};
  const paymentsDetails = useSelector((state) => state.itinerary?.apiData?.payments) || [];
  const creditShellDetails = useSelector((state) => state.itinerary?.apiData?.creditShellInfo) || {};
  const mfDataObj = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const mfAdditionalData = useSelector((state) => state.itinerary?.mfAdditionalDatav2) || {};
  const { itineraryMainByPath } = mfDataObj;
  const { paymentDetails, contactDetailsLabel,
    gstEmailLabel, numberLabel, gstCompany, infantFeeLabel, gstDetailsLabel,
    gstNumberLabel,
  } = itineraryMainByPath && itineraryMainByPath.item;
  const { itineraryAdditionalByPath } = mfAdditionalData;
  const { refundAmountLabel, pnrCreditShell } = (itineraryAdditionalByPath && itineraryAdditionalByPath.item) || '';
  const { currencyCode, specialFareCode } = bookingObj;
  const ssrAmountList = priceDetailObj?.ssrAmountlist || [];
  const taxAmountList = priceDetailObj?.taxAmountList || [];
  const feeCount = priceDetailObj?.lyd_DiscountDetails?.feeCount ?? 0;
  const feeLoyalDiscount = priceDetailObj?.lyd_DiscountDetails?.totalDiscount ?? 0;
  const specialFareBannerAEMData = mfDataObj?.itineraryMessages?.specialFareBanner || [];
  const currentItinerarySaleObj = specialFareBannerAEMData?.find(
    (item) => item?.specialfarecode?.toLowerCase() === specialFareCode?.toLowerCase(),
  );

  const isBurnFlow = useSelector((state) => state.itinerary?.isBurnFlow);
  const isEarnFlow = useSelector((state) => state.itinerary?.isEarnFlow);

  const contactDetailArray = useSelector((state) => state.itinerary?.apiData?.contacts) || [];

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

  const getFormattedAmount = (amount) => {
    return formatCurrencyFunc({ price: amount, currencycode: currencyCode });
  };

  const maskingText = (text) => {
    if (text && text.length > 4) {
      return text.substr(0, 2) + 'X'.repeat(text.length - 4) + text.slice(-2);
    }
    return text;
  };
  const feeListAbbreviation = useSelector((state) => state.itinerary?.feeCodeListAbbreviation) || [];
  const ssrListAbbreviation = useSelector((state) => state.itinerary?.ssrListAbbreviation) || [];
  const converObj = {};
  const converSSRObj = {};
  feeListAbbreviation.forEach((itm) => {
    converObj[itm.feeCode] = itm.name;
  });
  ssrListAbbreviation.forEach((itm) => {
    converSSRObj[itm.ssrCode] = itm.name;
  });
  // const contactObj = contactDetailArray && contactDetailArray[0] ? contactDetailArray[0] : {};
  // const { address } = contactObj;
  // const { lineOne, lineTwo, lineThree } = address || '';
  // let agentAddress = '';
  // const agentCompanyName = contactObj.companyName || '';
  // if (contactObj?.address) {
  //   if (contactObj?.address?.lineOne) agentAddress += lineOne || '';
  //   if (contactObj?.address?.lineTwo) agentAddress += lineTwo || '';
  //   if (contactObj?.address?.lineThree) agentAddress += lineThree || '';
  // }
  const { totalRefundAmount, airfareCharges, convenienceFee,
    seatAmount, infantCount, totalDiscount, infantFee, airfareChargesInPoints, totalAmount, redeemptionFee,
  } = priceDetailObj || {};
  const { cSBalanceAmount } = creditShellDetails;
  let subTotal = (totalRefundAmount || 0)
   + (airfareCharges || 0) + (convenienceFee || 0) + (seatAmount || 0)
    + (cSBalanceAmount || 0) + (infantCount || 0);
  let srrSubTotal = 0;
  // from aem,we are getting "true" as string ,for that we used regex
  // const isSlashedPriceToShow = /^true$/i.t est(window.msdv2?.enableSlashedPrices) && specialFareCode;

  const getTotalAmountSectionForBreakUp = () => {
    const cashUsedText = airfareCharges && formatCurrencyFunc({
      price: airfareCharges,
      currencycode: currencyCode,
    });
    if (!isBurnFlow) {
      return getFormattedAmount(priceDetailObj?.totalAmount);
    }

    let totalAmountLabel = priceDetailObj?.airfareChargesInPoints
      ? `${priceDetailObj?.airfareChargesInPoints} ${paymentDetails?.milesLabel}` : '';
    if (totalAmountLabel && cashUsedText) {
      totalAmountLabel = `${totalAmountLabel} + `;
    }
    if (cashUsedText) {
      totalAmountLabel = `${totalAmountLabel}${cashUsedText}`;
    }
    return totalAmountLabel;
  };

  const getTotalAmountSection = () => {
    const cashUsedText = totalAmount && formatCurrencyFunc({
      price: totalAmount,
      currencycode: currencyCode,
    });
    if (!isBurnFlow) {
      return getFormattedAmount(priceDetailObj?.totalAmount);
    }

    let totalAmountLabel = priceDetailObj?.airfareChargesInPoints
      ? `${priceDetailObj?.airfareChargesInPoints} ${paymentDetails?.milesLabel}` : '';
    if (totalAmountLabel && cashUsedText) {
      totalAmountLabel = `${totalAmountLabel} + `;
    }
    if (cashUsedText) {
      totalAmountLabel = `${totalAmountLabel} ${cashUsedText}`;
    }
    return totalAmountLabel;
  };

  const renderBurnFareSection = () => {
    const cashUsedBreakText = airfareCharges && formatCurrencyFunc({
      price: airfareCharges,
      currencycode: currencyCode,
    });

    const renderIBCVoucher = () => {
      const paymentCodeDetails = paymentsDetails.find((payment) => payment.code === TAB_KEYS.PYAMENT_CODE);
      if (paymentCodeDetails) {
        const { collectedAmount } = paymentCodeDetails;
        return (
          <li className="price-summary__list__list-item"> * {
            paymentDetails?.ibcVoucherLabel
            } {collectedAmount?.toLocaleString()}
          </li>
        );
      }
      return null;
    };

    return (
      <>
        <div className="print-fare-contact__content__heading print-fare-contact__content__bold">
          {paymentDetails?.fareSummary || 'Fare Summary' }
        </div>
        <ul className="print-fare-contact__content__price__list">
          {airfareChargesInPoints > 0 ? (
            <li className="print-fare-contact__content__price__list__list-item">
              <span className="print-fare-contact__content">
                { paymentDetails?.milesRedeemedLabel || 'Miles Redeemed'}
              </span>
              <span className="print-fare-contact__content__content__price nowrap">
                {`${airfareChargesInPoints} ${paymentDetails?.milesLabel}`}
              </span>
            </li>
          ) : null}
          {cashUsedBreakText ? (
            <li className="print-fare-contact__content__price__list__list-item">
              <span className="print-fare-contact__content">
                {paymentDetails?.cashUsedLabel || 'Cash Used'}
              </span>
              <span className="print-fare-contact__content__content__price">
                {cashUsedBreakText}
              </span>
            </li>
          ) : null}
          {renderIBCVoucher()}
          {infantFee ? (
            <li className="print-fare-contact__content__price__list__list-item">
              <span className="print-fare-contact__content">
                {paymentDetails?.infantFeeLabel || 'Infant charge'}
              </span>
              <span className="print-fare-contact__content__content__price">
                {formatCurrencyFunc({
                  price: infantFee,
                  currencycode: currencyCode,
                })}
              </span>
            </li>
          ) : null}
          {/* Total section */}
          <li className="print-fare-contact__content__price__list__list-item sub-total">
            <span className="print-fare-contact__content__content__price">
              {getTotalAmountSectionForBreakUp()}
            </span>
          </li>
        </ul>
      </>
    );
  };

  const renderEarnSection = () => {
    const hasNonZeroPromisPoints = priceDetailObj?.promisPoints?.some((item) => parseFloat(item.value) !== 0);
    if (!hasNonZeroPromisPoints) {
      return false;
    }

    const seatWiseInfoAem = paymentDetails?.sectionWiseEarnedMiles || [];
    const aemConfigObj = seatWiseInfoAem?.reduce((obj, item) => {
      // eslint-disable-next-line no-param-reassign
      obj[item.key.trim()] = item.value;
      return obj;
    }, {});
    return (
      <div className="miles-section">
        <div className="print-fare-contact__content__price">
          <div className="print-fare-contact__content__heading print-fare-contact__content__bold">
            {paymentDetails?.pointsEarnedSummaryLabel}
          </div>
          <ul className="print-fare-contact__content__price__list">
            {priceDetailObj?.promisPoints?.map((pPointItem) => {
              if (
                pPointItem?.code?.toLowerCase() === 'total' || !pPointItem?.value || pPointItem?.value === '0'
              ) {
                return false;
              }

              const label = aemConfigObj?.[pPointItem?.code] || pPointItem?.name || pPointItem?.code || '';
              return (
                <li className="print-fare-contact__content__price__list__list-item">
                  <span className="print-fare-contact__content">
                    {label}
                  </span>
                  <span className="print-fare-contact__content__content__price">
                    {pPointItem?.value}
                  </span>
                </li>
              );
            })}
            {/* Total section */}
            <li className="print-fare-contact__content__price__list__list-item sub-total">
              <span className="print-fare-contact__content__content__price">
                {priceDetailObj?.totalPoints}
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="print-fare-contact pageBreak-container">
      <div className="print-fare-contact__content">
        <div className="print-fare-contact__content__left">
          {priceDetailObj && (
            <div className="print-fare-contact__content__price">
                {isBurnFlow && renderBurnFareSection()}
              <div className="print-fare-contact__content__heading print-fare-contact__content__bold">
                {paymentDetails?.flightSummaryLabel}
              </div>
              <ul className="print-fare-contact__content__price__list">
                {(totalRefundAmount && totalRefundAmount > 0) ? (
                  <li className="print-fare-contact__content__price__list__list-item">
                    <span className="print-fare-contact__content">
                      {refundAmountLabel}
                    </span>
                    <span className="print-fare-contact__content__content__price">
                      {getFormattedAmount(totalRefundAmount)}
                    </span>
                  </li>
                ) : null}
                {cSBalanceAmount > 0 ? (
                  <li className="print-fare-contact__content__price__list__list-item">
                    <span className="print-fare-contact__content">
                      {pnrCreditShell || 'PNR Credit Shell'}
                    </span>
                    <span className="print-fare-contact__content__price">
                      {getFormattedAmount(cSBalanceAmount)}
                    </span>
                  </li>
                ) : null}
                {!isBurnFlow && airfareCharges > 0 ? (
                  <li className="print-fare-contact__content__price__list__list-item">
                    <span className="print-fare-contact__content">
                      {paymentDetails?.airFareChargeLabel}
                    </span>
                    <span className="print-fare-contact__content__content__price">
                      {getFormattedAmount(airfareCharges)}
                    </span>
                  </li>
                ) : null}
                { convenienceFee > 0 ? (
                  <li className="print-fare-contact__content__price__list__list-item">
                    <span className="print-fare-contact__content">
                      {paymentDetails?.convenienceFeeLabel || 'Convenience Fee'}
                    </span>
                    <span className="print-fare-contact__content__content__price">
                      {getFormattedAmount(convenienceFee)}
                    </span>
                  </li>
                ) : null}
                {seatAmount > 0 ? (
                  <li className="print-fare-contact__content__price__list__list-item">
                    <span className="print-fare-contact__content">
                      {paymentDetails?.seatFeeLabel}
                    </span>
                    <span className="print-fare-contact__content__content__price">
                      {getFormattedAmount(seatAmount)}
                    </span>
                  </li>
                ) : null}
                {infantCount > 0 ? (
                  <li className="print-fare-contact__content__price__list__list-item">
                    <span className="print-fare-contact__content">
                      {`${infantCount} ${infantFeeLabel || 'Infant fee'}`}
                    </span>
                    <span className="print-fare-contact__content__content__price">
                      {getFormattedAmount(infantFee)}
                    </span>
                  </li>
                ) : null}
                {(!!redeemptionFee && !!paymentDetails?.milesRedemptionCharges) ? (
                  <li className="print-fare-contact__content__price__list__list-item">
                    <span className="print-fare-contact__content">
                      {paymentDetails?.milesRedemptionCharges}
                    </span>
                    <span className="print-fare-contact__content__content__price">
                      {getFormattedAmount(redeemptionFee)}
                    </span>
                  </li>
                ) : null}
                {taxAmountList.map((tAmount) => {
                  if (tAmount.value > 0 && !tAmount.isHiddenInUI) {
                    subTotal += tAmount.value;
                    return (
                      <li
                        className="print-fare-contact__content__price__list__list-item"
                        key={uniq()}
                      >
                        <span className="print-fare-contact__content">
                          {converObj[tAmount.feeCode] || tAmount.feeName}
                        </span>
                        <span className="print-fare-contact__content__content__price">
                          {getFormattedAmount(tAmount.value)}
                        </span>
                      </li>
                    );
                  }
                  return null;
                })}
                {currentItinerarySaleObj?.discountedPriceLabel
                && totalDiscount > 0 ? (
                  <li className="print-fare-contact__content__price__list__list-item">
                    <span className="print-fare-contact__content">
                      {currentItinerarySaleObj?.discountedPriceLabel}
                    </span>
                    <span className="print-fare-contact__content__content__price">
                      -{getFormattedAmount(totalDiscount)}
                    </span>
                  </li>
                  ) : null}
                {priceDetailObj?.IndigoCash > 0 ? (
                  <li className="print-fare-contact__content__price__list__list-item indigo-cash">
                    <span className="print-fare-contact__content">
                      {paymentDetails?.indigoCashLabel || 'Indigo Cash'}
                    </span>
                    <span className="print-fare-contact__content__content__price">
                      -{getFormattedAmount(priceDetailObj?.IndigoCash)}
                    </span>
                  </li>
                ) : null}
                { subTotal > 0 ? (
                  <li className="print-fare-contact__content__price__list__list-item sub-total">
                    <span className="print-fare-contact__content__content__price">
                      {getFormattedAmount(subTotal)}
                    </span>
                  </li>
                ) : null}
              </ul>
              {sortedSsrAmountList.length > 0
                ? (
                  <>
                    <div className="print-fare-contact__content__heading print-fare-contact__content__bold">
                      {paymentDetails?.addOnsSummaryLabel}
                    </div>
                    <ul className="print-fare-contact__content__price__list">
                      {sortedSsrAmountList.map((ssrAmount) => {
                        srrSubTotal += (ssrAmount.ssrCode === PRIMV) ? -ssrAmount.value : ssrAmount.value;
                        return (
                          <li
                            className="print-fare-contact__content__price__list__list-item"
                            key={uniq()}
                          >
                            <span className="print-fare-contact__content">
                              {ssrAmount?.multiplier}{' '}
                              {converSSRObj[ssrAmount?.ssrCode] || ssrAmount?.ssrName}
                            </span>
                            <span className="print-fare-contact__content__voucher-price">
                              {getFormattedAmount(ssrAmount?.value)}
                            </span>
                          </li>
                        );
                      })}
                      { feeCount > 0 ? (
                        <li className="print-fare-contact__content__price__list__list-item">
                          <span className="print-fare-contact__content">
                            {paymentDetails?.primeVoucher}
                          </span>
                          <span className="print-fare-contact__content__voucher-price">
                            {feeCount} {paymentDetails?.eatFreeLabel}
                          </span>
                        </li>
                      ) : null}
                      {feeLoyalDiscount > 0 ? (
                        <li className="print-fare-contact__content__price__list__list-item">
                          <span className="print-fare-contact__content">
                            {paymentDetails?.loyaltySaving}
                          </span>
                          <span className="print-fare-contact__content__voucher-price">
                            - {formatCurrencyFunc({ price: feeLoyalDiscount, currencycode: currencyCode })}
                          </span>
                        </li>
                      ) : null}
                      <li className="print-fare-contact__content__price__list__list-item sub-total">
                        <span className="print-fare-contact__content__content__price">
                          {getFormattedAmount(srrSubTotal - (feeCount ? feeLoyalDiscount : 0))}
                        </span>
                      </li>
                    </ul>
                  </>
                )
                : null }

              <ul className="print-fare-contact__content__price__list">
                <li className="print-fare-contact__content__price__list__list-item mb-0">
                  <span className="print-fare-contact__content__heading print-fare-contact__content__bold total-fare">
                    {paymentDetails?.totalFareLabel}
                  </span>
                  <span
                    className="print-fare-contact__content__price__list__list-item__data
              print-fare-contact__content__bold  print-fare-contact__content__price__list__list-item__align-right"
                  >
                    {/* {isSlashedPriceToShow && (
                      <span
                        className="print-fare-contact__content__price__list__list-item__data
                print-fare-contact__content__price__list__list-item__data__slashed"
                      >
                        {getFormattedAmount(priceDetailObj?.originalTotal)}
                      </span>
                    )} */}
                    {getTotalAmountSection()}
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="print-fare-contact__content__right">
          {isEarnFlow && renderEarnSection()}
          {gstDetails?.companyName ? (
            <div className="print-fare-contact__content__contact gst-section">
              <div
                className="print-fare-contact__content__heading print-fare-contact__content__bold
              print-fare-contact__content__gstHeading"
              >
                <div className="gstHeading">{gstDetailsLabel}</div>
                {gstDetails?.customerNumber && (
                <div className="print-fare-contact__gst-list-item gst-number">
                  <span className="print-fare-contact__gst-list-label">
                    {gstNumberLabel} &nbsp;
                  </span>
                  <span className="print-fare-contact__gst-list-value">
                    {maskingText(gstDetails?.customerNumber)}
                  </span>
                </div>
                )}
              </div>
              <ul className="print-fare-contact__gst-list">
                {gstDetails?.email && (
                <li className="print-fare-contact__gst-list-item mb-4">
                  <span className="print-fare-contact__gst-list-label">
                    {gstEmailLabel} &nbsp;
                  </span>
                  <span className="print-fare-contact__gst-list-value">
                    {maskingText(gstDetails?.email)}
                  </span>
                </li>
                )}
                {gstDetails?.companyName && (
                <li className="print-fare-contact__gst-list-item">
                  <span className="print-fare-contact__gst-list-label">
                    {gstCompany} &nbsp;
                  </span>
                  <span className="print-fare-contact__gst-list-value">
                    {gstDetails?.companyName}
                  </span>
                </li>
                )}
              </ul>
            </div>
          ) : null}
          <div className="print-fare-contact__content__contact contact-section">
            <div className="print-fare-contact__content__heading print-fare-contact__content__bold">
              {contactDetailsLabel}
            </div>
            <ul className="print-fare-contact__content__contact__list">
              {/* {agentAddress && (
                <li className="print-fare-contact__content__contact__list__list-item">
                  <span
                    className="print-fare-contact__content__contact__list__list-item__data"
                    dangerouslySetInnerHTML={{ __html: gstDetails?.gstAddress?.html }}
                  />
                  <span
                    className="print-fare-contact__content__contact__list__list-item__data large-text"
                  >
                    {maskingText(agentAddress)}
                  </span>
                </li>
              )} */}
              {/* {agentCompanyName && (
                <li className="print-fare-contact__content__contact__list__list-item">
                  <span className="print-fare-contact__content__contact__list__list-item__data">
                    {gstCompany}
                  </span>
                  <span
                    className="print-fare-contact__content__contact__list__list-item__data"
                  >
                    {agentCompanyName}
                  </span>
                </li>
              )} */}
              {contactDetailArray[0]?.homePhone && (
                <li className="print-fare-contact__content__contact__list__list-item">
                  <span className="print-fare-contact__content__contact__list__list-item__data">
                    {numberLabel} &nbsp;
                  </span>
                  <span
                    className="print-fare-contact__content__contact__list__list-item__data"
                  >
                    +{contactDetailArray[0]?.homePhoneCountryCode}-
                    {maskingText(contactDetailArray[0]?.homePhone)}
                  </span>
                </li>
              )}
              {contactDetailArray[0]?.emailAddress && (
                <li className="print-fare-contact__content__contact__list__list-item">
                  <span className="print-fare-contact__content__contact__list__list-item__data">
                    {gstEmailLabel} &nbsp;
                  </span>
                  <span
                    className="print-fare-contact__content__contact__list__list-item__data"
                  >
                    {maskingText(contactDetailArray[0]?.emailAddress)}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

PrintFareContact.propTypes = {};

export default PrintFareContact;
