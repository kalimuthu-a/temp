import React from 'react';
import { useForm } from 'react-hook-form';
import FormRadio from './FormRadio';

export default {
  title: 'Skyplus/FormRadio',
  component: FormRadio,
};

export const Default = () => {
  const { register } = useForm({
    defaultValues: {
      checked: '',
    },
  });

  return (
    <FormRadio
      containerClass=""
      id="agree"
      value="agree"
      register={register}
      registerKey="radioKey"
    >
      Agree
    </FormRadio>
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
        <FormRadio
          containerClass=""
          id={journey}
          value={journey}
          register={register}
          registerKey="journey"
        >
          {journey}
        </FormRadio>
      ))}
    </>
  );
};
