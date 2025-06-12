import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import FormCheckBox from 'skyplus-design-system-app/src/components/FormCheckBox/FormCheckBox';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import { AppContext } from '../../../../../context/appContext';
import { ALREADY_OPT } from '../../../../../constants/constants';

const SpecialAssistanceOptions = ({ optionsName, formOptions, options, guidelinesTextDescription }) => {
  const { register } = useFormContext();
  const {
    state: {
      aemMainData: { specialAssistanceDetails },
    },
  } = useContext(AppContext);

  return (
    <div className="special-assistance__options bg-white p-8 d-flex flex-column gap-8">
      <div className="sh7">
        {specialAssistanceDetails?.specialAssistanceOptionsTitle}
      </div>
      <div className="special-assistance__dashed-card d-flex flex-column gap-4 rounded flex-md-row gap-md-12 p-4">
        <div className="special-assistance__options d-flex flex-column gap-6">
          {options?.map(
            ({ title, key, AlreadyOpt, Required }) => {
              const keyDisabled = formOptions[`${camelCase(key)}${ALREADY_OPT}`];
              if (!Required) return undefined;
              return (
                <FormCheckBox
                  key={key}
                  id={key}
                  containerClass="d-flex gap-4 align-items-center mb-6"
                  register={register}
                  registerKey={`${optionsName}.${key}`}
                  registerOptions={{
                    disabled: keyDisabled,
                    value: AlreadyOpt,
                  }}
                >
                  <div
                    className={`special-assistance__options-label body-small-regular  ${
                      keyDisabled ? 'text-disabled' : 'text-secondary'
                    }`}
                  >
                    {title}
                  </div>
                </FormCheckBox>
              );
            },
          )}
        </div>
      </div>
      {guidelinesTextDescription?.html && (
      <div
        className="body-small-regular text-secondary"
        dangerouslySetInnerHTML={{
          __html: guidelinesTextDescription?.html,
        }}
      />
      )}
    </div>
  );
};

SpecialAssistanceOptions.propTypes = {
  optionsName: PropTypes.string,
  formOptions: PropTypes.object,
  options: PropTypes.array,
  guidelinesTextDescription: PropTypes.object,
};

export default SpecialAssistanceOptions;
