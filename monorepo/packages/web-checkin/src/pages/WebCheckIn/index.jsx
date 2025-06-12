import React, { useState, useEffect, useMemo, useRef } from 'react';
import format from 'date-fns/format';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { paxCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import CheckBox from 'skyplus-design-system-app/dist/des-system/CheckBox';

import FlightDetail from '../../components/FlightDetail/FlightDetail';
import gtmEvent from '../../utils/gtmEvents';
import analyticsEvent from '../../utils/analyticsEvent';

import AddServices from '../common/AddServices';
import PassportEligibiltyModal from '../../components/PassportEligibiltyModal/PassportEligibiltyModal';
import useAppContext from '../../hooks/useAppContext';
import { webcheckinActions } from '../../context/reducer';
import {
  getCountriesData,
  getJournies,
  getPassengerHealthForm,
  getPrivacyPolicyData,
  policyConsent,
  postPassengerhealthform,
  postTravelDocuments,
} from '../../services';
import FormWrapper from './FormWrapper';

import {
  checkinTypes,
  localStorageKeys,
  GTM_ANALTYTICS,
  ANALTYTICS,
  EMERGENCY_STATUS_CODE,
  dateFormats,
} from '../../constants';
import WithPageLoader from '../../hoc/withPageLoader';
import LocalStorage from '../../utils/LocalStorage';
import Validator from '../../utils/Validation/Validator';
import { contactInfoSchema, visaFormSchema, formSchema } from './schemas';
import {
  getPassenderDocumentsData,
  getPassengerPostData,
  prefilledPostData,
} from './utils';
import useGetSSR from '../../hooks/useGetSSR';
import MinorConsent from '../../components/MinorConsent/MinorConsent';
import { setAnaltyicsContext } from '../../utils/analytics/webcheckin-home';
import usePageTitle from '../../hooks/usePageTitle';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';

const { TRIGGER_EVENTS } = ANALTYTICS;

const WebCheckIn = () => {
  const [showEligilbilty, setShowEligilbilty] = useState(false);
  const [travelDocument, setTravelDocument] = useState([]);
  const [minorConsent, setMinorConsent] = useState({
    showpopup: false,
    passengers: [],
  });
  const [gdpr, setGdpr] = useState(false);
  const [gdprGetData, setGdprGetData] = useState({});
  useGetSSR();

  usePageTitle('checkinPassenger.headingTitle');

  const [journey, setJourney] = useState({
    bookingDetails: null,
    journeysDetail: null,
    recommendedSSR: [],
    departureDate: new Date(),
    emergencyData: null,
  });
  const {
    dispatch,
    state: {
      aemModel,
      formData,
      minorConsentSelection,
      emergencyDetails,
      emergencyDetailsFormError,
      formErrors
    },
    aemLabel,
  } = useAppContext();

  const onClosEligilbiltyModel = () => {
    setShowEligilbilty(false);
  };

  const isInternational = journey?.journeysDetail?.segments?.some(
    (r) => r.international === true,
  );

  const responseRef = useRef(null);

  const {
    webCheckInTitle,
    addPassengerDetailsDescLabel,
    addPassengerDetailsLabel,
    mandatoryFieldLabel,
    passengerDetails,
    nextLink,
    seatTitle,
    seatDescription,
    gdprConsent,
  } = aemModel.checkinPassenger;

  useEffect(() => {
    const getApiData = async () => {
      try {
        const [response, countries, gdprResponse, travelDocuments] = await Promise.all([
          getJournies(),
          getCountriesData(),
          getPrivacyPolicyData(),
          getPassengerHealthForm(),
        ]);
        responseRef.current = response;
        if (response?.data?.bookingDetails) {
          const { journeyKey, type } = LocalStorage.getAsJson(
            localStorageKeys.c_p_d,
          );

          const jourenies =
            type === checkinTypes.SCHEDULE
              ? response?.data?.smartCheckinJourneysDetail
              : response?.data?.journeysDetail;

          const journeysDetail = jourenies?.find(
            (row) => row.journeyKey === journeyKey,
          );

          const selected = LocalStorage.getAsJson(localStorageKeys.c_p_d, {
            type: checkinTypes.NORMAL,
            passengers: [],
          });
          const { passengerKeys } = selected;
          const selectedPassengers = prefilledPostData(
            journeysDetail,
            travelDocuments,
            passengerKeys,
            passengerDetails,
          );

          const minorPassengers = selectedPassengers?.filter((passenger) => {
            const seatsAndSsrs = passenger?.segments[0]?.passengerSegment?.seatsAndSsrs;
            const isSeniorCitizen = seatsAndSsrs?.some((item) => item.ssrCode ===
              paxCodes?.seniorCitizen?.discountCode);
            return (
              passenger?.passengerTypeCode === paxCodes.adult.code &&
              passenger?.discountCode === null &&
              !isSeniorCitizen
            );
          });

          const findFilledAddress = response?.data?.EmergencyDetails?.find(
            (value) => value.addresses.length > 0,
          );
          const emergency_data =
            findFilledAddress?.addresses?.find(
              (statusCode) => statusCode.status == EMERGENCY_STATUS_CODE,
            ) || {};

          setMinorConsent((prev) => ({ ...prev, passengers: minorPassengers }));
          setJourney({
            journeysDetail: {
              ...journeysDetail,
              passengers: [...selectedPassengers],
            },
            bookingDetails: response?.data?.bookingDetails,
            recommendedSSR: response?.data?.recommendedSSR || [],
            departureDate: new Date(journeysDetail?.journeydetail?.departure),
            emergencyData: emergency_data,
          });
          if(!gdprResponse?.errors){
          let minorConsentSelect = new Set();
          gdprResponse?.forEach((item) => {
            if (minorPassengers?.some(x => x.passengerKey === item?.PassengerKey)) {
              minorConsentSelect.add(item?.PassengerKey)
            }
          })
          if (minorConsentSelect.size > 0) {
            dispatch({
              type: webcheckinActions.SET_MINOR_CONSENT_SELECTION,
              payload: {selection: minorConsentSelect} ,
            });
          }
        }
          setGdprGetData(gdprResponse);

          dispatch({
            type: webcheckinActions.SET_API_DATA,
            payload: {
              countries: countries?.countries,
              formData: [...selectedPassengers],
              formErrors: selectedPassengers.map(() => ({})),
              getMinorConsentData: gdprResponse,
            },
          });

          const aContext = setAnaltyicsContext(response);

          analyticsEvent({
            event: TRIGGER_EVENTS.WEBCHECKIN_FLIGHT_DETAILS_LOAD,
            data: {},
          });

          gtmEvent({
            event: GTM_ANALTYTICS.EVENTS.FLIGHT_STATUS_CHECKIN_PAGE_LOAD,
            data: {
              currency_code: response?.data?.bookingDetails?.currencyCode,
              OD: aContext?.gtmData?.OD,
              trip_type: aContext?.productInfo?.tripType,
              pax_details: aContext?.gtmData?.pax_details,
              departure_date: aContext?.gtmData?.departure_date,
              special_fare: aContext?.productInfo?.specialFare,
              flight_sector: aContext?.gtmData?.flight_sector,
              days_until_departure: aContext?.productInfo?.daysUntilDeparture,
            },
          });
        } else {
          dispatch({
            type: webcheckinActions.SET_TOAST,
            payload: {
              variation: 'Error',
              show: true,
              description: response?.aemError?.message,
            },
          });
          dispatch({
            type: webcheckinActions.SET_API_DATA,
            payload: {},
          });
        }
      } catch (err) {
        console.log({ err });

        // Error Handling
      } finally {
        dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
      }
    };

    getApiData();
  }, []);

  const onClickNexthandler = async () => {
    analyticsEvent({
      event: TRIGGER_EVENTS.WEBCHECKIN_FLIGHT_DETAILS_NEXT,
      data: {},
    });

    const aContext = setAnaltyicsContext(responseRef?.current);

    gtmEvent({
      event: GTM_ANALTYTICS.EVENTS.FLIGHT_STATUS_CHECKIN,
      data: {
        currency_code: responseRef?.current?.data?.bookingDetails?.currencyCode,
        OD: aContext?.gtmData?.OD,
        trip_type: aContext?.productInfo?.tripType,
        pax_details: aContext?.gtmData?.pax_details,
        departure_date: aContext?.gtmData?.departure_date,
        special_fare: aContext?.productInfo?.specialFare,
        flight_sector: aContext?.gtmData?.flight_sector,
        days_until_departure: aContext?.productInfo?.daysUntilDeparture,
      },
    });

    try {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: true });
      const pnr = journey.bookingDetails.recordLocator;
      try {
        const policyResponse = await policyConsent(
          pnr,
          journey,
          minorConsentSelection,
        );

        if (policyResponse?.data?.success === false) {
          dispatch({
            type: webcheckinActions.SET_TOAST,
            payload: {
              variation: 'Error',
              show: true,
              description: policyResponse?.aemError?.message,
            },
          });
          return;
        }
      } catch (err) {
        // Error Handling
      }
      const { journeyKey } = journey.journeysDetail;

      // If International Journey
        let postTravelDocResponse = {}
      if (isInternational) {
        const passengertravelDocuments = getPassenderDocumentsData(formData);
        postTravelDocResponse = await postTravelDocuments({
          passengertravelDocuments,
        });

        if(!postTravelDocResponse?.errors){
          const ineligibleCount = postTravelDocResponse?.docCheckStatus?.filter(
            (doc) => !doc?.documentCheckStatus,
          )?.length;

          if (ineligibleCount > 0) {
            setShowEligilbilty(postTravelDocResponse?.docCheckStatus);
            setTravelDocument(postTravelDocResponse?.docCheckStatus);
            return;
          }
        }
        else{
          dispatch({
            type: webcheckinActions.SET_TOAST,
            payload: {
              variation: 'Error',
              show: true,
              description: getErrorMsgForCode('default'),
            },
          });  
        }

      }

      const passengerData = getPassengerPostData(
        formData,
        journeyKey,
        emergencyDetails,
      );
      await postPassengerhealthform(passengerData);

      const { type, passengerKeys } = LocalStorage.getAsJson(
        localStorageKeys.c_p_d,
      );

      const manualCheckinRequestPayload = {
        baggageDeclarationRequest: [],
        manualCheckinRequest: [
          {
            journeyKey,
            passengerkeys: passengerKeys.map((passengerKey) => ({
              passengerKey,
            })),
            isSmartCheckin: type === checkinTypes.SCHEDULE,
          },
        ],
      };

      LocalStorage.set(localStorageKeys.m_c_r, manualCheckinRequestPayload);
      if(isInternational && !postTravelDocResponse?.errors) {
        window.location.href = nextLink;
      }else if(!isInternational) {
        window.location.href = nextLink;
      }
    } catch (err) {
      // Handling Error
      dispatch({
        type: webcheckinActions.SET_TOAST,
        payload: {
          variation: 'Error',
          show: true,
          description: err?.aemError?.message,
        },
      });
    } finally {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
    }
  };

  const schema = {
    ...contactInfoSchema,
    ...(isInternational && { ...formSchema, ...visaFormSchema }),
  };
