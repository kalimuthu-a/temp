import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
// import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { formatCurrencyFunc } from '../../utils';
import { AppContext } from '../../context/AppContext';
import { pushAnalytic } from '../../utils/analyticEvents';
import { EVENTS_NAME } from '../../utils/analytic';

const VisaSrpPlan = ({
  adultPrice,
  childPrice,
  currency,
  purpose,
  entryType,
  validity,
  stayPeriod,
  journeyTime,
  processingType }) => {
  const {
    state: {
      visaPlanDetailsByPath,
      visaSrpByPath,
    },
  } = React.useContext(AppContext);
  const aemLabel = visaPlanDetailsByPath || {};
  const aemData = visaSrpByPath || {};
  useEffect(() => {
    // tsd on visa plan page load
    const obj = {
      event: 'visaPageLoad',
      data: {
        _event: EVENTS_NAME.VISA_PLAN_PAGE_LOAD,
        pageName: 'Visa Detail',
        visaDetails: {
          visaName: `${stayPeriod} ${entryType}`,
          visaEntryType: processingType,
          visaValidity: validity,
          visaType: purpose,
          visaStay: stayPeriod,
        },
      },
    };
    pushAnalytic(obj);
  }, []);
  return (
    <div className="visa-plan-wrapper-srp">
      <div className="visa-plan-wrapper-srp-upper">
        <div className="visa-plan-wrapper-srp-upper__main">
          <div className="visa-plan-wrapper-srp-upper__item">
            <Chip variant="outlined" color="secondary-light" size="sm" containerClass="chips-bg">
              <span className="chips-text">
                {aemLabel?.getYourVisaLabel}&nbsp;
                <p className="journey"> {journeyTime}</p>
              </span>
            </Chip>
          </div>
          <div className="visa-plan-wrapper-srp-upper__item">
            <Chip variant="outlined" color="secondary-light" size="sm" containerClass="item-visa">
              <span className="visa-srp-wrapper__chips-text">
                {aemLabel?.visaCategory?.[0]?.value}
              </span>
            </Chip>
          </div>

        </div>
        <div className="visa-plan-wrapper-srp-upper__item item-right">
          <div className="item-right__adult-price">
            <span className="text">{aemData?.perAdultLabel}</span>
            <p className="curr">
              {formatCurrencyFunc({
                price: adultPrice || 0,
                currencycode: currency || 'INR',
              })}
            </p>
            <span className="tax">{aemData?.exclTaxesLabel}</span>
          </div>
          <div className="item-right__child-price">
            <span className="text">{aemData?.perChildLabel}</span>
            <p className="curr">
              {formatCurrencyFunc({
                price: childPrice || 0,
                currencycode: currency || 'INR',
              })}
            </p>
            <span className="tax">{aemData?.exclTaxesLabel}</span>
          </div>
        </div>
      </div>

      <div className="visa-plan-wrapper-srp-bottom">
        <div className="visa-plan-wrapper-srp-bottom__item one">
          <span className="srp-label-text">
            {aemLabel?.visaTypeLabel}
            <p className="validity">{purpose}</p>
          </span>
        </div>
        <div className="visa-plan-wrapper-srp-bottom__item two">
          <span className="srp-label-text">
            {aemLabel?.stayLabel}
            <p className="validity">{stayPeriod}</p>
          </span>
        </div>
        <div className="visa-plan-wrapper-srp-bottom__item third">
          <span className="srp-label-text">
            {aemLabel?.validityLabel}
            <p className="validity">{validity}</p>
          </span>
        </div>
        <div className="visa-plan-wrapper-srp-bottom__item fourth">
          <span className="srp-label-text">
            {aemLabel?.entryTypeLabel}
            <p className="validity">{entryType}</p>
          </span>
        </div>
      </div>
    </div>
  );
};
VisaSrpPlan.propTypes = {
  childPrice: PropTypes.number,
  adultPrice: PropTypes.number,
  journeyTime: PropTypes.any,
  purpose: PropTypes.any,
  entryType: PropTypes.any,
  validity: PropTypes.any,
  stayPeriod: PropTypes.any,
  currency: PropTypes.string,
  processingType: PropTypes.any,
};

export default VisaSrpPlan;
