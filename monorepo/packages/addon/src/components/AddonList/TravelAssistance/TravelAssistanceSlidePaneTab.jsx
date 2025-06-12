import React, { useMemo, useState } from 'react';
// Old Code:
// import DateOfBirth from "skyplus-design-system-app/dist/des-system/DateOfBirth";
import InputTextField from 'skyplus-design-system-app/dist/des-system/InputField';
import PropTypes from 'prop-types';
import {
  DAY_PLACEHOLDER,
  MONTH_PLACEHOLDER,
  YEAR_PLACEHOLDER,
  paxCodes,
} from '../../../constants/index';
import { generateNumbers } from '../../../functions/utils';

const currentYear = new Date().getFullYear();

// 12 Years Atleast
const dobYears = generateNumbers(currentYear - 70, currentYear - 12, true);
// After 70 Yeays Expiry
const expiryYear = generateNumbers(currentYear, currentYear + 70);
const month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const childYears = generateNumbers(currentYear - 12, currentYear - 2);
/**
 * @type {React.FC<import("../../../../types/AddOnList").TravelAssistanceSlidePaneTabProps>}
 * @returns {React.FunctionComponentElement}
 */
const TravelAssistanceSlidePaneTab = ({
  AEMData,
  onChangeTabDataHandler,
  dob,
  passportExpiry,
  passportNumber,
  visaNumber,
  visaExpiry,
  isInternational,
  type,
  errors,
  configData,
}) => {
  const [day] = useState(() => generateNumbers(1, 31));

  const dateProps = {
    day,
    locale: window?.locale || 'en',
    format: AEMData.monthFormat || 'short',
    disableDayOption: AEMData?.datePlaceholder ?? DAY_PLACEHOLDER,
    disableMonthOption: AEMData?.monthPlaceholder ?? MONTH_PLACEHOLDER,
    disableYearOption: AEMData?.yearPlaceholder ?? YEAR_PLACEHOLDER,
    month,
  };

  const onChangePassport = (val) => {
    onChangeTabDataHandler('passportNumber', val);
  };

  const onChangeVisaNumber = (val) => {
    onChangeTabDataHandler('visaNumber', val);
  };

  const years = useMemo(() => {
    if (paxCodes.seniorCitizen.discountCode === type) {
      return [dob.yy];
    }

    if (paxCodes.children.code === type) {
      return childYears;
    }
    return dobYears;
  }, [type, dob]);

  return (
    <div className="travel-assistance__content">
      <h5 className="travel-assistance__content-datelabel">
        {`${AEMData?.dateOfBirthLabel}*`}
      </h5>
      <DateOfBirth
        {...dateProps}
        value={dob}
        onChangeHandler={(value) => {
          onChangeTabDataHandler('dob', value, type);
        }}
        day={type === paxCodes.seniorCitizen.discountCode ? [dob.dd] : day}
        month={type === paxCodes.seniorCitizen.discountCode ? [dob.mm] : month}
        year={years}
      />
      <p className={`input-text-field__error ${errors.dob ? '' : 'd-none'}`}>
        {errors?.dob}
      </p>

      {isInternational && (
      <>
        <div className="travel-assistance__content-passport">
          <div className="travel-assistance__content-pdetails">
            <p className="travel-assistance__content-plabel">
              {AEMData?.passportDetailsLabel}
            </p>
            <InputTextField
              label={AEMData?.passportNumberLabel}
              onChangeHandler={onChangePassport}
              value={passportNumber}
              variation={errors.passportNumber
                ? 'INPUT_TEXT_FIELD_ERROR'
                : 'INPUT_TEXT_FIELD_FILLED'}
              error={errors?.passportNumber}
            />
          </div>
          <div className="travel-assistance__content-pdate">
            <p className="travel-assistance__content-expirylabel">
              {AEMData?.passportDateOfExpiryLabel}
            </p>
            <DateOfBirth
              {...dateProps}
              onChangeHandler={(value) => {
                onChangeTabDataHandler('passportExpiry', value);
              }}
              value={passportExpiry}
              year={expiryYear}
            />
            <p className="input-text-field__error">
              {errors?.passportExpiry}
            </p>
          </div>
        </div>
        <div className="travel-assistance__content-visa">
          <div className="travel-assistance__content-vdetails">
            <p className="travel-assistance__content-vlabel">
              {AEMData?.visaDetailsLabel}
            </p>
            <InputTextField
              label={AEMData?.visaNumberLabel}
              onChangeHandler={onChangeVisaNumber}
              value={visaNumber}
              variation={errors.visaNumber ?
                'INPUT_TEXT_FIELD_ERROR'
                : 'INPUT_TEXT_FIELD_FILLED'}
              error={errors?.visaNumber}
            />
          </div>
          <div className="travel-assistance__content-vdate">
            <p className="travel-assistance__content-vnumber">
              {AEMData?.visaDateOfExpiryLabel}
            </p>
            <DateOfBirth
              {...dateProps}
              onChangeHandler={(value) => {
                onChangeTabDataHandler('visaExpiry', value);
              }}
              value={visaExpiry}
              year={expiryYear}
            />
            <p className="input-text-field__error">{errors?.visaExpiry}</p>
          </div>
        </div>
      </>
      )}
    </div>
  );
};

TravelAssistanceSlidePaneTab.propTypes = {
  AEMData: PropTypes.any,
  onChangeTabDataHandler: PropTypes.func,
  dob: PropTypes.any,
  passportExpiry: PropTypes.any,
  passportNumber: PropTypes.string,
  visaNumber: PropTypes.string,
  visaExpiry: PropTypes.any,
  isInternational: PropTypes.bool,
  type: PropTypes.oneOf(['ADT', 'SRCT']),
  errors: PropTypes.any,
  configData: PropTypes.any,
};

export default TravelAssistanceSlidePaneTab;
