import React from 'react';
import PropTypes from 'prop-types';
import { TierProgress as TierRetain } from './TierProgress';
import CONSTANT from '../constant';

function RetainTier({ aemData, currentTier, tierDetails, tierReviewDate }) {
  const coBrandData = aemData?.coBrandCardDetails;
  console.log('bb', tierDetails);
  return (
    <div className="retain-promo-container">
      <div className="retain-promo" style={{ backgroundImage: `url(${coBrandData?.image?._publishUrl})` }}>
        {coBrandData?.title !== null && (
        <div className="retain-promo--des">
          <p className="title">{coBrandData?.title}</p>
          <p className="sub-title" dangerouslySetInnerHTML={{ __html: coBrandData?.description?.html }} />
        </div>

        )}

      </div>
    </div>

  );
}

export default RetainTier;
