import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

const DoubleTabButton = (props) => {
  const { isActive, onChangeTab, disabled, title } = props;
  return (
    <li className={`${isActive ? 'active' : ''}`}>
      <Button
        onClick={!disabled ? onChangeTab : ''}
        variant={isActive ? 'filled' : 'outline'}
        color="primary"
        size="small"
        disabled={disabled}
        containerClass="double-tab-container__btn"
      >
        <div
          className="double-tab-container__btn-title"
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
      </Button>
    </li>
  );
};

DoubleTabButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  isActive: PropTypes.element,
  onChangeTab: PropTypes.func,
};

export default DoubleTabButton;
