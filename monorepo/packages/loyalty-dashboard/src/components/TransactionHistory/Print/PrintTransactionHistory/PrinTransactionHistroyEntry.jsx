/* eslint-disable react/jsx-filename-extension */
import React, { forwardRef } from 'react';
import PrintLogo from './PrintLogoComp';
import PrintSummary from './PrintSummary';
import PrintTransactions from './PrintTransactions';

const PrinTransactionHistroyEntry = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="In6e2">
      <table>
        <thead>
          <tr>
            <td className="page-header-td">
              <div className="page-header-space" />
              {/* to allocate header space for the logo and time */}
              <div className="page-header">
                <PrintLogo />
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="page-content-td">
              {/* Wrap print content with tbody to allocate space - START */}
              <div className="page-content">
                <PrintSummary />
                <PrintTransactions currentTab={props?.currentTab} isPartner={props?.isPartner} isAllTransActive={props?.isAllTransActive} />
              </div>
              {/* Wrap print content with tbody to allocate space - END */}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default PrinTransactionHistroyEntry;
