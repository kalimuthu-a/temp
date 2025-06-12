/* eslint-disable react/prop-types */
import React, { useState, useContext, useRef, useEffect } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Offcanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import FareDetailsComponent from '../FareDetails';
import VisaModal from '../ModalPopUp';
import { AppContext } from '../../../context/AppContext';
import { GetFareDetails } from '../../../functions/GetFareDetails';
import { formatCurrencyFunc } from '../../../utils';

const VisaServiceFooterComponent = (props) => {
  const [fareDetailsDrawer, setFareDetailsDrawer] = useState(false);
  const [isMobile] = useIsMobile();
  const footerRef = useRef(null);
  const { totalText = '', paxDetail = '', totalAmount = '',
    viewDetail = '', buttonText = '', handleClick = '', buttonProps, setFooterHeight = null } = props;

  const {
    state: {
      visaUploadDocumentsByPath,
      visaSrpByPath,
      selectedVisaDetails,
      selectedVisaPax,
    },
  } = useContext(AppContext);

  const fareDetails = GetFareDetails(selectedVisaDetails, selectedVisaPax);
  const handleFareDetails = () => {
    setFareDetailsDrawer(true);
  };

  const handleFareDetailsClose = () => {
    setFareDetailsDrawer(false);
  };

  useEffect(() => {
    if (setFooterHeight && footerRef?.current) {
      setFooterHeight(footerRef?.current?.offsetHeight);
    }

    const handleResize = () => {
      if (setFooterHeight && footerRef?.current) {
        setFooterHeight(footerRef?.current?.offsetHeight);
      }
    };

    window?.addEventListener('resize', handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window?.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className="visa-footer-wrapper" ref={footerRef}>
        <div className="visa-price-footer">
          <span tabIndex={0} label="dash" role="button" className="dash" />
          <div className="visa-price-footer-left">
            {totalText && <p className="total">{totalText}</p>}
            {paxDetail && (
              <div
                className="body-small-medium cursor-pointer pax-details"
                role="presentation"
              >
                {paxDetail}
              </div>
            )}
            {totalAmount && (
              <Heading heading="h4 total-amount">{totalAmount}</Heading>
            )}

            {viewDetail && (
              <p className="view-details" aria-hidden="true" onClick={() => handleFareDetails()}>
                {viewDetail}
              </p>
            )}
          </div>
          <div className="visa-price-footer-right">
            {buttonText && (
              <Button
                color="primary"
                size="large"
                {...buttonProps}
                onClick={() => handleClick()}
              >
                {buttonText}
              </Button>
            )}
          </div>
        </div>
      </div>
      {fareDetailsDrawer && !isMobile && (
        <Offcanvas
          containerClassName="fare-detail-slider"
          onClose={() => handleFareDetailsClose()}
          renderFooter={() => (
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
                  price: fareDetails?.totalAmount,
                  currencycode: 'INR',
                })}
              </div>
            </div>
          )}
        >
          <FareDetailsComponent />
        </Offcanvas>
      )}
      {fareDetailsDrawer && isMobile && (
        <VisaModal onClose={() => handleFareDetailsClose()} />
      )}
    </>
  );
};

export default VisaServiceFooterComponent;
