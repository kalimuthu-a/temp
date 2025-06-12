import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './NoResults.scss';

const NoResults = ({ voucherHistoryNoResults }) => {
  return (
    <div className="noresults-container">
      <div className="noresults-icon">
        <img
          src={voucherHistoryNoResults?.image?._publishUrl}
          alt={voucherHistoryNoResults?.imageAltText}
        />
      </div>
      <span className="noresults-title">{voucherHistoryNoResults?.heading}</span>
      <span
        className="noresults-description"
        dangerouslySetInnerHTML={{
          __html: `${voucherHistoryNoResults?.description?.html}`,
        }}
      />
    </div>
  );
};

NoResults.propTypes = {
  voucherHistoryNoResults: PropTypes.object,
};

export default NoResults;
