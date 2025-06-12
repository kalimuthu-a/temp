import React, { useContext, useEffect, useRef, useState } from 'react';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { useCustomEventListener } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import PropTypes from 'prop-types';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import './PointsSplitup.scss';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { CUSTOM_EVENTS } from '../../../constants/constants';
import { AppContext, passengerEditActions } from '../../../context/appContext';
import { getIbcCalcFare, getIbcVoucherDetails } from '../../../services';
import { useDebounce } from '../../../functions/useDebounce';

const PointsSplitup = ({
  setPointSplitValue,
  setPointSplitError,
  pointSplitError,
  setPointSplitRequired,
  pointSplitRef,
  passengersCount,
  isHidden,
}) => {
  const {
    state: {
      disableLoyalty,
      isBurnFlow,
      isLoyaltyAuthenticated,
      aemMainData,
      modificationFlow,
      ssr,
    }, dispatch } = useContext(AppContext);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [inputPoint, setInputPoint] = useState({ raw: 0, formatted: '' });
  const [originalValueObj, setOriginalValueObj] = useState({ point: '', amount: '' });
  const [storedBackedObj, setStoredBackedObj] = useState({ point: '', amount: '' });
  const [voucherValue, setVoucherValue] = useState(null);
  const [modifiedValueObj, setModifiedValueObj] = useState({ point: '', amount: '' });
  const [bluChipBalance, setBluChipBalance] = useState(0);
  const [isInputValid, setIsInputValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewSummaryAPIData, setReviewSummaryData] = useState(null);
  const [isInitApiCalled, setIsInitApiCalled] = useState(false);
  const debouncedInputPoint = useDebounce(inputPoint.raw, 1500);
  const hasChangedRef = useRef(false);
  const shouldRoundOnDebounceRef = useRef(true);
  const initialRoundConditionRef = useRef(true);
  const authUser = Cookies.get('auth_user', true, true);
  const ibcBalance = Number(authUser?.loyaltyMemberInfo?.pointBalance || 0) + Number(voucherValue);
  const maxIbcRequired = Number(originalValueObj?.point || 0);
  const maxAllowed = ibcBalance > maxIbcRequired
    ? maxIbcRequired
    : ibcBalance;
  const minimumRequired = Math.floor(maxIbcRequired * 0.1);

  const dispatchDataToFareSummary = (obj) => {
    if (isHidden) {
      // if passengeredit is hidden then we should not dispatch this event to update faresummary
      return;
    }
    const totalAmountFromReviewSummaryAPI = reviewSummaryAPIData?.priceBreakdown?.totalAmount || 0;
    const totalAmount = totalAmountFromReviewSummaryAPI - Number(storedBackedObj.amount)
      + Number(obj?.amount);
    const updateFareSplitData = (data) => new CustomEvent(CUSTOM_EVENTS.EVENT_FARE_SUMMARY_FARE_SPLIT, data);
    document.dispatchEvent(
      updateFareSplitData({
        bubbles: true,
        detail: { title: 'Passenger Edit', amount: totalAmount, point: obj?.point, tax: obj?.tax },
      }),
    );
  };

  useEffect(() => {
    if (!hasChangedRef.current) return;

    if (debouncedInputPoint) {
      const numericInput = debouncedInputPoint;
      handleBlur({ numericInput });
    }
  }, [debouncedInputPoint]);

  useEffect(() => {
    initialRoundConditionRef.current = !(ibcBalance >= maxIbcRequired);
  }, []);

  const validateInput = ({ finalValue }) => {
    if (finalValue < minimumRequired) {
      const minimumIBCRequiredErrorMessageLabel = aemMainData?.minimumIBCRequiredErrorMessage?.replace('{minimumRequired}', minimumRequired?.toLocaleString('en-IN'));
      return {
        isValid: false,
        errorMessage: minimumIBCRequiredErrorMessageLabel,
      };
    }
    if (maxAllowed < finalValue) {
      const maximumIBCAllowedErrorMessageLabel = aemMainData?.maximumIBCAllowedErrorMessage?.replace('{maximumAllowed}', maxAllowed?.toLocaleString('en-IN'));
      return {
        isValid: false,
        errorMessage: maximumIBCAllowedErrorMessageLabel,
      };
    }

    return {
      isValid: true,
      errorMessage: '',
    };
  };

  const nearestValidValue = (value) => {
    let nearestValue = Number(value);
    if (nearestValue < 100) {
      return nearestValue;
    }

    const isMultipleOfPassengers = nearestValue % passengersCount === 0;
    const isMultipleOf100 = nearestValue % 100 === 0;

    if (isMultipleOf100 && isMultipleOfPassengers || !shouldRoundOnDebounceRef.current) {
      return nearestValue;
    }

    if (isMultipleOf100) {
      nearestValue = Math.floor(nearestValue / passengersCount) * passengersCount;
    } else {
      nearestValue = Math.floor(nearestValue / 100) * 100;
      nearestValue = Math.floor(nearestValue / passengersCount) * passengersCount;
    }
    shouldRoundOnDebounceRef.current = false;
    return nearestValue;
  };

  const getDefaultIBCInput = () => {
    if (modificationFlow) {
      return { numericInput: modifiedValueObj?.point };
    }
    if (ibcBalance >= maxIbcRequired) {
      return { numericInput: maxIbcRequired };
    }
    return { numericInput: ibcBalance };
  };

  useEffect(() => {
    if (!modificationFlow && ibcBalance < maxIbcRequired) {
      setPointSplitRequired({ required: true, maximumAllowed: maxAllowed });
    }
    const ibcInputConfig = getDefaultIBCInput();
    handleBlur(ibcInputConfig);
  }, [originalValueObj, voucherValue]);

  const getVoucherDetailsAPI = async () => {
    const ffn = authUser?.loyaltyMemberInfo?.FFN;
    const travelStartDate = ssr?.[0]?.journeydetail?.departure || '';
    const formatted = travelStartDate && travelStartDate?.split('T')[0];
    const response = await getIbcVoucherDetails(ffn, formatted);
    setVoucherValue(response?.data?.highest?.ibcVoucherValue || 0);
  };

  const handleError = (code) => {
    const error = getErrorMsgForCode(code);
    dispatch({
      type: passengerEditActions.SET_PASSENGER_EDIT_ERROR,
      payload: {
        flag: true,
        message: error?.message,
      },
    });
    return { success: false };
  };

  const makeIbcFareCalcAPI = async (ibc = 0) => {
    try {
      setIsLoading(true);
      const response = await getIbcCalcFare(ibc);
      const responseData = response?.data;
      if (!responseData || response?.errors) {
        handleError(response?.errors?.code);
      } else {
        if (!inputPoint?.raw) {
          setOriginalValueObj({ point: responseData?.baseFare?.originalIbc, amount: responseData?.tax });
        }
        const splittedAmount = responseData?.tax + (responseData?.baseFare?.nonIbc || 0);
        const splittedPoint = responseData?.baseFare?.ibc || responseData?.baseFare?.originalIbc;
        const obj = { point: splittedPoint || 0, amount: splittedAmount || 0, tax: responseData?.tax || 0 };
        setModifiedValueObj(obj);
        if (ibc) {
          dispatchDataToFareSummary(obj);
        } else {
          // we need to store what is the stored data in API
          setStoredBackedObj(obj);
        }
        return { success: true, response: obj };
      }
    } catch (err) {
      handleError();
    } finally {
      setIsLoading(false);
    }
  };

  const initialAPICalls = async () => {
    getVoucherDetailsAPI();
    const result = await makeIbcFareCalcAPI(0);
    if (result?.success && modificationFlow) {
      handleSuccessfulConfirmation(result?.response?.point);
    }
  };

  useEffect(() => {
    if (authUser?.loyaltyMemberInfo?.pointBalance != null) {
      setBluChipBalance(authUser.loyaltyMemberInfo.pointBalance);
    }
    try {
      const obj = localStorage.getItem('journeyReview');
      const parsedObj = JSON.parse(obj) || {};
      setReviewSummaryData(parsedObj);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!isInitApiCalled && ssr?.[0]?.journeydetail?.departure) {
      initialAPICalls();
      setIsInitApiCalled(true);
    }
  }, [ssr]);

  useCustomEventListener(CUSTOM_EVENTS.REVIEW_SUMMARY_API_DATA, (event) => {
    if (event?.fareSummaryData) {
      setReviewSummaryData(event?.fareSummaryData);
    }
  });

  const handleSuccessfulConfirmation = (value) => {
    setIsConfirmed(true);
    setPointSplitRequired({ required: false });
    setPointSplitValue(value);
    setPointSplitError('');
  };

  const onClickConfirm = async () => {
    const numericInput = inputPoint?.raw;
    const modifiedPoint = Number(modifiedValueObj?.point || 0);

    if (numericInput === modifiedPoint) {
      handleSuccessfulConfirmation(numericInput);
      return;
    }

    const result = await makeIbcFareCalcAPI(numericInput);
    if (result?.success) {
      handleSuccessfulConfirmation(result?.response?.point);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '';
    const x = num?.toString()?.replace(/,/g, '');
    return Number(x)?.toLocaleString('en-IN');
  };

  const handleChange = (e) => {
    hasChangedRef.current = true;
    const input = e.target.value;
    const raw = input.replace(/,/g, '');
    if (!/^\d*$/.test(raw)) return;
    const rawNum = raw ? Number(raw) : 0;
    shouldRoundOnDebounceRef.current = true;
    setInputPoint({ raw: rawNum, formatted: formatNumber(raw) });
    setPointSplitError('');
    setIsInputValid(false);
  };

  const roundingFunc = (numericInput) => {
    const isInputTenPercent = numericInput === minimumRequired;

    if (isInputTenPercent || initialRoundConditionRef?.current || numericInput === maxIbcRequired) {
      return false;
    }
    return true;
  };

  const handleBlur = ({ numericInput } = {}) => {
    if (!originalValueObj?.point || !aemMainData || voucherValue === null) return;
    const roundedInputPoint = nearestValidValue(numericInput);
    const shouldRound = roundingFunc(numericInput);
    const finalValue = shouldRound
      ? roundedInputPoint
      : numericInput;
    const validation = validateInput({ finalValue });
    setPointSplitError(validation.errorMessage);
    setIsInputValid(validation.isValid);
    setInputPoint({ raw: finalValue, formatted: formatNumber(finalValue) });
  };

  const getInputWidth = (value) => {
    const minWidth = 60;
    const maxWidth = 120;
    const charWidth = 14;

    if (!value) return minWidth;

    const commaCount = (value.match(/,/g) || []).length;
    const lengthWithoutCommas = value.length - commaCount;

    const calculatedWidth = lengthWithoutCommas * (charWidth - 1);

    return Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
  };

  const width = getInputWidth(inputPoint?.formatted);

  const dottedLine = () => <hr className="pointsplitup-container__details-wrapper__dotted-line" />;
  const renderConfirmButton = () => {
    return (
      <Button
        containerClass="pointsplitup-container__details-wrapper__notConfirmed-wrapper__input-button-wrapper__confirm-button"
        onClick={onClickConfirm}
        disabled={!isInputValid}
        loading={isLoading}
      >
        {aemMainData?.confirmFareCtaLabel}
      </Button>
    );
  };

  const renderInfo = (inDetail = false) => {
    let message = aemMainData?.bluchipsVouchersRedemptionInfo;
    let iconClass = 'icon-info';
    if (inDetail) {
      message = isConfirmed ? aemMainData?.ibcCannotModifyNote : aemMainData?.ibcInputFieldNote;
      iconClass = 'icon-asterik detail-icon';
    }
    return (
      <div className="pointsplitup-container__details-wrapper__info-wrapper">
        <i className={iconClass} />
        <p
          className="pointsplitup-container__details-wrapper__info-wrapper__info"
          dangerouslySetInnerHTML={{
            __html: message?.html,
          }}
        />
      </div>
    );
  };

  const renderPriceBreakage = (isOriginal = false) => {
    const fareLabel = isOriginal ? aemMainData?.selectedBaseAirfareLabel : aemMainData?.updatedBaseAirfareLabel;
    const fareValue = isOriginal ? originalValueObj : modifiedValueObj;
    const { point, amount } = fareValue;
    const formattedAmount = amount;
    const amountAemLabel = isOriginal ? aemMainData?.selectedBaseAirfareText?.html : aemMainData?.updatedBaseAirfareText?.html;
    const amountLabel = amountAemLabel?.replace('{point}', point?.toLocaleString('en-IN'))?.replace('{amount}', formattedAmount?.toLocaleString('en-IN'));
    return (
      <div className="pointsplitup-container__details-wrapper__fare-wrapper">
        <span className="pointsplitup-container__details-wrapper__common-label">{fareLabel}</span>
        <span
          className="pointsplitup-container__details-wrapper__fare-wrapper__value"
          dangerouslySetInnerHTML={{
            __html: amountLabel || '',
          }}
        />
      </div>
    );
  };

  const renderUpdatedOrInput = () => {
    return isConfirmed ? renderConfirmed() : renderNotConfirmed();
  };

  const renderConfirmed = () => {
    return (
      <div className="pointsplitup-container__details-wrapper__confirmed-wrapper">
        <div className="pointsplitup-container__details-wrapper__confirmed-wrapper__updated-and-button">
          {renderPriceBreakage()}
          <span className="price-modify-wrapper__modify-button">
            <Button
              classNames="price-modify-wrapper__modify-button__link-variation"
              variant="outline"
              onClick={() => setIsConfirmed(false)}
            >
              <i className="icon-edit price-modify-wrapper__modify-button__link-variation__icon-custom" />
              <span>{aemMainData?.editFareLabel}</span>
            </Button>
          </span>
        </div>
        {renderInfo(true)}
      </div>
    );
  };

  const renderNotConfirmed = () => {
    return (
      <div className="pointsplitup-container__details-wrapper__notConfirmed-wrapper">
        <span className="pointsplitup-container__details-wrapper__common-label">{aemMainData?.enterIBCAmountLabel}</span>
        <div className="pointsplitup-container__details-wrapper__notConfirmed-wrapper__input-button-wrapper">
          <div className="pointsplitup-container__details-wrapper__notConfirmed-wrapper__input-button-wrapper__input-wrapper">
            <div className="pointsplitup-container__details-wrapper__notConfirmed-wrapper__input-button-wrapper__input-wrapper__input-with-type">
              <InputField
                type="text"
                value={inputPoint?.formatted}
                onChangeHandler={handleChange}
                className={`${pointSplitError && 'border-error'} pointsplitup-container__details-wrapper__notConfirmed-wrapper__input-button-wrapper__input-wrapper__input-with-type__input-wrapper-class__input-class`}
                inputWrapperClass="pointsplitup-container__details-wrapper__notConfirmed-wrapper__input-button-wrapper__input-wrapper__input-with-type__input-wrapper-class"
                style={{ width: `${width}px` }}
              />
              <span
                className="pointsplitup-container__details-wrapper__notConfirmed-wrapper__input-button-wrapper__input-wrapper__input-with-type__input-type"
                dangerouslySetInnerHTML={{ __html: aemMainData?.inputUpdatedBaseAirfareText?.html }}
              />
            </div>
            {pointSplitError && <span ref={pointSplitRef} className="pointsplitup-container__details-wrapper__notConfirmed-wrapper__input-button-wrapper__input-wrapper__error-msg body-extra-small-regular">{pointSplitError}</span>}
            {renderInfo(true)}
          </div>
          {renderConfirmButton()}
        </div>
      </div>
    );
  };

  const renderChips = () => {
    return (
      <div className="pointsplitup-container__chip-wrapper">
        <div className="pointsplitup-container__chip-wrapper__chip">
          <span className="pointsplitup-container__chip-wrapper__chip__label">{aemMainData?.ibcBalanceLabel}</span>
          <span className="pointsplitup-container__chip-wrapper__chip__value">{bluChipBalance?.toLocaleString('en-IN')}</span>
        </div>
        <div className="pointsplitup-container__chip-wrapper__chip">
          <span className="pointsplitup-container__chip-wrapper__chip__label">{aemMainData?.ibcVoucherBalanceLabel} </span>
          <span className="pointsplitup-container__chip-wrapper__chip__value">{voucherValue?.toLocaleString('en-IN')}</span>
        </div>
      </div>
    );
  };

  if (disableLoyalty || !isLoyaltyAuthenticated || !isBurnFlow) {
    return null;
  }

  return (
    <div className="pointsplitup-container">
      <div
        className="pointsplitup-container__heading"
        dangerouslySetInnerHTML={{
          __html: aemMainData?.customizeFareIBCVoucherHeader?.html,
        }}
      />
      {renderChips()}
      {renderInfo()}
      <div className="pointsplitup-container__details-wrapper">
        {renderPriceBreakage(true)}
        {dottedLine()}
        {renderUpdatedOrInput()}
      </div>
    </div>
  );
};

PointsSplitup.propTypes = {
  inputPoint: PropTypes.string,
  setInputPoint: PropTypes.func,
};
export default PointsSplitup;
