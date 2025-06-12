import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import LinkButton from '../LinkButton';

import useAppContext from '../../hooks/useAppContext';

import { splitPnrActions } from '../../context/reducer';
import { getSplitPnrDetail, viewPnrDetailApi } from '../../services';
import { analyiticProductInfo, combineArrayToObject, createPNR, getSplitPnrPassengers } from '../../utils';
import SplitPnrBookingDetails from '../SplitPnrBookingDetails';
import SplitPnrPassengerSection from '../SplitPnrPassengerSection';
import analyticEvents from '../../utils/analyticEvents';
import { EVENTS } from '../../constants';

const classNameText = 'split_pnr';

const SplitPnrDetail = ({ errorHandler, handleLoader }) => {
  const {
    dispatch,
    state: { splitPnrDetailResponse, main, splitPnrs },
  } = useAppContext();

  // Analytic data generation
  const sendToAnalytic = ({ data: { parentpnr = {}, childpnr = {} }, errors = '' }) => {
    const splitPnrAnalyticData = { parentpnr, childpnr };
    // Generate product info for each item in the response
    const individualProductData = Object.keys(splitPnrAnalyticData)?.map((item) => {
      return analyiticProductInfo(splitPnrAnalyticData[item]);
    });
    // Combine the array of product info into a single object
    const {
      tripType,
      departureDate,
      specialFare,
      totalCount,
      adultCount,
      childrenCount,
      infantCount,
      seniorCitizenCount,
      daysUntilDeparture,
      sector,
      pnr,
      bookingChannel,
    } = combineArrayToObject(individualProductData);

    // Send the analytic event
    analyticEvents({
      data: {
        _event: EVENTS.SPLIT_PNR_SUCCESS,
        productInfo: {
          tripType,
          departureDates: departureDate,
          specialFare,
          totalPax: totalCount,
          adultPax: adultCount,
          childPax: childrenCount,
          infantPax: infantCount,
          seniorPax: seniorCitizenCount,
          daysUntilDeparture,
          sector,
          splitPnr: pnr,
        },
        eventInfo: {
          name: errors ? 'Error' : 'Success',
          position: '',
        },
        bookingChannel,
      },
      event: EVENTS.SPLIT_PNR_SUCCESS,
    });
  };

  // Split Pnr Post API Call
  const splitPnrApiCall = async () => {
    if (splitPnrs) {
      const { parent = {}, child = {} } = splitPnrs;
      const splitPnrPayload = {
        pnrDetails: { parent, child },
      };
      try {
        const response = await getSplitPnrDetail(splitPnrPayload);
        if (!response?.data) {
          // Use the common error handling function
          errorHandler(response);
        } else {
          // store response in store
          dispatch({
            type: splitPnrActions.GET_DETAIL,
            payload: {
              detail: response?.errors ? null : response?.data,
            },
          });
          // analytic
          if (response) {
            sendToAnalytic(response);
          }
        }
      } catch (err) {
        // handle for n/w error
        errorHandler();
      }
    }
  };

  useEffect(() => {
    // after save and submit click call splitPnr api
    splitPnrApiCall();

    // scroll to top
    window?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // memoized pnr response
  const splitPnrResponse = useMemo(() => {
    if (!splitPnrDetailResponse) return {};
    const { parentpnr, childpnr } = splitPnrDetailResponse;
    return { parentpnr, childpnr };
  }, [splitPnrDetailResponse]);

  // handle itinerary detail
  const viewItineryDetail = async (bookingDetails, passengers) => {
    const recordLocator = bookingDetails?.recordLocator || '';
    const last = passengers?.[0]?.name?.last || '';
    //  display Loader
    handleLoader(true);
    try {
      // API call
      const response = await viewPnrDetailApi(recordLocator, last);
      // Use the common error handling function
      if (!response?.data) {
        // remove loader
        handleLoader();
        errorHandler(response);
      } else {
        // Store the data if available
        localStorage.setItem('iti-data', JSON.stringify(response?.data));
        // redirect on itinerary page
        window.location.href = main?.viewDetailedItineraryCtaLink || '';
      }
    } catch (error) {
      // handle n/w error
      // remove loader
      handleLoader();
      // show error
      errorHandler();
    }
  };

  // render child and parent details of PNR
  const RenderSplitPnrDetails = () => {
    if (!splitPnrResponse || !Object.keys(splitPnrResponse).length) {
      return null;
    }

    return Object.keys(splitPnrResponse).map((item, key) => {
      const { bookingDetails, journeysDetail, passengers } = splitPnrResponse?.[item] || {};
      if (!bookingDetails || !journeysDetail || !passengers) return null;

      const displayKey = key + 1;
      const [, passengerListWithChild] = useMemo(() => getSplitPnrPassengers(passengers), [passengers]);

      return (
        <React.Fragment key={item}>
          <HtmlBlock
            html={createPNR({ pnr: bookingDetails?.recordLocator, number: displayKey }, main?.pnrLabel)}
            className={`${classNameText}--title`}
          />
          <SplitPnrBookingDetails splitPnrBooking={{ bookingDetails, journeysDetail, passengers }} />
          <LinkButton
            containerClass="detail_itinerary_link--container"
            buttonText={main?.viewDetailedItineraryCtaLabel}
            className="detail_itinerary_link--btn"
            onButtonClick={() => viewItineryDetail(bookingDetails, passengers)}
          />
          <HtmlBlock
            html={main?.passengersInPnrLabel}
            className={`${classNameText}--text--bold text-primary mb-n4`}
          />
          <SplitPnrPassengerSection isCheckBox={false} passengerList={passengerListWithChild} />
        </React.Fragment>
      );
    });
  };
  // handle Data
  return (
    splitPnrResponse && Object.keys(splitPnrResponse)?.length > 0 && (
      <>
        <HtmlBlock
          html={main?.findNewPNRSTitle}
          className={`${classNameText}--text text-secondary mb-4`}
        />
        <RenderSplitPnrDetails />
      </>
    )
  );
};

// PropTypes validation
SplitPnrDetail.propTypes = {
  errorHandler: PropTypes.func,
  handleLoader: PropTypes.func,
};

export default SplitPnrDetail;
