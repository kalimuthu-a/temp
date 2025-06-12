import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import Slider from '../Slider';
import FareDetailsSegment from '../FareDetailsSegment';
import CancellationFeeInfo from '../CancellationFeeInfo';
import { useFareSummaryContext } from '../../store/fare-summary-context';

import './FareSummaryDetails.scss';

const FareSummaryDetails = ({ onClose, totalAmountFormatted, addonDataList, seatListObj,
  seatMapDataFromEvent, totalSlashedAmountFormatted, isSeatEventReceived, isBurnFlow,
  isEarnFlow, eventBasedData }) => {
  const { aemData, fareSummaryData } = useFareSummaryContext();
  const [slide, setSlide] = useState(false);
  const delay = 500;
  const currencyCode = fareSummaryData?.bookingDetails?.currencyCode;

  useEffect(() => {
    setSlide(true);
    // const modalContent = document?.querySelector('.fare-summary-details__close');
    // if (modalContent) {
    //   modalContent?.focus();
    // }
  }, []);

  let pointBalanceStr = fareSummaryData?.priceBreakdown?.pointsBalanceDue?.toLocaleString();
  let totalAmountToShow = totalAmountFormatted;
  if (eventBasedData?.point && isBurnFlow) {
    pointBalanceStr = eventBasedData?.point?.toLocaleString();
  }
  if (eventBasedData?.amount && isBurnFlow) {
    totalAmountToShow = formatCurrency(eventBasedData?.amount, currencyCode, {
      minimumFractionDigits: 0,
    });
  }
  return (
    <Slider
      customClass="fare-summary-details-modal"
      open={slide}
      closeHandler={onClose}
      delay={delay}
    >
      <div className="fare-summary-details">
        <div className="fare-summary-details__head">
          <button
            aria-label="close button"
            type="button"
            className="fare-summary-details__close"
            onClick={onClose}
          >
            <span className="icon-close-simple" />
          </button>
        </div>
        <div className="fare-summary-details__body">
          <h4>{aemData?.fareDetailsLabel || 'Fare Details'}</h4>

          {fareSummaryData?.journeysDetail?.map((jItem, idx) => {
            return (
              <FareDetailsSegment
                idx={idx}
                key={jItem?.journeyKey}
                addonForTheJourney={addonDataList[jItem.journeyKey] || {}}
                seatListForTheJourney={seatListObj[jItem.journeyKey] || {}}
                seatMapDataFromEvent={seatMapDataFromEvent}
                isSeatEventReceived={isSeatEventReceived}
                isBurnFlow={isBurnFlow}
                isEarnFlow={isEarnFlow}
                pointSplitUpData={idx === 0 ? eventBasedData : {}} // only for 1 journey incase of burnflow
              />
            );
          })}
          {aemData?.cancellationLabel && !isBurnFlow && <CancellationFeeInfo />}
        </div>
        <div className="fare-summary-details__footer">
          <div className="total-fare">
            <div className="flex-h-between">
              <h6 className="total-fare__label">{aemData?.totalPriceLabel || 'Total Fare'}</h6>
              <span className="total-fare__amount">
                {isBurnFlow
                  ? `${pointBalanceStr} ${aemData?.milesLabel} ${totalAmountToShow ? ' + ' : ''}`
                  : ''}{totalAmountToShow ? `${totalAmountToShow}` : ''}
              </span>
            </div>
            <div className="flex-h-between">
              <span className="total-fare__info t-3">{aemData?.convenienceFeeLabel}</span>
              {totalSlashedAmountFormatted && !isBurnFlow
              && <strike className="total-fare__strike-out t-3">{totalSlashedAmountFormatted}</strike>}
            </div>
          </div>
        </div>
      </div>
    </Slider>
  );
};

FareSummaryDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  totalAmountFormatted: PropTypes.string.isRequired || PropTypes.number.isRequired,
  addonDataList: PropTypes.object,
  seatListObj: PropTypes.object,
  totalSlashedAmountFormatted: PropTypes.string,
  seatMapDataFromEvent: PropTypes.object,
  isSeatEventReceived: PropTypes.string,
  isBurnFlow: PropTypes.bool,
  isEarnFlow: PropTypes.bool,
  eventBasedData: PropTypes.object,
};

export default FareSummaryDetails;
