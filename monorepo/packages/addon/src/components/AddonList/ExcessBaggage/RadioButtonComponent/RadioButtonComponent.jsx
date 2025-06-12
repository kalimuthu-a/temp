import React from 'react';
import PropTypes from 'prop-types';
import RadioButton from 'skyplus-design-system-app/dist/des-system/RadioBox';

function RadioButtonComponent({
  values,
  aemLabel,
  AEMData,
  getBaggageSSRCodeName,
  formatCurrencyFunc,
  onChangeRadioOption,
  tabValue,
  label,
  formLabel,
  setRadioSelected,
  passengerKey,
  loggedInLoyaltyUser,
}) {
  const checkIsTaken = (passengersSSRKey) => {
    return (
      passengersSSRKey.filter((paxItem) => {
        return paxItem.passengerKey === passengerKey && paxItem.takencount > 0;
      }).length > 0
    );
  };
  const isAddonEligibleForPassenger = (passengersSSRKey) => {
    return (
      passengersSSRKey.filter((paxItem) => {
        return paxItem.passengerKey === passengerKey;
      }).length > 0
    );
  };

  return (
    <>
      {/* TD: Add label if bussiness requiement  */}
      <p className="skyplus-excess-baggage__domestic-label">{aemLabel}</p>
      <div className="skyplus-excess-baggage__radio-container">
        {values.map(
          ({
            price,
            currencycode,
            ssrKey,
            ssrCode,
            passengersSSRKey,
            originalPrice,
            potentialPoints,
            discounterPer,
          }) => {
            const _name = getBaggageSSRCodeName(AEMData?.ssrList, ssrCode);
            const hasPassengerAddon =
              isAddonEligibleForPassenger(passengersSSRKey);
            if (!hasPassengerAddon) return null;
            return (
              <div key={ssrKey} tabIndex="-1">
                <RadioButton
                  key={ssrKey}
                  id={ssrKey}
                  name="radio-domestic-flight"
                  description={_name}
                  price={price}
                  formatCurrencyFunc={formatCurrencyFunc}
                  currencycode={currencycode}
                  onChange={(value) => {
                    onChangeRadioOption(
                      formLabel,
                      value,
                      price,
                      _name,
                      currencycode,
                      ssrCode,
                      potentialPoints || 0,
                      discounterPer || 0,
                      originalPrice || 0,
                    );
                    setRadioSelected(false);
                  }}
                  ariaLabel={`${
                    ssrKey === tabValue[label] ? ' checked' : ' unchecked'
                  } ${_name} ${formatCurrencyFunc({ price, currencycode })}`}
                  value={ssrKey}
                  checked={ssrKey === tabValue[label]}
                >
                  <label
                    htmlFor={ssrKey}
                    className="addonradio__label tags-medium"
                  >
                    <span>{_name}</span>
                  </label>
                  {!(checkIsTaken(passengersSSRKey) && price === 0) && (
                    <>
                      <span className="tags-medium skyplus-excess-baggage__seperater">
                        |
                      </span>
                      <span className="addonradio__price tags-medium">
                        {formatCurrencyFunc({ price, currencycode })}
                      </span>
                      {originalPrice && loggedInLoyaltyUser ? (
                        <span className="skyplus-excess-baggage__addonradio--strickout-price tags-medium">
                          <del>
                            {' '}
                            {formatCurrencyFunc({
                              price: originalPrice,
                              currencycode,
                            })}
                          </del>
                        </span>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                </RadioButton>
              </div>
            );
          },
        )}
      </div>
    </>
  );
}
RadioButtonComponent.propTypes = {
  values: PropTypes.array,
  aemLabel: PropTypes.string,
  AEMData: PropTypes.object,
  getBaggageSSRCodeName: PropTypes.func,
  formatCurrencyFunc: PropTypes.func,
  onChangeRadioOption: PropTypes.func,
  tabValue: PropTypes.array,
  label: PropTypes.string,
  formLabel: PropTypes.string,
  setRadioSelected: PropTypes.func,
  passengerKey: PropTypes.string,
  loggedInLoyaltyUser: PropTypes.bool,
};
export default RadioButtonComponent;
