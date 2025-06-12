import React from 'react';
import { useForm } from 'react-hook-form';
import FormText from './FormText';

export default {
  title: 'Skyplus/FormText',
  component: FormText,
};

export const Default = () => {
  const { register } = useForm({
    defaultValues: {
      text: '',
    },
  });

  return (
    <FormText
      containerClass=""
      id="radio-1"
      value="radio-1"
      register={register}
      registerKey="text"
      label="radio-1"
    />
  );
};
