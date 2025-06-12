import React, { useState, useEffect, useContext, useMemo } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
// Old Code:
// import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';

import { AppContext } from '../../../../context/AppContext';
import ShowMore from '../../../ShowMore/ShowMore';
import {
  formatCurrencyFunc,
  formattedMessage,
} from '../../../../functions/utils';
import ShowMoreHtml from '../../../ShowMore/ShowMoreHtml';
import { categoryCodes } from '../../../../constants/index';

/**
 *
 * @type {React.FC<{
 * AEMData: *,
 * setDelayLostProtection: Function,
 * delayLostProtection: boolean,
 * brbCategory: *,
 * checkBoxChecked: boolean,setCheckBoxChecked: *,
 * readMoreLabel: string,readLessLabel : string
 * }>}
 * @returns {React.FunctionComponentElement}
 */
const ExcessBaggageLostProtection = ({
  AEMData,
  setDelayLostProtection,
  delayLostProtection,
  checkBoxChecked,
  setCheckBoxChecked,
  readMoreLabel,
  readLessLabel,
  brbCategory,
}) => {
  const {
    state: { excessBaggageData, containerConfigData, isInternationalFlight },
  } = useContext(AppContext);

  const price = useMemo(() => {
    const key = isInternationalFlight ? 'internationalPrice' : 'domesticPrice';

    const sliderConfiguration = get(
      containerConfigData,
      'configJson.data.addonAdditionalByPath.item.sliderConfiguration',
      [],
    );

    const BRBCategory = sliderConfiguration.find(
      (cat) => cat.categoryBundleCode === categoryCodes.brb,
    );
    if (BRBCategory) {
      return get(BRBCategory, key, 0);
    }

    return 0;
  }, []);

  const [error, setError] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const checked = delayLostProtection;
    setCheckBoxChecked(checked);
    setEnabled(checked);
  }, [delayLostProtection]);

  /* Old Code:
  const checkboxProps = {
    id: 'with-label',
    checked: checkBoxChecked || excessBaggageData.isDisabledDelayLostProtection,
    onChangeHandler: (e) => {
      setError('');
      setCheckBoxChecked(e.target.checked);
    },
    disabled:
      (checkBoxChecked && delayLostProtection) ||
      excessBaggageData.isDisabledDelayLostProtection,
  }; */

  const onAddToTripHandler = () => {
    if (checkBoxChecked) {
      setError('');
      setEnabled(true);
      setDelayLostProtection(true);
    } else {
      setError(AEMData?.acceptTermsError);
      setDelayLostProtection(false);
    }
  };

  const removeHandler = () => {
    setCheckBoxChecked(false);
    setEnabled(false);
    setDelayLostProtection(false);
  };

  const additionalBagPriceHtml = useMemo(() => {
    return formattedMessage(AEMData?.perPassengerPriceLabel, {
      price: `<b>${formatCurrencyFunc(brbCategory)}</b>`,
    });
  }, []);

  return (
    <div className="excess-baggage__lost">
      <div className="excess-baggage__lost-protection">
        <div className="excess-baggage__lost-left">
          <p className="excess-baggage__lost-title">
            {AEMData?.lostBaggageProtectionLabel}
          </p>
          <div className="excess-baggage__lost-label">
            <ShowMore
              text={AEMData?.lostBaggageProtectionDescription.html.replace(
                '{}',
                price,
              )}
              length={70}
              readLessLabel={readLessLabel}
              readMoreLabel={readMoreLabel}
            />
          </div>
        </div>
        <img src={AEMData?.poweredByImage._publishUrl} alt="PoweredBy" />
      </div>
      <p
        className="excess-baggage__lost-booking"
        dangerouslySetInnerHTML={{
          __html: additionalBagPriceHtml,
        }}
      />
      <span className="excess-baggage__lost-terms">
        {/* <Checkbox {...checkboxProps} /> */}
        <span
          className="excess-baggage__lost-conditions"
          dangerouslySetInnerHTML={{
            __html: AEMData.poweredByTermsAndConditions.html,
          }}
        />
      </span>

      <p className={`input-text-field__error ${error ? '' : 'd-none'}`}>
        {error}
      </p>

      <div className="excess-baggage__lost-disclaimer">
        <ShowMoreHtml
          length={85}
          text={AEMData?.poweredByDisclaimer.html}
          readLessLabel={readLessLabel}
          readMoreLabel={readMoreLabel}
        />
      </div>
      <div className="excess-baggage__lost-btn">
        {enabled || excessBaggageData.isDisabledDelayLostProtection ? (
          <div className="excess-baggage__lost-btn-head">
            <button className="excess-baggage__lost-btn-added re-add">
              {AEMData?.addedToTripCtaLabel}
            </button>
            {!excessBaggageData.isDisabledDelayLostProtection && (
              <button
                className="excess-baggage__lost-btn-remove re-remove"
                onClick={removeHandler}
              >
                {AEMData?.removeCtaLabel}
              </button>
            )}
          </div>
        ) : (
          <button
            className="excess-baggage__lost-btn-add re-add"
            onClick={onAddToTripHandler}
          >
            {AEMData?.addToTripCtaLabel}
          </button>
        )}
      </div>
    </div>
  );
};

ExcessBaggageLostProtection.defaultProps = {};
ExcessBaggageLostProtection.propTypes = {
  setDelayLostProtection: PropTypes.func.isRequired,
  delayLostProtection: PropTypes.bool.isRequired,
  AEMData: PropTypes.shape({
    addToTripCtaLabel: PropTypes.string,
    perPassengerPriceLabel: PropTypes.string,
    acceptTermsError: PropTypes.string,
    removeCtaLabel: PropTypes.string,
    addedToTripCtaLabel: PropTypes.string,
    lostBaggageProtectionLabel: PropTypes.string,
    poweredByTermsAndConditions: PropTypes.shape({
      html: PropTypes.string,
    }),
    poweredByDisclaimer: PropTypes.shape({
      html: PropTypes.string,
    }),
    lostBaggageProtectionDescription: PropTypes.shape({
      html: PropTypes.string,
    }),
    poweredByImage: PropTypes.shape({
      _publishUrl: PropTypes.string,
    }),
  }),
};

export default ExcessBaggageLostProtection;
