import React from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import PropTypes from 'prop-types';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import successGIF from '../../../styles/images/success-image.gif';

function SuccessErrorConfirmPopup({ description, title }) {
  const [isMobile] = useIsMobile();
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="success-error-message-container__top-div" />
      <div className="mt-8">
        <HtmlBlock html={description?.html} className={`text-center ${!isMobile ? 'h3' : 'h4'}`} />
        <HtmlBlock html={title} className="body-large-regular text-center" />
      </div>
      <div className="mt-8">
        <img src={successGIF} alt="Success GIF" loading="lazy" />
      </div>
    </div>
  );
}

SuccessErrorConfirmPopup.propTypes = {
  title: PropTypes.string,
  description: PropTypes.object,
};

export default SuccessErrorConfirmPopup;
