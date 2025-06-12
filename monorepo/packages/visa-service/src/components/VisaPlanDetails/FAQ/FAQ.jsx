import React, { useState } from 'react';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import PropTypes from 'prop-types';

const FAQ = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const accordionData = Object.keys(data || {}).map((key) => ({
    title: key,
    renderAccordionContent: <p className="faq-content">{data[key]}</p>,
  }));

  const props = {
    accordionData,
    activeIndex,
    setActiveIndex,
  };
  return (
    <div className="faq">
      <Accordion {...props} />
    </div>
  );
};

FAQ.propTypes = {
  data: PropTypes.any,
};

export default FAQ;
