import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CONSTANT from '../constant';
import dateJS, { formatDate } from '../../../../utils/date';
import { UTIL_CONSTANTS, localStorageKeys } from '../../../../utils';

function CurrentTier({ aemData, ...props }) {
  const currentTiet = props?.currentTier;
  const [reviewLabel, setReviewLabel] = useState('');
  const [currentTierLabel, setCurrentTierLabel] = useState({});
  const localStorageObj = JSON.parse(localStorage.getItem(localStorageKeys.GENERIC_DATA));
  const { TIER_LABELS } = CONSTANT;
  useEffect(() => {
    if (currentTiet !== TIER_LABELS?.BASE) {
      const date = props?.tierReviewDate ? dateJS(props.tierReviewDate).diff(new Date()) : { days: '' };
      const reviewDate = props?.tierReviewDate ? formatDate(props?.tierReviewDate, UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY) : '';
      setReviewLabel(date?.days ? `${reviewDate} ( ${date?.days} ${aemData?.daysLeftLabel})` : '');
    } else {
      setReviewLabel(aemData?.tierValidityLabel);
    }
    const tierLabelObj = localStorageObj?.loyaltyTierLabel?.find((items) => items.key == currentTiet);
    setCurrentTierLabel(tierLabelObj);
  }, []);
  const getTierColor = () => {
    let clr = {};
    if (currentTiet === TIER_LABELS?.GOLD) {
      clr = { pre: 'silver', next: 'gold' };
    }
    if (currentTiet === TIER_LABELS?.BASE) {
      clr = { pre: 'base', next: 'silver' };
    }
    if (currentTiet === TIER_LABELS?.SILVER) {
      clr = { pre: 'base', next: 'gold' };
    }
    return clr;
  };
  const colorCodeObj = getTierColor();
  return (
    <div className="tier">
      <div className="tier__current">
        <div className="heading">
          <p className="heading--main-heading" dangerouslySetInnerHTML={{ __html: aemData?.currentTierHeading?.html }} />
          {/* commenting below line becuase date is not coming from api. once they will provide we can enable it */}
          {/* <p className='heading--sub-heading'>{aemData?.tierReviewLabel}:<span> {reviewLabel}</span></p> */}
        </div>
        {/* use gold, base and silver class for active lines. and use hide class for hide inactive line */}
        {/* for now we are hiding the section. later it will be enabled */}
        {/* <ul className='tier-line'>
          {currentTiet && (
            <>
              <li className={`tier__pre ${colorCodeObj?.pre} ${currentTiet === TIER_LABELS?.BASE ? 'hideTierLine' : ''}`}></li>
              <li className={`tier__current--active ${currentTiet?.toLocaleLowerCase()}`}></li>
              <li className={`tier__next ${colorCodeObj?.next} ${currentTiet === TIER_LABELS?.GOLD ? 'hideTierLine' : ''}`} ></li>
            </>

          )}
        </ul> */}
        <span className="tier__current--bottom-heading">{currentTierLabel?.value}</span>
      </div>
    </div>
  );
}

CurrentTier.propTypes = {
  aemData: PropTypes.object,
  currentTier: PropTypes.any,
};
export default CurrentTier;
