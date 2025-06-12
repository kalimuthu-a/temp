/* eslint-disable max-len */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from '../../functions/sanitizeHtml';
import checkedIcon from '../../images/checked.svg';
import unCheckedIcon from '../../images/unChecked.svg';
import unCheckedDisabledIcon from '../../images/unCheckedDisabled.svg';

const CheckBoxV2 = (props) => {
  const {
    containerClass,
    descClass,
    id,
    name,
    value,
    title,
    image,
    checked,
    description,
    onChangeHandler,
    // register = () => {},
    required,
    disabled,
  } = props;
  const descriptionHtml = sanitizeHtml(description);
  if (!onChangeHandler) {
    return '';
  }

  const { imgIcon, imgAlt } = useMemo(() => {
    if (disabled) {
      return { imgIcon: unCheckedDisabledIcon, imgAlt: 'disabled' };
    }

    if (!checked) {
      return { imgIcon: unCheckedIcon, imgAlt: 'unchecked' };
    }

    return { imgIcon: checkedIcon, imgAlt: 'checked' };
  }, [checked, disabled]);

  return (
    <div
      className={`skyplus-checkbox-v2 d-flex gap-4 align-items-start justify-content-left ${containerClass}`}
    >
      <div>
        <input
          type="checkbox"
          name={name}
          id={id}
          value={value}
          checked={checked}
          required={required}
          onChange={onChangeHandler}
          className="d-none"
          aria-hidden="true"
          disabled={disabled}
        />
        <span
          role="checkbox"
          aria-checked={checked}
          aria-label={description || ''}
          id={`${id}-label`}
          tabIndex={0}
          className="cursor"
          {
            ...(!disabled && {
              onClick: () => onChangeHandler(!checked),
            })
          }
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              if (!disabled) {
                onChangeHandler(!checked);
              }
            }
          }}
        >
          <img src={imgIcon} alt={imgAlt} />
        </span>
      </div>
      <div>
        {title ? (
          <div className="d-flex align-items-center">
            {title}
            {image ? <img alt={name} src={image} className="ps-2 skyplus-checkbox-v2__img" /> : null}
          </div>
        ) : null}
        <div>
          {descriptionHtml ? (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label
              className={descClass}
              htmlFor={id}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

CheckBoxV2.defaultProps = {
  checked: false,
  descClass: 'body-small-regular',
  required: false,
  disabled: false,
};

CheckBoxV2.propTypes = {
  containerClass: PropTypes.string,
  checked: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChangeHandler: PropTypes.func,
  description: PropTypes.string,
  descClass: PropTypes.string,
  required: PropTypes.bool,
  title: PropTypes.string,
  image: PropTypes.string,
  // register: PropTypes.any,
  disabled: PropTypes.bool,
};

export default CheckBoxV2;
