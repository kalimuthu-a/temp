import React from 'react';
import { CorpConnectProvider } from './CorpConnectContext';
import CorpConnect from './CorpConnect';

const CorpConnectPage = () => {
  return (
    <CorpConnectProvider>
      <CorpConnect />
    </CorpConnectProvider>
  );
};

export default CorpConnectPage;