const isFormError = formErrors?.some(err => Object.values(err).some(Boolean));
  const isDataInValid =
    formData.some((data, i, arr) => {
      const errors = Validator.validate(schema, data);
      if(data?.passengerTypeCode === "INFT"){
        errors['email'] = '';
        errors['mobile'] = '';
      }
      const { passengerTypeCode, consent } = data;

      if (
        [paxCodes.infant.code, paxCodes.children.code].includes(
          passengerTypeCode,
        ) &&
        consent !== true
      ) {
        errors.consent = 'Please accept the consent';
      }

      const allVisaIds = arr.map((p) => p.visaUidNumber ?? '').filter(Boolean);
      const allVisaUniqueIds = new Set([...allVisaIds]);
      const allpassportNumbers = arr
        .map((p) => p.passportNumber ?? '')
        .filter(Boolean);
      const allpassportUniueNumbers = new Set([...allpassportNumbers]);

      if (allVisaIds.length !== allVisaUniqueIds.size && isInternational) {
        errors.visaUidNumber = 'Invalid';
      }

      if (
        allpassportNumbers.length !== allpassportUniueNumbers.size &&
        isInternational
      ) {
        errors.passportNumber = 'Invalid';
      }
      return Object.values(errors).filter(Boolean).length > 0;
    }) ||
    !formData?.[0]?.mobile ||
    !gdpr 

  const aemLabels = useMemo(() => {
    return {
      nextLabel: aemLabel('checkinPassenger.nextLabel'),
      gdprConsentLabel: aemLabel(
        'checkinPassenger.gdprConsentLabel',
        'GDPR consent placeholder',
      ),
      gdprOptions: aemLabel('checkinPassenger.gdprOptions', [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ]),
      minorConsentDescription: aemLabel(
        'checkinPassenger.euCitizenOfAgeTravelling',
      ),
    };
  }, [aemLabel]);

  const onCloseMinorConsent = () => {
    setMinorConsent((prev) => ({ ...prev, showpopup: false }));
  };

  const onChangeMinorConsent = (e) => {
    if (e === 'No') {
      dispatch({
        type: webcheckinActions.CLEAR_MINOR_CONSENT_SELECTION,
      });
      setGdprGetData(null)
    } else {
      setMinorConsent((prev) => ({ ...prev, showpopup: e === 'Yes' }));
    }
  };

  const openMinorConsent = () => {
    setMinorConsent((prev) => ({ ...prev, showpopup: true }));
  };

  const handleGDPRAccept = () => {
    setGdpr((prev) => !prev);
  };

  return (
    <div>
      <div className="wc-international-web-checkin d-flex gap-8">
        <div className="col-9 wc-webcheckin-left2">
          <HtmlBlock tagName="h2" html={webCheckInTitle?.html} />

          {journey.bookingDetails && (
            <div className="mt-12">
              <FlightDetail
                journey={journey.journeysDetail}
                bookingDetails={journey.bookingDetails}
              />
              <HtmlBlock tagName="h4" html={addPassengerDetailsLabel?.html} />

              <Text variation="body-medium-regular text-text-tertiary my-4">
                {addPassengerDetailsDescLabel}
              </Text>
              <Text variation="body-medium-lite text-text-tertiary my-4 mb-12">
                {mandatoryFieldLabel}
              </Text>
              <FormWrapper
                passengers={journey?.journeysDetail?.passengers}
                departureDate={journey.departureDate}
                isInternational={isInternational}
                aemData={aemModel.checkinPassenger}
                openMinorConsent={openMinorConsent}
                minorConsentDescription={aemLabels.minorConsentDescription}
                gdprOptions={aemLabels.gdprOptions}
                onChangeMinorConsent={onChangeMinorConsent}
                minorConsentSelection={minorConsentSelection}
                emergencyData={journey.emergencyData}
                gdprGetData={gdprGetData}
              />

              <CheckBox
                onChangeHandler={handleGDPRAccept}
                checked={gdpr}
                id="gdpr-consent"
              >
                <HtmlBlock html={gdprConsent?.html} />
              </CheckBox>
            </div>
          )}
        </div>
        {(seatTitle || seatDescription) && <AddServices />}
      </div>
      {showEligilbilty && (
        <PassportEligibiltyModal
          formData={formData}
          journey={journey}
          onClose={onClosEligilbiltyModel}
          travelDocument={travelDocument}
        />
      )}
      <div className="wc-footer">
        <div className="wc-footer-wrapper">
          <Button onClick={onClickNexthandler} disabled={isDataInValid || isFormError}>
            {aemLabels.nextLabel}
          </Button>
        </div>
      </div>

      {minorConsent.showpopup && (
        <MinorConsent
          paxDetails={minorConsent?.passengers}
          onCloseHandler={onCloseMinorConsent}
        />
      )}
    </div>
  );
};

export default WithPageLoader(WebCheckIn);
