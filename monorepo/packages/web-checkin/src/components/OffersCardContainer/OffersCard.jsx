import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

function OffersCard({ title, description, validity, className, imgSrc }) {
  return (
    <div
      className={`d-flex flex-column-reverse align-items-stretch rounded ${className}`}
    >
      <img src={imgSrc} alt="advertisment" />
      <div className="d-flex flex-column p-8 gradient-blur-card-dark rounded">
        <div className="h3 text-secondary-white">{title}</div>
        <div className="body-large-light my-2 text-secondary-white">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        {validity && (
          <div className="body-large-light my-2 text-secondary-white d-flex justify-content-between align-items-center">
            <div className="text-secondary-white">{validity}</div>
            <div className="right">
              <Icon className="icon-arrow-top-right" size="xs" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

OffersCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  validity: PropTypes.string,
  className: PropTypes.string,
  imgSrc: PropTypes.string,
};

export default OffersCard;
