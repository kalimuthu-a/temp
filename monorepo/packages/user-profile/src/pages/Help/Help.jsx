import React, { useEffect, useState } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import {
  getMyBookings,
  getMyBookingsAemData,
} from '../../services/myBooking.service';
import createMyBookingsCardData from '../MyBookings/FlightsBooking/BookingInfoData';
import BookingCard from '../MyBookings/FlightsBooking/BookingCard/BookingCard';
import BookingInfo from '../MyBookings/FlightsBooking/BookingInfo/BookingInfo';
import Loader from '../../components/common/Loader/Loader';
import { BROWSER_STORAGE_KEYS, ANALTYTICS } from '../../constants';

const Help = () => {
  const [bookingApiData, setBookingApiData] = useState([]);
  const [labels, setLabels] = useState({});
  const [loader, setLoader] = useState(false);
  const [isLogin, setLogin] = useState(false);

  const setInitMyBookingData = async () => {
    setLoader(true);
    const getMyBookingsData = await getMyBookings(3);
    const limitedBookings = [
      ...(getMyBookingsData?.currentJourney || []),
      ...(getMyBookingsData?.completedJourney || []),
    ];
    if (limitedBookings.length > 3) {
      limitedBookings.length = 3;
    }
    setBookingApiData(limitedBookings);

    const getMyBookingsAemLabels = await getMyBookingsAemData();
    setLabels(getMyBookingsAemLabels);
    setLoader(false);
  };

  const onLoginSuccess = () => {
    const isLoggedIn = Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    if (isLoggedIn) {
      setLogin(isLoggedIn);
      setInitMyBookingData();
    }
  };
  useEffect(() => {
    document.addEventListener(ANALTYTICS.DATA_CAPTURE_EVENTS.LOGIN_SUCCESS, onLoginSuccess);
    onLoginSuccess();
    return () => {
      document.removeEventListener(ANALTYTICS.DATA_CAPTURE_EVENTS.LOGIN_SUCCESS, onLoginSuccess);
    };
  }, []);

  const swiperConfig = {
    direction: 'horizontal',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      enabled: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        return `<span class="${className}"></span>`;
      },
    },
    cssMode: true,
    autoHeight: true,
  };

  useEffect(() => {
    setInitMyBookingData();
  }, []);

  if (!isLogin) {
    return null;
  }

  document.querySelector(
    '[data-component="mf-retrieve-pnr-v2"]',
  ).style.display = 'none';

  return (
    <>
      <div className="mb-16 d-none d-md-block">
        <div className="container">
          <p className="d-none d-md-block">
            <a
              href="/"
              className="text-decoration-none d-flex align-items-center text-primary-main"
            >
              <span className="icon-accordion-left-simple icon-size-md" />
              <span className="ps-4 body-large-regular text-decoration-underline text-uppercase">
                {labels?.helpDetails?.backLabel}
              </span>
            </a>
          </p>
        </div>
      </div>
      <div className="help-page w-100">
        {loader ? <Loader /> : null}
        <div className="mb-16">
          <Heading heading="h5" mobileHeading="h5" containerClass="mb-6">
            {labels?.helpDetails?.needHelpText}
          </Heading>
          <div className="gradient-secondary px-18 py-12 rounded-3
          d-flex flex-column flex-md-row gap-10 justify-content-between align-items-center"
          >
            <HtmlBlock
              html={labels?.helpDetails?.totalActiveRefund?.html}
              className="h4 text-secondary"
              tagName="h4"
            />
            <a
              href={labels?.helpDetails?.viewMyRefundLink}
              className="align-items-center bg-white border d-flex gap-16
              justify-content-center p-2 ps-12 rounded-pill text-decoration-none text-primary-main bg-add-refund"
            >
              {labels?.helpDetails?.viewMyRefundLabel}
              <i className="bg-primary-main icon-arrow-top-right icon-size-sm p-5 rounded-pill text-white" />
            </a>
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            {/* <Heading heading="h5" mobileHeading="h5">
            Your <span>last trips</span>
          </Heading> */}
            <HtmlBlock
              html={labels?.helpDetails?.lastTripLabel?.html}
              className="text-secondary h4"
            />
            <a
              href={labels?.helpDetails?.viewAllLink}
              className="body-medium-regular text-primary-main"
            >
              {labels?.helpDetails?.viewAllLabel}{' '}
              <span className="icon-accordion-left-24" />
            </a>
          </div>
          <div className="help-page__bookings-list position-relative pb-25">
            <SwiperComponent
              swiperConfig={swiperConfig}
              containerClass="mobile-slider"
            >
              {bookingApiData?.map((journey) => {
                const bookingData = createMyBookingsCardData(
                  journey,
                  labels,
                  journey?.isCompleted,
                );
                return (
                  <SwiperComponent.Slide key={uniq()}>
                    <BookingCard bookingData={bookingData} containerClass="m-5" labels={labels}>
                      <div className="rounded-3">
                        {bookingData?.bookingInfo?.map((data, index) => (
                          <BookingInfo
                            paymentStatus={bookingData?.paymentStatus}
                            bookingStatus={bookingData?.bookingStatus}
                            isOneWay={bookingData?.isOneWay}
                            bookingData={data}
                            key={uniq()}
                            bottomDivider={index > 0}
                            labels={labels}
                            partnerPNR={data?.partnerPnr}
                            codeShare={labels?.codeShare}
                          />
                        ))}
                      </div>
                    </BookingCard>
                  </SwiperComponent.Slide>
                );
              })}
            </SwiperComponent>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
