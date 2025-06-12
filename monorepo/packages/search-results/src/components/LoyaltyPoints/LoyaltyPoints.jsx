import React from 'react';
import PropTypes from 'prop-types';

import useAppContext from '../../hooks/useAppContext';

import { formattedMessage, formatPoints } from '../../utils';
import { DEFAULT_TIER } from '../../constants';

const LoyaltyPoints = ({ potentialPoints, className, popHover }) => {
  const {
    state: { main, additional, isEarn, authUser },
  } = useAppContext();
  const tier = authUser?.loyaltyMemberInfo?.tier?.trim?.() || DEFAULT_TIER;
  const points = potentialPoints?.[tier];

  if (!isEarn || !points) {
    return null;
  }

  const bonusPoints = potentialPoints?.[`${tier}Bonus`];

  let totalPoints = Number(points);

  if (bonusPoints) {
    totalPoints += Number(bonusPoints);
  }

  const displayPoints = main?.earnMilesLabel
    ? `+ ${formattedMessage(main?.earnMilesLabel, {
        earningPoints: formatPoints(totalPoints),
      })}`
    : '';

  return (
    <div className="loyalty-points--wrapper">
      <div
        className={`loyalty-points ${className} ${
          popHover ? 'hover-state' : ''
        }`}
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        tabIndex="0"
        aria-describedby="points-tooltip"
      >
        {displayPoints}
      </div>
      {popHover && (
        <div className="loyalty-points--tooltip" id="points-tooltip" role="tooltip">
          <h4>
            <i className="icon-user member-benefit-icon" />
            {additional?.memberBenefitLabel}
          </h4>

          <div className="d-flex justify-content-between align-items-center">
            <h5>{authUser?.loyaltyMemberInfo?.tier ? 'Loyalty earnings' : additional?.loyaltyFreeToJoinLabel}</h5>
            <div className="loyalty-points">{displayPoints}</div>
          </div>

          <div className="divider-line" />

          <div className="points-section">
            <div className="points-break-up">
              <p className="points-label">{tier} {additional?.milesLabel}: </p>
              <p className="points">{points} {additional?.milesLabel}</p>
            </div>
            <div className="points-break-up">
              <p className="points-label">{additional?.bonusMilesLabel?.trim()}: </p>
              <p className="points">{bonusPoints} {additional?.milesLabel}</p>
            </div>
          </div>

          <p className="bonus-points-note">
            {additional?.bonusMilesOnlyOnInfo}
          </p>
        </div>
      )}
    </div>
  );
};

LoyaltyPoints.propTypes = {
  potentialPoints: PropTypes.shape({
    Base: PropTypes.number,
  }),
  className: PropTypes.string,
  popHover: PropTypes.bool,
};

LoyaltyPoints.defaultProps = {
  potentialPoints: {
    Base: '',
  },
  className: '',
  popHover: false,
};

export default LoyaltyPoints;
