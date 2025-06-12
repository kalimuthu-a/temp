import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import NextChip from 'skyplus-design-system-app/dist/des-system/NextChip';
import {
  formattedMessage,
  uniq,
} from 'skyplus-design-system-app/dist/des-system/utils';
import find from 'lodash/find';

import FareDetailAccordian from './FareDetailAccordian';
import { formatCurrency, formatPoints } from '../../utils';
import useAppContext from '../../hooks/useAppContext';
import { discountCodes, FARE_CLASSES } from '../../constants';

const FareDetails = ({ item, currencyCode, rewardPoint, loyaltyBurnInfo }) => {
  const {
    state: { additional, isBurn },
  } = useAppContext();

  const {
    designator: { originCityName, destinationCityName },
    fare: {
      totalPublishFare,
      totalTax,
      paxFares,
      totalFareAmount,
      FareClass,
      aemFare,
    },
  } = item;

  const burnSummaryRows = useMemo(() => {
    if (!isBurn) return null;

    const calculatePaxCount = () => {
      const { DOUBLE_SEAT, TRIPLE_SEAT } = discountCodes;
      return paxFares?.reduce((acc, pax) => {
        if ([DOUBLE_SEAT, TRIPLE_SEAT].includes(pax?.passengerDiscountCode)) return acc;

        return acc + Number(pax?.multiplier);
      }, 0) || 0;
    };

    const createBurnSummary = (paxCount = 1) => {
      const { pointsSelected, cashComponent,
        // formattedInfantFare: fIF
      } = loyaltyBurnInfo || {};
      // const { infantCount } = flightSearchData || {};

      const { milesRedeemedLabel, milesLabel, cashUsedLabel,
        // infantChargeLabel,
      } = additional?.fareSummary || {};
      const burnSummary = [];

      if (pointsSelected) {
        const singlePaxPoints = Math.round(pointsSelected / paxCount);
        const formattedSinglePaxPoints = singlePaxPoints ? formatPoints(singlePaxPoints) : singlePaxPoints;
        burnSummary.push({
          label: milesRedeemedLabel,
          amountLabel: `${paxCount}x ${formattedSinglePaxPoints} ${milesLabel}`,
        });
      }

      if (cashComponent) {
        const singlePaxCash = formatCurrency(Math.round(cashComponent / paxCount), currencyCode);

        burnSummary.push({ label: cashUsedLabel, amountLabel: `${paxCount}x ${singlePaxCash}` });
      }

      // tobe removed based on confirmation
      // if (infantCount > 0) burnSummary.push({ label: infantChargeLabel, amountLabel: `${infantCount}x ${fIF}` });

      return burnSummary.map((r) => ({ ...r, id: uniq() }));
    };

    return createBurnSummary(calculatePaxCount());
  }, []);

  const { basefareRows, taxRows } = useMemo(() => {
    const getPaxLabel = (typeCode, passengerDiscountCode) => {
      const pax = find(additional?.fareSummary?.paxList, {
        typeCode,
        ...(passengerDiscountCode && { discountCode: passengerDiscountCode }),
      });

      return pax?.paxLabel;
    };

    const basefareRowsData = paxFares
      .filter((row) => Boolean(row))
      .map(
        ({
          publishedFare,
          passengerType,
          multiplier,
          passengerDiscountCode,
        }) => ({
          label: `${multiplier} ${getPaxLabel(
            passengerType,
            passengerDiscountCode,
          )}`,
          amount: publishedFare * multiplier,
          id: uniq(),
        }),
      );

    return {
      basefareRows: burnSummaryRows || basefareRowsData,
      taxRows: [
        {
          label: `
            ${additional?.fareSummary?.totalTaxLabel} ${isBurn ? additional?.fareSummary?.gstApplicableLabel : ''}
          `,
          amount: totalTax,
          id: uniq(),
        },
      ],
    };
  }, []);

  return (
    <div className="srp-fare-details-item">
      <div className="srp-fare-details-flight-info mb-6">
        <Heading
          heading="h4"
          containerClass="d-flex gap-4 d-flex- align-items-center"
        >
          {formattedMessage(
            additional?.fareSummary?.journeyOriginToDestination,
            {
              originCityName,
              destinationCityName,
            },
          )}
          {FareClass === FARE_CLASSES.BUSINESS && (
            <NextChip tabInex={-1}>{aemFare.fareBadge}</NextChip>
          )}
        </Heading>

        {rewardPoint && (
          <Chip
            containerClass="chip earn-points-chip"
            variant="filled"
            size=""
            color="secondary-light"
            txtcol="system-information"
          >
            {formattedMessage(additional?.earnPointInfo, {
              points: rewardPoint,
            })}
          </Chip>
        )}
      </div>
      <div className="fare-container">
        <FareDetailAccordian
          total={totalPublishFare}
          heading={additional?.fareSummary?.baseAirfareLabel}
          rows={basefareRows}
          currencyCode={currencyCode}
          loyaltyBurnInfo={loyaltyBurnInfo}
        />
        <FareDetailAccordian
          total={totalTax}
          heading={additional?.taxesAndFeeLabel}
          rows={taxRows}
          currencyCode={currencyCode}
        />
        <div className="srp-fare-details-item-footer">
          <div className="left">
            <Text variation="body-large-medium text-text-primary">
              {additional?.fareSummary?.totalFareLabel}
            </Text>
            <Text variation="body-medium-regular" containerClass="sub-text">
              {additional?.fareSummary?.convenienceFeeLabel}
            </Text>
          </div>
          <div className="right">
            <Text variation="sh4 totalprice">
              {loyaltyBurnInfo?.formattedPointsPlusCashPlusTax
                || formatCurrency(totalFareAmount, currencyCode)}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

FareDetails.propTypes = {
  item: PropTypes.any,
  currencyCode: PropTypes.string,
  rewardPoint: PropTypes.any,
  loyaltyBurnInfo: PropTypes.any,
};

export default FareDetails;
