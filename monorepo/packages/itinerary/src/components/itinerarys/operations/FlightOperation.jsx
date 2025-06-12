import React, { useEffect, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { UTIL_CONSTANTS, formatDate } from '../../../utils';
import { CONSTANTS } from '../../../constants';
import { makeCancelBookingReq, makeCancelFlightReq } from '../../../services';
import { setLoading, toggleToast } from '../../../store/configData';
import BookingInfo from '../../BookingInfo/BookingInfo';
import { pushAnalytic } from '../../../utils/analyticEvents';
import { pushDataLayer } from '../../../utils/dataLayerEvents';
import { findTripType } from '../../Passengers/dataConfig';

export const FLIGHT_OPERATIONS_MODULE = {
  CREDITSHELL: 'CREDITSHELL',
  CHANGEFLIGHTSELECTION: 'CHANGEFLIGHTSELECTION',
  CANCELFLIGHTSELECTION: 'CANCELFLIGHTSELECTION',
  CANCELBOOKINGSELECTION: 'CANCELBOOKINGSELECTION',
};

const {
  PASSENGER_TYPE,
  BROWSER_STORAGE_KEYS,
  MODIFY_FLOW_IDENTIFIER,
  PASSENGER_EXTRA_SEAT: {
    DOUBLE_SEAT_DISCOUNT_CODE,
    TRIPLE_SEAT_DISCOUNT_CODE,
    EXTRASEATTAG_DOUBLE,
    EXTRASEATTAG_TRIPLE,
  },
  PNR_TYPE,
  PAYWITH_MODES,
} = CONSTANTS;

const FlightOperation = ({ onClose, moduleFor, refreshData }) => {
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({});
  const mfDataAdditionalv2 = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath.item,
  ) || [];
  const mfBookingData = useSelector(
    (state) => state.itinerary?.mfDatav2?.itineraryMainByPath.item,
  ) || [];
  const journeyDetails = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const passengerListArray = useSelector((state) => state.itinerary?.apiData?.passengers) || [];
  const adultCount = passengerListArray?.length || 0;
  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const bookingDetails = (itineraryApiData && itineraryApiData.bookingDetails) || {};

  const [activeModule, setActiveModule] = useState('');
  const dispatch = useDispatch();
  const tripType = journeyDetails && findTripType(journeyDetails);

  const moduleForConfig = {
    [FLIGHT_OPERATIONS_MODULE.CHANGEFLIGHTSELECTION]: {
      heading: mfDataAdditionalv2?.changeFlightDetails?.heading,
      description:
        mfDataAdditionalv2?.changeFlightDetails?.description?.html || '',
      className: 'change-flight',
      options: [
        {
          label: mfDataAdditionalv2?.changeFlightDetails?.ctaLabel,
          value: FLIGHT_OPERATIONS_MODULE.CHANGEFLIGHTSELECTION,
        },
        // {
        //   label: mfDataAdditionalv2.changeFlightDetails?.secondaryCtaLabel,
        //   value: FLIGHT_OPERATIONS_MODULE.CANCELBOOKINGSELECTION,
        // },
      ],
    },
    [FLIGHT_OPERATIONS_MODULE.CANCELBOOKINGSELECTION]: {
      options: [
        {
          label: mfDataAdditionalv2?.changeFlightDetails?.ctaLabel, // eslint-disable-line sonarjs/no-duplicate-string
          value: FLIGHT_OPERATIONS_MODULE.CANCELFLIGHTSELECTION,
        },
        {
          label: mfDataAdditionalv2?.cancelFlightDetails?.secondaryCtaLabel,
          value: FLIGHT_OPERATIONS_MODULE.CANCELBOOKINGSELECTION,
        },
      ],
    },
    [FLIGHT_OPERATIONS_MODULE.CANCELFLIGHTSELECTION]: {
      heading: mfDataAdditionalv2?.cancelFlightDetails?.heading,
      description:
        mfDataAdditionalv2?.cancelFlightDetails?.description?.html || '',
      className: 'cancel-flight',
      options: [
        {
          label: mfDataAdditionalv2?.cancelFlightDetails?.ctaLabel,
          value: FLIGHT_OPERATIONS_MODULE.CANCELFLIGHTSELECTION,
        },
        {
          label: mfDataAdditionalv2?.cancelFlightDetails?.secondaryCtaLabel,
          value: FLIGHT_OPERATIONS_MODULE.CANCELBOOKINGSELECTION,
        },
      ],
    },
  };

  const moduleContentConfig = moduleForConfig[moduleFor] || [];

  useEffect(() => {
    setActiveModule(moduleFor);
  }, [moduleFor]);

  const onSelectCheckBox = (selectedJourneyItem = {}) => {
    const temp = { ...formData };
    const currentJourneyKey = selectedJourneyItem?.journeyKey;
    if (temp[currentJourneyKey]) {
      delete temp[currentJourneyKey];
    } else {
      temp[currentJourneyKey] = {
        isChecked: true,
        key: currentJourneyKey,
      };
    }
    setFormData(temp);
  };

  const onConfirmCancelFlight = async () => {
    const selectedJouneyKeys = Object.keys(formData).map((keyItem) => {
      return { journeykey: keyItem };
    });
    const payload = {
      journeys: selectedJouneyKeys,
    };
    dispatch(setLoading(true));
    const response = await makeCancelFlightReq(payload);
    dispatch(setLoading(false));
    if (response && response.isSuccess) {
      localStorage.setItem(
        BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER,
        MODIFY_FLOW_IDENTIFIER.CANCEL_FLIGHT,
      );
      refreshData(MODIFY_FLOW_IDENTIFIER.CANCEL_FLIGHT);
      onClose();
    } else if (!response?.isSuccess) {
      // eslint-disable-next-line no-nested-ternary
      const err = Array.isArray(response?.response?.errors)
        ? response?.response?.errors[0]
        : response?.response?.error
          ? response?.response?.error
          : response?.response?.errors;

      const errorObj = getErrorMsgForCode(err?.code);
      const { message } = errorObj;
      dispatch(
        toggleToast({
          show: true,
          props: {
            title: 'Error',
            description: message || 'Something went wrong',
            variation: 'notifi-variation--error',
          },
        }),
      );
      pushAnalytic({
        data: {
          _event: 'cancelFlightPopupOpen',
          _eventInfoName: 'Cancel Flight',
        },
        event: 'click',
        error: Object.create(null, {
          code: { value: err?.code, enumerable: true },
          message: { value: message, enumerable: true },
        }),
      });
    }
    // will make the API call
    // setIsShowConfirmProceed(false);
    // setCancelFlight(false);
    // Adobe Analytic
    pushDataLayer({
      data: {
        _event: 'link_click',
        pnrResponse: { ...itineraryApiData },
      },
      event: 'link_click',
      props: {
        clickText: 'Proceed',
        clickNav: 'Proceed>Cancel Flight',
      },
    });
    pushAnalytic({
      data: {
        _event: 'cancelFlightPopupOpen',
        _eventInfoName: 'Cancel Flight',
      },
      event: 'click',
      error: {},
    });
  };

  const renderFlightList = () => {
    return journeyDetails?.map((info) => {
      if (activeModule === FLIGHT_OPERATIONS_MODULE.CHANGEFLIGHTSELECTION && !info?.journeydetail?.canBeChanged) {
        // we should not show the flight which not appliable for change
        return;
      }
      if (activeModule === FLIGHT_OPERATIONS_MODULE.CANCELFLIGHTSELECTION && !info?.journeydetail?.canBeCancelled) {
        // we should not show the flight which not appliable for cancel
        return;
      }
      const journeyKey = info?.journeyKey;
      // eslint-disable-next-line consistent-return
      return (
        <div
          aria-hidden="true"
          key={uniq()}
          className="flight-card"
          onClick={() => {
            setChecked(!checked);
            onSelectCheckBox(info);
          }}
        >
          <div>
            <div className="travel-info">
              <span className="source">{info?.journeydetail?.origin}</span>
              <span className="dots" />
              <span className="dest">{info?.journeydetail?.destination}</span>
            </div>
            <span className="seat">
              <div className="clearfix bshadow0 pbs">
                <span className="icon-calender" />
              </div>
              <span className="date">
                {info?.journeydetail?.departure && moment(info?.journeydetail?.departure).format('DD MMM, YY')}
              </span>
              <i className="icon-Passenger" />
              <span className="pax">{`${adultCount} Pax`}</span>
            </span>
          </div>
          <div>
            <span className="checkbox">
              <input
                checked={formData[journeyKey]?.isChecked || false}
                type="checkbox"
                value="value1"
                className="checkbox-selected"
                onChange={() => {
                  onSelectCheckBox(info);
                }}
              />
            </span>
          </div>
        </div>
      );
    });
  };

  const renderFlightOperations = () => {
    if (
      activeModule === FLIGHT_OPERATIONS_MODULE.CHANGEFLIGHTSELECTION
      || activeModule === FLIGHT_OPERATIONS_MODULE.CANCELFLIGHTSELECTION
    ) {
      if (activeModule === FLIGHT_OPERATIONS_MODULE.CHANGEFLIGHTSELECTION) {
        const pnr = bookingDetails?.recordLocator || '';
        // Adobe Analytic
        pushAnalytic({
          data: {
            _event: 'changeFlightPopupOpen',
            _eventInfoName: mfDataAdditionalv2?.changeFlightDetails?.ctaLabel,
          },
          event: 'click',
          error: {},
          product: {
            productInfo: {
              pnr,
            },
          },
        });
        pushDataLayer({
          data: {
            _event: 'link_click',
            pnrResponse: { ...itineraryApiData },
          },
          event: 'link_click',
          props: {
            clickText: 'Proceed',
            clickNav: `${mfDataAdditionalv2?.changeFlightDetails?.ctaLabel}>Proceed`,
          },
        });
      } else {
        // Adobe Analytic
        pushAnalytic({
          data: {
            _event: 'changeFlightPopupOpen',
            _eventInfoName: mfDataAdditionalv2?.changeFlightDetails?.ctaLabel,
          },
          event: 'click',
          error: {},
        });
      }
      return renderFlightList();
    }
    if (
      activeModule === FLIGHT_OPERATIONS_MODULE.CANCELBOOKINGSELECTION
    ) {
      // Adobe Analytic call
      pushAnalytic({
        data: {
          _event: 'changeBookingPopupAction',
          _eventInfoName: 'Close',
        },
        event: 'click',
        error: {},
      });
      pushDataLayer({
        data: {
          _event: 'link_click',
          pnrResponse: { ...itineraryApiData },
        },
        event: 'link_click',
        props: {
          clickText: 'Proceed',
          clickNav: 'Change Booking>Proceed',
        },
      });
      return (
        <BookingInfo
          mfData={mfBookingData}
          bookingDetails={bookingDetails}
          journeyDetail={journeyDetails}
          passengerDetails={passengerListArray}
          isCancelFlight
        />
      );
    }
    return null;
  };

  const constructObjForSrp = () => {
    const selectedJourneyData = Object.values(formData);
    const originaljourneyObjKeys = [];
    const selectedJouneyKey = [];
    selectedJourneyData.forEach((sJourneyItem) => {
      if (sJourneyItem?.isChecked) {
        const obj = {
          journeyKey: sJourneyItem?.key,
        };
        originaljourneyObjKeys.push(sJourneyItem?.key);
        selectedJouneyKey.push(obj);
      }
    });
    const selectedChangeFlightLen = originaljourneyObjKeys?.length || 0;
    const notMulttiCity = selectedChangeFlightLen > 1 ? PNR_TYPE.ROUND_TRIP : PNR_TYPE.ONE_WAY;
    let selectedTripType = (selectedChangeFlightLen > 2) ? PNR_TYPE.MULTY_CITY : notMulttiCity;

    const obj = {
      originaljourney: {
        keys: selectedJouneyKey,
      },
      codes: {
        currency: bookingDetails?.currencyCode || 'INR',
        promotionCode: !bookingDetails?.isRedeemTransaction ? bookingDetails?.specialFareCode : '',
        vaxDoseNo: '',
      },

      criteria: [],
      passengers: {
        residentCountry: 'IN',
        types: [],
      },
      taxesAndFees: 'TaxesAndFees',
      purposeOfTravel: bookingDetails?.purposeOfTravel || '',
      tripCriteria: selectedTripType || tripType,
      payWith: bookingDetails?.isRedeemTransaction ? PAYWITH_MODES.POINTS : PAYWITH_MODES.CASH,
    };
    // update criteria Data - START
    const tempCriteria = [];
    journeyDetails?.forEach((jItem, index) => {
      if (!originaljourneyObjKeys?.includes(jItem?.journeyKey)) {
        return;
      }
      const newJourneyDate = jItem?.journeydetail?.departure || '';
      const currentJourneyDetails = jItem?.journeydetail || {};
      /* eslint-disable no-undef */
      const journeyDate = formatDate(
        newJourneyDate,
        UTIL_CONSTANTS.DATE_CANGEFLIGHT_SRP_PAYLOADIN,
      );

      const prev = journeyDetails[index - 1];
      const next = journeyDetails[index + 1];

      const temp = {
        dates: {
          beginDate: journeyDate,
          minDate: prev
            ? moment(prev?.journeydetail?.arrival).format(CONSTANTS.DATE_FORMAT.YYYYMMDD)
            : moment().format(CONSTANTS.DATE_FORMAT.YYYYMMDD),
          maxDate: next
            ? moment(next?.journeydetail?.departure).format(CONSTANTS.DATE_FORMAT.YYYYMMDD)
            : moment().add(1, 'year').format(CONSTANTS.DATE_FORMAT.YYYYMMDD),
          prevArrival: prev?.journeydetail?.arrival ?? '',
          nextDeparture: next?.journeydetail?.departure ?? '',
        },
        flightFilters: {
          type: 'All',
        },
        stations: {
          originStationCodes: [currentJourneyDetails?.origin],
          destinationStationCodes: [currentJourneyDetails?.destination],
          originCity: currentJourneyDetails.originCityName,
          destinationCity: currentJourneyDetails.destinationCityName,
        },
      };
      tempCriteria.push(temp);
    });
    if (
      tempCriteria?.length === 2
      && (String(tempCriteria[0]?.stations?.originStationCodes?.[0])
        !== String(tempCriteria[1]?.stations?.destinationStationCodes?.[0])
        || String(tempCriteria[1]?.stations?.originStationCodes?.[0])
          !== String(tempCriteria[0]?.stations?.destinationStationCodes?.[0]))
    ) {
      selectedTripType = PNR_TYPE.MULTY_CITY;
      obj.tripCriteria = selectedTripType;
    }
    obj.criteria = tempCriteria;
    // update criteria Data - END
    // update passengerType Data - START
    const tempTypes = [];
    const tempAdult = {
      type: PASSENGER_TYPE.ADULT,
      discountCode: '',
      count: 0,
    };
    const tempSeniorAdult = {
      type: PASSENGER_TYPE.ADULT,
      discountCode: PASSENGER_TYPE.SENIOUR,
      count: 0,
    };
    const tempChild = {
      type: PASSENGER_TYPE.CHILD,
      discountCode: '',
      count: 0,
    };
    const tempInfant = {
      type: PASSENGER_TYPE.INFANT,
      discountCode: '',
      count: 0,
    };
    const tempExtraDoubleSeat = {
      type: PASSENGER_TYPE.ADULT,
      discountCode: DOUBLE_SEAT_DISCOUNT_CODE,
      count: 0,
    };
    const tempExtraTripleSeat = {
      type: PASSENGER_TYPE.ADULT,
      discountCode: TRIPLE_SEAT_DISCOUNT_CODE,
      count: 0,
    };
    passengerListArray?.forEach((pItem) => {
      const isInfantFoundInPax = pItem?.infant?.name?.first || false;
      if (isInfantFoundInPax) {
        tempInfant.count += 1;
      }
      if (
        pItem?.passengerTypeCode === PASSENGER_TYPE.ADULT
        && pItem?.discountCode === PASSENGER_TYPE.SENIOUR
      ) {
        tempSeniorAdult.count += 1;
      } else if (
        pItem?.passengerTypeCode === PASSENGER_TYPE.ADULT
      ) {
        tempAdult.count += 1;
      } else if (pItem?.passengerTypeCode === PASSENGER_TYPE.CHILD) {
        tempChild.count += 1;
      }

      // for extra seat
      if (pItem?.ExtraSeatTag === EXTRASEATTAG_DOUBLE) {
        tempExtraDoubleSeat.count += 1;
      } else if (pItem?.ExtraSeatTag === EXTRASEATTAG_TRIPLE) {
        tempExtraTripleSeat.count += 1;
      }
    });
    if (tempAdult.count > 0) {
      tempTypes.push(tempAdult);
    }
    if (tempSeniorAdult.count > 0) {
      tempTypes.push(tempSeniorAdult);
    }
    if (tempChild.count > 0) {
      tempTypes.push(tempChild);
    }
    if (tempInfant.count > 0) {
      tempTypes.push(tempInfant);
    }
    if (tempExtraDoubleSeat.count > 0) {
      tempTypes.push(tempExtraDoubleSeat);
    }
    if (tempExtraTripleSeat.count > 0) {
      tempTypes.push(tempExtraTripleSeat);
    }
    obj.passengers.types = tempTypes;

    // update passengerType Data - END

    return obj;
  };

  const onConfirmChangeFlight = () => {
    const data = constructObjForSrp();

    const pnr = bookingDetails?.recordLocator || '';
    localStorage.setItem(
      BROWSER_STORAGE_KEYS.CHANGE_FLIGHT_DATA_TO_SRP,
      JSON.stringify(data),
    );
    // Adobe Analytic
    pushAnalytic({
      data: {
        _event: 'changeFlightPopupOpen',
        _eventInfoName: 'Change Flight',
      },
      event: 'click',
      error: {},
      product: {
        productInfo: {
          pnr,
        },
      },
    });
    pushDataLayer({
      data: {
        _event: 'link_click',
        pnrResponse: { ...itineraryApiData },
      },
      event: 'link_click',
      props: {
        clickText: 'Proceed',
        clickNav: 'Proceed>Change Flight',
      },
    });
    localStorage.setItem(
      BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER,
      MODIFY_FLOW_IDENTIFIER.CHANGE_FLIGHT,
    );
    // redirect to SRP modification
    window.location.href = mfDataAdditionalv2?.changeFlightDetails?.ctaPath;
  };
  const onConfirmCancelBooking = async () => {
    dispatch(setLoading(true));
    const response = await makeCancelBookingReq();
    dispatch(setLoading(false));
    if (response?.isSuccess) {
      localStorage.setItem(
        BROWSER_STORAGE_KEYS.MODIFY_FLOW_IDENTIFIER,
        MODIFY_FLOW_IDENTIFIER.CANCEL_BOOKING,
      );
      // eslint-disable-next-line no-unused-expressions
      refreshData && refreshData(MODIFY_FLOW_IDENTIFIER.CANCEL_BOOKING);
      // Adobe Analytic
      pushAnalytic({
        data: {
          _event: 'cancelBookingPopupAction',
          _eventInfoName: 'Close',
        },
        event: 'click',
        error: {},
      });
    } else {
      // eslint-disable-next-line no-nested-ternary
      const err = Array.isArray(response?.response?.errors)
        ? response?.response?.errors[0]
        : response?.response?.error
          ? response?.response?.error
          : response?.response?.errors; { /* NOSONAR */ } // eslint-disable-line no-lone-blocks
      const errorObj = getErrorMsgForCode(err?.code);
      dispatch(
        toggleToast({
          show: true,
          props: {
            title: 'Error',
            description: errorObj?.message || 'Something went wrong',
          },
        }),
      );
      // Adobe Analytic
      pushAnalytic({
        data: {
          _event: 'cancelBookingPopupAction',
          _eventInfoName: 'Cancel Booking',
        },
        event: 'click',
        error: Object.create(null, {
          code: { value: errorObj.errorCode, enumerable: true },
          message: { value: errorObj?.message, enumerable: true },
        }),
      });
    }
    pushDataLayer({
      data: {
        _event: 'link_click',
        pnrResponse: { ...itineraryApiData },
      },
      event: 'link_click',
      props: {
        clickText: 'Proceed',
        clickNav: 'Proceed>Confirm Cancel Booking',
      },
    });
    // eslint-disable-next-line no-unused-expressions
    onClose && onClose();
  };

  const renderButton = () => {
    const buttonProps = {
      disabled: false,
    };
    if (
      activeModule === FLIGHT_OPERATIONS_MODULE.CANCELFLIGHTSELECTION
    ) {
      const selectedJouney = Object.values(formData).map(
        (item) => item.isChecked,
      );
      buttonProps.disabled = !selectedJouney.length;
      buttonProps.onClick = onConfirmCancelFlight;
    } else if (
      activeModule === FLIGHT_OPERATIONS_MODULE.CHANGEFLIGHTSELECTION
    ) {
      const selectedJouney = Object.values(formData).map(
        (item) => item.isChecked,
      );
      buttonProps.disabled = !selectedJouney.length;
      buttonProps.onClick = onConfirmChangeFlight;
    } else if (
      activeModule === FLIGHT_OPERATIONS_MODULE.CANCELBOOKINGSELECTION
    ) {
      buttonProps.onClick = onConfirmCancelBooking;
    }
    return (
      <Button variant="outline" color="primary" size="small" {...buttonProps}>
        {mfDataAdditionalv2?.proceedLabel}
      </Button>
    );
  };
  return (
    <OffCanvas
      onClose={onClose}
      containerClassName={`mobile-variation1 ${moduleContentConfig.className === 'change-flight'
    || moduleContentConfig.className === 'cancel-flight' ? 'change-cancel-flight' : ''}`}
    >
      <div className="change-flight-details__container">
        <div className="head">
          <p className="heading">{moduleContentConfig.heading}</p>
          <div className="desc">
            <Heading heading="h4" mobileHeading="h3" containerClass="sub-title">
              <div
                dangerouslySetInnerHTML={{
                  __html: moduleContentConfig.description,
                }}
              />
            </Heading>
          </div>
        </div>
        <div className="container-info">
          <div
            className={`destination-toggle destination-toggle--${moduleContentConfig?.options?.length}`}
          >
            {moduleContentConfig?.options?.map((x) => (
              <Button
                block
                size="small"
                containerClass={`destination-segment-btn ${activeModule} ${
                  x.value !== activeModule ? 'not-selected' : ''
                }`}
                key={x.key}
                onClick={() => {
                  setActiveModule(x.value);
                }}
              >
                <span className="options ">{x?.label}</span>
              </Button>
            ))}
          </div>

          {renderFlightOperations()}
        </div>
        <div className="change-flight-details__footer footer">{renderButton()}</div>
      </div>
    </OffCanvas>
  );
};

FlightOperation.propTypes = {
  onClose: PropTypes.func.isRequired,
  moduleFor: PropTypes.string,
  refreshData: PropTypes.any,
};

export default FlightOperation;
