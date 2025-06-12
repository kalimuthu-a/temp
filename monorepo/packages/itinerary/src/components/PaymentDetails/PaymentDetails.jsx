import React, { useState } from 'react';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
// import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { useSelector } from 'react-redux';
import { convertNumberWithCommaSep, formatCurrencyFunc, formatDate, UTIL_CONSTANTS } from '../../utils';
import FlightFare from './FlightFare';
import AddonsFare from './AddonsFare';
import Card from './Card';
import MilesFare from './MilesFare';
import BurnFareSection from './BurnFareSection';
import BurnTaxesSection from './BurnTaxesSection';
import { CONSTANTS } from '../../constants';

// eslint-disable-next-line sonarjs/cognitive-complexity
const PaymentDetails = () => {
  const mfDataObj = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const priceObj = useSelector((state) => state.itinerary?.apiData?.priceBreakdown) || {};
  const bookingObj = useSelector((state) => state.itinerary?.apiData?.bookingDetails) || {};
  const creditShellDetails = useSelector((state) => state.itinerary?.apiData?.creditShellInfo) || {};
  const gstDetails = useSelector((state) => state.itinerary?.apiData?.gstInformation) || {};
  const contactApiData = useSelector((state) => state.itinerary?.apiData?.contacts) || [];
  const contactObj = contactApiData?.[0] || {};
  const ssrAmountList = priceObj?.ssrAmountlist || [];
  const taxAmountList = priceObj?.taxAmountList || [];
  const { currencyCode, specialFareCode, promoCode } = bookingObj;
  const specialFareBannerAEMData = mfDataObj?.itineraryMessages?.specialFareBanner || [];
  const currentItinerarySaleObj = specialFareBannerAEMData?.find(
    (item) => item?.specialfarecode?.toLowerCase() === specialFareCode?.toLowerCase(),
  );
  const isShowDiscountLabel = specialFareCode && specialFareCode === promoCode;

  const hasNonZeroRefundAmount = priceObj?.refundList?.some((item) => parseFloat(item.amount) !== 0);
  const isBurnSummaryShow = priceObj?.airfareChargesInPoints || priceObj?.airfareCharges;
  // [CONSTANTS.BOOKING_STATUS.COMPLETED, CONSTANTS.BOOKING_STATUS.CONFIRMED].includes(bookingObj?.bookingStatus);

  const isBurnFlow = useSelector((state) => state.itinerary?.isBurnFlow);
  const feeListAbbreviation = useSelector((state) => state.itinerary?.feeCodeListAbbreviation) || [];
  const ssrListAbbreviation = useSelector((state) => state.itinerary?.ssrListAbbreviation) || [];
  const journeysDetailArray = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const converObj = {};
  const converSSRObj = {};
  feeListAbbreviation.forEach((itm) => {
    converObj[itm.feeCode] = itm.name;
  });
  ssrListAbbreviation.forEach((itm) => {
    converSSRObj[itm.ssrCode] = itm.name;
  });
  // from aem,we are getting "true" as string ,for that we used regex
  // const isSlashedPriceToShow = /^true$/i.test(window.msdv2?.enableSlashedPrices) && specialFareCode;

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexMiles, setActiveIndexMiles] = useState(0);
  const initalActiveIndexes = [0, 1, 2];

  const item = mfDataObj?.itineraryMainByPath?.item;
  const {
    totalDeductionsLabel,
    totalFareLabel,
    fareDetailsLabel,
    addOnsSummaryLabel,
    fareTypesList,
    loyaltyPointsCreditNote,
    totalPointsEarnedLabel,
    milesDetailsLabel,
    pointsEarnedSummaryLabel,
    redemptionAndConvenienceFee,
    milesLabel,
    fareSummary,
    taxesChargesFeesLabel,
    totalRefundLabel,
    deductionsLabel,
    cancellationChargeLabel,
  } = item?.paymentDetails || {};

  const jouneryProductKeys = new Map();

  journeysDetailArray?.forEach((journey) => {
    const jouneryProductKey = journey?.productClass || journey.segments?.[0]?.productClass;

    const fareMatchObjAem = fareTypesList.find(
      (items) => items.productClass === jouneryProductKey,
    );
    if (fareMatchObjAem) {
      jouneryProductKeys.set(fareMatchObjAem?.productClass, fareMatchObjAem);
    }
  });

  const flightDetailsAccordion = {
    title: fareDetailsLabel,
    subTitle: '',
    renderAccordionContent: (
      <FlightFare
        {...{
          priceObj,
          creditShellDetails,
          taxAmountList,
          converObj,
          isShowDiscountLabel,
          currentItinerarySaleObj,
          currencyCode,
        }}
      />
    ),
    renderSubtitle: () => {
      return (
        <div className="payment-fare-badges">
          {Array.from(jouneryProductKeys).map((badge) => {
            const [productClass, aemfare] = badge;

            const className = ['BR', 'BC'].includes(productClass)
              ? 'skyplus-chip--next'
              : 'skyplus-chip-filled-col-secondary-light-size-sm-bg-none-txtcol-system-information';

            return (
              <div className="skyplus-chip" key={productClass}>
                <div className={className}>
                  <span>{aemfare?.fareLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  };
  const flightDetailsBurnAccordion = {
    title: fareDetailsLabel,
    subTitle: '',
    renderAccordionContent: (
      <BurnFareSection
        {...{
          priceObj,
          creditShellDetails,
          taxAmountList,
          converObj,
          isShowDiscountLabel,
          currentItinerarySaleObj,
          currencyCode,
        }}
      />
    ),
    renderSubtitle: () => {
      return (
        <div className="payment-fare-badges">
          {Array.from(jouneryProductKeys).map((badge) => {
            const [productClass, aemfare] = badge;

            const className = ['BR', 'BC'].includes(productClass)
              ? 'skyplus-chip--next'
              : 'skyplus-chip-filled-col-secondary-light-size-sm-bg-none-txtcol-system-information';

            return (
              <div className="skyplus-chip" key={productClass}>
                <div className={className}>
                  <span>{aemfare?.fareLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  };
  const taxDetailsBurnAccordion = {
    title: hasNonZeroRefundAmount ? deductionsLabel : taxesChargesFeesLabel,
    subTitle: '',
    renderAccordionContent: (
      <BurnTaxesSection
        {...{
          priceObj,
          creditShellDetails,
          taxAmountList,
          converObj,
          isShowDiscountLabel,
          currentItinerarySaleObj,
          currencyCode,
        }}
      />
    ),
  };

  const accordionDataMilesDetails = [{
    title: pointsEarnedSummaryLabel,
    renderAccordionContent: <MilesFare {...{ priceObj, ssrAmountList, converSSRObj, currencyCode }} />,
  }];

  const accordionDataFlightPayment = [
    ...(ssrAmountList?.length > 0
      ? [
        flightDetailsAccordion,
        {
          title: addOnsSummaryLabel,
          renderAccordionContent: (
            <AddonsFare
              {...{ priceObj, ssrAmountList, converSSRObj, currencyCode }}
            />
          ),
        },
      ]
      : [flightDetailsAccordion]),
  ];
  const accordionDataBurnFlightPayment = isBurnSummaryShow ? [flightDetailsBurnAccordion] : [];
  if (ssrAmountList.length > 0) {
    accordionDataBurnFlightPayment.push({
      title: addOnsSummaryLabel,
      renderAccordionContent: (
        <AddonsFare
          {...{ priceObj, ssrAmountList, converSSRObj, currencyCode }}
        />
      ),
    });
  }
  if (taxAmountList?.length > 0) {
    accordionDataBurnFlightPayment.push(taxDetailsBurnAccordion);
  }

  const renderContactGstDetails = () => {
    return (
      <div className="gst-contact-info">
        {gstDetails.companyName && (
        <Card
          header={item?.gstDetailsLabel || 'GST Details'}
          subHeader={`${item?.gstNumberLabel || 'GST Number:'} ${gstDetails?.customerNumber
          }`}
        >
          <div>
            {`${item?.gstEmailLabel} ` || 'E-mail:'}{' '}
            <span className="content-value">{gstDetails?.email}</span>
          </div>
          <div>
            {`${item?.gstCompany} ` || 'GST Company: '}
            <span className="content-value">{gstDetails?.companyName}</span>
          </div>
        </Card>
        )}
        {contactObj?.homePhone && (
        <Card header={item?.contactDetailsLabel}>
          <div>
            {`${item?.numberLabel} ` || 'Number : '}
            <span className="content-value">{contactObj.homePhone}</span>
          </div>
          <div>
            {`${item?.gstEmailLabel} ` || 'emailId'}
            <span className="content-value">{contactObj?.emailAddress}</span>
          </div>
        </Card>
        )}
      </div>
    );
  };
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderBurnFlowChanges = () => {
    let totalAmountLabel;
    let totalRefundAmountLabel;
    let totalDeductionAmountLabel;
    if (hasNonZeroRefundAmount) {
      // for cancel refund flow
      const totalAmoutRefund = priceObj?.refundList?.find((i) => i.currency === currencyCode)?.amount;
      const totalPointsRefund = priceObj?.refundList?.find((i) => i.currency === 'PTE')?.amount;

      const cashUsedText = totalAmoutRefund && formatCurrencyFunc({
        price: totalAmoutRefund,
        currencycode: currencyCode,
      });
      totalRefundAmountLabel = totalPointsRefund ? `${convertNumberWithCommaSep(totalPointsRefund)} ${milesLabel}` : '';
      if (totalRefundAmountLabel && cashUsedText) {
        totalRefundAmountLabel = `${totalRefundAmountLabel} + `;
      }
      if (cashUsedText) {
        totalRefundAmountLabel = `${totalRefundAmountLabel}${cashUsedText}`;
      }
      // Deduction -Start
      const cashUsedTextDeduction = priceObj?.totalAmount && formatCurrencyFunc({
        price: priceObj?.totalAmount,
        currencycode: currencyCode,
      });
      totalDeductionAmountLabel = priceObj?.totalPoints
        ? `${convertNumberWithCommaSep(priceObj?.totalPoints)} ${milesLabel}` : '';
      if (totalDeductionAmountLabel && cashUsedTextDeduction) {
        totalDeductionAmountLabel = `${totalDeductionAmountLabel} + `;
      }
      if (cashUsedTextDeduction) {
        totalDeductionAmountLabel = `${totalDeductionAmountLabel}${cashUsedTextDeduction}`;
      }
      // Deduction -End
    } else {
      // for normal flow
      const cashUsedText = priceObj?.totalAmount && formatCurrencyFunc({
        price: priceObj?.totalAmount,
        currencycode: currencyCode,
      });
      totalAmountLabel = priceObj?.airfareChargesInPoints
        ? `${convertNumberWithCommaSep(priceObj?.airfareChargesInPoints)} ${milesLabel}` : '';
      if (totalAmountLabel && cashUsedText) {
        totalAmountLabel = `${totalAmountLabel} + `;
      }
      if (cashUsedText) {
        totalAmountLabel = `${totalAmountLabel}${cashUsedText}`;
      }
    }
    let totalSectionLabel = totalFareLabel || 'TOTAL FARE';
    let totalSectionAmount = totalAmountLabel;
    // if(bookingObj?.hasModification && hasNonZeroRefundAmount){
    //   totalSectionLabel = totalDeductionsLabel;
    //   totalSectionAmount = totalDeductionAmountLabel;
    // }else
    if (hasNonZeroRefundAmount) {
      totalSectionLabel = totalRefundLabel || 'Total Refund';
      totalSectionAmount = totalRefundAmountLabel;
    }

    return (
      <div className="payment-details payment-miles-burn">
        <Heading heading="h4" mobileHeading="h5">
          {fareSummary || 'Fare Summary'}
        </Heading>
        <div className="flight-payment">
          <Accordion
            activeIndex={activeIndex}
            accordionData={accordionDataBurnFlightPayment}
            setActiveIndex={setActiveIndex}
            initalActiveIndexes={initalActiveIndexes}
            isMultiOpen
          />

          {totalSectionAmount ? (
            <div className="total-fare">
              <div className="title-container">
                <div className="title">
                  {totalSectionLabel}
                </div>
                {!!isBurnFlow && !hasNonZeroRefundAmount
                && <div className="title-note">{redemptionAndConvenienceFee}</div>}
                {isBurnFlow
                && bookingObj?.bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.CANCELLED.toLowerCase()
                && <div className="title-note">{cancellationChargeLabel}</div>}
              </div>
              <div className="price">
                {totalSectionAmount}
              </div>
            </div>
          ) : null}
        </div>
        {renderContactGstDetails()}
      </div>
    );
  };
  const getHoldData = (dateToUpdate) => {
    return dateToUpdate?.replace('{price}', formatCurrencyFunc(
      { price: priceObj?.balanceDue, currencycode: currencyCode },
    ))
      ?.replace('{date}', formatDate(bookingObj?.holdDate, UTIL_CONSTANTS.DATE_SPACE_DDDMMMYYYYHHMM));
  };
  const isPriceObjPresent = priceObj && Object.keys(priceObj).length > 0;
  const hasNonZeroPromisPoints = priceObj?.promisPoints?.some((item2) => parseFloat(item2.value) !== 0);
  const isMilesShowShow = !window.disableLoyalty && hasNonZeroPromisPoints;
  if (!isPriceObjPresent) {
    return null;
  }
  if (isBurnFlow) {
    return renderBurnFlowChanges();
  }

  const isFlexHold = ((bookingObj?.paymentStatus === CONSTANTS?.PAYMENT_STATUS?.PENDING) && bookingObj?.isFlexPay);
  const enableFlexClass = isFlexHold ? 'flex-hold' : '';

  return (
    <div className="payment-details">
      <Heading heading="h4" mobileHeading="h5">
        {item?.paymentDetailsLabel || 'Payment Details'}
      </Heading>
      {isFlexHold
        ? <div className="flexi_pay_detail">{getHoldData(item?.paymentConfirmText)}</div> : null}
      <div className={`flight-payment ${enableFlexClass}`}>
        <Accordion
          activeIndex={activeIndex}
          accordionData={accordionDataFlightPayment}
          setActiveIndex={setActiveIndex}
          initalActiveIndexes={initalActiveIndexes}
          isMultiOpen
        />

        {(priceObj?.totalAmount) ? (
          <div className="total-fare">
            <div className="title-container">
              <div className="title">
                {priceObj?.totalRefundAmount
                  ? totalDeductionsLabel
                  : totalFareLabel || 'TOTAL FARE'}
              </div>
              {isBurnFlow && priceObj?.totalRefundAmount
              && bookingObj?.bookingStatus?.toLowerCase() === CONSTANTS.BOOKING_STATUS.CANCELLED.toLowerCase()
              && <div className="title-note">{cancellationChargeLabel}</div>}
            </div>
            <div className="price">
              {formatCurrencyFunc({
                price: priceObj?.totalAmount,
                currencycode: currencyCode,
              })}
            </div>
          </div>
        ) : null}
      </div>
      {isMilesShowShow && (
      <div className="payment-miles-info">
        <Heading heading="h4" mobileHeading="h5">
          {milesDetailsLabel}
        </Heading>
        <Accordion
          activeIndex={activeIndexMiles}
          accordionData={accordionDataMilesDetails}
          setActiveIndex={setActiveIndexMiles}
          initalActiveIndexes={[0]}
          isMultiOpen
        />
        <div className="total-fare">
          <div className="title-container">
            <div className="title">{totalPointsEarnedLabel}
            </div>
          </div>
          <div className="price">
            {convertNumberWithCommaSep(priceObj?.totalPoints)}
          </div>
          <div className="subtitle">
            <i className="icon-info" />
            <HtmlBlock
              html={loyaltyPointsCreditNote?.html}
              className=""
            />
          </div>
        </div>
      </div>
      )}

      {renderContactGstDetails()}
    </div>
  );
};

PaymentDetails.propTypes = {};

export default PaymentDetails;
