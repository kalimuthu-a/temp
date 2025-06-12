import React from 'react';
import { useForm } from 'react-hook-form';
import FormMultiRadio from './FormMultiRadio';

export default {
  title: 'Skyplus/FormMultiRadio',
  component: FormMultiRadio,
};

export const Default = () => {
  const { register } = useForm({
    defaultValues: {
      journeys: [],
    },
  });

  const journeys = ['All', 'DEL-BOM', 'BOM-DEL'];

  return (
    <>
      {journeys.map((journey) => (
        <FormMultiRadio
          key={journey}
          containerClass=""
          id={journey}
          placeholder={journey}
          register={register}
          registerKey="journeys"
        >
          {journey}
        </FormMultiRadio>
      ))}
    </>
  );
};
