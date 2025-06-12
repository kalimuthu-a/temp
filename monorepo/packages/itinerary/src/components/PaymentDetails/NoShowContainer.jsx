import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { setLoading, toggleToast } from '../../store/configData';
import { makeNoShowReq } from '../../services';
import { CONSTANTS } from '../../constants';

const NoShowContainer = ({ updateItineraryData }) => {
  const dispatch = useDispatch();
  const { indigoTaxRefund, bookingDetails } = useSelector((state) => state.itinerary?.apiData) || {};
  const mfDataObj = useSelector(
    (state) => state.itinerary?.mfDatav2?.itineraryMainByPath?.item,
  ) || {};
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleClick = async () => {
    const { nonAG } = CONSTANTS.NOSHOW_CODE;
    if (indigoTaxRefund?.isRefundProcessed || indigoTaxRefund?.taxQueueFlag) {
      let msg = mfDataObj?.refundClaimedAgent?.plaintext || '';
      if (indigoTaxRefund?.fopType?.toLowerCase() === nonAG) {
        msg = mfDataObj?.refundClaimedCustomer?.plaintext || '';
      }
      dispatch(
        toggleToast({
          show: true,
          props: { title: 'Error', description: msg, autoDismissTimeer: 10000 },
        }),
      );
    } else if (indigoTaxRefund?.errorInNoShowTaxRefund) {
      let msg = '';
      let title = 'Error';
      let variation = 'notifi-variation--error';

      const refundAmount = indigoTaxRefund?.refundAmount !== undefined
        ? indigoTaxRefund?.refundAmount
        : 0;
      switch (indigoTaxRefund?.errorInNoShowTaxRefund) {
        case 'RefundFeeAlreadyAvailableAG':
          msg = mfDataObj?.refundClaimedAgent?.plaintext || '';
          break;
        case 'PNRIsMoreThanOneYearOld':
          msg = mfDataObj?.pnrIsMoreThanOneYearOld?.plaintext || '';
          break;
        case 'RestrictedFOP':
          msg = mfDataObj?.restrictedFOP;
          break;
        case 'OtherFOPDoesNotHaveSufficientAmount':
          msg = mfDataObj?.otherFOPDoesNotHaveSufficientAmount?.plaintext || '';
          break;
        case 'RefundFeeAlreadyAvailable':
          msg = mfDataObj?.refundClaimedCustomer?.plaintext || '';
          break;
        case 'FirstFOPRestricted':
          msg = mfDataObj?.firstFOPRestricted?.plaintext || '';
          break;
        case 'RefundAlreadyProcessed':
          title = 'Refund Request In Process.';
          msg = mfDataObj?.refundAlreadyProcessed?.plaintext || '';
          msg = msg?.replace(
            '$amount',
            `${bookingDetails.currencyCode} ${refundAmount}`,
          );
          variation = 'notifi-variation--info';
          break;
        case 'ConnectingNoShow':
          msg = mfDataObj?.connectingNoShow?.plaintext || '';
          break;
        default:
          break;
      }
      dispatch(
        toggleToast({
          show: true,
          props: { title, description: msg, autoDismissTimeer: 10000, variation },
        }),
      );
    } else {
      // API Payload
      const payload = {
        indigoTaxRefund: {
          taxQueueFlag: true,
        },
      };
      // API call
      dispatch(setLoading(true));
      const data = await makeNoShowReq(payload);
      dispatch(setLoading(false));
      // after succes api call
      if (data.isSuccess) {
        await updateItineraryData();
        let successMsg = mfDataObj?.refundRequestSubmittedAgent?.plaintext || '';
        if (indigoTaxRefund?.fopType?.toLowerCase() === nonAG) {
          successMsg = mfDataObj?.refundRequestSubmittedCustomer?.plaintext || '';
        }
        const refundAmount = indigoTaxRefund?.refundAmount !== undefined
          ? indigoTaxRefund?.refundAmount
          : 0;
        successMsg = successMsg?.replace(
          '$amount',
          `${bookingDetails.currencyCode} ${refundAmount}`,
        );
        dispatch(
          toggleToast({
            show: true,
            props: {
              title: 'Info',
              variation: 'notifi-variation--info',
              description: successMsg,
              autoDismissTimeer: 10000,
            },
          }),
        );
      } else {
        dispatch(
          toggleToast({
            show: true,
            props: {
              title: 'Error',
              variation: 'notifi-variation--error',
              description: 'Something went wrong',
              autoDismissTimeer: 10000,
            },
          }),
        );
      }
    }
  };
  return (
    <div className="passenger-no-show-container">
      <div className="passenger-no-show-container-left">
        <span className="icon icon-info passenger-no-show-container__icon" />
        <HtmlBlock
          html={mfDataObj?.noShowNote?.html || 'Passenger(s) in this PNR is No Show. To claim the tax refund please'}
          className="passenger-no-show-container__message"
        />
      </div>
      <button
        type="button"
        className="passenger-no-show-container__link"
        onClick={handleClick}
      >
        {mfDataObj?.clickHereLabel || 'Click Here'}
      </button>
    </div>
  );
};

NoShowContainer.propTypes = {
  updateItineraryData: PropTypes.object,
};

export default NoShowContainer;
