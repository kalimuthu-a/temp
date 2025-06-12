import React from 'react';
import Card from './Card';
import { AppContext } from '../../../context/AppContext';

const PaymentCustomerSupport = () => {
  const {
    state: { bookingConfirmation },
  } = React.useContext(AppContext);
  return (
    <div className="paymentCustomer">
      <div className="gst-contact-info">
        <Card header={bookingConfirmation?.needCustomerSupportLabel}>
          <div>
            <span className="contact-label">{bookingConfirmation?.contactNoLabel}</span>
            <span className="content-value">
              {' '}
              {bookingConfirmation?.customerCareNoLabel} {' '}
            </span>
          </div>
          <div className="contact-value">
            <span className="contact-label"> {bookingConfirmation?.contactEmail}</span>
            <span className="content-value">
              {' '}
              {bookingConfirmation?.customerCareEMailIdLabel}{' '}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default PaymentCustomerSupport;
