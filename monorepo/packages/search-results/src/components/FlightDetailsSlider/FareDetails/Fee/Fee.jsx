import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import classNames from 'classnames';

const Fee = ({
  label,
  viewDetailsLink,
  viewDetailsLabel,
  durationLabel,
  withBorder,
  charge1,
  charge2,
}) => {
  const className = classNames(
    'fare-details__fee__head d-flex justify-content-between align-items-end',
    { withBorder: withBorder && !durationLabel },
  );
  return (
    <div className="fare-details__fee">
      <div className={className}>
        <Text
          variation="body-small-medium"
          mobileVariation="body-small-medium"
          containerClass="left text-text-primary"
        >
          {label}
        </Text>

        <a
          className="fare-details__fee__head__view-detail"
          href={viewDetailsLink}
          target="_blank"
          rel="noreferrer"
        >
          {viewDetailsLabel}
        </a>
      </div>
      {durationLabel && (
        <div className="fare-details__fee__content duration">
          <div className="fare-details__fee__content__row d-flex justify-content-between">
            <Text
              variation="body-medium-regular"
              mobileVariation="body-small-regular"
            >
              {durationLabel?.[0]}
            </Text>
            <Text
              variation="body-medium-regular"
              mobileVariation="body-small-regular"
            >
              {charge1}
            </Text>
          </div>
          <div className="fare-details__fee__content__row d-flex justify-content-between">
            <Text
              variation="body-medium-regular"
              mobileVariation="body-small-regular"
            >
              {durationLabel?.[1]}
            </Text>
            <Text
              variation="body-medium-regular"
              mobileVariation="body-small-regular"
            >
              {charge2}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

Fee.propTypes = {
  viewDetailsLink: PropTypes.string,
  viewDetailsLabel: PropTypes.string,
  label: PropTypes.any,
  withBorder: PropTypes.bool,
  durationLabel: PropTypes.array,
  charge1: PropTypes.string,
  charge2: PropTypes.string,
};

export default Fee;
