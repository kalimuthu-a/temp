import PropTypes from 'prop-types';
import React from 'react';
import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import { FormContextProvider } from './FormContext';
import Form from './Form';
import CargoHome from '../CargoContainer/Cargo/CargoForm';

const FormWrapper = ({ context = {} }) => {
  const { CARGO_HOME } = Pages;

  return (
    <FormContextProvider context={context}>
      {(window?.pageType === CARGO_HOME) ? (
        <CargoHome />
      ) : (
        <Form />
      )}
    </FormContextProvider>
  );
};

FormWrapper.propTypes = {
  context: PropTypes.object,
};

export default FormWrapper;
