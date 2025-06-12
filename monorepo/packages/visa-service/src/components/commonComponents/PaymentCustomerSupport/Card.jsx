import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ header, subHeader, children }) => {
  return (
    <div className="card box-shadow-card-soft">
      <div className="title-container">
        <div className="title">{header}</div>
        <div className="subtitle">{subHeader}</div>
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  header: PropTypes.string,
  subHeader: PropTypes.string,
  children: PropTypes.any,
};

export default Card;
