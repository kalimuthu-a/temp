import React from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const InfoAlertPopup = ({
  title,
  description,
}) => {
  return (
    <div className="info-alert-popup">
      <div className="info-alert-popup__content">
        <div className="info-alert-popup__loader" />
        <div className="title">{title}</div>
        <HtmlBlock
          html={description?.html || ''}
          className="description"
        />
      </div>
    </div>
  );
};

InfoAlertPopup.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};
export default InfoAlertPopup;
