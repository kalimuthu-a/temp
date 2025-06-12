import React from 'react';
import { MyBookingsContextProvider } from './MyBookingsContext';
import MyBookingsInit from './MyBookingsInit';

const MyBookingsPage = () => {
  return (
    <MyBookingsContextProvider>
      <MyBookingsInit />
    </MyBookingsContextProvider>
  );
};

export default MyBookingsPage;
