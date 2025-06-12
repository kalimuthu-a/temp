import PropTypes from 'prop-types';
import React from 'react';
import CheckBox from '../CheckBox/CheckBox';
import { a11y } from '../../functions/globalConstants';

const NextChip = ({
  children,
  withCheckbox,
  withBorder,
  onClick = () => {},
  ...props
}) => {
  const border = withBorder ? 'withBorder' : '';
  const className = `skyplus-chip--next ${border}`;

  /**
   * @type {React.KeyboardEventHandler<HTMLDivElement>}
   */
  const onKeyDownHandler = (e) => {
    if (e.key === a11y.key.enter) {
      onClick();
    }
  };

  return (
    <div
      className={className}
      onClick={onClick}
      role="button"
      onKeyDown={onKeyDownHandler}
      tabIndex={0}
      {...props}
    >
      {withCheckbox && <CheckBox checked defaultChecked />}
      <span>{children}</span>
    </div>
  );
};

NextChip.defaultProps = {
  onClick: () => {},
  withBorder: false,
  withCheckbox: false,
};

NextChip.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.any,
  withBorder: PropTypes.any,
  withCheckbox: PropTypes.bool,
};

export default NextChip;
