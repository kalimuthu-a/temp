import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { CONSTANTS } from '../../constants';
import FlightOperation, {
  FLIGHT_OPERATIONS_MODULE,
} from '../itinerarys/operations/FlightOperation';
import UpdateContactModal from '../itinerarys/operations/UpdateContact/UpdateContactModal';
import PrintHome from '../common/Print/PrintHome';
import { setLoading, toggleToast } from '../../store/configData';
// import { emailItineraryReq } from '../../services';
import Cookies from '../../utils/cookies';
import { pushAnalytic } from '../../utils/analyticEvents';
import { pushDataLayer } from '../../utils/dataLayerEvents';
import EmailItinerary from '../itinerarys/operations/EmailItinerary/EmailItinerary';
import FrequentFlyer from '../Loyalty/FrequentFlyer/FrequentFlyer';
import { postUpdateFFN } from '../../services';
import { bindWithDeepLinkUrl } from '../Flight/dataConfig';

const { TAB_KEYS } = CONSTANTS;

export const ENVCONFIG = {
  FLIGHT_STATUS: '/',
  AVAIL_PLANB: 'https://www.goindigo.in/plan-b.html',
  ADDBAGTAG: 'https://www.goindigo.in/check-in/addbagtag.html',
  VIEWBAGTAG: 'https://www.goindigo.in/bag-tag.html',
  SPLITPNR:
    'https://dbusinessapps.goindigo.in/WebsiteAppDigital4x/splitpnr/index',
  SEATSELECT: '/content/indigo/in/en/booking/seat-select-modification.html',
};
function NavButtonList({ list, refreshData, parentTabName }) {
  const [config, setConfig] = useState('');
  const dispatch = useDispatch();

  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const bookingDetails = itineraryApiData?.bookingDetails || {};
  const paymentsDetails = itineraryApiData?.payments || [];
  const isPartialRedemption = bookingDetails.changeFlightValidation?.code;
  const passengersArray = (itineraryApiData && itineraryApiData.passengers) || [];
  const { ffNumberSuccessMessage, ffNumberErrorMessage } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath.item,
  ) || [];

  const authUser = useSelector((state) => state.itinerary?.authUser);

  const { BROWSER_STORAGE_KEYS, MODIFY_FLOW_IDENTIFIER, DISABLE_REASON_CODE } = CONSTANTS;
  const {
    webCheckInLink, internationalWebCheckInLink,
    undoWebCheckInCtaPath,
    loginCancellationMsg,
    disableReasonCodeMap,
  } = useSelector((state) => state.itinerary?.mfDatav2?.itineraryMainByPath?.item) || {};

  const verifiedObject = { ffData: [] };
  const notifySuccessVariation = 'notifi-variation--Success';
  const iconGreenVariation = 'icon-check text-forest-green';
  const containerClassModify = 'modification-success-toast itinearary-success-toast';

  const handleClose = (e) => {
    if (e?.preventDefault) {
      e?.preventDefault();
    }
    setConfig(null);
  };
  const openUrlWithPostFormObj = (url, params = {}) => {
    const form = document.createElement('form');
    form.target = '_self';
    form.method = 'POST';
    form.action = url;

    for (const i in params) {
      if (Object.hasOwn(params, i)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = i;
        input.value = params[i];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  };

  const onClickWhatsappItinerary = async () => {
    dispatch(setLoading(true));
    // const payload = {
    //   emailItinerary: {
    //     isMultipleEmailIds: true,
    //     isWhatsappRequest: true,
    //     recordLocator: bookingDetails.recordLocator,
    //     emailAddresses: [],
    //   },
    // };
    // const data = await emailItineraryReq(payload); { /* NOSONAR */ }
    dispatch(
      toggleToast({
        show: true,
        props: {
          title: 'Information',
          variation: notifySuccessVariation,
          description:
            'Your flight Itinerary has been mailed'
            + 'successfully and sent on your WhatsApp number if the service has been subscribed for',
          infoIconClass: iconGreenVariation,
          containerClass: 'itienararay--success itinearary-success-toast',
          autoDismissTimeer: 10000,
        },
      }),
    );
    dispatch(setLoading(false));
  };
  const isPNRHasTheInternational = () => {
    let isInternational = false;
    itineraryApiData?.journeysDetail?.forEach((jItem) => {
      if (isInternational) return; // if anyone segment has international then we consider as international
      // eslint-disable-next-line consistent-return
      jItem?.segments?.forEach((sItem) => {
        if (sItem?.international) {
          isInternational = true;
          return null;
        }
      });
    });
    return isInternational;
  };
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const setFfNumberVerified = (object) => {
    verifiedObject.ffData = JSON.parse(JSON.stringify(object));
  };

  const handleUpdateFfn = () => {
    const updateFFNPayload = { request: {
      PNR: bookingDetails.recordLocator,
      OTP: '',
      updateFFN: [],
    },
    };
    verifiedObject.ffData.forEach((data) => {
      if (data.paxFFNumberVerified === true) {
        updateFFNPayload.request.updateFFN.push({
          passengerKey: data.passengerKey,
          FFN: data.ffn,
          Title: data.title,
          FirstName: data.fname,
          LastName: data.lname,
        });
      }
    });

    const responseUpdateFfn = postUpdateFFN(updateFFNPayload);
    responseUpdateFfn.then((res) => {
      let updateFFNSuccessFlag = true;
      let errorMessage = ffNumberErrorMessage?.description?.html;
      if (!res?.response?.data) {
        updateFFNSuccessFlag = false;
        if (res?.response?.error?.message) {
          errorMessage = res?.response?.error?.message;
        }
      } else {
        res?.response?.data.forEach((resData) => {
          if (!resData.status) {
            updateFFNSuccessFlag = false;
          }
        });
      }
      if (updateFFNSuccessFlag) {
        dispatch(
          toggleToast({
            show: true,
            props: {
              title: '',
              description: ffNumberSuccessMessage?.description?.html,
              variation: notifySuccessVariation,
              containerClass: containerClassModify,
              infoIconClass: iconGreenVariation,
            },
          }),
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        const handleScroll = () => {
          window.removeEventListener('scroll', handleScroll);
          window.location.reload();
        };

        window.addEventListener('scroll', handleScroll);
      } else {
        dispatch(
          toggleToast({
            show: true,
            props: {
              title: '',
              description: errorMessage,
              variation: 'notifi-variation--Error',
              containerClass: containerClassModify,
            },
          }),
        );
      }
    });
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const viewCtaOperations = (operationName, buttonItem) => {
    const pnrValue = bookingDetails?.recordLocator || '';
    let payNowLink = '';
    const dataFromAEM = window?.msdv2 || {};
    const lastname = (passengersArray && passengersArray[0]?.name?.last) || '';
    const refurl = window.location.href;// after payment will redirect to itinerary page itself.
    const loginTypeObj = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.ROLE_DETAILS, true) || {};
    const formDataObj = {
      PNR: pnrValue,
      RoleCode: loginTypeObj?.roleCode || 'WWWA',
    };
    switch (operationName) {
      case TAB_KEYS.FLIGHTSTATUS:
        window.open(
          buttonItem?.link?.replace('pnrStr', bookingDetails.recordLocator),
          '_blank',
        );
        break;
      case TAB_KEYS.ADDBAGTAG:
        window.open(ENVCONFIG.ADDBAGTAG, '_blank');
        break;
      case TAB_KEYS.VIEWBAGTAG:
        window.open(ENVCONFIG.VIEWBAGTAG, '_blank');
        break;
      case TAB_KEYS.WHATSAPP:
        onClickWhatsappItinerary();
        break;
      case TAB_KEYS.ADDPAYMENT:
        if (dataFromAEM.payNowPagePath) {
          if (dataFromAEM.payNowPagePath.includes('?')) {
            payNowLink = `${dataFromAEM.payNowPagePath}&pnr=${pnrValue}&lastname=${lastname}&refurl=${refurl}`;
          } else {
            payNowLink = `${dataFromAEM.payNowPagePath}?pnr=${pnrValue}&lastname=${lastname}&refurl=${refurl}`;
          }
        }
        if (payNowLink) {
          window.open(payNowLink, '_self');
        }
        break;
      case TAB_KEYS.SPLITPNR:
        openUrlWithPostFormObj(buttonItem?.link, formDataObj);
        break;
      case TAB_KEYS.EMAIL || TAB_KEYS.EMAILITINERARY:
        setConfig(TAB_KEYS.EMAIL);
        break;
      case TAB_KEYS.CHANGEADDSEAT:
        localStorage.setItem(BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER, MODIFY_FLOW_IDENTIFIER.CHANGE_SEAT);
        window.open(buttonItem?.link, '_self');
        break;
      case TAB_KEYS.EDITADDONS:
        localStorage.setItem(BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER, MODIFY_FLOW_IDENTIFIER.CHANGE_ADDON);
        window.open(buttonItem?.link, '_self');
        break;
      case TAB_KEYS.SPECIALASSISTANT:
        localStorage.setItem(BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER, MODIFY_FLOW_IDENTIFIER.CHANGE_WHEELCHAIR);
        window.open(buttonItem?.link, '_self');
        break;
      case TAB_KEYS.SMARTCHECKIN:
      case TAB_KEYS.WEBCHECKIN: {
        if (isPNRHasTheInternational()) {
          if (internationalWebCheckInLink?.includes('bau=1')) {
            window.location.href = bindWithDeepLinkUrl(internationalWebCheckInLink, bookingDetails, passengersArray);
          } else {
            window.location.href = internationalWebCheckInLink || '';
          }
        } else {
          window.location.href = webCheckInLink || '';
        }
        break;
      }
      case TAB_KEYS.BOARDINGPASS: {
        const payload = {
          journeyKey: itineraryApiData?.journeysDetail?.[0]?.journeyKey,
          passengerKeys: [],
        };
        localStorage.setItem(BROWSER_STORAGE_KEYS.BOARDING_PASS_PAYLOAD, JSON.stringify(payload));
        window.location.href = buttonItem?.link || '';
        break;
      }
      case TAB_KEYS.UNDOCHECKIN:
        window.location.href = undoWebCheckInCtaPath || '';
        break;
      case TAB_KEYS.VISASERVICE:
        window.open(buttonItem?.link, '_self');
        break;
      default:
    }
  };

  const bindOperations = (buttonItem, parentTabNames) => {
    const paymentCode = paymentsDetails.some((payment) => payment.code === TAB_KEYS.PYAMENT_CODE);
    const upperButtonCode = buttonItem?.code?.toUpperCase() || buttonItem?.buttonCode?.toUpperCase();
    const isChangeFlightTab = upperButtonCode === TAB_KEYS.CHANGEFLIGHT;
    const isPartialRedemptionMatch = TAB_KEYS?.IBCVOUCHER_CANCELLED_PNR === isPartialRedemption;
    if (isPartialRedemptionMatch && paymentCode && isChangeFlightTab) {
      const codeMesage = bookingDetails.changeFlightValidation?.code;
      const errorObj = getErrorMsgForCode(codeMesage);
      const { message } = errorObj;
      dispatch(
        toggleToast({
          show: true,
          props: {
            title: '',
            variation: 'notifi-variation--warning',
            description: message,
            containerClass: 'itienararay--success itinearary-success-toast',
            autoDismissTimeer: 10000,
          },
        }),
      );
      return;
    }

    const disableAEMReasonObj = disableReasonCodeMap?.find((it) => {
      return it?.key?.toLowerCase() === buttonItem?.disbaleReason?.toLowerCase();
    }) || {};
    let toastMsgText = disableAEMReasonObj?.value
    || (buttonItem?.disbaleReason && DISABLE_REASON_CODE[buttonItem?.disbaleReason]);
    const isLoggedInLoyaltyUser = authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.ffn;

    if (bookingDetails?.isRedeemTransaction && !isLoggedInLoyaltyUser
      && [TAB_KEYS.CANCELBOOKING, TAB_KEYS.CANCELFLIGHT, TAB_KEYS.CHANGEFLIGHT].includes(upperButtonCode)) {
      // modification not allowed if its not loggedIn user and if its redeem PNR
      toastMsgText = loginCancellationMsg;
    }
    if (toastMsgText) {
      // disabled feature - we should not allow user to proceed
      dispatch(
        toggleToast({
          show: true,
          props: {
            title: '',
            description: toastMsgText,
            variation: notifySuccessVariation,
            containerClass: containerClassModify,
            autoDismissTimeer: 10000,
            infoIconClass: iconGreenVariation,
          },
        }),
      );
      return;
    }
    const isChildItem = buttonItem?.label;
    // analytics - START
    // Adobe Analytics
    pushAnalytic({
      data: {
        _event: 'modifyActionPopup',
        _eventInfoName: !isChildItem ? parentTabNames : buttonItem?.label,
        _componentName: parentTabNames,
        pnrResponse: { ...itineraryApiData },
      },
      event: 'click',
      error: {},
    });
    // Google Analytics
    pushDataLayer({
      data: {
        _event: 'link_click',
        pnrResponse: { ...itineraryApiData },
      },
      event: 'link_click',
      props: {
        clickText: !isChildItem ? parentTabNames : buttonItem?.label,
        clickNav: `${buttonItem?.label}>${parentTabNames}`,
      },
    });
    viewCtaOperations(upperButtonCode, buttonItem);
    if (
      [
        TAB_KEYS.CHANGEFLIGHT,
        TAB_KEYS.CANCELFLIGHT,
        TAB_KEYS.CANCELBOOKING,
        TAB_KEYS.UPDATECONTACTDETAILS,
        TAB_KEYS.EMAIL,
        TAB_KEYS.EMAILITINERARY,
        TAB_KEYS.FFNUMBER,
      ].includes(upperButtonCode)
    ) {
      setConfig(upperButtonCode);
    }
  };

  const renderFunctionality = () => {
    if (config === TAB_KEYS.CHANGEFLIGHT) {
      return (
        <FlightOperation
          onClose={handleClose}
          moduleFor={FLIGHT_OPERATIONS_MODULE.CHANGEFLIGHTSELECTION}
          refreshData={refreshData}
        />
      );
    }
    if (config === TAB_KEYS.CANCELFLIGHT) {
      return (
        <FlightOperation
          onClose={handleClose}
          moduleFor={FLIGHT_OPERATIONS_MODULE.CANCELFLIGHTSELECTION}
          refreshData={refreshData}
        />
      );
    }
    if (config === TAB_KEYS.CANCELBOOKING) {
      return (
        <FlightOperation
          onClose={handleClose}
          moduleFor={FLIGHT_OPERATIONS_MODULE.CANCELBOOKINGSELECTION}
          refreshData={refreshData}
        />
      );
    }
    if (config === TAB_KEYS.UPDATECONTACTDETAILS) {
      return <UpdateContactModal onClose={handleClose} key={uniq()} />;
    }
    if ((config === TAB_KEYS.EMAIL) || (config === TAB_KEYS.EMAILITINERARY)) {
      return <EmailItinerary onClose={handleClose} showToast={config} key={uniq()} />;
    }
    if (config === TAB_KEYS.FFNUMBER) {
      return (
        <FrequentFlyer
          onClose={handleClose}
          showToast={config}
          key={uniq()}
          handleUpdateFfn={handleUpdateFfn}
          setFfNumberVerifiedObject={setFfNumberVerified}
        />
      );
    }
    return null;
  };

  const isPrintEnable = (flag) => {
    switch (flag) {
      case TAB_KEYS.DOWNLOAD:
        return true;
      case TAB_KEYS.SHARE:
        return true;
      case TAB_KEYS.WALLET:
        return true;
      default:
        return null;
    }
  };

  const disabledIconForRedemption = (code) => {
    const isChangeFlight = TAB_KEYS?.CHANGEFLIGHT === code;
    const isPartial = isPartialRedemption === TAB_KEYS?.PARTIAL_REDEMPTION;
    return !!((isChangeFlight && isPartial));
  };

  return (
    <>
      {config && renderFunctionality()}
      {list
        && list.map((item) => {
          const upperButtonCode = item?.code?.toUpperCase() || item?.buttonCode?.toUpperCase();
          if (!upperButtonCode) {
            return null;
          }
          if ([TAB_KEYS.SHARE, TAB_KEYS.WALLET].includes(upperButtonCode)) {
            return null;
          }
          if (isPrintEnable(upperButtonCode)) {
            return (
              <PrintHome key={uniq()}>
                <div
                  key={`${uniq()}-PrintHome`}
                  role="button"
                  tabIndex="0"
                  className="tab-cta"
                  data-button-code={item.code}
                >
                  <div
                    className={`tab-cta-icon  ${
                      item?.iconClass !== undefined
                        ? item?.iconClass
                        : item?.icon
                    }`}
                  />
                  <div className="tab-cta-label"> {
                  item?.label !== undefined ? (item?.label) : (item?.buttonValue)
                  }
                  </div>
                </div>
              </PrintHome>
            );
          }
          return (
            <div
              key={`${uniq()}-cta`}
              aria-hidden="true"
              className={`tab-cta ${disabledIconForRedemption(upperButtonCode) ? 'disableCashPoint' : ''}`}
              onKeyDown={(e) => { if (e.key === 'Enter') bindOperations(item, parentTabName); }}
              onClick={() => !disabledIconForRedemption(upperButtonCode) && bindOperations(item, parentTabName)}
              data-button-code={item.code}
            >
              <div
                className={`tab-cta-icon  ${
                  item?.iconClass !== undefined ? item?.iconClass : item?.icon
                }`}
              >
                {' '}
              </div>
              <div className="tab-cta-label"> {item?.label !== undefined ? (item?.label) : (item?.buttonValue)}</div>
            </div>
          );
        })}
    </>
  );
}

NavButtonList.propTypes = {
  list: PropTypes.array,
  refreshData: PropTypes.any,
  parentTabName: PropTypes.any,
};

export default NavButtonList;
