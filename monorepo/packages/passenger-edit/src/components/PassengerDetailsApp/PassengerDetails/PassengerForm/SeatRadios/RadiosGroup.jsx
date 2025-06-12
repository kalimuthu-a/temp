import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import './Radios.scss';
import RadioInput from './RadioInput/RadioInput';

const RadiosGroup = (props) => {
  const {
    items,
    errors,
    register,
    cardIndex,
    disabled,
    fieldName,
    className,
    hideCardDetails,
  } = props;

  const name = `userFields.${cardIndex}.${fieldName}`;
  const useFormErrorMsg = errors?.userFields?.[cardIndex]?.[fieldName]?.message;
  const classNameV2 = hideCardDetails ? 'extra-seats-on-accordion-close' : '';

  return (
    <div className={!hideCardDetails ? 'mb-12' : 'ms-12 mt-4'}>
      <div className={`d-flex flex-wrap row-gap-8 column-gap-8 column-gap-md-16 mb-8 justify-content-start ${className} ${classNameV2}`}>
        {items?.map((item) => {
          return (
            <RadioInput
              id={name}
              key={uniq()}
              item={item}
              name={name}
              disabled={disabled}
              register={register}
              {...props}
            />
          );
        })}
      </div>
      {useFormErrorMsg
        ? <span className="radio-box-group-error-msg body-small-regular ms-4">{useFormErrorMsg} </span>
        : ''}
    </div>
  );
};

RadiosGroup.propTypes = {
  items: PropTypes.shape([]).isRequired,
  cardIndex: PropTypes.string,
  value: PropTypes.shape({ value: '', label: '' }),
  register: PropTypes.func,
  disabled: PropTypes.bool,
  fieldName: PropTypes.string,
  className: PropTypes.string,
  classNameV2: PropTypes.string,
  hideCardDetails: PropTypes.bool,
  errors: PropTypes.shape({ userFields: [] }),
};

export default RadiosGroup;
