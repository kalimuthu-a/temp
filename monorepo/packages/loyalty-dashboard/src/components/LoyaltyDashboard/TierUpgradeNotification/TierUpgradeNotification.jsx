import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUserSummaryContext } from '../../../store/user-summary-context';

const TierUpgradeNotification = ({ isActiveFlag }) => {
  const [isActive, setIsActive] = useState(isActiveFlag);
  const { aemData } = useUserSummaryContext();
  return (
    isActive && (
      <div className="loyalty-db-tier-upgrade-notification">
        <div className="loyalty-db-tier-upgrade-notification__content">
          <span><i className="icon-arrow-top-right" /></span>
          <p
            dangerouslySetInnerHTML={{
              __html: aemData?.congratsMessage?.html || 'Congratulations! You are now a loyalty member',
            }}
          />
        </div>
        <button
          type="button"
          aria-label="Close"
          className="loyalty-db-tier-upgrade-notification__action"
          onClick={() => setIsActive(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsActive(false);
            }
          }}
        >
          <i className="icon-close-circle" />
        </button>
      </div>
    )
  );
};

TierUpgradeNotification.propTypes = {
  isActiveFlag: PropTypes.bool,
};

export default TierUpgradeNotification;
