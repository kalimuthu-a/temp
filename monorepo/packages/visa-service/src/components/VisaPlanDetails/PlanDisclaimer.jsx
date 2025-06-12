import React from 'react';
import PropTypes from 'prop-types';

const PlanDisclaimer = ({ disclaimer }) => {
  const listItem = (item) => {
    return (<li key={item}>{item}</li>);
  };

  return (
    <div>
      <ul>
        {disclaimer?.map((items) => listItem(items))}
      </ul>
    </div>
  );
};

PlanDisclaimer.propTypes = {
  disclaimer: PropTypes.array,
};

export default PlanDisclaimer;
