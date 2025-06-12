import React, { useState } from 'react';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import PropTypes from 'prop-types';
import { downloadInvoice } from '../../../services';
import Loader from '../../commonComponents/Loader/Loader';
import { pushAnalytic } from '../../../utils/analyticEvents';
import { EVENTS_NAME, AA_CONSTANTS } from '../../../utils/analytic';

const InvoiceDownload = ({ bookingId, pnr, sector, quickAction, decryptBookingId, decryptPnr }) => {
  const [toastMessage, setToastMessage] = useState({
    message: '',
    status: 'success',
    show: false,
  });
  const [loading, setLoader] = useState(false);

  const pushToAnalytic = () => {
    pushAnalytic({
      event: 'visaClick',
      data: {
        _eventInfoName: 'Download',
        _event: EVENTS_NAME.VISA_SUCCESS,
        _componentName: 'Visa Service',
        pageName: 'Visa Successful',
        interactionType: AA_CONSTANTS.LINK_BUTTON_CLICK,
        productInfo: {
          bookingID: decryptBookingId,
          pnr: decryptPnr,
          sector,
        },
      },
    });
  };

  const downloadBookingInvoice = async () => {
    if (!loading) {
      setLoader(true);
      const invoice = await downloadInvoice(bookingId, pnr);
      setLoader(false);
      pushToAnalytic();
      if (invoice?.message) {
        const toastInvoice = {
          message: invoice.message,
          status: invoice?.isSuccess ? 'Success' : 'Error',
          show: true,
        };
        setToastMessage(toastInvoice);
      }
    }
  };

  return (
    loading
      ? <Loader />
      : (
        <div>
          <div
            aria-hidden="true"
            className={`download-container d-flex justify-content-center align-items-center flex-column 
        ${loading && 'disable-button'}`}
            onClick={downloadBookingInvoice}
          >
            <div className="tab-cta-icon  icon-download" />
            <div className="tab-cta-label">
              {quickAction?.buttonValue}
            </div>
          </div>
          {toastMessage?.show && (
            <Toast
              variation={`notifi-variation--${toastMessage?.status}`}
              description={toastMessage?.message}
              autoDismissTimeer={3000}
              onClose={() => setToastMessage({ show: false, message: '', status: '' })}
            />
          )}
        </div>
      )
  );
};

InvoiceDownload.propTypes = {
  bookingId: PropTypes.string,
  pnr: PropTypes.string,
  sector: PropTypes.string,
  quickAction: PropTypes.object,
  decryptBookingId: PropTypes.string,
  decryptPnr: PropTypes.string,
};

export default InvoiceDownload;
