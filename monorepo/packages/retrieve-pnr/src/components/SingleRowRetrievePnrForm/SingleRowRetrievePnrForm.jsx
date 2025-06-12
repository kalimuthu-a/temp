import React, { useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import PropTypes from 'prop-types';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { useCustomEventDispatcher } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import { addInitiateRefund } from '../../services';
import { CUSTOM_EVENTS, SUCCESS_LABEL } from '../constants';
import { validateForm } from '../RetrievePnrForm/utils';

const SingleRowRetrievePnrForm = ({ aemData = {}, pageType, isSingleRowRetrievePnrFormVisible }) => {
  const [formData, setFormData] = useState({
    pnr: '',
    email: '',
    errors: {
      pnr: true,
      email: true,
    },
    isLoading: false,
  });
  const [alert, setAlert] = useState(false);
  const [toastMsg, setToastMsg] = useState({ status: '', msg: '' });
  const dispatchCustomEvent = useCustomEventDispatcher();
  const onChangeForm = (key, value) => {
    const formTemp = { ...formData, [key]: value };
    const errors = validateForm(formTemp);
    setFormData({
      ...formTemp,
      errors,
    });
  };

  const onCloseAlert = () => {
    setAlert('');
    if (toastMsg?.msg !== '') {
      setToastMsg({ status: '', msg: '' });
    }
  };

  const onClickGenerateOTP = async () => {
    if (Object.keys(formData.errors)?.length > 0) {
      return;
    }
    setFormData((prev) => ({ ...prev, isLoading: true }));
    const initiateRefundResponse = await addInitiateRefund(
      formData?.pnr,
      formData?.email,
      setAlert,
      aemData?.errorMessages?.FailureMessage,
    );
    if (initiateRefundResponse?.oTPResponse?.status?.toLowerCase() === SUCCESS_LABEL) {
      dispatchCustomEvent(CUSTOM_EVENTS.HANDLE_SHOW_OTP_MODAL, {
        isOTPModalOpen: true,
      });
    }
    setFormData((prev) => ({ ...prev, isLoading: false }));
  };

  return (
    <div className="retrieve-pnr retrieve-pnr-container">
      {(aemData?.refundClaimTitle) ? (
        <div className="refund-claim-title">
          <HtmlBlock tagName="h3" html={aemData?.refundClaimTitle?.html} />
        </div>
      ) : null}
      {isSingleRowRetrievePnrFormVisible && (
        <div className={`retrieve-pnr-form rounded-1 mt-12 ${pageType}`}>
          <HtmlBlock className="retrieve-pnr-form-title" html={aemData?.refundClaimDescription?.html} />
          <Input
            placeholder={aemData?.pnrLabel}
            name="pnr-booking-ref"
            onChange={(e) => onChangeForm('pnr', e.target.value.toUpperCase())}
            inputWrapperClass="mb-0"
            value={formData?.pnr}
            maxLength={6}
          />
          <Input
            placeholder={aemData?.lastNameLabel}
            name="email-last-name"
            onChange={(e) => onChangeForm('email', e.target.value)}
            maxLength={32}
            inputWrapperClass="mb-0"
            value={formData?.email}
          />
          <div className="d-block">
            <Button
              key={aemData?.generateOTPLabel}
              // eslint-disable-next-line
              onClick={onClickGenerateOTP}
              disabled={Object.keys(formData?.errors)?.length > 0}
              block
              variant="filled"
              type="submit"
              loading={formData?.isLoading}
              title={aemData?.generateOTPLabel}
            >
              {aemData?.generateOTPLabel}
            </Button>
          </div>
        </div>
      )}
      {alert && (
        <Toast
          mainToastWrapperClass="wc-toast"
          variation="notifi-variation--Error"
          description={alert}
          containerClass="wc-toast-container"
          onClose={onCloseAlert}
        />
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
    </div>
  );
};

SingleRowRetrievePnrForm.propTypes = {
  aemData: PropTypes.object,
  pageType: PropTypes.string,
  isSingleRowRetrievePnrFormVisible: PropTypes.bool,
};

export default SingleRowRetrievePnrForm;
