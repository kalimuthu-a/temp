import React from 'react';
import { createPortal } from 'react-dom';
import InvoiceDownload from '../index';

const DownloadInvoice = ({ bookingId, pnr, sector, quickAction, decryptBookingId, decryptPnr }) => {
  return createPortal(
    <InvoiceDownload
      bookingId={bookingId}
      pnr={pnr}
      sector={sector}
      quickAction={quickAction}
      decryptPnr={decryptPnr}
      decryptBookingId={decryptBookingId}
    />,
    document.getElementById('quick-actions'),
  );
};

export default DownloadInvoice;
