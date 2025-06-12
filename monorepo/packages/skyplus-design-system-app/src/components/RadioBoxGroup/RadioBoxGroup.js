import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import RadioBox from '../RadioBox/RadioBox';
import { a11y } from '../../functions/globalConstants';

const RadioBoxGroup = ({
  items,
  name,
  selectedValue,
  containerClassName,
  onChange,
  fieldName,
  disableRadios,
  register = () => {},
  errors = [],
}) => {
  const useFormErrorMsg = errors?.[fieldName || name]?.message;

  const ref = useRef(null);

  const onKeyUpHandler = (e) => {
    const { key, currentTarget } = e;
    const radioEle = document?.activeElement?.parentElement;

    if (!radioEle) return;

    if (key === a11y.key.arrowleft) {
      if (radioEle.previousElementSibling) {
        radioEle.previousElementSibling.querySelector('.custom-radio').focus();
      } else {
        currentTarget
          .querySelector('.radio-label:last-child .custom-radio')
          .focus();
      }
    }

    if (key === a11y.key.arrowright) {
      if (radioEle.nextElementSibling) {
        radioEle.nextElementSibling.querySelector('.custom-radio').focus();
      } else {
        currentTarget
          .querySelector('.radio-label:first-child .custom-radio')
          .focus();
      }
    }
  };

  return (
    <div tabIndex={0} role="radiogroup" ref={ref} onKeyUp={onKeyUpHandler}>
      <div className={containerClassName}>
        {items?.map((item, key) => {
          const { label, value, disabled } = item;
          const id = `radio-input-${name}-${value}`;
          return (
            <RadioBox
              onChange={onChange}
              value={value}
              name={name}
              id={id}
              checked={value === selectedValue}
              disabled={disabled || disableRadios}
              register={register}
              tabIndex={key + 1}
              role="radio"
              aria-labelledby={id}
              data-value={value}
            >
              <span className={`label ${disabled ? 'disabled-label' : ''}`}>
                {label}
              </span>
            </RadioBox>
          );
        })}
      </div>
      {useFormErrorMsg ? (
        <span className="radio-box-group-error-msg">{useFormErrorMsg} </span>
      ) : (
        ''
      )}
    </div>
  );
};

RadioBoxGroup.propTypes = {
  containerClassName: PropTypes.any,
  items: PropTypes.array,
  selectedValue: PropTypes.any,
  onChange: PropTypes.func,
  name: PropTypes.string,
  fieldName: PropTypes.string,
  errors: PropTypes.any,
  register: PropTypes.func,
  disableRadios: PropTypes.bool,
};

export default RadioBoxGroup;
