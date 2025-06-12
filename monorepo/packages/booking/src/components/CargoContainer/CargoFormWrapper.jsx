import PropTypes from 'prop-types';
import React from 'react';
import CargoHome from './Cargo/CargoForm';
import { CargoProvider } from './CargoContext';

const CargoFormWrapper = ({ context = {} }) => {
  return (
    <CargoProvider context={context}>
      <CargoHome />
    </CargoProvider>
  );
};

CargoFormWrapper.propTypes = {
  context: PropTypes.object,
};

export default CargoFormWrapper;
