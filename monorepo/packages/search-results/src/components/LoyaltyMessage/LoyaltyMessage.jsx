import React from 'react';

import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useAppContext from '../../hooks/useAppContext';

function LoyaltyMessage() {
  const {
    state: { main, isBurn },
  } = useAppContext();

  if (!isBurn) {
    return null;
  }

  return (
      (main?.importantInfoLabel || main?.ibcEligibilityInfoMessage) && (
        <div className="loyalty-message">
          {main?.importantInfoLabel && (
            <div className="loyalty-container">
              <Icon className="icon-info-filled" size="md" />{' '}
              <span className="loyalty-heading">
                {main?.importantInfoLabel}
              </span>
            </div>
          )}
          {main?.ibcEligibilityInfoMessage && (
            <div
              className="body-small-regular skyplus-addon-mf__modal-content"
              dangerouslySetInnerHTML={{
                __html: main?.ibcEligibilityInfoMessage?.html,
              }}
            />
          )}
        </div>
      )
  );
}

export default LoyaltyMessage;
