import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

const TabButton = (props) => {
  const { isActive, onChangeTab, title, description, checked } = props;
  return (
    <li className={`${isActive ? 'active' : ''} ${checked ? 'checked' : ''}`}>
      <Button
        onClick={onChangeTab}
        variant={isActive ? 'filled' : 'outline'}
        color="primary"
        size="small"
        containerClass="tab-container__btn"
      >
        <div className="tab-container__btn-title">
          {title}
          {!description && checked && <i className="icon-check" />}
        </div>
        {description && (
          <>
            <div className="tab-container__btn-desc">{description}</div>
            {checked && <i className="icon-check" />}
          </>
        )}
      </Button>
    </li>
  );
};

TabButton.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  checked: PropTypes.bool,
  isActive: PropTypes.element,
  onChangeTab: PropTypes.func,
};

export default TabButton;
