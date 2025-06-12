import React, { useRef, useEffect, useState } from 'react';

import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import add from 'date-fns/add';
// import TempForm from '../../components/Form/TempForm/TempForm';
import customEvent from '../../utils/customEvent';
import useAppContext from '../../hooks/useAppContext';
import RecentSearchSlider from '../../components/RecentSearch/RecentSearchSlider';
import FormWrapper from '../../components/Form/FormWrapper';
import Shimmer from '../../components/Shimmer/Shimmer';
import analyticsEvent from '../../utils/analyticsEvent';
import gtmPushAnalytic from '../../utils/gtmEvents';
import { ANALTYTICS, COOKIE_KEYS, GTM_ANALTYTICS } from '../../constants';
import { getMaxDateForCalendar, isMemberAndGuestUser } from '../../utils';
import BubbleButton from '../../components/common/BubbleButton/BubbleButton';
import { defaultCurreny } from '../../constants/form';
import { bookingActions } from '../../context/reducer';

const HomePageContainer = () => {
  // const [showTempForm, setShowTempForm] = useState(true);
  const [isMobile] = useIsMobileBooking();

  const {
    dispatch,
    state: {
      main,
      additional,
      loading,
      widgetsModel,
      airportsData,
      activeCurrencyModel,
      isLoyaltyEnabled,
      showLoyaltyBox,
      authUser,
      nomineeDetails,
    },
  } = useAppContext();
  const bubbleTitle = main?.firstBubbleTitle;
  const bubbleDesc = main?.firstBubbleDescription;
  const bubbleLink = main?.firstBubbleLink;

  const [currency, setCurreny] = useState(defaultCurreny);

  const inputRef = useRef(null);

  const updateScrollPosition = () => {
    const headerOffset = 90;
    if (inputRef.current && isMobile) {
      const elementPosition =
        inputRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    inputRef.current?.focus();
  };

  useEffect(() => {
    // For shifting of BW due to late arrival of  contextual messgae
    const dynamicMessageElement = document.querySelector(
      'div[data-component="contextual-message-dynamic-v2"]',
    );

    if (dynamicMessageElement) {
      const observerCallback = (mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'childList') {
            updateScrollPosition();
          }
        });
      };

      const observer = new MutationObserver(observerCallback);
      observer.observe(dynamicMessageElement, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    }
    return () => {};
  }, [isMobile]);

  useEffect(() => {
    updateScrollPosition();
  }, []);

  const [journies, setJournies] = useState(() => {
    const defaultLocationEle = document.getElementById('src-dest-iata');
    const defaultSource = defaultLocationEle?.dataset?.originIata || '';
    const defaultDestination =
      defaultLocationEle?.dataset?.destinationIata || '';

    const sourceCity = airportsData.find(
      (airport) => airport.stationCode === defaultSource,
    );

    const destinationCity = airportsData.find(
      (airport) => airport.stationCode === defaultDestination,
    );

    return [
      {
        destinationCity,
        sourceCity,
        isNationalityPopup: false,
        departureDate: add(new Date(), {
          days: 1,
        }),
        arrivalDate: null,
        minDate: new Date(),
        key: uniq(),
        maxDate: getMaxDateForCalendar(),
      },
    ];
  });

  useEffect(() => {
    let authUserData;
    try {
      authUserData = Cookies.get(COOKIE_KEYS.USER, true, true);
    } catch (e) {
      authUserData = Cookies.get(COOKIE_KEYS.USER);
    }
    dispatch({
      type: bookingActions.SET_AUTH_USER,
      payload: authUserData,
    });
    document.addEventListener(
      customEvent.SHOW_FULL_BOOKING_WIDGET_FORM,
      (data) => {
        if (data?.detail?.date) {
          const journeyItem = [
            {
              destinationCity: data.detail.destination,
              sourceCity: data.detail.origin,
              isNationalityPopup: false,
              departureDate: data.detail.date,
              arrivalDate: null,
              minDate: new Date(),
              key: uniq(),
              maxDate: getMaxDateForCalendar(),
            },
          ];

          let currencyItem = activeCurrencyModel.find(
            (row) => row.currencyCode === data.detail.origin.currencyCode,
          );

          if (!currencyItem) {
            currencyItem = defaultCurreny;
          }

          setCurreny(currencyItem);
          setJournies(journeyItem);
        }
        setTimeout(() => {
          document.body.classList.remove('overflow-hidden');
        }, 100);

        // setShowTempForm(false);
      },
    );
  }, []);

  const onClickHotel = () => {
    analyticsEvent({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.BOOK_A_STAY_CLICK,
      data: {},
    });

    gtmPushAnalytic({
      event: GTM_ANALTYTICS.EVENTS.BOOK_A_STAY_CLICK,
    });
  };

  const onClickFlight = () => {
    analyticsEvent({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.BOOK_A_FLIGHT_CLICK,
      data: {},
    });

    gtmPushAnalytic({
      event: GTM_ANALTYTICS.EVENTS.BOOK_A_FLIGHT_CLICK,
    });
  };

  return loading ? (
    <Shimmer />
  ) : (
    <>
      <div className="bookingmf-container--tab-container" ref={inputRef}>
        <div className="bookingmf-container__tabs">
          <div
            className="bookingmf-container__tabs--item active"
            onClick={onClickFlight}
            role="presentation"
          >
            <Icon className="icon-Flight" />
            <Text
              variation="body-large-medium"
              mobileVariation="body-small-medium"
              containerClass="tab-link"
            >
              {main.bookFlightLabel}
            </Text>
          </div>
          {main.bookStayLabel && (
            <a
              className="bookingmf-container__tabs--item"
              onClick={onClickHotel}
              href={main.bookStayPath}
              target={main.bookStayOpenInNewTab ? '_blank' : '_self'}
              rel="noreferrer noopener"
            >
              <Icon className="icon-hotel" />
              <Text
                variation="body-large-medium"
                mobileVariation="body-small-medium"
                containerClass="tab-link"
              >
                {main.bookStayLabel}
              </Text>
            </a>
          )}
        </div>
        <div className="bookingmf-container__tabs--content">
          {/* {showTempForm && isMobile && (
            <TempForm
              context={{
                payload: {
                  journies,
                  specialFares: widgetsModel.specialFareList,
                },
              }}
            />
          )} */}
          <FormWrapper
            context={{
                payload: {
                  journies,
                  specialFares: widgetsModel.specialFareList,
                  currency,
                },
              }}
          />
        </div>
      </div>
      {authUser?.loyaltyMemberInfo?.FFN &&
        isLoyaltyEnabled &&
        showLoyaltyBox && (
          <div
            className="loyality-msg-btn d-flex mt-md-6 p-8 gap-4
            justify-content-md-between flex-md-row  bg-secondary-medium  p-md-6 flex-column"
          >
            <div className="d-flex flex-column gap-2 justify-content-center">
              <h6 className="body-small-medium text-primary lh-20">
                {additional?.noteLabel}
              </h6>
              <p className="body-small-medium text-secondary lh-20">
                {additional?.loyaltyPermittedMembersInfo}
              </p>
            </div>
            {nomineeDetails.length + 1 !==
              additional?.maximumLoyaltyTravellers &&
              additional?.addNomineeCtaPath &&
              additional?.addNomineeCta && (
                <div className="d-flex justify-md-content-center py-md-2 px-md-10">
                  <a
                    href={additional?.addNomineeCtaPath}
                    className="add-nominee-btn-6e-loyalty link text-capitalize
                    text-decoration-underline text-primary-main"
                  >
                    {additional?.addNomineeCta}
                  </a>
                </div>
              )}
          </div>
        )}
      <div className="bookingmf-container--xplore">
        {bubbleTitle && bubbleDesc && isMemberAndGuestUser() && (
          <BubbleButton
            bubbleTitle={bubbleTitle}
            bubbleDescription={bubbleDesc}
            bubbleLink={bubbleLink}
            journies={journies}
          />
        )}
        {main.showRecentSearch && <RecentSearchSlider />}
      </div>
    </>
  );
};

export default HomePageContainer;
