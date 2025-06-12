import React, { useState } from 'react';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';
import { setItineraryDetails, setExploreCities } from '../../store/itinerary';
import { setLoading, toggleToast } from '../../store/configData';
import { makePNRSearch, makeExploreCityReq } from '../../services';
import { pushAnalytic } from '../../utils/analyticEvents';
import { pushDataLayer } from '../../utils/dataLayerEvents';
import { CONSTANTS } from '../../constants';

const RetrieveItinerary = ({ onClose, closeToast = () => {} }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    pnr: '',
    flighdetails: {
      label: '6E',
      value: '6E',
    },
  });

  const ssrListAbbreviation = useSelector((state) => state.itinerary.ssrListAbbreviation);

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoadingButton] = useState(false); // NOSONAR
  const [error, setError] = useState({});
  const [isEnableToRetrivePnr, setEnableToRetrivePnr] = useState(true);

  const dispatch = useDispatch();
  const mfAdditionalData = useSelector((state) => state.itinerary?.mfAdditionalDatav2) || {};
  const {
    retrieveItinerarySection,
  } = mfAdditionalData?.itineraryAdditionalByPath?.item || '';
  const getExploreCities = async (journey) => {
    const cityCode = journey?.length > 0
      ? journey[0].journeydetail.destination
      : '';
    if (!cityCode) return;
    const { response } = await makeExploreCityReq(cityCode);
    if (response?.data?.iataDetailsList?.items?.length > 0) {
      const { items } = response?.data?.iataDetailsList || {};
      dispatch(setExploreCities({ data: items }));
    }
  };

  function containsSpecialChars(str) {
    // eslint-disable-next-line no-useless-escape
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; // NOSONAR
    return specialChars.test(str);
  }

  const onChangeFormData = (key, value) => {
    const temp = { ...formData };
    temp[key] = value;
    if (temp.lastName !== '' && temp.pnr !== '' && isEnableToRetrivePnr) {
      setEnableToRetrivePnr(false);
    } else if ((temp.lastName === '' || temp.pnr === '') && !isEnableToRetrivePnr) {
      setEnableToRetrivePnr(true);
    }
    setFormData(temp);
  };
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const onClickContinue = async () => {
    const errorObj = {};
    if (Object.keys(errorObj).length < 1) {
      setLoadingButton(true);
      let pnr = formData.pnr || '';
      if (formData.flighdetails.value === 'TK') {
        pnr += formData.flighdetails.value;
      }

      dispatch(setLoading(true));
      localStorage.removeItem(CONSTANTS.BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER);
      const data = await makePNRSearch(pnr, formData.lastName);
      const isPNRFoundInResponse = data?.bookingDetails?.recordLocator
      || data?.bookingDetails?.bookingStatus;
      setLoadingButton(false);
      if (data && data.error) {
        closeToast(true);
        // eslint-disable-next-line no-unused-expressions
        onClose && onClose();
        const getErrorMsg = getErrorMsgForCode(data.errorCode);
        const { message } = getErrorMsg;
        dispatch(
          toggleToast({
            show: true,
            props: {
              title: 'Error',
              description: message,
              variation: 'notifi-variation--error',
              autoDismissTimeer: 10000,
            },
          }),
        );
        pushAnalytic({
          data: {
            pnrResponse: { ...data },
            _event: 'itineraryPageLoad',
            isPlKey: !pnr,
            ssrListAbbreviation,
          },
          event: 'itineraryPageLoad',
          error: Object.create(null, {
            code: { value: data.errorCode, enumerable: true },
            message: { value: message, enumerable: true },
          }),
        });
        pushAnalytic({
          data: {
            pnrResponse: { ...data },
            _event: 'warning',
            isPlKey: !pnr,
            ssrListAbbreviation,
            warning: true,
            warningMessage: message,
          },
          event: 'warning',
          error: Object.create(null, {
            code: { value: data.errorCode, enumerable: true },
            message: { value: message, enumerable: true },
          }),
        });
      } else {
        // eslint-disable-next-line no-unused-expressions
        onClose && onClose();
        dispatch(setItineraryDetails({ data }));
        getExploreCities(data?.journeysDetail);
        if (data?.iataDetailsList?.items?.length > 0) {
          const { items } = data?.iataDetailsList || {};
          dispatch(setExploreCities({ data: items }));
        }
        if (isPNRFoundInResponse) {
          // Adobe Analytic
          pushAnalytic({
            data: {
              pnrResponse: { ...data },
              _event: 'itineraryPageLoad',
              isPlKey: !pnr,
              ssrListAbbreviation,
            },
            event: 'itineraryPageLoad',
            error: {},
          });
          // Gtm Analytic
          pushDataLayer({
            data: {
              _event: 'page-load',
              pnrResponse: { ...data },
            },
            event: 'page-load',
          });
        }
      }
      setEnableToRetrivePnr(true);
      dispatch(setLoading(false));
    }
    setError(errorObj);
  };
  const onKeyHandler = (event) => {
    if (event.key === 'Enter') {
      onClickContinue();
    }
  };
  const inputProps = {
    onKeyPress: onKeyHandler,
  };
  return (
    <OffCanvas
      containerClassName="skp-retrieve-pnr"
      onClose={onClose}
      renderFooter={() => {
        return (
          <Button
            containerClass={`continue retrieve-pnr-cta ${isEnableToRetrivePnr ? 'disabled' : ''}`}
            onClick={onClickContinue}
            tabIndex="0"
          >
            {retrieveItinerarySection?.retrieveItineraryCtaText || 'Retrieve Itinerary'}
          </Button>
        );
      }}
    >
      <div className="itinerary-retrieve-slider">
        <HtmlBlock
          className="itinerary-retrieve-slider-title"
          html={retrieveItinerarySection?.findYourBookingLabel?.html.replace('\\&quot;', ' ').replace('\\&quot;', ' ')}
        />
        <div className="itinerary-retrieve-slider-firstbox">
          <InputField
            placeholder={retrieveItinerarySection?.pnrBookingReferenceLabel || 'PNR/Booking Reference'}
            // eslint-disable-next-line consistent-return
            onChangeHandler={(e) => {
              const { value } = e.target;
              if (containsSpecialChars(value)) {
                return null;
              }
              onChangeFormData('pnr', value);
            }}
            value={formData.pnr}
            variation="DEFAULT"
            error={error.pnr}
            customClass="itinerary-retrieve-slider--field"
            inputProps={inputProps}
            maxLength={6}
            register={() => {}}
            hideLabel={false}
          />
        </div>

        <InputField
          placeholder={retrieveItinerarySection?.emailLastNameLabel || 'Email/Last Name'}
          onChangeHandler={(e) => {
            const { value } = e.target;
            onChangeFormData('lastName', value);
          }}
          value={formData.lastName}
          variation="DEFAULT"
          error={error.lastName}
          customClass="itinerary-retrieve-slider--field"
          inputProps={inputProps}
          register={() => {}}
          hideLabel={false}
        />
      </div>
    </OffCanvas>
  );
};

RetrieveItinerary.propTypes = {
  onClose: PropTypes.func,
  closeToast: PropTypes.func,
};
export default RetrieveItinerary;
