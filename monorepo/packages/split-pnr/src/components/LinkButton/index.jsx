import React from 'react';
import PropTypes from 'prop-types';

const classNameText = 'split-pnr--button-container';

const LinkButton = ({ buttonText, containerClass, className, iconClass, onButtonClick }) => (
  buttonText && (
    <div className={`${classNameText} ${containerClass}`}>
      <button type="button" className={`${classNameText}--link ${className}`} onClick={onButtonClick}>
        {iconClass && <i className={`${iconClass} ${classNameText}--icon`} />}
        <span>{buttonText}</span>
      </button>
    </div>
  )
);

LinkButton.propTypes = {
  buttonText: PropTypes.string,
  containerClass: PropTypes.string,
  className: PropTypes.string,
  iconClass: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default LinkButton;
