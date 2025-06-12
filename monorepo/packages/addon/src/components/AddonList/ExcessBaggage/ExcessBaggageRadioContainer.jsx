import React from 'react';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import RadioButton from 'skyplus-design-system-app/dist/des-system/RadioBox';
import RadioButtonComponent from './RadioButtonComponent/RadioButtonComponent';

function ExcessBaggageRadioContainer({
  flights,
  isInternationalFlight,
  AEMData,
  getBaggageSSRCodeName,
  formatCurrencyFunc,
  onChangeRadioOption,
  tabValue,
  onClickReset,
  showReset,
  onChangeHandler,
  passengerKey,
  setRadioSelected,
  radioSelected,
  loggedInLoyaltyUser,
}) {
  return (
    <div>
      {/* No Extra Baggage Radio Button */}
      {tabValue.allowBaggageChange && (
        <div className="skyplus-excess-baggage__radio-container">
          <RadioButton
            readOnly
            aria-hidden
            type="radio"
            id="id"
            name="name"
            onChange={onChangeHandler}
            checked={radioSelected}
            disabled={!showReset && !radioSelected}
          >
            <label htmlFor="id" className="skyplus-excess-baggage__addonradio--label">
              <span className="skyplus-excess-baggage__no-baggage-title">
                {AEMData?.label}
              </span>
            </label>
          </RadioButton>
        </div>
      )}
      {map(flights, (values, key) => {
        if (values.length === 0) {
          return null;
        }

        const label = key.toLowerCase();

        const formLabel = label;

        let aemLabel;
        // Old Code:
        // isInternationalFlight
        // ? AEMData?.internationalFlightsLabel
        // : AEMData?.domesticFlightsLabel;
        if (!isInternationalFlight && label === 'domestic') {
          aemLabel = AEMData?.domesticFlightLabel;
        } else {
          aemLabel = AEMData?.internationalFlightLabel;
        }
        return (
          <RadioButtonComponent
            values={values}
            aemLabel={aemLabel}
            AEMData={AEMData}
            getBaggageSSRCodeName={getBaggageSSRCodeName}
            formatCurrencyFunc={formatCurrencyFunc}
            onChangeRadioOption={onChangeRadioOption}
            tabValue={tabValue}
            label={label}
            formLabel={formLabel}
            onClickReset={onClickReset}
            setRadioSelected={setRadioSelected}
            passengerKey={passengerKey}
            loggedInLoyaltyUser={loggedInLoyaltyUser}
          />
        );
      })}
    </div>
  );
}

ExcessBaggageRadioContainer.propTypes = {
  flights: PropTypes.array,
  isInternationalFlight: PropTypes.bool,
  AEMData: PropTypes.object,
  getBaggageSSRCodeName: PropTypes.string,
  formatCurrencyFunc: PropTypes.func,
  onChangeRadioOption: PropTypes.func,
  tabValue: PropTypes.array,
  onClickReset: PropTypes.func,
  passengerKey: PropTypes.string,
  onChangeHandler: PropTypes.func,
  showReset: PropTypes.bool,
  setRadioSelected: PropTypes.func,
  radioSelected: PropTypes.bool,
  loggedInLoyaltyUser: PropTypes.bool,
};
export default ExcessBaggageRadioContainer;
