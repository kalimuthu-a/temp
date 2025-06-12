import React from 'react';
import PropTypes from 'prop-types';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';

const VisaToast = ({ alert, setAlert, variation = '', timer = 5000 }) => {
  const toastProps = {
    description: alert,
    onClose: () => setAlert(''),
    infoIconClass: 'icon-close-solid',
    variation,
    autoDismissTimeer: timer,
  };

  return <Toast {...toastProps} />;
};
VisaToast.propTypes = {
  alert: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
  variation: PropTypes.string,
  timer: PropTypes.number,
};

export default VisaToast;
