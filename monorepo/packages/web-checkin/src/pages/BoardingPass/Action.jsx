import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Text from 'skyplus-design-system-app/dist/des-system/Text';

const Action = ({ label, icon, handleAction }) => {
  const onClickHandler = () => {
    handleAction(icon);
  };

  const onKeyUpHandler = () => {};

  return (
    <div
      className="boarding-action-item"
      tabIndex={0}
      onClick={onClickHandler}
      onKeyUp={onKeyUpHandler}
      role="button"
    >
      <Icon className={icon} />
      <Text variation="body-medium-regular">{label}</Text>
    </div>
  );
};

Action.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  handleAction: PropTypes.func,
};

export default Action;
