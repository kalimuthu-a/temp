import React from 'react';
import { MyGSTDetailsProvider } from './MyGSTDetailsContext';
import MyGSTDetails from './MyGSTDetails';

const MyGSTDetailsPage = () => {
  return (
    <MyGSTDetailsProvider>
      <MyGSTDetails />
    </MyGSTDetailsProvider>
  );
};

export default MyGSTDetailsPage;
