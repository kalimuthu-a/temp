import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import { useFormContext } from 'react-hook-form';
import { AppContext } from '../../../../../context/appContext';
import SpecialAssistanceSlider from './SpecialAssistanceSlider';
import { ALREADY_OPT, IS_REQUIRED } from '../../../../../constants/constants';

const Label = ({
  onClick,
  optionsName,
  formOptions,
  onCloseLabel,
  disabled,
  wheelChairAssistanceLevel,
  wheelchairReasonName,
}) => {
  const { setValue, getValues } = useFormContext();
  const {
    state: {
      aemMainData: { specialAssistanceDetails },
    },
  } = useContext(AppContext);

  const options = specialAssistanceDetails?.specialAssistanceOptions || [];
  const categories = [];
  options.forEach((oItem) => {
    const item = oItem;
    const optKey = `${camelCase(oItem.key)}${ALREADY_OPT}`;
    const requiredKey = `${camelCase(oItem.key)}${IS_REQUIRED}`;
    item[ALREADY_OPT] = formOptions?.[optKey];
    item[IS_REQUIRED] = formOptions?.[requiredKey];
    item.selected = formOptions?.[oItem.key];
    categories.push(item);
  });

  const opted = categories?.filter((item) => item?.[ALREADY_OPT] || item.selected);
  const wheelchairCheck = specialAssistanceDetails?.specialAssistanceOptions[4]?.key;
  const clickHandler = (e, val) => {
    e.stopPropagation();
    setValue(`${optionsName}.${val}`, false);
    if (val === wheelchairCheck) {
      setValue(wheelChairAssistanceLevel, null);
      setValue(wheelchairReasonName, null);
    }
    onCloseLabel(getValues(optionsName));
  };

  return (
    <div
      className={`${disabled ? 'special-assistance-disabled__label' : 'special-assistance__label'} 
      text-secondary border-0 w-100 d-flex flex-column gap-6 rounded p-6 flex-md-row text-capitalize`}
      role="button"
      onClick={onClick}
      onKeyDown={onClick}
      tabIndex={0}
    >
      <div
        className="mh-100 d-flex flex-column flex-md-row align-items-md-center w-100 justify-content-between gap-6"
      >
        <div className="d-flex justify-content-between align-items-center w-100 gap-6">
          <div className="text-start link-small">
            {specialAssistanceDetails?.label}
          </div>
          {!!opted.length && (
            <SpecialAssistanceSlider
              onClick={clickHandler}
              containerClass="d-none d-md-flex body-small-regular"
              categories={opted}
            />
          )}
          {opted.length ? (
            <span
              className="special-assistance__label-btn text-uppercase body-medium-medium text-decoration-underline"
              onClick={onClick}
              aria-hidden="true"
            >
              {specialAssistanceDetails?.editLabel}
            </span>
          ) : (
            <span
              className="special-assistance__label-btn icon-add-circle"
              onClick={onClick}
              aria-hidden="true"
            />
          )}
        </div>
        {!!opted.length && (
          <SpecialAssistanceSlider
            onClick={clickHandler}
            containerClass="d-flex d-md-none body-small-regular"
            categories={opted}
          />
        )}
      </div>
    </div>
  );
};

Label.propTypes = {
  onClick: PropTypes.func,
  optionsName: PropTypes.string,
  formOptions: PropTypes.object,
  onCloseLabel: PropTypes.func,
  disabled: PropTypes.bool,
  wheelChairAssistanceLevel: PropTypes.string,
  wheelchairReasonName: PropTypes.string,
};

export default Label;
