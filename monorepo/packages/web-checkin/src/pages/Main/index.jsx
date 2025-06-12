import React, { useEffect, useMemo, useState } from 'react';
import FlightJourneyTabs from 'skyplus-design-system-app/dist/des-system/FlightJourneyTab';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import UserIdentity from 'skyplus-design-system-app/src/functions/UserIdentity';

import analyticsEvent from '../../utils/analyticsEvent';
import gtmEvent from '../../utils/gtmEvents';

import useAppContext from '../../hooks/useAppContext';
import { webcheckinActions } from '../../context/reducer';

import { ANALTYTICS, ERROR_CODES, GTM_ANALTYTICS } from '../../constants';
import { getJournies } from '../../services';
import WithPageLoader from '../../hoc/withPageLoader';
import FlightCheckin from '../../components/FlightCheckin/FlightCheckin';
import { setAnaltyicsContext } from '../../utils/analytics/webcheckin-home';
import usePageTitle from '../../hooks/usePageTitle';

const { TRIGGER_EVENTS } = ANALTYTICS;

const WebCheckIn = () => {
  const { dispatch, aemLabel } = useAppContext();
  const [redirectToItinerary, setRedirectToItinerary] = useState(false);

  usePageTitle('checkinHome.headingTitle');

  const aemLabels = useMemo(() => {
    return {
      yourTrips: aemLabel('checkinHome.yourTrips'),
      pnrViewAndManageLabel: aemLabel('checkinHome.pnrViewAndManageLabel.html'),
      pnrBookingReference: aemLabel('checkinHome.pnrBookingReference'),
      emailIdLastName: aemLabel('checkinHome.emailIdLastName'),
      getStartedLabel: aemLabel('checkinHome.getStartedLabel'),
      selectPassengersForWebCheckin: aemLabel(
        'checkinHome.selectPassengersForWebCheckin.html',
      ),
      backToItineraryUrl: aemLabel('checkinHome.backToItineraryUrl'),
    };
  }, [aemLabel]);

  const [response, setResponse] = useState({
    bookingDetails: null,
    sectors: [],
    journeys: [],
    selectedIndex: 0,
  });

  const getSectors = (journeydetail) => {
    const { origin, destination } = journeydetail;
    return {
      origin,
      destination,
      key: uniq(),
    };
  };

  const redirectToItineraryHandler = () => {
    window.location.href = aemLabel('checkinHome.backToItineraryUrl');
  };

  useEffect(() => {
    if (redirectToItinerary) {
      redirectToItineraryHandler();
    }
  }, [redirectToItinerary]);

  useEffect(() => {
    const getApiData = async () => {
      try {
        const apiResponse = await getJournies();

        if (apiResponse?.errors?.code === ERROR_CODES.pnr_balance_due) {
          setRedirectToItinerary(true);
        }

        if (apiResponse?.data?.bookingDetails) {
          const { journeysDetail } = apiResponse.data;

          let { smartCheckinJourneysDetail } = apiResponse.data;

          if (UserIdentity.isSMEAdmin || UserIdentity.isSMEUser) {
            smartCheckinJourneysDetail = [];
          }

          const journeys = [
            ...journeysDetail.map((journey) => ({
              ...journey,
              isSchedule: false,
            })),
            ...smartCheckinJourneysDetail.map((journey) => ({
              ...journey,
              isSchedule: true,
            })),
          ];

          const sectors = journeys.map((journey) => {
            return getSectors(journey.journeydetail);
          });

          setResponse({
            ...apiResponse?.data,
            sectors,
            journeys,
            selectedIndex: 0,
          });
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

        const analyticContext = setAnaltyicsContext(apiResponse);

        analyticsEvent({
          event: TRIGGER_EVENTS.WEB_CHECK_HOME_PAGE_LOAD,
          data: analyticContext,
        });

        dispatch({
          type: webcheckinActions.SET_ANALYTICS_CONTEXT,
          payload: analyticContext,
        });

        gtmEvent({
          event: GTM_ANALTYTICS.EVENTS.WEB_CHECK_HOME_PAGE_LOAD,
          data: {
            currency_code: apiResponse?.data?.bookingDetails?.currencyCode,
            OD: analyticContext?.gtmData?.OD,
            trip_type: analyticContext?.productInfo?.tripType,
            pax_details: analyticContext?.gtmData?.pax_details,
            departure_date: analyticContext?.gtmData?.departure_date,
            special_fare: analyticContext?.productInfo?.specialFare,
            flight_sector: analyticContext?.gtmData?.flight_sector,
            days_until_departure:
              analyticContext?.productInfo?.daysUntilDeparture,
          },
        });
      } catch (err) {
        // Error Handling
      } finally {
        dispatch({
          type: webcheckinActions.SET_API_DATA,
          payload: {},
        });
      }
    };

    getApiData();
  }, []);

  const onChangeJourneyIndex = (index) => {
    setResponse((prevState) => ({ ...prevState, selectedIndex: index }));
  };

  return (
    <div className="wc-webcheckin">
      <div className="wc-webcheckin-right">
        {response.sectors.length > 0 && (
          <>
            <FlightJourneyTabs
              containerClass="webcheckin-journey"
              sectors={response.sectors}
              onChangeCallback={onChangeJourneyIndex}
              selectedIndex={response.selectedIndex}
            />

            <HtmlBlock
              html={aemLabels.selectPassengersForWebCheckin}
              tagName="h3"
              className="select-passenger-checkin"
            />
            <div className="wc-webcheckin-right-journey">
              <FlightCheckin
                booking={{
                  ...(response.bookingDetails || {}),
                  ...(response.journeys[response.selectedIndex] || {}),
                }}
                selectedIndex={response.selectedIndex}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WithPageLoader(WebCheckIn);
