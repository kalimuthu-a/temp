import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PaxListV2.scss';
import { useTripSummaryContext } from '../../store/trip-summary-context';

function PaxListV2({ passengerList }) {
  const [isExpand, setIsExpand] = useState(true);
  const { aemData } = useTripSummaryContext();

  return (
    <div className="trip-slider-pax">
      <div
        className={`trip-slider-pax__title-container ${isExpand ? ' trip-slider-pax__title-container--expanded' : ''}`}
        role="button"
        tabIndex="0"
        onKeyDown={() => setIsExpand(!isExpand)}
        onClick={() => setIsExpand(!isExpand)}
      >
        <h6 className="sh7 heading">{passengerList?.length} {aemData?.passengerTravellingLabel}</h6>
        <i className="icon-accordion-down-simple icon-size-sm arrowIcon" />
      </div>
      {isExpand && (
      <div className="trip-slider-pax-item-container">
        {
          passengerList?.map((pItem) => {
            const firstName = pItem.name?.first || '';
            const lastName = pItem.name?.last || '';
            const isInfant = pItem?.infant?.name?.first;
            const infantNameObj = pItem?.infant?.name || {};
            return (
              <div key={pItem.passengerKey} className="trip-slider-pax-item">
                <span className="trip-slider-pax-item__avatar">{firstName?.charAt(0)}{lastName?.charAt(0)}</span>
                <span className="trip-slider-pax-item__namebox">
                  <span className="body-large-regular trip-slider-pax-item__pax-name ">{firstName}{' '}{lastName}</span>
                  {isInfant && (
                  <span className="infant">
                    <i className="icon-link" />{infantNameObj.first}{' '}{infantNameObj.last}
                  </span>
                  )}
                </span>
              </div>
            );
          })
        }
      </div>
      )}
    </div>
  );
}

PaxListV2.propTypes = {
  passengerList: PropTypes.array,
};

export default PaxListV2;
