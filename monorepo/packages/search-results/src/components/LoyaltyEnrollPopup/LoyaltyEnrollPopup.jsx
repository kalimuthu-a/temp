import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';

import useAppContext from '../../hooks/useAppContext';

import { formattedMessage, formatPoints } from '../../utils';
import { UPDATE_FLIGHT_SEARCH } from '../../constants';

function LoyaltyEnrollPopup({ data, updateFlightSearch }) {
  if (!data) {
    return null;
  }

  const { state: { additional, authUser } } = useAppContext();

  const getHandler = (handler) => (handler === UPDATE_FLIGHT_SEARCH.withCash ? updateFlightSearch : handler);

  const className = 'loyalty-enroll-popup-content';
  const { onClick, onClickSecondary, ...rest } = data || {};
  const onClickHandler = useMemo(() => getHandler(onClick), [onClick]);
  const onClickSecondaryHandler = useMemo(() => getHandler(onClickSecondary), [onClickSecondary]);
  const { note, pointsList, ctaLabel, secondaryCtaLabel, image, types } = rest || {};

  return (
    <div className={`${className}`}>
      {note && (
        <p>
          {formattedMessage(note, {
            currentBalance: formatPoints(authUser?.loyaltyMemberInfo?.pointBalance) || '0',
            minimumPoints: formatPoints(additional?.minPointsToRedeemValue) || '',
            minimumPercentage: additional?.minPercentageToRedeemValue || '',
          })}
        </p>
      )}

      {types && (
        <ul className={`${className}--nominee-list`}>
          {types?.map?.(({ icon, count, label }) => (
            <li key={uniq()}>
              <Icon className={icon} size="sm" />

              {`${count} ${label}`}
            </li>
          ))}
        </ul>
      )}

      {pointsList && (
        <ul>
          {pointsList?.map?.((el) => (
            <li key={uniq()}>✨{el}</li>
          ))}
        </ul>
      )}

      {image && (
        <div className={`${className}--img-container`}>
          <img
            src={image._publishUrl}
            alt={image.imageAltText}
            className={`${className}--img-container--img-gif`}
          />
        </div>
      )}

      <div className="button-contianer">
        {ctaLabel && (
          <Button
            block
            {...(onClickHandler && {
              onClick: onClickHandler,
            })}
            {...(ctaLabel &&
              secondaryCtaLabel && {
                color: 'primary',
                variant: 'outline',
              })}
          >
            {ctaLabel}
          </Button>
        )}
        {secondaryCtaLabel && (
          <Button
            block
            {...(onClickSecondaryHandler && {
              onClick: onClickSecondaryHandler,
            })}
          >
            {secondaryCtaLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

LoyaltyEnrollPopup.propTypes = {
  data: PropTypes.shape({}).isRequired,
  updateFlightSearch: PropTypes.func,
};

export default LoyaltyEnrollPopup;
