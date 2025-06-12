import React, { Suspense, useContext, useEffect, useMemo, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import { useCustomEventDispatcher } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import RadioBox from 'skyplus-design-system-app/dist/des-system/RadioBox';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import {
  Pages,
  TripTypes,
  PayWithModes,
  specialFareCodes,
} from 'skyplus-design-system-app/src/functions/globalConstants';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import classnames from 'classnames';
import DropDown from '../common/DropDown/DropDown';

import PromoCodeSlider from '../PromoCodeSlider';
import useAppContext from '../../hooks/useAppContext';
import { FormContext } from '../Form/FormContext';
import { formActions } from '../Form/formReducer';
import {
  analyticpushData,
  submitFormHandler,
  validateBookingForm,
} from '../../utils/functions';
import analyticsEvent from '../../utils/analyticsEvent';
import { ANALTYTICS, customEvents, LOGIN_TYPE, COOKIE_KEYS, dateFormats } from '../../constants';
import { bookingActions } from '../../context/reducer';
import { generateSearchResultPayload } from '../../utils/searchResultsUtils';
import { triggerClosePopup, updateMultipleQueryParams } from '../../utils';
import { setBwCntxtVal } from '../../utils/localStorageUtils';
import PromoCodeSliderShimmer from '../PromoCodeSlider/PromoCodeSliderShimmer';
import format from 'date-fns/format';

const { SET_PROMO_CODE } = formActions;
const { XPLORE, HOMEPAGE, FLIGHT_SELECT_MODIFICATION } = Pages;
const callExploreDestinationApiEvent = (config) => {
  return new CustomEvent(customEvents.CALL_EXPLORE_DESTINATION_API, config);
};

const Bottom = () => {
  const {
    state: { main, additional, pageType, isModificationFlow, isLoyaltyEnabled, authUser },
    dispatch: dispatchApp,
  } = useAppContext();

  const pointBalanceValue = authUser?.loyaltyMemberInfo?.pointBalance;
  const isValidPointBalance = (value) => typeof value === 'number' && !Number.isNaN(value) && value >= 0;

  const pointBalance = isValidPointBalance(pointBalanceValue)
    ? new Intl.NumberFormat('en-IN', {}).format(pointBalanceValue)
    : '';

  const pointBalanceMessage = formattedMessage(additional?.milesBalanceLabel, {
    currentBalance: `<span class="highlight-balance">${pointBalance}</span>`,
  });
  const [showSlider, setShowSlider] = useState(false);
  const [promoCodeSliderChunkLoaded, setPromoCodeSliderChunkLoaded] =
    useState(false);

  const dipatchModifySearch = useCustomEventDispatcher();

  const { formState, dispatch } = useContext(FormContext);

  const { promocode, paxInfo } = formState;
  const totalAdult = paxInfo?.ADT.Count + paxInfo?.SRCT.Count;

  const onClickAddPromo = () => {
    analyticsEvent({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.POPUPLOAD_PROMO_CODE,
      data: {},
    });
    setShowSlider(true);
  };

  const onCloseSlider = () => {
    setShowSlider(false);
  };

  const onChangeTravellingReason = (value) => {
    triggerClosePopup();

    dispatch({
      type: formActions.CHANGE_FORM_ITEM,
      payload: { travellingFor: value },
    });
  };

  const onChangePayMode = (value) => {
    triggerClosePopup();

    dispatch({
      type: formActions.CHANGE_FORM_ITEM,
      payload: { payWith: value },
    });
    dispatch({
      type: SET_PROMO_CODE,
      payload: {
        code: '',
        error: '',
        success: false,
        card: '',
        PromoType: 'PreBooking',
      },
    });
  };

  const travellingForOptions = useMemo(() => {
    return main.travellingReasons;
  }, []);

  const payWithOptions = useMemo(() => {
    if (
      [TripTypes.ROUND, TripTypes.MULTI_CITY].includes(formState.triptype.value)
    ) {
      return main.paymentModes.filter((mode) => mode.value === PayWithModes.CASH);
    }
    return main.paymentModes;
  }, [formState.triptype.value]);

  const removePromoCode = () => {
    dispatch({
      type: formActions.SET_PROMO_CODE,
      payload: { code: '', success: false, card: '' },
    });
  };

  let personasType = Cookies.get(COOKIE_KEYS.ROLE_DETAILS);
  personasType = personasType && JSON.parse(personasType);
  const showHotelCheckbox = [LOGIN_TYPE.MEMBER, LOGIN_TYPE.NO_LOGIN]
    .includes(personasType?.roleName?.toUpperCase());
  const showTravellingFor = showHotelCheckbox && pageType === HOMEPAGE && main?.hotelsSRPredirectionconsentcheckbox;
  const isUnaccompaniedMinorTrue = formState?.selectedSpecialFare?.specialFareCode === specialFareCodes.UMNR;
  const generateHotelUrl = () => {
    // Extracting passenger counts
    const { journies } = formState;
    // Determining rooms based on pax logic
    const rooms = totalAdult === 1 ? '1a-0c' : '2a-0c';
    const checkInDate = new Date(journies[0].departureDate);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 1);
    // Format dates as YYYY-MM-DD
    const formatDate = (date) =>
      format(date, dateFormats.yyyyMMdd)?.split('T')[0];
    const airportCode = journies[0]?.destinationCity?.cityCode;
    const obj = {
      airport_code: airportCode,
      checkin: formatDate(checkInDate),
      checkout: formatDate(checkOutDate),
      rooms: rooms,
    };
    const url = updateMultipleQueryParams(main?.configureUrlHotelSrpPageRedirection, obj);
    // Building URL Here
    return url;
  };

  const isSubmitButtonEnable =
    validateBookingForm(formState) &&
    ((formState.paxInfo.ADT.Count +
      formState.paxInfo.SRCT.Count +
      formState.paxInfo.CHD.Count) >
      0);

  const onSubmit = () => {
    if (!isSubmitButtonEnable) return;

    const { SRP } = Pages;
    setBwCntxtVal(formState, main.recentSearchCount, pageType);
    const modify = pageType === SRP || pageType === FLIGHT_SELECT_MODIFICATION;
    const isXplore = pageType === XPLORE;
    analyticpushData(formState, modify, isXplore, isLoyaltyEnabled);

    if (pageType === SRP || pageType === FLIGHT_SELECT_MODIFICATION) {
      const value = generateSearchResultPayload(formState);
      dipatchModifySearch(customEvents.CALL_SEARCH_RESULT_API, value);
      dispatchApp({
        type: bookingActions.SHOW_FULL_FORM_IN_SRP,
        payload: false,
      });
    }
    else if (formState?.showBestHotelDeals && totalAdult > 0) {
      // Generating hotel URL Here
      const hotelUrl = generateHotelUrl(formState);
      // Opening hotel URL in current tab
      window.open(main.searchCtaPath, '_blank');
      window.location.href = hotelUrl;
      // Opening flight search in new tab
    }
    else if (pageType === XPLORE) {
      const value = generateSearchResultPayload(formState);
      document.dispatchEvent(
        callExploreDestinationApiEvent({
          bubbles: true,
          detail: {
            value,
          },
        }),
      );
      dispatchApp({
        type: bookingActions.SHOW_FULL_FORM_IN_SRP,
        payload: false,
      });
    } else {
      submitFormHandler({
        redirectUrl: main.searchCtaPath,
      });
    }
  };

  const appliedClassName = classnames(
    'addpromocode-btn--to-apply d-flex justify-content-end',
    {
      disabled:
        formState.selectedSpecialFare ||
        isModificationFlow ||
        formState.payWith !== PayWithModes.CASH ||
        paxInfo?.SRCT?.Count > 0,
    },
  );

  useEffect(() => {
    const urlHash = new URL(window.location.href)?.hash;
    if (pageType === HOMEPAGE && urlHash === '#payWithPoints') {
      dispatch({
        type: formActions.CHANGE_FORM_ITEM,
        payload: { payWith: PayWithModes.POINTS },
      });
    }
  }, []);

  useEffect(() => {
    if (pageType === FLIGHT_SELECT_MODIFICATION) {
      try {
        const storedData = localStorage.getItem('c_m_d') || '{}';
        const parsedData = JSON.parse(storedData);

        if (parsedData && parsedData.payWith) {
          dispatch({
            type: formActions.CHANGE_FORM_ITEM,
            payload: { payWith: parsedData.payWith },
          });
        }
      } catch (error) {
        // Ignoring the error as we don't need to handle it
      }
    }
  }, [pageType]);

  const showConcentCheckBox = (pageType === HOMEPAGE && showHotelCheckbox && main?.hotelsSRPredirectionconsentcheckbox && !isUnaccompaniedMinorTrue);
  return (
    <div className="bottom-container">

      {showConcentCheckBox && (
        <div className="besthotel-checkbox">
          <Checkbox
            id="bestHotelDeals"
            containerClass="sm"
            checked={formState.showBestHotelDeals}
            onChangeHandler={(e) =>
              dispatch({
                type: formActions.SHOW_BEST_HOTEL_DEALS,
                payload: e.target.checked,
              })
            }
          />
          <label className="besthotel-checkbox-label">
            {main?.hotelsSRPredirectionconsentcheckbox}
          </label>
        </div>
      )}

      <div className={`iam-travellling-to ${showTravellingFor ? 'd-md-none' : 'd-lg-block'}`}>
        {travellingForOptions.length > 0 && (
          <div
            className={`iam-travellling-to__wrapper d-flex ${isModificationFlow ? 'disabled' : ''
              }`}
          >
            <div className="pt-3 left">
              {main.travellingReasonLabel}
              &nbsp;
            </div>
            <DropDown
              renderElement={() =>(
                <div
                  className="travelling-for-value"
                  role="combobox"
                  tabIndex={0}
                  aria-controls="dropdown-menu"
                  aria-expanded={false}
                  aria-label="Travelling For "
                >
                  {formState.travellingFor}
                  <Icon
                    tabIndex={-1}
                    aria-label="Travelling For dropdown expand icon"
                    role="button"
                    className="icon-accordion-down-simple"
                    size="sm"
                  />
                </div>
              )}
              containerClass="travelling-reason-dropdown"
              items={travellingForOptions}
              renderItem={({ value }) => (
                <div className="travelling-reason-dropdown__item" key={value}>
                  <RadioBox
                    onChange={onChangeTravellingReason}
                    value={value}
                    id={`reason-${value}`}
                    checked={value === formState.travellingFor}
                  >
                    {value}
                  </RadioBox>
                </div>
              )}
            />
            <div className="travelling-reason-dropdown__mobile">
              {travellingForOptions.map(({ value }) => {
                return (
                  <div
                    className="travelling-reason-dropdown__mobile__item"
                    key={value}
                  >
                    <RadioBox
                      onChange={onChangeTravellingReason}
                      value={value}
                      id={`reason-${value}`}
                      checked={value === formState.travellingFor}
                    >
                      {value}
                    </RadioBox>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {isLoyaltyEnabled && (
        <div className="ipay-with">
          {payWithOptions.length > 0 && (
            <div
              className={`ipay-with__wrapper d-flex ${isModificationFlow ? 'disabled' : ''
                }`}
            >
              <div className="pt-3 left">
                {main.payModeLabel}
                &nbsp;
              </div>
              <DropDown
                renderElement={() => (
                  <div
                    className="pay-with-value"
                    role="combobox"
                    tabIndex={0}
                    aria-controls="dropdown-menu"
                    aria-expanded={false}
                    aria-label="Pay with "
                  >
                    <p className="pay-with-value-text">{formState.payWith}</p>
                    <Icon className="icon-accordion-down-simple" size="sm" />
                  </div>
                )}
                containerClass="pay-mode-dropdown"
                items={payWithOptions}
                renderItem={({ value }) => (
                  <div
                    className={`pay-mode-dropdown__item ${authUser?.loyaltyMemberInfo?.FFN &&
                      (!authUser?.loyaltyMemberInfo
                        ?.pointRedeemEligibilityFlag &&
                        value !== PayWithModes.CASH
                        ? 'pe-none opacity-50'
                        : '')
                      }`}
                    key={value}
                  >
                    <RadioBox
                      onChange={onChangePayMode}
                      value={value}
                      id={`reason-${value}`}
                      checked={value === formState.payWith}
                    >
                      {value}
                    </RadioBox>
                  </div>
                )}
              />
              <div className="pay-mode-dropdown__mobile flex-wrap">
                {payWithOptions.map(({ value }) => {
                  return (
                    <div
                      className={`pay-mode-dropdown__mobile__item ${
                        authUser?.loyaltyMemberInfo?.FFN &&
                        (!authUser?.loyaltyMemberInfo
                          ?.pointRedeemEligibilityFlag &&
                          value !== PayWithModes.CASH
                          ? 'pe-none opacity-50'
                          : '')
                        }`}
                      key={value}
                    >
                      <RadioBox
                        onChange={onChangePayMode}
                        value={value}
                        id={`reason-${value}`}
                        checked={value === formState.payWith}
                      >
                        {value}
                      </RadioBox>
                    </div>
                  );
                })}
                {formState.triptype.value === TripTypes.ONE_WAY &&
                  authUser?.loyaltyMemberInfo?.FFN && (
                    <div className="d-flex gap-2 mb-6 w-100">
                      {pointBalance && pointBalance !== '' && (
                        <p
                          className="body-light text-secondary py-2 lh-lg"
                          dangerouslySetInnerHTML={{
                            __html: pointBalanceMessage,
                          }}
                        />
                      )}
                      {!authUser?.loyaltyMemberInfo
                        ?.pointRedeemEligibilityFlag && (
                          <p
                            className="eligible-redemption-text bg-secondary-light
                        alert-msg-for-dropdown body-light text-secondary py-2 px-4"
                          >
                            {additional.notEligibleErrorMessage}
                          </p>
                        )}
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      )}
      {pageType !== XPLORE && (
        <div className="addpromocode-btn">
          {promocode.success ? (
            <div
              tabIndex={0}
              role="button"
              className="addpromocode-btn--applied d-flex justify-content-end"
            >
              &quot;{promocode?.indigoCode || promocode?.card}&quot;
              <span className="success">{additional.promoCodeApplyText}</span>
              <Icon
                className="icon-close-simple"
                onClick={removePromoCode}
                size="md"
              />
            </div>
          ) : (
            <button
              className={appliedClassName}
              onClick={onClickAddPromo}
              type="button"
            >
              +<u>{main.promoCodeLabel}</u>
            </button>
          )}
        </div>
      )}
      <Button
        containerClass="search-btn"
        disabled={!isSubmitButtonEnable}
        onClick={onSubmit}
        tabIndex={isSubmitButtonEnable ? '0' : '-1'}
        role="button"
        aria-pressed="false"
        aria-disabled={!isSubmitButtonEnable}
      >
        {main.searchCtaLabel}
      </Button>
      <Suspense
        fallback={<PromoCodeSliderShimmer onCloseSlider={onCloseSlider} />}
      >
        {showSlider && (
          <PromoCodeSlider
            promoCodeSliderChunkLoaded={promoCodeSliderChunkLoaded}
            setPromoCodeSliderChunkLoaded={setPromoCodeSliderChunkLoaded}
            onCloseSlider={onCloseSlider}
          />
        )}
      </Suspense>
    </div>
  );
};

Bottom.propTypes = {};

export default Bottom;
