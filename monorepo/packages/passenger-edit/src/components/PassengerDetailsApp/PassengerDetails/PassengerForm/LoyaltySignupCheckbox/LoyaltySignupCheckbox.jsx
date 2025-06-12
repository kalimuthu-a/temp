import React, { useContext, useEffect } from 'react';
import sanitizeHtml from 'skyplus-design-system-app/dist/des-system/sanitizeHtml';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { AppContext } from '../../../../../context/appContext';
import FormCheckBox from '../FormCheckBox/FormCheckBox';
import './LoyaltySignupCheckbox.scss';

const LoyaltySignupCheckbox = ({ hideCardDetails,
  ffName,
  hidden,
  loyaltySignupName,
  disabled,
  onEveryInputChange,
}) => {
  const { state: { aemMainData },
  } = useContext(AppContext);

  const { watch, register } = useFormContext();

  const { usePaxDetailsForLoyalty } = aemMainData;
  const { note, description, title } = usePaxDetailsForLoyalty || {};
  const loyaltyDescription = sanitizeHtml(description?.html);

  const ffNumber = watch(ffName) || '';
  const loyaltySignup = watch(loyaltySignupName) || false;

  useEffect(() => {
    if (!loyaltySignup) onEveryInputChange(loyaltySignupName, false);
  }, [ffNumber, loyaltySignupName]);

  return (
    <div className={hideCardDetails || hidden ? 'd-none' : ''}>
      <FormCheckBox
        key={loyaltySignupName}
        id={loyaltySignupName}
        containerClass={`w-100 d-flex
      flex-row-reverse justify-content-between align-items-center
      text-primary body-medium-regular mb-8`}
        register={register}
        registerKey={loyaltySignupName}
        inputProps={{ disabled, className: `${disabled ? 'disabledClass' : ''}` }}
        variant="v2"
      >
        <div className={`link-small ${disabled ? 'title-disabled' : ''}`}>{title}</div>
      </FormCheckBox>
      <div className="p-6 note">
        <div className="body-regular text-primary mb-6">{note}</div>
        <div
          className="body-regular text-secondary"
          dangerouslySetInnerHTML={{
            __html: loyaltyDescription,
          }}
        />
      </div>
    </div>
  );
};

LoyaltySignupCheckbox.propTypes = {
  hideCardDetails: PropTypes.bool,
  ffName: PropTypes.string,
  hidden: PropTypes.bool,
  loyaltySignupName: PropTypes.string,
  disabled: PropTypes.bool,
  onEveryInputChange: PropTypes.func,
};

export default LoyaltySignupCheckbox;
