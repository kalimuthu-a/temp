import React from 'react';
import { useForm } from 'react-hook-form';
import FormCheckBox from './FormCheckBox';

export default {
  title: 'Skyplus/FormCheckBox',
  component: FormCheckBox,
};

const label = 'Agree';

export const Default = () => {
  const { register } = useForm({
    defaultValues: {
      checked: '',
    },
  });

  return (
    <FormCheckBox
      containerClass=""
      id="agree"
      placeholder="agree"
      register={register}
      registerKey="radioKey"
    >
      {label}
    </FormCheckBox>
  );
};

export const Group = () => {
  const { register } = useForm({
    defaultValues: {
      journey: '',
    },
  });

  const journeys = ['All', 'DEL-BOM', 'BOM-DEL'];

  return (
    <>
      {journeys.map((journey) => (
        <FormCheckBox
          containerClass=""
          id={journey}
          placeholder={journey}
          register={register}
          registerKey="journey"
        >
          {journey}
        </FormCheckBox>
      ))}
    </>
  );
};

export const V2 = () => {
  const { register } = useForm({
    defaultValues: {
      checked: '',
    },
  });

  return (
    <FormCheckBox
      containerClass=""
      id="agree"
      placeholder="agree"
      register={register}
      registerKey="radioKey"
      variant="v2"
    >
      {label}
    </FormCheckBox>
  );
};
