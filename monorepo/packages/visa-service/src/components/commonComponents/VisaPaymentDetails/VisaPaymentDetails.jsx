import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { AppContext } from '../../../context/AppContext';
import { formatCurrencyFunc } from '../../../utils';
import { GetFareDetails, GetPaymentFareDetails } from '../../../functions/GetFareDetails';

const priceClass = 'price-summary__list';

// AccordionContentChild Component
const AccordionContentChild = ({ taxDetails }) => {
  const items = taxDetails || [];
  return (
    <div className="payment-summary-table bottom-divider">
      {items.length > 0 && (
      <ul className="payment-summary child-gap">
        {items?.map((item) => {
          return (
            <li key={`${item?.title}${uniq()}`} className={`${priceClass}__list-item`}>
              <span className={`${priceClass}__heading`}>{item?.title || ''}</span>
              <span className={`${priceClass}__price`}>{item?.price || 0}</span>
            </li>
          );
        })}
      </ul>
      )}
    </div>
  );
};

// AccordionContent Component
const AccordionContent = ({ taxDetails, aemVisaReviewData, priceDistributions, travelerBasicDetails, totalTaxFee }) => {
  const {
    state: {
      visaUploadDocumentsByPath,
      selectedVisaDetails,
      selectedVisaPax,
    },
  } = useContext(AppContext);
  const [activeIndex, setActiveIndex] = useState([0, 1]);
  const taxDetailsMemo = taxDetails;
  const fareDetails = selectedVisaPax
    ? GetFareDetails(selectedVisaDetails, selectedVisaPax)
    : GetPaymentFareDetails(priceDistributions, travelerBasicDetails);
  // const fareDetails = GetPaymentFareDetails(priceDistributions, travelerBasicDetails);

  const symbole = 'X';
  const currencyCode = 'INR';
  return (
    <div className="payment-summary-table top-divider">
      <div className="fare-breakup-container-charge bottom-divider">
        {fareDetails?.totalAdult > 0 && (
        <div className="fare-breakup-container-group ">
          <div className="fare-breakup-container-text">
            {fareDetails?.totalAdult}{' '}
            {fareDetails?.totalAdult > 1
              ? visaUploadDocumentsByPath?.adultsLabel : visaUploadDocumentsByPath?.adultLabel}
          </div>
          <div className="fare-breakup-container-val">
            {fareDetails?.totalAdult} {symbole} {' '}
            {formatCurrencyFunc({
              price: fareDetails?.baseFareAdult || 0,
              currencycode: currencyCode,
            })}
          </div>
        </div>
        )}

        {fareDetails?.totalChild > 0 && (
        <div className="fare-breakup-container-group">
          <div className="fare-breakup-container-text">
            {fareDetails?.totalChild}{' '}
            {visaUploadDocumentsByPath?.childLabel}
          </div>
          <div className="fare-breakup-container-val">
            {fareDetails?.totalChild} {symbole} {' '}
            {formatCurrencyFunc({
              price: fareDetails?.baseFareChild || 0,
              currencycode: currencyCode,
            })}
          </div>
        </div>
        )}
      </div>
      <div className="fare-breakup-container-subtotal">
        {formatCurrencyFunc({
          price: fareDetails?.totalBaseFare || 0,
          currencycode: currencyCode,
        })}
      </div>
      {taxDetailsMemo?.length > 0 && (
      <Accordion
        activeIndex={1}
        accordionData={[
          {
            title: aemVisaReviewData?.taxesFeesLabel,
            renderAccordionContent: (
              <AccordionContentChild taxDetails={taxDetailsMemo} />
            ),
          },
        ]}
        setActiveIndex={setActiveIndex}
        initalActiveIndexes={activeIndex}
        isMultiOpen
      />
      )}

      <ul className="payment-summary ">
        <li className={`${priceClass} __list-item`}>
          <span className={`${priceClass} __heading`}>{aemVisaReviewData?.totalTaxLabel}</span>
          <span className="price-summary__list__price">
            {formatCurrencyFunc({
              price: totalTaxFee || 0,
              currencycode: currencyCode,
            })}
          </span>
        </li>
      </ul>
    </div>
  );
};

