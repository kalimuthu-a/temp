import React from 'react';
import PropTypes from 'prop-types';

const LinkHollow = ({
  link = '#',
  label,
  title,
  icon = 'icon-accordion-left-24',
  extraClasses = '',
  onClickHandler,
}) => (
  <a
    href={link}
    className={`${extraClasses} border border-primary-main w-100 d-flex align-items-center 
    justify-content-center rounded-pill
    py-3 px-6 py-md-4 px-md-16 align-self-md-start text-decoration-none bg-white
    text-action-selected text-center`}
    tabIndex="0"
    title={label}
    aria-label={title}
    target="_blank"
    rel="noreferrer"
    onClick={onClickHandler}
  >
    {label}
    {icon && <span className={`${icon} icon-size-md pe-none`} />}
  </a>
);

LinkHollow.propTypes = {
  link: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  extraClasses: PropTypes.string,
  title: PropTypes.string,
  onClickHandler: PropTypes.func,
};

export default LinkHollow;
