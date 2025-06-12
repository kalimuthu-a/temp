/* eslint-disable react/jsx-filename-extension */
import React, { forwardRef } from 'react';
import './print.scss';
import PrintLogo from './PrintLogoComp';
import PrintMoreInformation from './MoreInformation/PrintMoreInfo';
import PrintPassenger from './Passengers/PrintPassenger';
import PrintFareContact from './FareDetails/PrintFareContactDetails';
import PrintDgrInfo from './PrintDgrInfo';

const PrintHomeEntry = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="In6e2">
      <table>
        <thead>
          <tr>
            <td>
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
            <td>
              {/* Wrap print content with tbody to allocate space - START */}
              <div className="page-content">
                <PrintPassenger />
                <PrintFareContact />
                <PrintMoreInformation />
                <PrintDgrInfo />
              </div>
              {/* Wrap print content with tbody to allocate space - END */}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default PrintHomeEntry;