// PaymentDetails Component
const VisaPaymentDetails = ({ priceBreakDown }) => {
  const [parentItem, setParentItem] = useState([]);
  const [childItem, setChildItem] = useState([]);
  const [totalTaxFee, setTotalTaxFee] = useState();

  const { state } = useContext(AppContext) || {};
  const aemVisaReviewData = state?.visaReviewApplicationByPath?.visaFareSummary || {};
  const { feeLabel } = state?.visaUploadDocumentsByPath || {};

  const [activeIndex, setActiveIndex] = useState([0]);
  useEffect(() => {
    if (priceBreakDown) {
      const { paymentDistribution = {}, visaBookingBrief = {}, travelerBasicDetails = [] } = priceBreakDown;

      const { cgst, igst, sgst, basePrice, fee } = paymentDistribution || {};
      const totalFees = cgst + igst + sgst + fee;
      setTotalTaxFee(totalFees);
      // for 1st according
      const basePriceValue = formatCurrencyFunc({
        price: basePrice,
        currencycode: 'INR',
      });

      const data = [
        { title: `${visaBookingBrief?.stayPeriod}${' '}
        ${visaBookingBrief?.entryType} * ${travelerBasicDetails?.length}`,
        price: basePriceValue },
      ];
      setParentItem(data);

      const sgstValue = formatCurrencyFunc({
        price: sgst,
        currencycode: 'INR',
      });
      const cgstValue = formatCurrencyFunc({
        price: cgst,
        currencycode: 'INR',
      });
      const igstValue = formatCurrencyFunc({
        price: igst,
        currencycode: 'INR',
      });
      const feeValue = formatCurrencyFunc({
        price: fee,
        currencycode: 'INR',
      });
      // for 2st according
      const childData = [
        { title: aemVisaReviewData?.sgstLabel || '', price: sgstValue },
        { title: aemVisaReviewData?.cgstLabel || '', price: cgstValue },
        { title: aemVisaReviewData?.igstLabel || '', price: igstValue },
        { title: feeLabel || '', price: feeValue },
      ];
      setChildItem(childData);
    }
  }, [priceBreakDown]);
  const totalAmount = priceBreakDown?.totalAmount && formatCurrencyFunc({
    price: priceBreakDown?.totalAmount,
    currencycode: 'INR',
  });

  return (
    <>
      <HtmlBlock
        className="h4 heading-paydetails mb-12"
        html={aemVisaReviewData?.paymentDetailsLabel?.html || ''}
      />
      <div className="payment-details">
        <div className="flight-payment">
          {parentItem?.length > 0 && (
          <Accordion
            activeIndex={0}
            accordionData={[{
              title: aemVisaReviewData?.paymentSummaryLabel,
              renderAccordionContent: (
                <AccordionContent
                  items={parentItem}
                  taxDetails={childItem}
                  aemVisaReviewData={aemVisaReviewData}
                  taxAmount={priceBreakDown?.paymentDistribution?.tax}
                  priceDistributions={priceBreakDown || []}
                  travelerBasicDetails={priceBreakDown?.travelerBasicDetails || {}}
                  totalTaxFee={totalTaxFee || 0}
                />
              ),
            }]}
            setActiveIndex={setActiveIndex}
            initalActiveIndexes={activeIndex}
            isMultiOpen
          />
          )}
          <div className="payment-summary-total">
            <div>
              <div className="tfee">{aemVisaReviewData?.totalFeeLabel}</div>
            </div>
            <div className="price"> {totalAmount}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisaPaymentDetails;

AccordionContentChild.propTypes = {
  taxDetails: PropTypes.array,
};

AccordionContent.propTypes = {
  taxDetails: PropTypes.array,
  aemVisaReviewData: PropTypes.object,
  priceDistributions: PropTypes.any,
  travelerBasicDetails: PropTypes.any,
  totalTaxFee: PropTypes.any,
};

VisaPaymentDetails.propTypes = {
  priceBreakDown: PropTypes.object,
};
