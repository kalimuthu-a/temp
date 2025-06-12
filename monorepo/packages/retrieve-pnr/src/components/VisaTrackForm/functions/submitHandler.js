import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { makePnrSearchReq, makeTrackVisaStatusReq } from '../../../services';
import validateField from './validateField';
import { interactions, PAGE, TYPE, VALUES, VISA_CLICK } from '../../../constants/analytic';
import analyticEvents from '../../../utils/analyticEvents';

const onSubmit = async (aemData, formData, setFormData, setAlert, activeTabIndex) => {
  setFormData((prev) => ({ ...prev, isLoading: true }));
  const errorsObj = aemData?.refundErrorMessages;
  const error = validateField(formData, activeTabIndex, errorsObj);
  if (
    (activeTabIndex === 0 && (error.pnr || error.email)) ||
    (activeTabIndex === 1 && error.bookingId)
  ) {
    setFormData((prev) => ({ ...prev, isLoading: false, errors: error }));
    return;
  }
  const response = (activeTabIndex === 0) ? await makePnrSearchReq(
    formData.pnr,
    formData.email,
    '',
    true,
  ) : await makeTrackVisaStatusReq(formData.pnr, formData.bookingId);

  if (activeTabIndex === 0 && response?.data) {
    window.location.href = aemData?.getStartedInternationalCtaLink;// Redirect to Itinerary page
  } else if (activeTabIndex === 1 && response?.isSuccess) {
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
      errMsg?.message?.replace('{bookingId}', formData?.bookingId);
      setFormData({
        ...formData,
        bookingId: '',
      });
    }
    setAlert(response?.message);
  }
  setFormData((prev) => ({ ...prev, isLoading: false }));

  // tsd on click
  analyticEvents({
    event: VISA_CLICK,
    interactionType: interactions.Link_Button_Click,
    data: {
      _event: 'getStarted',
      LOB: PAGE.VISA,
      pageInfo: {
        pageName: VALUES.VISA_STATUS_LANDING_PAGE,
        journeyFlow: PAGE.VISAFLOW,
        siteSection: PAGE.VISAFLOW,
      },
      eventInfo: {
        name: TYPE.submit,
        position: '',
        component: VALUES.VISA_SERVICE,
      },
      productInfo: {
        bookingID: formData?.bookingId || '',
        pnr: formData?.pnr || '',
      },
    },
  });
};
export default onSubmit;
