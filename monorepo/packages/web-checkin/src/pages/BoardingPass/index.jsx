import React, { useEffect, useRef, useState, useMemo } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import HotelStrip from 'skyplus-design-system-app/dist/des-system/HotelStrip';
import { useReactToPrint } from 'react-to-print';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInHours from 'date-fns/differenceInHours';
import format from 'date-fns/format';

import InfoAlert from '../../components/common/Alerts/InfoAlert';
import BannerHeading from '../../components/boarding-pass/BannerHeading';
import BoardingDetail from '../../components/boarding-pass/BoardingDetail';
import DangerousGood from '../../components/DangerousGood/DangerousGood';
import useAppContext from '../../hooks/useAppContext';
import Action from './Action';
import PrintBoardingPass from '../../components/BoardingPass/BoardingPass';

import { getBoardingPass, getHotelData } from '../../services';
import { webcheckinActions } from '../../context/reducer';
import analyticsEvent from '../../utils/analyticsEvent';
import gtmEvent from '../../utils/gtmEvents';

import {
  ANALTYTICS,
  localStorageKeys,
  GTM_ANALTYTICS,
  dateFormats,
  PAX_SHORT_NAME,
  HOTEL_TRAVELTIPS_VARIATION,
  COOKIE_KEYS,
  LOGIN_TYPE,
} from '../../constants';
import WithPageLoader from '../../hoc/withPageLoader';
import LocalStorage from '../../utils/LocalStorage';
import EmailBoardingPass from '../../components/EmailBoardingPassModal/EmailBoardingPassModal';
import useGetSSR from '../../hooks/useGetSSR';
import ChatSection from './ChatSection/ChatSection';
import ReturnFlightBanner from './ReturnFlightBanner/ReturnFlightBanner';
import usePageTitle from '../../hooks/usePageTitle';

const { TRIGGER_EVENTS, DATA_CAPTURE_EVENTS } = ANALTYTICS;

