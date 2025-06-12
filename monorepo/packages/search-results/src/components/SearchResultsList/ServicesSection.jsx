import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';

const ServicesSection = ({ serviceKey, services }) => {
  return (
    <div>
      <div className={`line-bg heading-${serviceKey}`} />
      {services.map(({ icon, value }) => (
        <div
          className="fare-details__single"
          key={uniq()}
          style={{ visibility: value ? 'visible' : 'hidden' }}
        >
          <Icon className={icon} size="sm" />
          <HtmlBlock html={value} className="body-extra-small-regular" />
        </div>
      ))}
    </div>
  );
};

ServicesSection.propTypes = {
  serviceKey: PropTypes.any,
  services: PropTypes.array,
};

export default ServicesSection;
