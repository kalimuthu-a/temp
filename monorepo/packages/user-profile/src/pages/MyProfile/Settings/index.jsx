import React from 'react';
import { SettingsProvider } from './SettingsContext';
import Settings from './Settings';

const SettingsPage = () => {
  return (
    <SettingsProvider>
      <Settings />
    </SettingsProvider>
  );
};

export default SettingsPage;
