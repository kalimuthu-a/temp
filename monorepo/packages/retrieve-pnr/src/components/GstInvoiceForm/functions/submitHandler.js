import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
// import { makeRefundStatusReq } from '../../../services';
import mockData from '../../../mock/invoiceData';
import validateField from './validateField';

const onSubmit = async (aemData, formData, setFormData, setAlert, activeTabIndex) => {
  setFormData((prev) => ({ ...prev, isLoading: true }));
  const errorsObj = aemData?.refundErrorMessages;
  const error = validateField(formData, activeTabIndex, errorsObj);
  if (
    (activeTabIndex === 0 && (error.pnr || error.email)) ||
    (activeTabIndex === 1 && (error.gstEmail || error.invoiceNumber))
  ) {
    setFormData((prev) => ({ ...prev, isLoading: false, errors: error }));
    return;
  }
  const response = mockData.data;
  if (response?.status) {
    window.location.href = aemData?.getStartedCtaLink;
  } else {
    const errMsg = getErrorMsgForCode(response?.errors?.code);
    setAlert(errMsg?.message);
  }
  setFormData((prev) => ({ ...prev, isLoading: false }));
};
export default onSubmit;
