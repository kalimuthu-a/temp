import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { createRoot } from 'react-dom/client';
import CONSTANTS from './constants';
import { RefundContextProvider } from './store/refund-context';
import RefundHeader from './components/RefundHeader/RefundHeader';
import RefundSummary from './components/RefundSummary/RefundSummary';
import './App.scss';
import getAEMData, { getRefundStatus } from './services/index';
import MoreInformation from './components/MoreInformation/MoreInformation';
import NeedHelp from './components/NeedHelp/NeedHelp';
import Loader from './components/Common/Loader';

const App = () => {
  const [apiData, setAPIData] = useState(null);
  const [aemData, setAemData] = useState([]);
  useEffect(() => {
    const initApp = async () => {
      const response = await getAEMData();
      setAemData(response);
      getRefundStatus(setAPIData);
    };
    initApp();
  }, []);
  return (
    <div className="rt_container_wrapper">
      {!apiData ? (<Loader />) : (
        <>
          {aemData?.goBackLabel && (
          <a
            href={aemData?.goBackPath ? aemData?.goBackPath : '/'}
            className="refundGoBackLabel"
          >
            {aemData?.goBackLabel}
          </a>
          )}

          <div className="refund--container">
            <div className="refundSummary">
              <RefundHeader
                aemData={aemData}
                apiData={apiData}
              />
              <RefundSummary
                aemData={aemData}
                apiData={apiData}
              />
            </div>
            <div className="asideSection">
              <NeedHelp
                chatWithUs={aemData?.chatWithUsLabel}
                bookAgain={aemData?.bookAgainLabel}
                needHelp={aemData?.needHelpLabel}
                trackAnotherRefundLabel={aemData?.trackAnotherRefundLabel}
                trackAnotherRefundPath={aemData?.trackAnotherRefundPath}
              />
              <MoreInformation aemData={aemData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// App.propTypes = {
//   data: PropTypes.object,
// };

let rootElement = null;

function RefundMainApp(ele, data = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }

    rootElement.render(
      <RefundContextProvider>
        <App data={data} />
      </RefundContextProvider>,
    );
  }
}

if (document.querySelector('#__mf__hotel_bookings__dev__only')) {
  // window.BookingMainApp = BookingMainApp;
  RefundMainApp(document.getElementById('__mf__hotel_bookings__dev__only'), {
    app_name: CONSTANTS.APP_NAME,
  });
}

// eslint-disable-next-line import/prefer-default-export
export { RefundMainApp as hotelBookingsAppInit };
