import React from 'react';
import PropTypes from 'prop-types';

function InfoBanner({ content = '', iconClass = 'icon-info', wrapperClass = '' }) {
  if (!content) return;
  return (
    <div className={`infobanner-iti ${wrapperClass}`}>
      <i className={`infobanner-iti-icon ${iconClass}`} />
      <span className="infobanner-iti-content">{content}</span>
    </div>
  );
}

InfoBanner.propTypes = {
  iconClass: PropTypes.string,
  content: PropTypes.any,
};

export default InfoBanner;
