import React from 'react';
import VisaResult from './VisaResult';
import useSidePanelAdjustments from '../../hook/useSidePanelAdjustments';
import VisaHeaderSection from '../commonComponents/VisaHeaderSection/VisaHeaderSection';

const VisaSrp = () => {
  // side pannel adjustment
  useSidePanelAdjustments(true);
  return (
    <div className="visa-srp">
      <VisaHeaderSection headingText="srp" />
      <VisaResult />
    </div>
  );
};

export default VisaSrp;
