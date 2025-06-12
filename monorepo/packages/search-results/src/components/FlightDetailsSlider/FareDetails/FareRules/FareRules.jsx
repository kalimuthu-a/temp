import PropTypes from 'prop-types';
import React from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const FareRules = ({ services }) => {
  return (
    <div className="fare-rules">
      {services.map((service) => (
        <div
          className="fare-rules__rule d-flex align-items-center"
          key={service.value}
        >
          <i className={`sky-icons ${service.icon} sm`} />
          <HtmlBlock className="body-small-regular" html={service.value} />
        </div>
      ))}
    </div>
  );
};

FareRules.propTypes = {
  services: PropTypes.array,
};

export default FareRules;
