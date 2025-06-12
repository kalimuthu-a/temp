import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../SeatRadios/Radios.scss';

const GenderRadios = (props) => {
  const {
    items,
    errors,
    register,
    cardIndex,
    disabled,
    fieldName,
    className,
    required,
    selectedValue,
    onEveryInputChange,
  } = props;

  const [fieldValue, setFieldValue] = useState(selectedValue || '');
  const name = `userFields.${cardIndex}.${fieldName}`;
  const useFormErrorMsg = errors?.userFields?.[cardIndex]?.[fieldName]?.message;
  const refs = useRef(items.map(() => React.createRef()));
  const [checkedIndex, setCheckedIndex] = useState(null);

  const onChangeHandler = (e, index) => {
    const val = e.target.value;
    setFieldValue(val || '');
    onEveryInputChange(name, val || '');
    setCheckedIndex(index);
  };

  useEffect(() => {
    setFieldValue(selectedValue || '');
    onEveryInputChange(name, selectedValue || '');
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
      const nextInput = refs.current[nextIndex]?.current?.querySelector('input');
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [checkedIndex]);

  if (!items.length) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className={`d-flex flex-wrap gap-12 gap-md-16 mb-12 justify-content-md-start ${className}`}>
        {items.map((item, index) => {
          const isDisabled = disabled || item.disabled;
          const disabledClass = isDisabled ? 'radio-disabled' : '';
          const isChecked = fieldValue === item?.value;
          const isCheckedClass = isChecked ? 'radio-checked' : '';
          const uniqueId = `${name}-${item.value}`;

          return (
            <div
              key={uniqueId}
              className={`d-flex flex-wrap align-items-center ms-8 ${disabledClass} ${isCheckedClass}`}
              ref={refs.current[index]}
            >
              <input
                id={uniqueId}
                name={name}
                type="radio"
                value={item.value}
                checked={isChecked}
                disabled={isDisabled}
                className="custom-radio-btn"
                aria-label={item.label}
                {...register(name, { required,
                  value: item.value,
                  onChange: (e) => onChangeHandler(e, index) })}
              />
              <label
                htmlFor={uniqueId}
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
  register: PropTypes.func,
  selectedValue: PropTypes.string,
  disabled: PropTypes.bool,
  fieldName: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.string,
  onEveryInputChange: PropTypes.func,
  errors: PropTypes.shape({ userFields: [] }),
};

export default GenderRadios;
