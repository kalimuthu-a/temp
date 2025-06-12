import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import QueryDisplay from './QueryDisplay';
import { getRecentQueries } from '../../services/recentQueries.service';

const RecentQuery = ({ aemData }) => {
  const [recentQueries, setRecentQueries] = useState([]);
  const loggedInData = Cookies.get('auth_user', true, true);
  const [data, setData] = useState(null);

  useEffect(() => {
    getRecentQueries({ email: loggedInData?.email, number: loggedInData?.mobileNumber }).then((apiResponse) => {
      if (Array.isArray(apiResponse.records) && apiResponse.records.length > 0) {
        setRecentQueries(apiResponse.records);
        setData({ records: apiResponse.records });
      }
    });
  }, []);

  const limitedData = {
    ...data,
    records: recentQueries.slice(0, 2),
  };

  const redirectToPage = (event) => {
    event.preventDefault();
    const linkToRedirectPath = aemData?.viewAllQueriesPath;
    if (linkToRedirectPath) {
      window.location.href = linkToRedirectPath;
    }
  };

  return (
    limitedData.records.length > 0 && (
      <div className="recent-query-main">
        <div className="justify-content-between d-flex heading-wrapper-title">
          <HtmlBlock className="retrieve-pnr-form-title" html={aemData?.recentQueriesDescription?.html} />
          <button type="button" className="view-queries-anchor text-uppercase btn" onClick={redirectToPage}>
            <span className="view-queries btn-text">{aemData?.viewAllCta}</span>
          </button>
        </div>
        <QueryDisplay data={limitedData} aemData={aemData} />
      </div>
    )
  );
};

RecentQuery.propTypes = {
  aemData: PropTypes.shape({
    viewAllQueriesPath: PropTypes.string,
    recentQueriesDescription: PropTypes.shape({
      html: PropTypes.string,
    }),
    viewAllCta: PropTypes.string,
  }),
};

export default RecentQuery;
