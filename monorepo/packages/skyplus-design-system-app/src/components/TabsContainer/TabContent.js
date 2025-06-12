import React from 'react';
import PropTypes from 'prop-types';

const TabContent = (props) => {
  const { children } = props;
  return <div className="tab-container__content">{children}</div>;
};

TabContent.propTypes = {
  children: PropTypes.element,
};

export default TabContent;
