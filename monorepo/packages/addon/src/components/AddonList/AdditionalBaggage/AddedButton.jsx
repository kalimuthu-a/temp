import React, { useMemo } from 'react';
import PopOver from '../../../common/Popover/PopOver';
import { emptyFn } from '../../../functions/utils';

const AddedButton = ({
  onClickHandler,
  disabled,
  tooltipContent,
  addedLabel,
  withPopover = true,
}) => {
  const Button = useMemo(() => {
    return (
      <button
        className={`custom-button btn-added ${
				  disabled ? 'cursor-default' : 'cursor-pointer'
        } `}
        onClick={disabled ? emptyFn : onClickHandler}
      >
        <span className="addon-card__right__cta__add__icon indigoIcon" />
        <span className="addon-card__right__cta__added__name-ellipsis">
          {tooltipContent}
        </span>
        <span className="addon-card__right__cta__added__price">
          {addedLabel}
        </span>
        <span className="addon-card__right__cta__add__icon indigoIcon" />
      </button>
    );
  }, [disabled, onClickHandler, tooltipContent, addedLabel]);

  return withPopover ? (
    <PopOver
      tooltipContent={tooltipContent}
      withClose={false}
      className="text-left"
      TargetElem={Button}
    />
  ) : (
    Button
  );
};

AddedButton.defaultProps = {};
AddedButton.propTypes = {};

export default AddedButton;
