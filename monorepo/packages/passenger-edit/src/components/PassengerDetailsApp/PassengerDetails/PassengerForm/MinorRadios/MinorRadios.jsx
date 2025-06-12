import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import '../SeatRadios/Radios.scss';

const GenderRadios = (props) => {
  const {
    items,
    errors,
    cardIndex,
    disabled,
    fieldName,
    className,
    selectedValue,
    onEveryInputChange,
  } = props;

  const [fieldValue, setFieldValue] = useState('');
  const name = `userFields.${cardIndex}.${fieldName}`;
  const useFormErrorMsg = errors?.userFields?.[cardIndex]?.[fieldName]?.message;
  const refs = useRef(items.map(() => React.createRef()));
  const [checkedIndex, setCheckedIndex] = useState(null);

  const onChangeHandler = (e, index) => {
    const val = e.target.value;
    setFieldValue(val);
    onEveryInputChange(name, val);
    setCheckedIndex(index);
  };

  useEffect(() => {
    setFieldValue(selectedValue);
  }, [selectedValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const activeIndex = refs.current.findIndex(
        (ref) => ref.current && ref.current.contains(document.activeElement),
      );
      if (activeIndex === -1 || (checkedIndex !== null && checkedIndex === activeIndex)) {
        return;
      }
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % refs.current.length;
      const nextInput = refs?.current?.[nextIndex]?.current?.querySelector('input');
      nextInput?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [checkedIndex]);

  const getCheckedClass = (isChecked, isDisabled) => {
    let checkedClass = '';
    if (isChecked && isDisabled) {
      checkedClass = '';
    } else if (isChecked) {
      checkedClass = 'radio-checked';
    } else {
      checkedClass = '';
    }
    return checkedClass;
  };

  return (
    <div className="mb-12">
      <div className={`d-flex flex-wrap gap-12 gap-md-16 mb-12 justify-content-md-start ${className}`}>
        {items.map((item, index) => {
          const isDisabled = disabled || item.disabled;
          const disabledClass = isDisabled ? 'radio-disabled' : '';
          const isChecked = fieldValue === item?.value;
          const isCheckedClass = getCheckedClass(isChecked, isDisabled);

          return (
            <div
              key={uniq()}
              className={`d-flex flex-wrap align-items-center ms-8 ${disabledClass} ${isCheckedClass}`}
              ref={refs.current[index]}
            >
              <input
                id={item.value}
                name={name}
                type="radio"
                value={item.value}
                checked={isChecked}
                disabled={isDisabled}
                className="custom-radio-btn"
                aria-label={item.label}
                onChange={(e) => onChangeHandler(e, index)}
              />
              <label
                htmlFor={item.value}
                className="custom-radio-label body-small-regular text-capitalize"
              >
                {item.label}
              </label>
            </div>
          );
        })}
      </div>
      {useFormErrorMsg
        ? <span className="radio-box-group-error-msg body-small-regular ms-4">{useFormErrorMsg} </span>
        : ''}
    </div>
  );
};

GenderRadios.propTypes = {
  items: PropTypes.shape([]).isRequired,
  cardIndex: PropTypes.string,
  value: PropTypes.shape({ value: '', label: '' }),
  selectedValue: PropTypes.string,
  disabled: PropTypes.bool,
  fieldName: PropTypes.string,
  className: PropTypes.string,
  onEveryInputChange: PropTypes.func,
  errors: PropTypes.shape({ userFields: [] }),
};

export default GenderRadios;