const BoardingPass = () => {
  const componentRef = useRef();
  const [isMobile] = useIsMobile();

  const [response, setResponse] = useState({
    boardingPasses: [],
    recordLocator: '',
  });

  useGetSSR();

  usePageTitle('boardingPass.headingTitle');

  const [showEmailBoardingPass, setShowEmailBoardingPass] = useState(false);

  const { dispatch, aemLabel, formattedAEMLabel } = useAppContext();

  const [hotelList, setHotelList] = useState({ data: [], arrivalCityName: '', showMoreUrl: '' });

  let personasType = Cookies.get(COOKIE_KEYS.ROLE_DETAILS);
  personasType = personasType && JSON.parse(personasType);
  const showHotelStrip = [LOGIN_TYPE.MEMBER, LOGIN_TYPE.NO_LOGIN]
    .includes(personasType?.roleName?.toUpperCase());

  const slidePerViewDesktop = response.boardingPasses.length > 1 ? 1.02 : 1;
  const slidePerViewMobile = response.boardingPasses.length > 1 ? 1.05 : 1;

  const swiperConfig = {
    direction: 'horizontal',
    grid: {
      rows: 1,
      fill: 'column',
    },
    slidesPerView: isMobile ? slidePerViewMobile : slidePerViewDesktop,
    cssMode: true,
    pagination: false,
    spaceBetween: 8,
    navigation: {
      nextEl: '.boarding-pass-right',
      prevEl: '.boarding-pass-left',
      enabled: true,
    },
    on: {
      slideChange: (e) => {
        const { activeIndex, slides } = e;

        const classNameDisbaled = 'swiper-button-disabled';

        if (slides.length === 0) {
          document
            .querySelector('.sky-icons.boarding-pass-left')
            ?.classList?.add(classNameDisbaled);
        } else {
          document
            .querySelector('.sky-icons.boarding-pass-left')
            ?.classList?.remove(classNameDisbaled);
        }

        if (slides.length === activeIndex + 1) {
          document
            .querySelector('.sky-icons.boarding-pass-right')
            ?.classList?.add(classNameDisbaled);
        } else {
          document
            .querySelector('.sky-icons.boarding-pass-right')
            ?.classList?.remove(classNameDisbaled);
        }
      },
    },
  };

  const getPathFromUrl = (url) => {
    return url?.split(/[?#]/)[0] || 'N/A';
  };

  const isPrevPageContactUs = () => {
    const previousUrls = JSON.parse(sessionStorage.getItem('prevUrls'));
    const prevPageUrl = previousUrls?.length > 2 && getPathFromUrl(previousUrls[previousUrls?.length - 2]);
    return prevPageUrl && prevPageUrl?.includes('contact-us');
  };

  const getCommonGtmData = (_response) => {
    const firstBoarding = _response?.boardingPasses?.[0];

    if (!firstBoarding) {
      return {};
    }
    const { departure, origin, destination } =
      firstBoarding?.segments?.designator || {};

    const { bookingAnalyticsDetails, passengerAnalyticsDetails } =
      _response.bookingAnalytics || {
        bookingAnalyticsDetails: {},
        passengerAnalyticsDetails: {},
      };

    const { TotalPax, AdultPax, ChildPax, SeniorPax, InfantPax } =
      passengerAnalyticsDetails ?? {
        TotalPax: 0,
        AdultPax: 0,
        ChildPax: 0,
        SeniorPax: 0,
        InfantPax: 0,
      };

    const paxDetails = [TotalPax];

    if (SeniorPax) {
      paxDetails.push(`${SeniorPax}${PAX_SHORT_NAME.SS}`);
    }

    if (AdultPax) {
      paxDetails.push(`${AdultPax}${PAX_SHORT_NAME.ADT}`);
    }

    if (ChildPax) {
      paxDetails.push(`${ChildPax}${PAX_SHORT_NAME.CHD}`);
    }

    if (InfantPax) {
      paxDetails.push(`${InfantPax}${PAX_SHORT_NAME.INF}`);
    }

    return {
      PNR: _response?.recordLocator,
      days_until_departure: differenceInCalendarDays(
        departure,
        new Date(),
      ).toString(),
      trip_type: bookingAnalyticsDetails?.TripType ?? '',
      OD: `${origin}-${destination}`,
      pax_details: paxDetails.join('|'),
      specialFare: bookingAnalyticsDetails?.SpecialFare ?? '',
    };
  };

  const hotelStripAnalyticsHandler = (hotelListItemValues) => {
    const { hotel_name, price, customer_rating, city, country, sliderIndex } = hotelListItemValues || {};
    const { currency_code, total } = price || {};

    const analyticsDataCard = {
      event: DATA_CAPTURE_EVENTS.HOTEL_STRIP_CARD,
      data: {
        hotelListResponse: {
          page: {
            eventInfo: {
              name: 'Select Hotel',
              position: sliderIndex?.toString(),
              component: 'Hotel Strip Cards',
            },
            pageInfo: {
              pageName: 'Boarding Pass',
              siteSection: 'Check-in Flow',
              language: 'en',
              lob: 'Flights',
              journeyFlow: 'Check-in Flow',
            },
          },
          product: {
            productInfo: {
              hotelSearchDetails: {
                hotelName: hotel_name,
                hotelPrice: total?.toString(),
                hotelRating: customer_rating?.toString(),
                hotelID: null,
                hotelRank: sliderIndex,
                searchType: 'Property',
                searchKeyword: `${city}, ${country}`,
                searchCity: city,
                searchCountry: country,
              },
              currencyCode: currency_code,
            },
          },
        },
      },
    };
    const analyticsDataSeeMore = {
      event: DATA_CAPTURE_EVENTS.HOTEL_STRIP_SEEMORE,
      data: {
        hotelListResponse: {
          page: {
            eventInfo: {
              name: 'Show More',
              position: null,
              component: analyticsDataCard.data.hotelListResponse.page.eventInfo.component,
            },
            pageInfo: analyticsDataCard.data.hotelListResponse.page.pageInfo,
          },
        },
      },
    };
    if (hotel_name) {
      analyticsEvent(analyticsDataCard);
    } else {
      analyticsEvent(analyticsDataSeeMore);
    }
  };

  const pageLoadAnalytics = (data) => {
    const firstBoarding = data.boardingPasses[0];

    if (!firstBoarding) {
      return {};
    }
    const { departure, origin, destination } =
      firstBoarding.segments.designator;

    const { bookingAnalyticsDetails, passengerAnalyticsDetails } =
      data.bookingAnalytics || {
        bookingAnalyticsDetails: {},
        passengerAnalyticsDetails: {},
      };

    const { TotalPax, AdultPax, ChildPax, SeniorPax, InfantPax } =
      passengerAnalyticsDetails ?? {
        TotalPax: 0,
        AdultPax: 0,
        ChildPax: 0,
        SeniorPax: 0,
        InfantPax: 0,
      };

    const groupedBoardingPass = data.boardingPasses.reduce((acc, pass) => {
      const { passenger } = pass;

      const key = `${passenger.name.first}-${passenger.name.last}`;

      if (!Reflect.has(acc, key)) {
        acc[key] = [];
      }

      acc[key].push(pass);

      return acc;
    }, {});

    const payload = LocalStorage.getAsJson(localStorageKeys.b_d_p);

    analyticsEvent({
      event: TRIGGER_EVENTS.BOARDING_PASS_PAGE_LOAD,
      data: {
        productInfo: {
          tripType: bookingAnalyticsDetails?.TripType ?? '',
          departureDates: format(new Date(departure), dateFormats.ddMMyyyy),
          specialFare: bookingAnalyticsDetails?.SpecialFare ?? '',
          totalPax: TotalPax.toString(),
          adultPax: AdultPax.toString(),
          childPax: ChildPax.toString(),
          infantPax: InfantPax.toString(),
          seniorPax: SeniorPax.toString(),
          daysUntilDeparture: differenceInCalendarDays(
            departure,
            new Date(),
          ).toString(),
          sector: `${origin}-${destination}`,
          pnr: data.recordLocator,
          hoursUntilDeparture: differenceInHours(
            departure,
            new Date(),
          ).toString(),
          totalCheckin: Object.keys(groupedBoardingPass).length.toString(),
          checkinSuccess: '1',
          checkinType: 'Web',
          checkinCategory: data.quickCheckIn.length > 0 ? 'Partial' : 'Full',
          marketType: firstBoarding.segments.international
            ? 'International'
            : 'Domestic',
        },
        user: {
          nationality: '',
          journeyID: payload.journeyKey,
          passengerID: payload.passengerKeys.join('|'),
        },
        bookingChannel: bookingAnalyticsDetails?.BookingChannel,
      },
    });

    return true;
  };

  useEffect(() => {
    const getApiData = async () => {
      try {
        const payload = LocalStorage.getAsJson(localStorageKeys.b_d_p);
        const apiResponse = await getBoardingPass(payload);
        dispatch({ type: webcheckinActions.SET_API_DATA, payload: {} });

        if (apiResponse.data) {
          setResponse(apiResponse.data);
          getHotelData(apiResponse.data?.boardingPasses, setHotelList);
          try {
            pageLoadAnalytics(apiResponse.data);
            const _getCommonGtmData = getCommonGtmData(apiResponse.data);

            gtmEvent({
              event: GTM_ANALTYTICS.EVENTS.CHECK_IN_COMPLETE,
              data: {
                ..._getCommonGtmData,
              },
            });
          } catch (error) {
            // Error Handling for GTM
          }
        } else {
          dispatch({
            type: webcheckinActions.SET_TOAST,
            payload: {
              variation: 'Error',
              show: true,
              description: apiResponse?.aemError?.message,
            },
          });
        }
      } catch (err) {
        // Error Handling
        dispatch({
          type: webcheckinActions.SET_TOAST,
          payload: {
            variation: 'Error',
            show: true,
            description: 'Something went Wrong',
          },
        });
      } finally {
        dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
      }
    };

    getApiData();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => {
      return componentRef.current;
    },
    removeAfterPrint: false,
    copyStyles: true,
    onBeforeGetContent: () => {},
    onAfterPrint: () => {},
    bodyClass: 'In6e2',
  });

  const handleEmail = () => {
    setShowEmailBoardingPass(true);
  };

  const handleAction = (icon) => {
    if (icon === 'icon-download' || icon === 'icon-share') {
      analyticsEvent({
        event: TRIGGER_EVENTS.BOARDING_PASS_DOWNLOAD,
        data: {},
      });
      gtmEvent({
        event: GTM_ANALTYTICS.EVENTS.BOARDING_PASS_EMAIL,
        data: {
          click_text: 'Download',
          ...getCommonGtmData(response),
        },
      });
      handlePrint();
    } else if (icon === 'icon-email') {
      analyticsEvent({ event: TRIGGER_EVENTS.BOARDING_PASS_EMAIL, data: {} });
      gtmEvent({
        event: GTM_ANALTYTICS.EVENTS.BOARDING_PASS_EMAIL,
        data: {
          click_text: 'Email',
          ...getCommonGtmData(response),
        },
      });
      handleEmail();
    }
  };
  const onCloseEmailBoardingPass = () => {
    setShowEmailBoardingPass(false);
  };

  const labels = useMemo(() => {
    return {
      hotelRecommendations: aemLabel('boardingPass.hotelRecommendations'),
      webCheckInHomeCTA: aemLabel('boardingPass.webCheckInHomeCTA'),
      disclaimerTitle: aemLabel('boardingPass.disclaimerTitle'),
      backToCheckinLabel: aemLabel('boardingPass.backToCheckinLabel'),
      disclaimerDescription: aemLabel(
        'boardingPass.disclaimerDescription.html',
      ),
      dangerousGoodsTitle: aemLabel(
        'boardingPass.dangerousGoods.restrictedGoodsTitle.html',
      ),
      restrictedGoodsDescription: aemLabel(
        'boardingPass.dangerousGoods.restrictedGoodsDescription.html',
      ),
      restrictedItemList: aemLabel(
        'boardingPass.dangerousGoods.restrictedItemList',
        [],
      ),
      boardingPassTitle: aemLabel('boardingPass.boardingPassTitle.html'),
      boardingPassForAllTitle: aemLabel(
        'boardingPass.boardingPassForAllTitle',
        'Boarding pass for all Passengers',
      ),
      quickActionsLabel: aemLabel('boardingPass.quickActionsLabel.html'),
      saveShareOptions: aemLabel('boardingPass.saveShareOptions', []),
      completeCTALink: aemLabel('boardingPass.completeCTALink'),
      webCheckInHomeCTALink: aemLabel('boardingPass.webCheckInHomeCTALink'),
      autoCheckinCounter: formattedAEMLabel(
        'boardingPass.autoCheckinCounter',
        'Auto check-in scheduled for {count} pax',
        { count: response?.quickCheckIn?.length },
      ),
      boardingPassgenerated: aemLabel(
        'boardingPass.boardingPassgenerated',
        'Boarding pass will be generated 4 hrs before the flight departure and shared on registered email',
      ),
      backToContactUsLabel: aemLabel('boardingPass.backToContactUsLabel'),
      backToContactUsLink: aemLabel('boardingPass.backToContactUsLink'),
    };
  }, [aemLabel]);

  const onClickNexthandler = async () => {
    analyticsEvent({
      event: TRIGGER_EVENTS.BOARDING_PASS_GOTO_WEBCHECKIN,
      data: {},
    });
    window.location.href = labels.webCheckInHomeCTALink;
  };

  return (
    <>
      <div className="wc-boarding-pass" style={{ display: 'flex' }}>
        <div className="col-9 wc-boarding-pass-left">
          <div className="wc-webcheckin-link mt-2 mb-4">
            <i className="sky-icons icon-accordion-left-simple me-2 mt-0.5 sm" />
            <a href={isPrevPageContactUs() ? labels.backToContactUsLink : labels.webCheckInHomeCTALink}>
              {isPrevPageContactUs() ? labels.backToContactUsLabel : labels.backToCheckinLabel || 'Back to check-in'}
            </a>
          </div>
          <HtmlBlock
            className="boarding-pass-container__heading"
            html={labels.boardingPassTitle}
            tagName="h1"
          />
          <div className="d-flex justify-content-between controlls">
            {labels.boardingPassForAllTitle}
            {response?.boardingPasses.length > 1 && (
              <div className="d-flex gap-4 ">
                <Icon
                  className="boarding-pass-left icon-accordion-left-solid"
                  size="lg"
                />
                <Icon
                  className="boarding-pass-right icon-accordion-left-filled-24"
                  size="lg"
                />
              </div>
            )}
          </div>
          <div className="boarding-pass-list">
            <SwiperComponent
              swiperConfig={swiperConfig}
              containerClass="skyplus-slider boarding-pass-list-slider"
            >
              {response?.boardingPasses?.map((boardingPass) => (
                <SwiperComponent.Slide
                  key={boardingPass?.passenger?.barCode}
                  className="boarding-pass d-flex"
                >
                  <div className="boarding-pass__circle" />
                  <div className="boarding-pass__lower-circle" />
                  <BannerHeading boardingPass={boardingPass} />
                  <BoardingDetail
                    boardingPass={boardingPass}
                    recordLocator={response?.recordLocator}
                  />
                </SwiperComponent.Slide>
              ))}
            </SwiperComponent>
          </div>

          {response?.quickCheckIn?.length > 0 && (
            <InfoAlert containerClassName="auto-checkin-counter">
              <Text variation="title">{labels.autoCheckinCounter}</Text>
              <HtmlBlock
                html={labels.boardingPassgenerated}
                className="text-secondary disclaimer"
              />
            </InfoAlert>
          )}

          {isMobile && (
            <div className="info-alert-disclaimer">
              <InfoAlert>
                <Text variation="title mb-4">{labels.disclaimerTitle}</Text>
                <HtmlBlock
                  html={labels.disclaimerDescription}
                  className="text-secondary disclaimer"
                />
              </InfoAlert>
            </div>
          )}

          {response.boardingPasses.length > 0 && (
            <>
              <Heading heading="h3">
                <HtmlBlock html={labels.quickActionsLabel} />
              </Heading>
              <div className="d-flex boarding-pass-action-container">
                {labels.saveShareOptions.map(
                  ({ buttonCode, buttonValue, icon }) => (
                    <Action
                      key={buttonCode}
                      label={buttonValue}
                      icon={icon}
                      handleAction={handleAction}
                    />
                  ),
                )}
              </div>
            </>
          )}

          {/* Hotel Strip */}
          { hotelList?.data?.length && showHotelStrip ? (
            <HotelStrip
              hotelList={hotelList?.data}
              arrivalCityName={hotelList?.arrivalCityName}
              showMoreUrl={hotelList?.showMoreUrl}
              hotelRecommendations={labels?.hotelRecommendations}
              stripType={HOTEL_TRAVELTIPS_VARIATION.HOTELSTRIP}
              analyticsHandler={hotelStripAnalyticsHandler}
            />
          ) : null }

          <DangerousGood
            items={labels.restrictedItemList}
            title={labels.dangerousGoodsTitle}
            subTitle={labels.restrictedGoodsDescription}
          />
        </div>
        <div className="col-3 wc-boarding-pass-right">
          <div className="info-alert-disclaimer">
            <InfoAlert>
              <Text variation="title mb-4">{labels.disclaimerTitle}</Text>
              <HtmlBlock
                html={labels.disclaimerDescription}
                className="text-secondary disclaimer"
              />
            </InfoAlert>
          </div>
          <div className="d-flex flex-column gap-12">
            <ReturnFlightBanner />
            <ChatSection />
          </div>
        </div>

        {showEmailBoardingPass && (
          <EmailBoardingPass
            onClose={onCloseEmailBoardingPass}
            recordLocator={response.recordLocator}
          />
        )}
      </div>
      <div className="wc-footer">
        <div className="wc-footer-wrapper">
          <Button onClick={onClickNexthandler}>
            {labels.webCheckInHomeCTA}
          </Button>
        </div>
      </div>

      <div className="d-none">
        <PrintBoardingPass
          ref={componentRef}
          passses={response.boardingPasses}
          recordLocator={response.recordLocator}
        />
      </div>
    </>
  );
};

export default WithPageLoader(BoardingPass);
