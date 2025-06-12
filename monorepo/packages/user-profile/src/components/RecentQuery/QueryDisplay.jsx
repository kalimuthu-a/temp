import React from 'react';
import PropTypes from 'prop-types';
import { QUESRIES } from '../../constants';

const QueryDisplay = ({ data, aemData }) => {
  const displayRecords = data?.records?.slice(0, 2);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })} ${date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })}`;
  };
  const linkToRedirectPath = aemData?.viewAllQueriesPath;
  const redirectToDetails = (pnr) => {
    if (!linkToRedirectPath) {
      return;
    }
    const linkToRedirect = `${window.location.origin}${linkToRedirectPath.replace(
      '/content/skyplus6e/in/en/',
      '/',
    )}`;
    window.location.href = `${linkToRedirect}?pnr=${pnr}`;
  };

  return (
    <div className="search-query-container d-flex">
      {displayRecords?.map((record) => (
        <div
          className="query-tiles d-flex"
          key={record?.pnrNumber}
          onClick={() => redirectToDetails(record?.pnrNumber)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              redirectToDetails(record?.pnrNumber);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <button
            type="button"
            aria-label="close button"
            className="border-0 p-0 align-self-start d-flex"
          >
            <span className="d-flex icon-question-info" ></span>
          </button>
          <div className="pnr-details">
            <div className="pnr-label">{aemData?.pnrLabel.slice(0, 3) } - {record?.pnrNumber}</div>
            <div className="plr-date">{formatDate(record?.dateTimeOpened)}</div>
            <div className="fw-500 query-details">{record?.subject}</div>
          </div>
          <div className="inquiry-status-wrapper">
            <span
              className={`status-query-label ${
                record?.status === QUESRIES.QUESRIES_STATUS.OPEN
                  ? 'open-query'
                  : ''
              } ${
                record?.status === QUESRIES.QUESRIES_STATUS.RESOLVED
                  ? 'resolved-query'
                  : ''
              } ${
                record?.status === QUESRIES.QUESRIES_STATUS.CLOSED
                  ? 'closed-query'
                  : ''
              } ${
                record?.status === QUESRIES.QUESRIES_STATUS.UNTOUCHED
                  ? 'untouched-query'
                  : ''
              }`}
            >
              {record?.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

QueryDisplay.propTypes = {
  data: PropTypes.shape({
    records: PropTypes.arrayOf(
      PropTypes.shape({
        pnrNumber: PropTypes.string,
        dateTimeOpened: PropTypes.string,
        subject: PropTypes.string,
        status: PropTypes.string,
      }),
    ),
  }),
  aemData: PropTypes.shape({
    viewAllQueriesPath: PropTypes.string,
    pnrLabel: PropTypes.string,
  }),
};

QueryDisplay.defaultProps = {
  data: null,
  aemData: null,
};

export default QueryDisplay;
