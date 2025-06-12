import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';

import RetrievePnrForm from './components/RetrievePnrForm';
import './index.scss';
import analyticEvents from './utils/analyticEvents';
import { AnalyticsPageData } from './components/constants';
import { getAEMData } from './services';

const RetrievePnr = ({ analyticsData }) => {
  const [aemData, setAemData] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      const response = await getAEMData(analyticsData?.pageType);
      setAemData(response);
    };

    if (AnalyticsPageData.has(analyticsData?.pageType)) {
      analyticEvents({
        data: {
          _event: 'pageload',
          pageInfo: {
            pageName: analyticsData?.pageName,
            siteSection: analyticsData?.pageFlow ?? 'Modification Flow',
            journeyFlow: analyticsData?.pageFlow ?? 'Modification Flow',
          },
        },
        event: 'pageload',
      });
    }

    initApp();
  }, []);

  if (!aemData) {
    return null;
  }

  return (
    <RetrievePnrForm
      aemData={aemData}
      analyticsData={analyticsData}
      pageType={analyticsData?.pageType}
    />
  );
};

RetrievePnr.propTypes = {
  analyticsData: PropTypes.shape({
    pageFlow: PropTypes.string,
    pageName: PropTypes.string,
    pageType: PropTypes.string,
  }),
};

let rootElement = null;

/**
 *
 * @param {HTMLElement} ele
 * @param {*} data
 * @param {*} standAloneMode
 */
function retrievePnrAppInit(ele, data) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }

    const { pageType = 'track-refund' } = data;
    const { pageFlow, pageName } = AnalyticsPageData.get(pageType) ?? {
      pageName: '',
      pageFlow: '',
    };
    rootElement.render(
      <RetrievePnr analyticsData={{ pageName, pageFlow, pageType }} />,
    );
  }
}

if (document.querySelector('#__mf__retrieve_pnr__dev__only')) {
  retrievePnrAppInit(
    document.getElementById('__mf__retrieve_pnr__dev__only'),
    {},
  );
}

// eslint-disable-next-line import/prefer-default-export
export { retrievePnrAppInit };
