import React from 'react';
import PropTypes from 'prop-types';
import './FlightButton.scss';

const FlightButton = ({
  icon = 'icon-flight-arrow',
  onClickHandler,
  children,
  link,
  containerCss = 'rounded-pill bg-other-background-blur',
  imgLink,
}) => {
  return (
    <a
      href={link || '#'}
      onClick={onClickHandler}
      className={`position-relative flight-button text-decoration-none border-0 p-2 ps-12 w-100 d-block overflow-hidden ${containerCss}`}
    >
      {imgLink ? <img className="flight-button__bg-img position-absolute start-0 top-0 w-100" src={imgLink} alt="bg image" /> : null}
      <div className="position-relative z-1 d-flex justify-content-between align-items-center gap-5">
        {children}
        <div className="bg-primary rounded-circle bg-primary-main p-5">
          <span className={`${icon} text-white`} />
        </div>
      </div>
    </a>
  );
};

FlightButton.propTypes = {};

export default FlightButton;
