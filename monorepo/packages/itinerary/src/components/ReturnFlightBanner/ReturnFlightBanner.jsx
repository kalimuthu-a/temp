import React, { useState, useEffect } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { useSelector } from 'react-redux';
import { formatCurrencyFunc } from '../../utils';
import { findTripType } from '../Passengers/dataConfig';
import { CONSTANTS } from '../../constants';

const ReturnFlightBanner = () => {
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const itineraryApiData = useSelector((state) => state.itinerary?.apiData) || {};
  const { journeysDetail, lowFareData, payments } = itineraryApiData;
  const [returnCityName, setReturnCityName] = useState('');
  const {
    bookReturnFlightPrice,
    bookReturnFlightTitle,
    bookReturnFlightSubtext,
    bookReturnFlightBgImage,
    bookReturnFlightDiscount,
    bookAnotherFlightTitle,
    bookReturnFlightRedirection,
  } = mfData?.itineraryMainByPath?.item || '';

  const subTitleString = bookReturnFlightPrice
    ?.replace('{city}', returnCityName)
    .replace('{price}', '');
  const tripType = (journeysDetail?.length > 0) && findTripType(journeysDetail);
  const returnFlightPrice = formatCurrencyFunc({
    price: lowFareData?.Amount || '',
    currencycode: payments?.[0]?.collectedCurrencyCode || 'INR',
  });

  useEffect(() => {
    if (journeysDetail?.length > 0 && lowFareData?.CityName) {
      const returnFlightCity = journeysDetail?.filter(
        (journey) => (journey?.journeydetail?.destination === lowFareData?.CityName),
      )[0]?.journeydetail?.destinationCityName;
      setReturnCityName(returnFlightCity);
    }
  }, [(journeysDetail?.length > 0), lowFareData?.CityName]);

  return (
    <div className="return-flight-banner">
      <div className="return-flight-banner__title-block">
        <Heading containerClass="title" heading="h0" mobileHeading="h1">
          {tripType === CONSTANTS.PNR_TYPE.ONE_WAY
            ? bookAnotherFlightTitle
            : ''}
        </Heading>
        <HtmlBlock html={bookReturnFlightSubtext?.html} className="sub-title" />
      </div>
      <div className="return-flight-banner__card">
        <div className="return-flight-banner__card__img-container">
          <img
            src={bookReturnFlightBgImage?._publishUrl}
            alt={bookReturnFlightTitle}
            loading="lazy"
          />
        </div>
        <div className="return-flight-banner__card__main-container">
          <Heading containerClass="title" heading="h0" mobileHeading="h1">
            {bookReturnFlightDiscount}
          </Heading>
          <div className="return-flight-banner__card__content">
            <div className="return-flight-banner__card__description">
              <Heading
                heading="h4"
                mobileHeading="h3"
                containerClass="return-flight-banner__card__subtitle"
              >
                {subTitleString}{' '}
                <span className="price">{returnFlightPrice}</span>
              </Heading>
            </div>
            <div className="return-flight-banner__redirect">
              <a
                href={bookReturnFlightRedirection || '#'}
                className="return-flight-banner__link"
                aria-label="save-link"
              >
                <span className="return-flight-banner__link__wrapper">
                  <i className="sky-icons icon-arrow-top-right sm" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReturnFlightBanner;
