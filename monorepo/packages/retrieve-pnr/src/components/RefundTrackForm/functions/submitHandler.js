import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { makeRefundStatusReq } from '../../../services';
import validateField from './validateField';

const onSubmit = async (aemData, formData, setFormData, setAlert, activeTabIndex) => {
  setFormData((prev) => ({ ...prev, isLoading: true }));
  const errorsObj = aemData?.refundErrorMessages;
  const error = validateField(formData, activeTabIndex, errorsObj);
  if (
    (activeTabIndex === 0 && (error.pnr || error.email)) ||
    (activeTabIndex === 1 && error.justpayId)
  ) {
    setFormData((prev) => ({ ...prev, isLoading: false, errors: error }));
    return;
  }
  const response = (activeTabIndex === 0) ? await makeRefundStatusReq(
    formData.pnr,
    formData.email,
    '',
  ) : await makeRefundStatusReq('', '', formData.justpayId);
  if (response?.isSuccess) {
    window.location.href = aemData?.getStartedCtaLink;
  } else {
    const errMsg = getErrorMsgForCode(response?.errors?.code);
    if (activeTabIndex === 0) {
      errMsg?.message?.replace('{PNR}', formData?.pnr);
      setFormData({
        ...formData,
        pnr: '',
        email: '',
      });
    } else {
      errMsg?.message?.replace('{JuspayId}', formData?.justpayId);
      setFormData({
        ...formData,
        justpayId: '',
      });
    }
    setAlert(errMsg?.message);
  }
  setFormData((prev) => ({ ...prev, isLoading: false }));
};
export default onSubmit;
