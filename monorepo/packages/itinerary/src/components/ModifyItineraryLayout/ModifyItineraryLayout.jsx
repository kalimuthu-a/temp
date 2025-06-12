import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { convertNumberWithCommaSep, formatCurrencyFunc, getSessionToken } from '../../utils';
import { setLoading, toggleToast } from '../../store/configData';
import { makeFinishBookingReq, makeResetBookingReq, otpInitiateReq } from '../../services';
import { CONSTANTS } from '../../constants';
import EnterOTP from '../common/EnterOTP/EnterOTP';
import ShellCredit from '../itinerarys/operations/CreditShellSelection';
import InfoAlertPopup from '../common/InfoAlertPopup/InfoAlertPopup';
import { pushDataLayer } from '../../utils/dataLayerEvents';
import { pushAnalytic } from '../../utils/analyticEvents';

const ModifyItineraryLayout = ({ refreshData, modifyFlowCompleteIdentifier,
  setAcknowledgementFlow,
  getModifyAcknowledgementDetail,
}) => {
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpNumber, setOtpNumber] = React.useState('');
  const [isCreditShellOpen, setIsCreditShellOpen] = useState(false);
  const [selectedCreditShell, setSelectedCreditShell] = useState('');
  const [sliderOpen, setSliderOpen] = useState(false);
  const dispatch = useDispatch();
  const otpLength = 6;
  const priceObj = useSelector((state) => state.itinerary?.apiData?.priceBreakdown) || {};
  const bookingObj = useSelector((state) => state.itinerary?.apiData?.bookingDetails) || {};
  const mfDataObj = useSelector(
    (state) => state.itinerary?.mfDatav2?.itineraryMainByPath?.item,
  ) || {};
  const isBurnFlow = useSelector((state) => state.itinerary?.isBurnFlow);

  const { paymentDetails } = mfDataObj;
  const { currencyCode, isOtpRequiredForModification: isOTPRequired } = bookingObj;
  const [otpError, setOtpError] = useState(null); // NOSONAR
  const [loading, setLoadingButton] = useState(false); // NOSONAR
  const isCreditShellPopupRequired = bookingObj?.showAutoRefundPopUp && !isBurnFlow;
  const [enableInfoAlert, setEnableInfoAlert] = useState(false);
  const [resetModification, setResetmodification] = useState(false);
  const hasNonZeroRefundAmount = priceObj?.refundList?.some((item) => parseFloat(item.amount) !== 0);

  const { MODIFY_FLOW_IDENTIFIER, FEECODE_CONFIG_LIST } = CONSTANTS;
  const { successMessage } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};

  useEffect(() => {
    setIsCreditShellOpen(true);
  }, [isCreditShellPopupRequired]);

  const onChangeCreditShell = (value) => {
    setSelectedCreditShell(value);
    localStorage.setItem(
      CONSTANTS.BROWSER_STORAGE_KEYS.CREDITSHELL_REFUNDTYPE,
      value,
    );
  };

  const mfAdditionalData = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};
  const apiData = useSelector((state) => state.itinerary?.apiData) || {};
  const { changeBookingText, changeFlightDetails, totalBookingLabel,
    cancelChargesLabel, refundAmountLabel, cancelFlightDetails,
    processRequestPopUp, discardChangesPopup, pointsRefundInfo, cashRefundInfo } = mfAdditionalData;// refundDetails
  const changeFlightLabel = changeFlightDetails?.ctaLabel;
  const { totalAmount, taxAmountList, totalRefundAmount, airfareChargesInPoints } = priceObj;
  const cancelFlightLabel = cancelFlightDetails?.ctaLabel || '';
  const totalAmountBeforeRefund = Number(totalAmount) + Number(totalRefundAmount);

  const getBurnFlowParams = () => {
    if (!isBurnFlow) return false;
    let totalAmountLabel;
    let totalBookingLabelBurn;
    let totalBookingAmount = 0;
    let totalCancelFee = '';

    let totalBookingPoints = 0;
    if (hasNonZeroRefundAmount) {
      // for cancel refund flow
      const totalAmoutRefund = priceObj?.refundList.find((i) => i.currency === currencyCode)?.amount;
      const totalPointsRefund = priceObj?.refundList.find((i) => i.currency === 'PTE')?.amount;
      totalBookingAmount += totalAmoutRefund;
      totalBookingPoints += totalPointsRefund;
      const cashUsedText = totalAmoutRefund && formatCurrencyFunc({
        price: totalAmoutRefund,
        currencycode: currencyCode,
      });
      totalAmountLabel = totalPointsRefund
        ? `${convertNumberWithCommaSep(totalPointsRefund)} ${paymentDetails?.milesLabel}` : '';
      if (totalAmountLabel && cashUsedText) {
        totalAmountLabel = `${totalAmountLabel} + `;
      }
      if (cashUsedText) {
        totalAmountLabel = `${totalAmountLabel}${cashUsedText}`;
      }
    } else if (totalRefundAmount) {
      totalAmountLabel = formatCurrencyFunc({
        price: totalRefundAmount,
        currencycode: currencyCode,
      });
    }
    const cancelFeeExceptPoints = taxAmountList
      ?.filter((i) => i.feeCode !== FEECODE_CONFIG_LIST.LOYALTY_CANCEL_FEE_IN_POINTS);
    let cancelFeeFromAmount = cancelFeeExceptPoints.reduce((sum, fee) => sum + fee.value, 0);
    cancelFeeFromAmount += (priceObj?.convenienceFee || 0);
    const cancelFeeFromPoints = taxAmountList
      ?.find((i) => i.feeCode === FEECODE_CONFIG_LIST.LOYALTY_CANCEL_FEE_IN_POINTS)?.value;
    totalBookingPoints += Number(cancelFeeFromPoints || 0);
    totalBookingAmount += Number(cancelFeeFromAmount || 0);

    if (cancelFeeFromPoints) {
      totalCancelFee += `${cancelFeeFromPoints} ${paymentDetails?.milesLabel}`;
    }
    if (cancelFeeFromAmount) {
      const formattedAmt = formatCurrencyFunc({
        price: cancelFeeFromAmount,
        currencycode: currencyCode,
      });
      totalCancelFee += cancelFeeFromPoints ? ` + ${formattedAmt}` : formattedAmt;
    }

    // total Booking Amount - START
    totalBookingLabelBurn = totalBookingPoints
      ? `${convertNumberWithCommaSep(totalBookingPoints)} ${paymentDetails?.milesLabel}` : '';
    if (totalBookingLabelBurn && totalBookingAmount) {
      totalBookingLabelBurn = `${totalBookingLabelBurn} + `;
    }
    if (totalBookingAmount) {
      totalBookingLabelBurn = `${totalBookingLabelBurn}${formatCurrencyFunc({
        price: totalBookingAmount,
        currencycode: currencyCode,
      })
      } `;
    }
    // total Booking Amount - END

    return { totalAmountLabel, totalBookingLabelBurn, totalCancelFee };
  };

  const getBurnFlowFooterParams = () => {
    if (!isBurnFlow) return false;
    let totalAmountLabel;
    let totalBurnAmountLabel;
    if (hasNonZeroRefundAmount) {
      // for cancel refund flow
      const totalAmoutRefund = priceObj?.refundList.find((i) => i.currency === currencyCode)?.amount;
      const totalPointsRefund = priceObj?.refundList.find((i) => i.currency === 'PTE')?.amount;
      const cashUsedText = totalAmoutRefund && formatCurrencyFunc({
        price: totalAmoutRefund,
        currencycode: currencyCode,
      });
      totalAmountLabel = totalPointsRefund
        ? `${convertNumberWithCommaSep(totalPointsRefund)} ${paymentDetails?.milesLabel}` : '';
      if (totalAmountLabel && cashUsedText) {
        totalAmountLabel = `${totalAmountLabel} + `;
      }
      if (cashUsedText) {
        totalAmountLabel = `${totalAmountLabel}${cashUsedText}`;
      }
    } else if (totalRefundAmount) {
      totalAmountLabel = formatCurrencyFunc({
        price: totalRefundAmount,
        currencycode: currencyCode,
      });
    } else {
      // for totalFare section
      const cashUsedText = totalAmount && formatCurrencyFunc({
        price: totalAmount,
        currencycode: currencyCode,
      });
      totalBurnAmountLabel = airfareChargesInPoints
        ? `${convertNumberWithCommaSep(airfareChargesInPoints)} ${paymentDetails?.milesLabel}` : '';
      if (totalBurnAmountLabel && cashUsedText) {
        totalBurnAmountLabel = `${totalBurnAmountLabel} + `;
      }
      if (cashUsedText) {
        totalBurnAmountLabel = `${totalBurnAmountLabel}${cashUsedText}`;
      }
    }
    return { totalAmountLabel, totalBurnAmountLabel };
  };

  const makePaymentRequiredFlow = () => {
    const token = getSessionToken();
    const dataToPass = { from: 'Itinerary', token, params: { flowIdentifier: modifyFlowCompleteIdentifier } };
    const event = new CustomEvent(CONSTANTS.EVENT_INITIATE_PAYMENT, {
      bubbles: true,
      detail: dataToPass,
    });
    document.dispatchEvent(event);
    setEnableInfoAlert(false);
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onCommitBooking = async (otp) => {
    if (isOTPRequired && otp?.length < otpLength) {
      return;
    }
    const selectedRefuntTypeFromCreditshell = localStorage.getItem(
      CONSTANTS.BROWSER_STORAGE_KEYS.CREDITSHELL_REFUNDTYPE,
    );
    const payload = {
      notifyContact: true,
      otp: isOTPRequired ? otp : '',
      refundType: selectedRefuntTypeFromCreditshell || selectedCreditShell || '',
      comments: [
        {
          type: 'Default',
          text: 'Updating 2March,2023',
        },
      ],
    };
    setLoadingButton(true);
    const response = await makeFinishBookingReq(payload);
    const isSuccess = response?.data?.success;
    if (response?.isSuccess || isSuccess) {
      // Adobe Analytic
      pushAnalytic({
        data: {
          _event: 'modifyOtpPopupAction',
          _eventInfoName: 'Submit',
          isReviewItinerary: true,
        },
        event: 'click',
        error: {},
      });
      pushDataLayer({
        data: {
          _event: 'link_click',
          pnrResponse: { ...apiData },
        },
        event: 'link_click',
        props: {
          clickText: 'Submit',
          clickNav: 'OTP>Submit',
        },
      });
      // success
      // eslint-disable-next-line no-console
      console.log('---cuuu:::', response);
      const flowIdentifier = localStorage.getItem(CONSTANTS.BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER);
      refreshData(flowIdentifier);
      setShowOtpPopup(false);
      setLoadingButton(false);
      // dispatch(setLoading(false));
      // after modification shows success acknowledge - START
      getModifyAcknowledgementDetail(modifyFlowCompleteIdentifier);
      // after modification shows success acknowledge - END
      if ([MODIFY_FLOW_IDENTIFIER.CANCEL_BOOKING,
        MODIFY_FLOW_IDENTIFIER.CANCEL_FLIGHT].includes(modifyFlowCompleteIdentifier)) {
        setAcknowledgementFlow(true);
      } else {
        let msg = 'Success! changed successfully';
        if (modifyFlowCompleteIdentifier === MODIFY_FLOW_IDENTIFIER.CHANGE_SEAT) {
          msg = successMessage?.filter((msgData) => msgData?.key === 'changeSeat')?.[0]?.description?.html
            || 'Seat changed successfully';
        } else if (modifyFlowCompleteIdentifier === MODIFY_FLOW_IDENTIFIER.CHANGE_ADDON) {
          msg = successMessage?.filter((msgData) => msgData?.key === 'addOn')?.[0]?.description?.html
            || 'Your add ons are successfully added.';
        } else if (modifyFlowCompleteIdentifier === MODIFY_FLOW_IDENTIFIER.CHANGE_WHEELCHAIR) {
          msg = successMessage?.filter((msgData) => msgData?.key === 'specailAssistance')?.[0]?.description?.html
            || 'Special Assistance added successfully';
        }
        dispatch(
          toggleToast({
            show: true,
            props: {
              title: '',
              description: msg,
              variation: 'notifi-variation--Success',
              containerClass: 'modification-success-toast itinearary-success-toast',
              autoDismissTimeer: 10000,
              infoIconClass: 'icon-check text-forest-green',
            },
          }),
        );
      }
    } else if ((!response?.data?.errors) && (response?.response?.data?.paymentRequired)) {
      makePaymentRequiredFlow();
      setLoadingButton(false);
    } else {
      let err;
      if (Array.isArray(response?.response?.errors)) {
        err = response?.response?.errors[0];
      } else if (response?.response?.error) {
        err = response?.response?.error;
      } else {
        err = response?.response?.errors;
      }
      const errorObj = getErrorMsgForCode(err?.code);
      const { message } = errorObj;
      pushAnalytic({
        data: {
          _event: 'modifyOtpPopupAction',
          _eventInfoName: 'Submit',
          isReviewItinerary: true,
        },
        event: 'click',
        error: Object.create(null, {
          code: { value: err?.code, enumerable: true },
          message: { value: message, enumerable: true },
        }),
      });
      dispatch(setLoading(false));
      setOtpError(errorObj?.message);
      setLoadingButton(false);
    }
  };

  const onClickFinish = async (isResendOtp) => {
    const flowIdentifier = localStorage.getItem(
      CONSTANTS.BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER,
    ) || '';
    // eslint-disable-next-line no-console
    console.log('---stage::Flow type', flowIdentifier);
    // dispatch(setLoading(true));
    setLoadingButton(true);
    const response = await otpInitiateReq();
    dispatch(setLoading(false));
    setLoadingButton(false);
    if (response?.isSuccess) {
      if (isResendOtp) {
        // in resend otp flow, we dont need to send analytics which is handled in buttonclick
        return;
      }

      // success
      setShowOtpPopup(true);
    } else {
      // eslint-disable-next-line no-use-before-define, no-shadow
      const { response } = response;

      const err = Array.isArray(response?.errors)
        ? response.errors[0]
        : response?.error ?? response?.errors;

      // Adobe Analytic
      const errorObj = getErrorMsgForCode(err?.code);
      setOtpError(errorObj?.message);
    }
    pushDataLayer({
      data: {
        _event: 'cancel_finish',
        pnrResponse: { ...apiData },
      },
      event: 'cancel_finish',
      props: {
        clickText: 'Finish',
        clickNav: 'Itinerary>Finish',
      },
    });
  };

  const onClickResetClose = () => {
    setResetmodification(false);
    return null;
  };

  const onClickResetChanges = async () => {
    onClickResetClose();
    dispatch(setLoading(true));
    const response = await makeResetBookingReq({
      notifyContact: true,
      comments: [
        {
          type: 'Default',
          text: 'Updating 2March,2023',
        },
      ],
    });
    if (response?.isSuccess) {
      // Adobe Analytic
      pushAnalytic({
        data: {
          _event: 'itineraryButtonAction',
          _eventInfoName: 'Reset Changes',
          isReviewItinerary: true,
          _componentName: 'Itinerary modification footer',
        },
        event: 'click',
        error: {},
      });
      pushDataLayer({
        data: {
          _event: 'link_click',
          pnrResponse: { ...apiData },
        },
        event: 'link_click',
        props: {
          clickText: 'Cancel',
          clickNav: 'Itinerary>Cancel',
        },
      });
    } else {
      const err = Array.isArray(response?.response?.errors) ? response?.response?.errors[0] : response?.response?.error;
      const errorObj = getErrorMsgForCode(err?.code);
      const { message } = errorObj;
      // Adobe Analytic
      pushAnalytic({
        data: {
          _event: 'itineraryButtonAction',
          _eventInfoName: 'Reset Changes',
          isReviewItinerary: true,
          _componentName: 'Itinerary modification footer',
        },
        event: 'click',
        error: Object.create(null, {
          code: { value: err?.code, enumerable: true },
          message: { value: message, enumerable: true },
        }),
      });
      pushAnalytic({
        data: {
          _event: 'warning',
          pnrResponse: { ...apiData },
        },
        event: 'warning',
        props: {
          clickText: 'Cancel',
          clickNav: 'Itinerary>Cancel',
        },
      });
    }
    dispatch(setLoading(false));
    refreshData();
  };
  const renderOtpContent = () => {
    return (
      <EnterOTP
        onClickResent={() => {
          // Adobe Analytic
          pushAnalytic({
            data: {
              _event: 'modifyOtpPopupAction',
              _eventInfoName: 'Resend',
              isReviewItinerary: true,
            },
            event: 'click',
            error: {},
          });
          pushDataLayer({
            data: {
              _event: 'link_click',
              pnrResponse: { ...apiData },
            },
            event: 'link_click',
            props: {
              clickText: 'Resend',
              clickNav: 'OTP>Resend',
            },
          });
          onClickFinish(true);
        }}
        onClickVerifyOtp={() => onCommitBooking(otpNumber)}
        variation="model"
        onClickClose={() => {
          setSliderOpen(false);
          setShowOtpPopup(false);
        }}
        onChangeHandler={(val) => setOtpNumber(val)}
        otpError={otpError}
        setOtpError={setOtpError}
        loading={loading}
      />
    );
  };

  const onClickProcedFromSlider = () => {
    dispatch(setLoading(true));
    setSliderOpen(false);
    if (isOTPRequired) {
      onClickFinish();
    } else {
      onCommitBooking();
    }
    // dispatch(setLoading(false));
  };
  // console.log('---modifyFlowCompleteIdentifier:::', modifyFlowCompleteIdentifier);
  const onClickFinishButton = () => {
    if ([MODIFY_FLOW_IDENTIFIER.CANCEL_BOOKING,
      MODIFY_FLOW_IDENTIFIER.CANCEL_FLIGHT,
    ].includes(modifyFlowCompleteIdentifier)) {
      if (isCreditShellPopupRequired) {
        setIsCreditShellOpen(true);
      }
      setSliderOpen(true);
    } else {
      onClickProcedFromSlider();
    }
  };

  const renderChangeFlightBtn = () => {
    return (
      <div className="btn-container">
        <div className="btn-content">
          {/* <HtmlBlock
            html={changeBookingText.html}
            className="booking-tag"
          /> */}
          <Heading heading="h5" mobileHeading="h6" containerClass="sub-title booking-tag">
            <div
              dangerouslySetInnerHTML={{
                __html: changeBookingText.html,
              }}
            />
          </Heading>
          {/* <div>
            <span>Change instead of cancel</span>
            <div className='offer-line'>
              <span>and get <span className='btn-txt-offer'> 15% off</span></span>
            </div>
          </div> */}
          <div
            className="btn-change-flight"
            onClick={() => setResetmodification(true)}
            aria-hidden
          >
            <Icon className="icon-Change_flight" />
            <div className="change-flight-btn-label">{changeFlightLabel}</div>
          </div>
        </div>
      </div>
    );
  };
  const renderFareData = () => {
    const { totalAmountLabel, totalBookingLabelBurn, totalCancelFee } = getBurnFlowParams() || {};
    let hideDeductionSection = false;
    if (isBurnFlow && bookingObj?.bookingStatus === CONSTANTS.BOOKING_STATUS.CANCELLED) {
      hideDeductionSection = true;
    }
    const cancelFeeData = taxAmountList
      ?.find((i) => i.feeCode === FEECODE_CONFIG_LIST.CANCEL_FEE_CODE) || {};
    return (
      <div className="table-container">
        <div className="content-container">
          {(totalAmountBeforeRefund || totalBookingLabelBurn) && !hideDeductionSection ? (
            <div className="content-row">
              <div className="content-cell">{totalBookingLabel}</div>
              <div className="content-cell">
                {totalBookingLabelBurn || formatCurrencyFunc({
                  price: totalAmountBeforeRefund,
                  currencycode: currencyCode,
                })}
              </div>
            </div>
          ) : null}
          {(cancelFeeData?.value || totalCancelFee) && !hideDeductionSection ? (
            <div className="content-row">
              <div className="content-cell">{cancelChargesLabel}</div>
              <div className="content-cell">
                { totalCancelFee || formatCurrencyFunc({
                  price: cancelFeeData?.value,
                  currencycode: currencyCode,
                })}
              </div>
            </div>
          ) : null}
          {(totalRefundAmount || totalAmountLabel) ? (
            <div className="content-row active-row">
              <div className="content-cell">{refundAmountLabel}</div>
              <div className="content-cell">
                {totalAmountLabel || formatCurrencyFunc({
                  price: totalRefundAmount,
                  currencycode: currencyCode,
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderBurnCancelPoint = () => {
    if (!isBurnFlow) return null;
    return (
      <ul className="iti-modify-layout-note">
        {!!pointsRefundInfo?.html && (
        <li>
          <span className="iti-modify-layout-note-heading">Note 1</span>
          <HtmlBlock
            html={pointsRefundInfo.html}
            className="iti-modify-layout-note-refund-desc"
          />
        </li>
        )}
        {!!cashRefundInfo?.html && (
        <li>
          <span className="iti-modify-layout-note-heading">Note 2</span>
          <HtmlBlock
            html={cashRefundInfo.html}
            className="iti-modify-layout-note-refund-desc"
          />
        </li>
        )}
      </ul>
    );
  };

  // const renderSourceNote = () => {
  //   return (
  //     <div className="note-container">
  //       <span className="note-heading">{refundDetails[0].title}</span>
  //       <span className="note-description">
  //         <HtmlBlock
  //           html={refundDetails[0].description.html}
  //           className=""
  //         />
  //       </span>
  //     </div>
  //   );
  // };

  const renderCancelBookingHeader = () => {
    return (
      <div className="cancel-booking-wrapper">
        <span className="cancel-booking-title">{cancelFlightLabel}</span>
      </div>
    );
  };

  const resetModifyConfirmRender = () => {
    return (
      <div className="modify-reset-confirmation-content-main">
        <Heading
          heading="h4"
          mobileHeading="h3"
          containerClass="sub-title"
        >
          <div> {discardChangesPopup?.heading || 'Reset your change?'} </div>
        </Heading>
        <div className="modify-reset-confirmation-content-main-buttongrp">
          <Button
            variant="outline"
            color="primary"
            size="small"
            onClick={() => onClickResetChanges()}
          >
            {discardChangesPopup?.ctaLabel || 'Yes'}
          </Button>
          <Button
            color="primary"
            size="small"
            onClick={() => onClickResetClose()}
          >
            {discardChangesPopup?.secondaryCtaLabel || 'No'}
          </Button>
        </div>
      </div>
    );
  };

  const moduleContentConfig = {};
  const renderConfirmSlider = () => {
    return (
      <OffCanvas onClose={() => setSliderOpen(false)} containerClassName="mobile-variation1 modify-itineray-slider">
        <div className="change-flight-details__container">
          <div className="head">
            <p className="heading">{moduleContentConfig.heading}</p>
            <div className="desc">
              <Heading
                heading="h4"
                mobileHeading="h3"
                containerClass="sub-title"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: moduleContentConfig.description,
                  }}
                />
              </Heading>
            </div>
          </div>
          <div className="container-info">
            {renderCancelBookingHeader()}
            {renderChangeFlightBtn()}
            {renderFareData()}
            {/* {isCreditShellPopupRequired && renderSourceNote()} */}
            {isCreditShellOpen && isCreditShellPopupRequired && (
              <ShellCredit
                onChange={onChangeCreditShell}
                activeModule="creditshell-modify"
                selected={selectedCreditShell}
                onClickProceed={onClickFinishButton}
              />
            )}
            { renderBurnCancelPoint()}
          </div>
          <div className="change-flight-details__footer">
            <Button
              variant="outline"
              color="primary"
              size="small"
              disabled={isCreditShellOpen && isCreditShellPopupRequired && !selectedCreditShell}
              onClick={onClickProcedFromSlider}
            >
              {mfAdditionalData?.proceedLabel}
            </Button>
          </div>
        </div>
      </OffCanvas>
    );
  };
  const { totalAmountLabel: totalRefunLabelForFooterBurn, totalBurnAmountLabel } = getBurnFlowFooterParams() || {};
  return (
    <>
      {sliderOpen && renderConfirmSlider()}

      {showOtpPopup && renderOtpContent()}
      {enableInfoAlert && (
        <InfoAlertPopup
          title={processRequestPopUp?.heading || ''}
          description={processRequestPopUp?.description || ''}
        />
      )}
      {resetModification
        && (
          <ModalComponent
            modalContent={() => resetModifyConfirmRender()}
            variation="dropdown"
            modalWrapperClass="modify-reset-confirmation-popup"
            modalContentClass="modify-reset-confirmation-content"
            onCloseHandler={() => onClickResetClose()}
          />
        )}

      <div className="modify-layout-itinerary">
        <div className="line" />
        {(priceObj?.totalAmount || totalBurnAmountLabel) && !isBurnFlow ? (
          <div className="left-container">
            <Text>
              {
                totalRefunLabelForFooterBurn ? <span className="title">Total Refund</span>
                  : (
                    <span className="title">
                      {priceObj?.totalRefundAmount
                        ? paymentDetails?.totalDeductionsLabel : paymentDetails?.totalFareLabel || 'TOTAL FARE'}
                    </span>
                  )
}
            </Text>
            <Text>
              <span className="price">
                {totalRefunLabelForFooterBurn || totalBurnAmountLabel || formatCurrencyFunc({
                  price: priceObj?.totalAmount,
                  currencycode: currencyCode,
                })}
              </span>
            </Text>
            <Text>
              {!totalRefunLabelForFooterBurn && (
              <span className="subtitle">
                {paymentDetails?.convenienceFeeLabel || 'Zero Convenience Fee'}
              </span>
              )}
            </Text>
          </div>
        ) : null}
        <div className="button-group">
          <Button
            {...{ size: 'small', variant: 'outline' }}
            onClick={() => {
              setResetmodification(true);
              // Adobe Analytic
              pushAnalytic({
                data: {
                  _event: 'modifyOtpPopupAction',
                  _eventInfoName: 'Cancel',
                  isReviewItinerary: true,
                },
                event: 'click',
                error: {},
              });
              pushDataLayer({
                data: {
                  _event: 'link_click',
                  pnrResponse: { ...apiData },
                },
                event: 'link_click',
                props: {
                  clickText: 'Proceed',
                  clickNav: 'Itinerary>Cancel Flight',
                },
              });
            }}
          >{paymentDetails?.cancelLabel}
          </Button>
          <Button
            {...{ size: 'small', color: 'primary' }}
            onClick={onClickFinishButton}
          >
            {paymentDetails?.finishLabel}
          </Button>
        </div>
      </div>
    </>
  );
};

ModifyItineraryLayout.propTypes = {
  refreshData: PropTypes.any,
  modifyFlowCompleteIdentifier: PropTypes.string,
  setAcknowledgementFlow: PropTypes.func,
  getModifyAcknowledgementDetail: PropTypes.func,
};
export default ModifyItineraryLayout;
