import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import Offcanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import sumBy from 'lodash/sumBy';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { formatCurrency } from '../../utils';

import FareDetails from './FareDetails';
import Alert from '../common/Alert/Alert';
import useAppContext from '../../hooks/useAppContext';
import './FareDetails.scss';

const FareDetailSlider = ({ onClose, selectedFares, currencyCode, loyaltyBurnInfo }) => {
  // would require if need to show loyalty points in fare summary
  const totalRewards = false;
  const { totalAmount } = useMemo(() => {
    return {
      totalAmount: sumBy(selectedFares, 'fare.totalFareAmount'),
      totalRewards: sumBy(selectedFares, 'fare.rewardPoint'),
    };
  }, [selectedFares]);

  const {
    state: { additional },
  } = useAppContext();

  return (
    <Offcanvas
      containerClassName="srp-fare-details"
      renderFooter={() => {
        return (
          <div className="srp-fare-details-footer">
            <div className="srp-fare-details-footer-rewards">
              {totalRewards && (
                <div className="py-4 px-8">
                  {additional?.fareSummary?.eRewardsLabel}
                  &nbsp;
                  <span>{totalRewards}</span>
                </div>
              )}
            </div>
            <div className="srp-fare-details-footer-price">
              <div className="left">
                <Text variation="sh7" containerClass="fw-semibold totalprice">
                  {additional?.fareSummary?.totalPriceLabel}
                </Text>
                <Text
                  variation="body-small-variation"
                  containerClass="text-text-tertiary sub-text"
                >
                  {additional?.fareSummary?.convenienceFeeLabel}
                </Text>
              </div>
              <div className="right">
                <Text
                  variation="sh3"
                  containerClass="fw-semibold text-accent-dark"
                >
                  {loyaltyBurnInfo?.formattedPointsPlusCashPlusTax
                    || formatCurrency(totalAmount, currencyCode)}
                </Text>
              </div>
            </div>
          </div>
        );
      }}
      onClose={onClose}
    >
      <Heading containerClass="title" heading="h0">
        <div
          dangerouslySetInnerHTML={{
              __html: additional?.fareDetailsRteLabel?.html || '',
            }}
        />
      </Heading>

      {selectedFares?.map((fare) => (
        <FareDetails
          key={fare.journeyKey}
          item={fare}
          currencyCode={currencyCode}
          loyaltyBurnInfo={loyaltyBurnInfo}
          rewardPoint={totalRewards}
        />
      ))}
      <Alert>
        <HtmlBlock
          html={additional?.fareSummary?.disclaimerLabel}
          className="disclaimer-title mb-4"
        />
        <HtmlBlock
          html={additional?.fareSummary?.disclaimerDescription?.html}
          className="disclaimer"
        />
      </Alert>
    </Offcanvas>
  );
};

FareDetailSlider.propTypes = {
  onClose: PropTypes.any,
  selectedFares: PropTypes.array,
  currencyCode: PropTypes.string,
  loyaltyBurnInfo: PropTypes.any,
};

export default FareDetailSlider;
