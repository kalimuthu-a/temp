import React, { useEffect } from 'react';
import * as PDF417 from 'pdf417-generator';
import PropTypes from 'prop-types';

const PassengerBarcode = ({ barValue, barcodeTitle, barcodeDescription }) => {
  const [barurl, setBarUrl] = React.useState('');
  useEffect(() => {
    if (barValue) {
      const canvas = document.getElementById('barcode');
      PDF417.draw(barValue, canvas, 2, 5, 2.5);
      setBarUrl(canvas.toDataURL());
    }
  }, [barValue]);
  return (
    barValue ? (
      <div className="passenger-barcode">
        <canvas id="barcode" style={{ height: '120px', display: 'none' }} />
        <img alt="Barcode" src={barurl} style={{ height: '60px', width: '210px' }} />
        {barcodeTitle
          ? <p className="py-4 text-tertiary body-extra-small-regular">{barcodeTitle || 'QR Code'}</p> : null}
        {barcodeDescription ? <p>{barcodeDescription || 'Scan for entry at airport'}</p> : null}
      </div>
    ) : null
  );
};

PassengerBarcode.propTypes = {
  barValue: PropTypes.string.isRequired,
  barcodeTitle: PropTypes.string.isRequired,
  barcodeDescription: PropTypes.string.isRequired,
};
export default PassengerBarcode;
