import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import { uniq, formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import NextChip from 'skyplus-design-system-app/dist/des-system/NextChip';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';

import { useFareSummaryContext } from '../../store/fare-summary-context';
import { PASSENGER_TYPE, EXTRASEAT_TAG, BROWSER_STORAGE_KEYS, CONSTANTS } from '../../constants';
import {
  getFeeForCode,
  getJourneyPriceBreakdown,
  getJourneyType,
} from '../../utils';

import './FareDetailsSegment.scss';

const FareDetailsSegment = ({ idx, addonForTheJourney, seatListForTheJourney,
  seatMapDataFromEvent, isSeatEventReceived, isBurnFlow, pointSplitUpData }) => {
  const { aemData, fareSummaryData, feeCodeMapping, ssrCodeMapping, pageType } =
    useFareSummaryContext();
  const [authuser, setAuthUser] = useState();
  const journeysDetail = fareSummaryData?.journeysDetail;
  const [journeyPriceBreakdown] = getJourneyPriceBreakdown(
    journeysDetail[idx]?.journeyKey,
    fareSummaryData?.priceBreakdown?.journeywiseList,
  );
  const tripType = getJourneyType(aemData, journeysDetail, idx);
  const origin = journeysDetail[idx]?.journeydetail?.origin;
  const destination = journeysDetail[idx]?.journeydetail?.destination;
  const currencyCode = fareSummaryData?.priceBreakdown?.currencyCode;
  const { specialFareCode, promoCode } = fareSummaryData?.bookingDetails || {};
  const isShowDiscountLabel = specialFareCode && specialFareCode === promoCode;
  const addonListForThisJourney = addonForTheJourney?.uiData || [];
  const seatDataByJourney = seatMapDataFromEvent.data?.[journeysDetail[idx]?.journeyKey] || {};
  const seatSSRIdentifier = ['SEAT', 'SEAT2', 'SATR', 'STBG', 'STWB', 'SNXT'];

  const isNext = journeysDetail[idx]?.productClass === 'BR' || journeysDetail[idx]?.productClass === 'BC';
  const fareType = aemData?.fareTypesList.find((fType) => fType?.productClass === journeysDetail[idx]?.productClass);

  const converSSRCodeObj = {};
  ssrCodeMapping?.forEach((itm) => {
    converSSRCodeObj[itm.ssrCode] = itm.name;
  });

  useEffect(() => {
    const authInfo = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true) || {};
    setAuthUser(authInfo);
  }, []);

  const getPaxLabel = (paxCode, discountCode) => {
    const [pax] = aemData?.paxList?.filter((item) => {
      return item.typeCode === paxCode && item.discountCode === discountCode;
    }) || [];
    return pax?.paxLabel;
  };

  const renderFareBreakupPriceList = (jItem) => {
    const taxAmountList = jItem?.taxAmountList;
    const amountToShow = (pointSplitUpData?.amount && isBurnFlow) ? 
    pointSplitUpData?.amount : (jItem?.airfareCharges || 0)
    const formattedAmount = amountToShow
      && formatCurrency(amountToShow, currencyCode, {
        minimumFractionDigits: 0,
      });
    let discountLabel = null;
    let totalDiscount = null;
    if (isShowDiscountLabel && jItem?.totalDiscount > 0) {
      // TODO: AEM Integration for label
      discountLabel = 'Discount';
      totalDiscount = formatCurrency(jItem?.totalDiscount, currencyCode, {
        minimumFractionDigits: 0,
      });
    }

    return (
      <>
        {(formattedAmount && !isBurnFlow) ? (
          <div className="fare-list__row flex-h-between" key="regular">
            <span>{CONSTANTS.REGULAR_FARE}</span>
            <span>{formattedAmount}</span>
          </div>
        ) : null}
        {taxAmountList?.map((tItem) => {
          if (isSeatEventReceived && seatSSRIdentifier.includes(tItem.feeCode)) {
            // we will show the seat fare under addons section via event, hence API given data not required to show
            return;
          }
          const feeLabel = getFeeForCode(tItem.feeCode, feeCodeMapping) || tItem.feeName;
          const fareAmount = formatCurrency(tItem?.value, currencyCode, {
            minimumFractionDigits: 0,
          });
          return (
            <div className="fare-list__row flex-h-between" key={uniq()}>
              <span>{feeLabel}</span>
              <span>{fareAmount}</span>
            </div>
          );
        })}
        {totalDiscount && !isBurnFlow && (
          <div className="fare-list__row flex-h-between" key="discount-label">
            <span>{discountLabel || 'Discount'}</span>
            <span>{`(-) ${totalDiscount}`}</span>
          </div>
        )}
      </>
    );
  };

  const renderInfantPaxCharge = (jItem = {}) => {
    if (!jItem.infantCount) return null;
    let prefix = '';
    prefix = getPaxLabel(PASSENGER_TYPE.INFANT, null) || 'Infant';
    const multiplier = jItem?.infantCount;
    const multipledFare = Number(jItem?.infantPrice) * Number(multiplier);
    const fareAmount = formatCurrency(multipledFare, currencyCode, {
      minimumFractionDigits: 0,
    });
    const fareAmountPerPax = formatCurrency(jItem?.infantPrice, currencyCode, {
      minimumFractionDigits: 0,
    });
    const paxLabel = `${prefix} ${' '}${multiplier} x ${fareAmountPerPax}`;
    return (
      <div className="fare-list__row flex-h-between" key={uniq()}>
        <span>{paxLabel}</span>
        <span>{fareAmount}</span>
      </div>
    );
  };

  const renderPassengerFareCharges = (jItem) => {
    let sortedPax = [];
    const paxFares = jItem?.paxFares || [];
    const foundAdult = paxFares.filter(
      (pItem) => !pItem.passengerDiscountCode
        && pItem.passengerType === PASSENGER_TYPE.ADULT,
    ) || [];
    const foundSeniorAdult = paxFares.filter(
      (pItem) => ![EXTRASEAT_TAG.DOUBLE, EXTRASEAT_TAG.TRIPLE].includes(
        pItem.passengerDiscountCode,
      )
        && pItem.passengerDiscountCode === PASSENGER_TYPE.SENIOUR
        && pItem.passengerType === PASSENGER_TYPE.ADULT,
    ) || [];
    const foundChild = paxFares.filter(
      (pItem) => pItem.passengerType === PASSENGER_TYPE.CHILD,
    ) || [];
    const foundDoubleSeat = paxFares.filter(
      (pItem) => pItem.passengerDiscountCode === EXTRASEAT_TAG.DOUBLE,
    ) || [];
    const foundTripleSeat = paxFares.filter(
      (pItem) => pItem.passengerDiscountCode === EXTRASEAT_TAG.TRIPLE,
    ) || [];
    sortedPax = [
      ...foundAdult,
      ...foundSeniorAdult,
      ...foundChild,
      'renderInfant',
      ...foundDoubleSeat,
      ...foundTripleSeat,
    ];

    return (
      <>
        {sortedPax.map((pItemFare) => {
          if (pItemFare === 'renderInfant') {
            // we have to render infant detail before extra seats
            return renderInfantPaxCharge(jItem);
          }

          const multiplier = pItemFare?.multiplier || 1;
          const multipledFare = Number(pItemFare?.fareAmount) * Number(multiplier);
          const fareAmount = formatCurrency(multipledFare, currencyCode, {
            minimumFractionDigits: 0,
          });
          const fareAmountPerPax = formatCurrency(
            pItemFare?.fareAmount,
            currencyCode,
            { minimumFractionDigits: 0 },
          );
          let prefix = '';
          if (
            pItemFare?.passengerDiscountCode === EXTRASEAT_TAG.DOUBLE
          ) {
            prefix = aemData?.extraSeatLabelDouble || 'Double';
          } else if (
            pItemFare?.passengerDiscountCode === EXTRASEAT_TAG.TRIPLE
          ) {
            prefix = aemData?.extraSeatLabelTriple || 'Triple';
          } else if (
            pItemFare?.passengerType === PASSENGER_TYPE.ADULT
            && pItemFare?.passengerDiscountCode === PASSENGER_TYPE.SENIOUR
          ) {
            prefix = getPaxLabel(pItemFare?.passengerType, pItemFare?.passengerDiscountCode) || 'Senior Citizen';
          } else if (pItemFare?.passengerType === PASSENGER_TYPE.ADULT) {
            prefix = getPaxLabel(pItemFare?.passengerType, pItemFare?.passengerDiscountCode) || 'Adult ';
          } else if (pItemFare?.passengerType === PASSENGER_TYPE.CHILD) {
            prefix = getPaxLabel(pItemFare?.passengerType, pItemFare?.passengerDiscountCode) || 'Child';
          }
          const paxLabel = `${prefix} ${' '} ${multiplier} x ${fareAmountPerPax}`;
          return prefix ? (
            <div className="fare-list__row flex-h-between" key={uniq()}>
              <span>{paxLabel}</span>
              <span>{fareAmount}</span>
            </div>
          ) : null;
        })}
      </>
    );
  };

  const renderLoyaltyFare = (jFareItem) => {
    const amountToShowFare = (pointSplitUpData?.tax && isBurnFlow && pointSplitUpData?.amount) ?
      (Number(pointSplitUpData?.amount || 0) - Number(pointSplitUpData?.tax || 0))
      : (jFareItem?.airfareCharges || 0)
    const pointsToCalc = (pointSplitUpData?.point && isBurnFlow) ? 
    pointSplitUpData?.point : (fareSummaryData?.priceBreakdown?.pointsBalanceDue || 0)
    const cashUsed = amountToShowFare && formatCurrency(amountToShowFare, currencyCode, {
      minimumFractionDigits: 0,
    });
    const infantAmount = jFareItem?.infantPrice && formatCurrency(jFareItem?.infantPrice, currencyCode, {
      minimumFractionDigits: 0,
    });
    const paxCount = fareSummaryData?.passengers?.length || 1;
    const pointsPerPax = pointsToCalc / paxCount || 0;
    return (
      <>
        {!!pointsPerPax && (
          <div className="fare-list__row flex-h-between" key={uniq()}>
            <span>{aemData?.milesRedeemedLabel}</span>
            <span> {paxCount} * {pointsPerPax?.toLocaleString()} </span>
          </div>
        )}
        {!!cashUsed && (
          <div className="fare-list__row flex-h-between" key={uniq()}>
            <span>{aemData?.cashUsedLabel}</span>
            <span>{cashUsed}</span>
          </div>
        )}
        {!!infantAmount && (
          <div className="fare-list__row flex-h-between" key={uniq()}>
            <span>{aemData?.infantChargeLabel}</span>
            <span>{infantAmount}</span>
          </div>
        )}
      </>
    );
  };

  const renderAddonFareSection = () => {
    const memberTier = authuser?.loyaltyMemberInfo?.tier || '';

    const primItems = [];
    const primVItems = [];
    const otherItems = [];

    addonListForThisJourney.forEach(item => {
      if (item.ssrCode === CONSTANTS.PRIME_SSRCODE) {
        primItems.push(item);
      } else if (item.ssrCode === CONSTANTS.PRIME_VOCHER_SSRCODE) {
        primVItems.push(item);
      } else if (item.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE) {
        primVItems.push(item);
      } else if (item.ssrCode === CONSTANTS.LoyaltyV) {
        primVItems.push(item);
      } else {
        otherItems.push(item);
      }
    });

    const sortedAddonList = [...otherItems, ...primItems, ...primVItems];

    return sortedAddonList.map((sItem) => {
      let addonValue;
      if (sItem?.value === 0) {
        addonValue = sItem?.value;
      }
      const ssrLabel = converSSRCodeObj[sItem.ssrCode] || sItem.name || sItem.ssrName || sItem.ssrCode;
      const formattedAmount = formatCurrency(sItem?.value || addonValue, currencyCode, { minimumFractionDigits: 0 });
      const formattedDiscountAmount = formatCurrency(sItem?.Discount || 0, currencyCode, { minimumFractionDigits: 0 });
      const totalLoyaltySave = sItem.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE ? (1 ?? 0) * (sItem?.value ?? 0)
                                :  (sItem?.multiplier ?? 0) * (sItem?.value ?? 0);
      const formattedTotalAmountWithMutliplier = formatCurrency(totalLoyaltySave, currencyCode, {
        minimumFractionDigits: 0,
      });
      return (
        <div key={uniq()}>
          <div className="fare-list__row flex-h-between">
            <span>{(sItem.ssrCode === CONSTANTS.LoyaltyV) ? aemData?.loyaltySaving : ssrLabel }</span>

            {sItem.ssrCode === CONSTANTS.MEAL_VOUCHER_SSRCODE ? (
              <span className="green">{`${sItem?.multiplier} x Free Meal`}</span>
            ) : sItem.ssrCode === CONSTANTS.LoyaltyV ? (
                <span className="green">{formattedAmount?.startsWith('-') ?
                   formattedAmount : `-${formattedAmount}`}</span>
            ) : (
              <span>{`${sItem?.multiplier} x ${formattedAmount}`}</span>
            )}
          </div>
          {isBurnFlow &&
          aemData?.memberDiscountAddedByTier?.html &&
          sItem?.discountPercentage ? (
            <div className="fare-list__row flex-h-between" key={uniq()}>
              <HtmlBlock
                tagName="span"
                className="fare-list__row__addon_discount"
                html={formattedMessage(
                  aemData?.memberDiscountAddedByTier?.html,
                  {
                    memberTier,
                    discountPercentage: sItem?.discountPercentage,
                  },
                )}
              />
              <span className="green">{`-${formattedDiscountAmount}`}</span>
            </div>
          ) : null}
          {sItem.ssrCode === CONSTANTS.PRIME_VOCHER_SSRCODE && 
          aemData?.loyaltySaving ? (
            <div className="fare-list__row flex-h-between" key={uniq()}>
              <HtmlBlock
                tagName="span"
                className="fare-list__row__addon_discount"
                html={aemData?.loyaltySaving}
              />
              <span className="green">{`-${formattedTotalAmountWithMutliplier}`}</span>
            </div>
          ) : null}
        </div>
      );
    });
  };
  
  const validateFreeMealSeat = (xlFreeMealSeat, selectedSeats) => {
    let cpmlObj = {}; let
      seatCount = 0;
    selectedSeats.forEach((seat) => {
      if (xlFreeMealSeat.includes(seat?.designator || seat?.unitDesignator)) {
        cpmlObj = {
          ssrCode: CONSTANTS.CPML,
          value: 0,
          ssrName: '6E Curated Bag',
          multiplier: seatCount,
        };
        seatCount += 1;
      }
    });
    return (Object.keys(cpmlObj).length > 0) ? { ...cpmlObj, multiplier: seatCount } : null;
  };
  const renderSeatFareCharges = () => {
    const seatGroupDataByPrice = {};
    seatDataByJourney?.seats?.forEach((item) => {
      if (!seatGroupDataByPrice[item.price]) seatGroupDataByPrice[item.price] = { multiplier: 0 };
      seatGroupDataByPrice[item.price].multiplier += 1;
    });
    return Object.keys(seatGroupDataByPrice)?.map((priceAmountKey) => {
      const sItem = seatGroupDataByPrice[priceAmountKey];
      const ssrLabel = aemData?.paidSeatTitle || 'Paid Seat';
      const formattedAmount = formatCurrency(priceAmountKey, currencyCode, { minimumFractionDigits: 0 });
      return (
        <div className="fare-list__row flex-h-between" key={uniq()}>
          <span>{ssrLabel}</span>
          <span>{`${sItem?.multiplier} x ${formattedAmount}`}</span>
        </div>
      );
    });
  };

  const getEarnedPoints = (journeyPrice) => {
    let earnedPoints = aemData?.earnedPtsLabel;
    earnedPoints = earnedPoints?.replace('{points}', (journeyPrice?.totalPoints || 0));
    return earnedPoints;
  };
  let totalFareNum = journeyPriceBreakdown?.totalAmount;

  if (pointSplitUpData?.amount && isBurnFlow) {
    totalFareNum = pointSplitUpData?.amount;
  }
  // the specific total calculation for Data from Event - START
  if (seatListForTheJourney?.totalseatJourneyAmount) {
    totalFareNum += Number(seatListForTheJourney?.totalseatJourneyAmount);
  }
  if (addonForTheJourney?.totalAddonJourneyAmount) {
    totalFareNum += addonForTheJourney?.totalAddonJourneyAmount < 0
      ? 0
      : Number(addonForTheJourney?.totalAddonJourneyAmount);
  }
  // the specific total calculation for Data from Event - END
  const totalFareSec = totalFareNum && formatCurrency(totalFareNum, currencyCode, {
    minimumFractionDigits: 0,
  });
  const isLoyaltyDisabled = window?.disableLoyalty;
  let pointsToShow = journeyPriceBreakdown?.pointsBalanceDue?.toLocaleString();
  if (pointSplitUpData?.point && isBurnFlow) {
    pointsToShow = pointSplitUpData?.point?.toLocaleString();
  }
  return (
    <div className="fare-details-segment">
      <div className="segment-title-wrapper flex-h-between">
        <h6>{tripType}</h6>
        {journeyPriceBreakdown?.totalPoints && journeyPriceBreakdown?.totalPoints !== '0' && isLoyaltyDisabled ? (
          <Chip
            color="info"
            variant="filled"
            withBorder
            containerClass="rewards-chip"
          >
            {getEarnedPoints(journeyPriceBreakdown)}
          </Chip>
        ) : null}
      </div>
      <div className="segment-table">
        <div className="d-flex align-items-center segment-table__head">
          <div>{`${origin} - ${destination}`}</div>
          <div className="ms-8">{isNext && <NextChip>{fareType?.fareLabel}</NextChip>}</div>
        </div>
        <div className="segment-table__fare-list t-3 lh-2">
          <span className="fare-list-title">{aemData?.fareChargesLabel || 'Fare Charges'}</span>
          {journeyPriceBreakdown && !isBurnFlow
            && renderPassengerFareCharges(journeyPriceBreakdown)}
          {isBurnFlow && renderLoyaltyFare(journeyPriceBreakdown)}
          {(addonListForThisJourney?.length > 0) && (
            <>
              <div className="divider" />
              <span className="fare-list-title">{aemData?.addOnsTitle || 'Add-ons'}</span>
              {addonListForThisJourney?.length > 0 && renderAddonFareSection()}
            </>
          )}
          <div className="divider" />
          <span className="fare-list-title">{aemData?.fareBreakupLabel || 'Fare Breakup'}</span>
          {journeyPriceBreakdown
            && renderFareBreakupPriceList(journeyPriceBreakdown)}
          {renderSeatFareCharges()}
        </div>
        <div className="segment-table__fare-total">
          {isBurnFlow
            ? `${(pointsToShow)} ${aemData?.milesLabel} ${
              totalFareSec ? ' + ' : ''
            }`
            : ''}
          {totalFareSec ? `${totalFareSec}` : ''}
        </div>
      </div>
    </div>
  );
};

FareDetailsSegment.propTypes = {
  idx: PropTypes.number.isRequired,
  addonForTheJourney: PropTypes.object,
  seatListForTheJourney: PropTypes.object,
  seatMapDataFromEvent: PropTypes.object,
  isBurnFlow: PropTypes.bool,
  isSeatEventReceived: PropTypes.bool,
  pointSplitUpData: PropTypes.object,
};

export default FareDetailsSegment;
