import React from 'react';
import { PassengerProvider } from './PassengerContext';
import SavedPassengers from './SavedPassengers';

const SavedPassengersPage = () => {
  return (
    <PassengerProvider>
      <SavedPassengers />
    </PassengerProvider>
  );
};

export default SavedPassengersPage;
