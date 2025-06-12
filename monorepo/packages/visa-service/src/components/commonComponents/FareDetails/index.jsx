/* eslint-disable i18next/no-literal-string */
import React, { useContext } from 'react';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { AppContext } from '../../../context/AppContext';
import { GetFareDetails } from '../../../functions/GetFareDetails';
import { formatCurrencyFunc } from '../../../utils';

const FareDetailsComponent = () => {
  const {
    state: {
      visaUploadDocumentsByPath,
      selectedVisaDetails,
      bookingConfirmation,
      visaReviewApplicationByPath,
      selectedVisaPax,
      visaSrpByPath,
    },
  } = useContext(AppContext);

  const visaTitle = visaUploadDocumentsByPath?.touristVisaLabel?.html?.replace(
    '{Country}',
    selectedVisaDetails?.countryName,
  );
  const [isMobile] = useIsMobile();
  const fareDetails = GetFareDetails(selectedVisaDetails, selectedVisaPax);
  const totalLabel = bookingConfirmation?.totalLabel;
  const tFees = fareDetails?.totalFees ?? 0;
  const tServiceTax = fareDetails?.totalServiceTax ?? 0;

  return (
    <>
      <div className="fare-details-wrapper">
        <div className="fare-details-wrapper__title">
          {visaUploadDocumentsByPath?.fareDetailsLabel}
        </div>
        <HtmlBlock
          className="fare-details-wrapper__sub-title"
          html={visaTitle}
        />
        <div className="fare-breakup-container">
          <div className="fare-breakup-container__card">
            <div className="fare-breakup-container-lbl">
              {visaUploadDocumentsByPath?.baseChargesLabel}
            </div>
            <div className="fare-breakup-container-charge">
              {fareDetails?.totalAdult > 0 && (
              <div className="fare-breakup-container-group">
                <div className="fare-breakup-container-text">
                  {fareDetails?.totalAdult}{' '}
                  {fareDetails?.totalAdult > 1
                    ? visaUploadDocumentsByPath?.adultsLabel : visaUploadDocumentsByPath?.adultLabel}
                </div>
                <div className="fare-breakup-container-val">
                  {fareDetails?.totalAdult} x{' '}
                  {formatCurrencyFunc({
                    price: fareDetails?.baseFareAdult || 0,
                    currencycode: 'INR',
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
                  {fareDetails?.totalChild} x{' '}
                  {formatCurrencyFunc({
                    price: fareDetails?.baseFareChild || 0,
                    currencycode: 'INR',
                  })}
                </div>
              </div>
              )}
            </div>
            <div className="fare-breakup-container-subtotal">
              {formatCurrencyFunc({
                price: fareDetails?.totalBaseFare || 0,
                currencycode: 'INR',
              })}
            </div>
          </div>
          <div className="fare-breakup-container__card">
            <div className="fare-breakup-container-lbl">
              {visaReviewApplicationByPath?.visaFareSummary?.taxesFeesLabel}
            </div>
            <div className="fare-breakup-container-charge">
              <div className="fare-breakup-container-group">
                <div className="fare-breakup-container-text">
                  {visaUploadDocumentsByPath?.feeLabel}
                </div>
                <div className="fare-breakup-container-val">
                  {formatCurrencyFunc({
                    price: fareDetails?.totalFees || 0,
                    currencycode: 'INR',
                  })}
                </div>
              </div>
              <div className="fare-breakup-container-group">
                <div className="fare-breakup-container-text">
                  {visaUploadDocumentsByPath?.serviceTaxLabel}
                </div>
                <div className="fare-breakup-container-val">
                  {formatCurrencyFunc({
                    price: fareDetails?.totalServiceTax || 0,
                    currencycode: 'INR',
                  })}
                </div>
              </div>
            </div>
            <div className="fare-breakup-container-subtotal">
              {formatCurrencyFunc({
                price: tFees + tServiceTax || 0,
                currencycode: 'INR',
              })}
            </div>
          </div>
        </div>
        <div className="fare-details-wrapper__total">
          <div>
            {totalLabel
              ? totalLabel.charAt(0).toUpperCase()
                + totalLabel.slice(1).toLowerCase()
              : ''}
          </div>
          <div>
            {formatCurrencyFunc({
              price: fareDetails?.totalAmount || 0,
              currencycode: 'INR',
            })}
          </div>
        </div>
      </div>
      {isMobile && (
        <div className="payment-details-footer-wrapper">
          <div className="payment-details-footer-wrapper__lbl">
            <div className="payment-details-footer-wrapper__lbl__price">
              {visaUploadDocumentsByPath?.totalPriceLabel}
            </div>
            <div className="payment-details-footer-wrapper__lbl__travellers">
              {selectedVisaPax?.length < 10
                ? `0${selectedVisaPax?.length}`
                : selectedVisaPax?.length}{' '}
              {visaSrpByPath?.travellerLabel}
            </div>
          </div>
          <div className="payment-details-footer-wrapper__amt">
            {formatCurrencyFunc({
              price: fareDetails?.totalAmount || 0,
              currencycode: 'INR',
            })}
          </div>
        </div>
      )}
    </>
  );
};
export default FareDetailsComponent;
