import React, { useMemo, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

import FormField from '../WebCheckIn/FormField';
import { regexConstant } from '../../constants';
import useAppContext from '../../hooks/useAppContext';
import { webcheckinActions } from '../../context/reducer';
import { getItinerary } from '../../services';

const RetrivePnrForm = () => {
  const { dispatch, aemLabel } = useAppContext();

  const aemLabels = useMemo(() => {
    return {
      pnrBookingReference: aemLabel('checkinHome.pnrBookingReference'),
      emailIdLastName: aemLabel('checkinHome.emailIdLastName'),
      getStartedLabel: aemLabel('checkinHome.getStartedLabel'),
    };
  }, [aemLabel]);

  const [data, setData] = useState({
    recordLocator: '',
    lastName: '',
    errors: {
      recordLocator: true,
    },
  });

  function validatePNR(pnr) {
    // Check if PNR matches the expected format (e.g., 6 alphanumeric characters)
    return /^[A-Z0-9]{6}$/i.test(pnr);
  }

  const validateForm = (formData) => {
    const obj = {};

    if (!validatePNR(formData.recordLocator)) {
      obj.recordLocator = true;
    }

    if (
      !regexConstant.ONLY_CHARS_FIELD.test(formData?.lastName) &&
      !regexConstant.EMAIL.test(formData?.lastName)
    ) {
      obj.lastName = true;
    }

    return obj;
  };

  const onChangeForm = (e) => {
    const { name, value } = e.target;

    const formTemp = { ...data, [name]: value };
    const errors = validateForm(formTemp);

    setData({
      ...formTemp,
      errors,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: webcheckinActions.SHOW_LOADER, payload: true });

    try {
      const response = await getItinerary({
        recordLocator: data.recordLocator,
        lastName: data.lastName,
        processFlag: 'checkin',
      });

      if (response?.data?.success) {
        window.location.href = aemLabel('checkinHome.getStartedLink');
      } else {
        dispatch({
          type: webcheckinActions.SET_TOAST,
          payload: {
            variation: 'Error',
            show: true,
            description: response?.aemError?.message,
          },
        });
      }
    } catch (error) {
      const { aemError } = error;

      dispatch({
        type: webcheckinActions.SET_TOAST,
        payload: {
          variation: 'Error',
          show: true,
          description: aemError.message,
        },
      });
    } finally {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <FormField
        fieldConfig={{
          fieldType: 'text',
          placeholder: aemLabels.pnrBookingReference,
          maxLength: 6,
        }}
        data={data}
        errors={{}}
        onChange={onChangeForm}
        fieldName="recordLocator"
      />
      <FormField
        fieldConfig={{
          fieldType: 'text',
          placeholder: aemLabels.emailIdLastName,
          maxLength: 50,
        }}
        data={data}
        errors={{}}
        onChange={onChangeForm}
        fieldName="lastName"
      />
      <Button
        block
        disabled={Object.keys(data.errors).length > 0}
        type="submit"
      >
        {aemLabels.getStartedLabel}
      </Button>
    </form>
  );
};

RetrivePnrForm.propTypes = {};

export default RetrivePnrForm;
