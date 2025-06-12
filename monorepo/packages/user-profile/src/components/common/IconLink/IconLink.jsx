import React from 'react';
import PropTypes from 'prop-types';

const IconLink = ({ icon, title, subTitle, link = '#', newTab, containerClass = 'mt-6 px-8 py-6' }) => {
  return (
    <div className={`bg-white rounded-3 ${containerClass}`}>
      <a href={link} title={title} className="d-flex gap-6 text-decoration-none align-items-center">
        <div className="">
          <span className={`d-block p-5 rounded-circle bg-secondary-light icon-size-md ${icon}`} />
        </div>
        <div>
          <p className="body-medium-light mb-3 text-primary">{title}</p>
          <p className="body-small-light text-tertiary">{subTitle}</p>
        </div>
        <span className="icon-accordion-left-24 icon-size-sm ms-md-auto" />
      </a>
    </div>
  );
};

IconLink.propTypes = {};

export default IconLink;
