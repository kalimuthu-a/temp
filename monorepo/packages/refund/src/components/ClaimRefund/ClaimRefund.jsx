import React, { useState } from "react";
import RefundOtpPopup from "../RefundOtpPopup/RefundOtpPopup";
import {useCustomEventListener} from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import PassengerDetailsForm from "../PassengerDetailsForm/PassengerDetailsForm";
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { CUSTOM_EVENTS } from "../../constants";

const ClaimRefund = ({aemData}) => {
  const [passengerDetails, setPassengerDetails] = useState({});
  const [isOtpSumbitted, setIsOtpSubmitted] = useState(false);
  const [isOpenOtpPopup, setIsOpenOtpPopup] = useState(false)
  const [toastMsg, setToastMsg] = useState({ status: '', msg: '' });

  const onCloseAlert = () => {
    if (toastMsg?.msg !== '') {
      setToastMsg({ status: '', msg: '' });
    }
  };

  useCustomEventListener(
    CUSTOM_EVENTS.HANDLE_SHOW_OTP_MODAL,
    (data) => {
      setIsOpenOtpPopup(data?.isOTPModalOpen)
    },
  );

  return(
    <>
    {isOpenOtpPopup ? 
      <RefundOtpPopup
        setIsOpenOtpPopup={setIsOpenOtpPopup} 
        aemData={aemData} 
        setIsOtpSubmitted={setIsOtpSubmitted} 
        setPassengerDetails={setPassengerDetails} 
      /> 
    : null}
    {isOtpSumbitted && (
      <div className="passenger_details_container rounded-1">
        <PassengerDetailsForm
          aemData={aemData}
          passengerDetails={passengerDetails}
          setToastMsg={setToastMsg}
          setIsOtpSubmitted={setIsOtpSubmitted}
        />
      </div>
    )}
    {toastMsg?.msg !== '' && (
      <Toast
        mainToastWrapperClass="wc-toast"
        variation={
          toastMsg?.status
            ? 'notifi-variation--Success'
            : 'notifi-variation--Error'
        }
        description={toastMsg?.msg}
        containerClass="wc-toast-container"
        onClose={onCloseAlert}
      />
    )}
    </>
  )
}

export default ClaimRefund;