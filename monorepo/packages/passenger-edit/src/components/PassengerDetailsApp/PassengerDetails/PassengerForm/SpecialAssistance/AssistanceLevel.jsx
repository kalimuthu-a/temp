import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormRadio from 'skyplus-design-system-app/src/components/FormRadio/FormRadio';
import { useFormContext } from 'react-hook-form';

const AssistanceLevel = ({ options, title, wheelChairAssistanceLevel }) => {
  const { register } = useFormContext();
  return (
    <div className="special-assistance__card bg-white p-8 d-flex flex-column gap-2 position-relative">
      <div className="special-assistance__heading body-medium-large">
        {title}
      </div>
      <div className="special-assistance__dashed-card d-flex flex-column gap-4 rounded px-4 py-2 flex-md-row gap-md-12">
        <div
          className="w-100 d-flex flex-wrap gap-4 column-gap-md-12 flex-column
          body-small-regular flex-md-row"
        >
          {options?.map(({ key, title: label }) => {
            return (
              <FormRadio
                key={key}
                id={key}
                register={register}
                registerKey={wheelChairAssistanceLevel}
                value={label}
                containerClass="d-flex gap-3"
              >
                {label}
              </FormRadio>
            );
          })}
        </div>
      </div>
    </div>
  );
};

AssistanceLevel.propTypes = {
  options: PropTypes.array,
  title: PropTypes.string,
  wheelChairAssistanceLevel: PropTypes.string,
};
export default AssistanceLevel;
