import React, { useEffect, useMemo, useRef, useState } from 'react';
import FlightJourneyTabs from 'skyplus-design-system-app/dist/des-system/FlightJourneyTab';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import useAppContext from '../../hooks/useAppContext';
import { webcheckinActions } from '../../context/reducer';

import { getJournies, postUnDoWebCheckin } from '../../services';
import WithPageLoader from '../../hoc/withPageLoader';
import useGetSSR from '../../hooks/useGetSSR';
import TabContent from './TabContent';
import UndoWebCheckinPromotModel from '../../components/common/Modal/UndoWebCheckinPromptModal';
import { setAnaltyicsContext } from '../../utils/analytics/webcheckin-home';
import usePageTitle from '../../hooks/usePageTitle';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';

const UndoWebCheckIn = () => {
  const { dispatch, aemLabel } = useAppContext();
  const UndoCheckInNotAllowedXSAT = 'UndoCheckInNotAllowedXSAT';
  const DEFAULT_ERROR = 'default';
  useGetSSR();

  const passengerRef = useRef(null);

  const [response, setResponse] = useState({
    bookingDetails: null,
    sectors: [],
    journeys: [],
    selectedIndex: 0,
  });

  const [prompt, setPrompt] = useState({
    show: false,
  });

  const getSectors = (journeydetail) => {
    const { origin, destination } = journeydetail;
    return {
      origin,
      destination,
      key: uniq(),
    };
  };

  useEffect(() => {
    const getApiData = async () => {
      try {
        const apiResponse = await getJournies();

        if (apiResponse?.data?.bookingDetails) {
          const { journeysDetail } = apiResponse.data;

          const journeys = [...journeysDetail];

          const sectors = journeys.map((journey) => {
            return getSectors(journey.journeydetail);
          });

          setResponse({
            ...apiResponse?.data,
            sectors,
            journeys,
            selectedIndex: 0,
          });

          const analyticContext = setAnaltyicsContext(apiResponse);

          dispatch({
            type: webcheckinActions.SET_ANALYTICS_CONTEXT,
            payload: analyticContext,
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

  usePageTitle('checkinHome.headingTitle');

  const aemLabels = useMemo(() => {
    return {
      yourTripsLabel: aemLabel('checkinHome.yourTripsLabel', 'Your Trips'),
      addPnrLabel: aemLabel(
        'checkinHome.yourTripsLabel',
        'Add using PNR to view & manage your bookings',
      ),
      undoWebCheckinPopUpHeading: aemLabel(
        'checkinHome.undoWebCheckinPopUp.description.html',
      ),
      undoWebCheckinPopUpContinue: aemLabel(
        'checkinHome.undoWebCheckinPopUp.secondaryCtaLabel',
      ),
      undoWebCheckinPopUpCancel: aemLabel(
        'checkinHome.undoWebCheckinPopUp.ctaLabel',
      ),
      undoWebCheckinPopUpMessage: aemLabel(
        'checkinHome.undoWebCheckinPopUp.heading',
      ),
      undoWebCheckinSuccessMsg: aemLabel(
        'checkinHome.undoWebCheckinSuccessMsg.html',
      ),
      undoWebCheckinFailureMsg: aemLabel(
        'checkinHome.undoWebCheckinFailureMsg.html',
      ),
      yourTrips: aemLabel('checkinHome.yourTrips'),
      pnrViewAndManageLabel: aemLabel('checkinHome.pnrViewAndManageLabel.html'),
      pnrBookingReference: aemLabel('checkinHome.pnrBookingReference'),
      emailIdLastName: aemLabel('checkinHome.emailIdLastName'),
      selectPassengersForWebCheckin: aemLabel(
        'checkinHome.selectPassengersForWebCheckin.html',
      ),
      backToItineraryUrl: aemLabel('checkinHome.backToItineraryUrl'),
    };
  }, [aemLabel]);

  const onChangeJourneyIndex = (index) => {
    setResponse((prevState) => ({ ...prevState, selectedIndex: index }));
  };

  const onClickCancel = () => {
    setPrompt({ show: false, checked: false });
  };

  const getXsatMessage = ({code, message}, defaultMsg) => {
    if (code === UndoCheckInNotAllowedXSAT) {
      let errorMsg = getErrorMsgForCode(code);
      return errorMsg.code === DEFAULT_ERROR ? message : errorMsg?.message;
    } else {
      return defaultMsg;
    }
  }

  const onClickContinue = async () => {
    setPrompt({ show: false, checked: true });

    dispatch({ type: webcheckinActions.SHOW_LOADER, payload: true });

    const { journeyKey, passengers } = passengerRef.current;

    const payload = [
      {
        journeyKey,
        passengers: [...passengers].map((v) => ({ passengerKey: v })),
      },
    ];

    try {
      const apiResponse = await postUnDoWebCheckin({
        journeys: payload,
      });
      dispatch({
        type: webcheckinActions.SET_TOAST,
        payload: {
          variation: apiResponse?.data?.success ? 'Success' : 'Error',
          show: true,
          description: apiResponse?.data?.success
            ? aemLabels.undoWebCheckinSuccessMsg
            : getXsatMessage(apiResponse.data.errors, aemLabels.undoWebCheckinFailureMsg),
        },
      });

      if (apiResponse?.data?.success) {
        setTimeout(() => {
          window.location = aemLabels.backToItineraryUrl;
        }, 1500);
      }
    } catch (error) {
      dispatch({
        type: webcheckinActions.SET_TOAST,
        payload: {
          variation: response?.data?.success ? 'Success' : 'Error',
          show: true,
          description: response?.data?.success
            ? aemLabels.undoWebCheckinSuccessMsg
            : aemLabels.undoWebCheckinFailureMsg,
        },
      });
    } finally {
      dispatch({ type: webcheckinActions.SHOW_LOADER, payload: false });
    }
  };

  const onClickUndoCheckin = ({ passengers, journeyKey }) => {
    passengerRef.current = { passengers, journeyKey };
    setPrompt({ show: true, checked: false });
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
              <TabContent
                booking={{
                  ...(response.bookingDetails || {}),
                  ...(response.journeys[response.selectedIndex] || {}),
                }}
                isUndoCheckin
                onUndoCheckin={onClickUndoCheckin}
                selectedIndex={response.selectedIndex}
              />
            </div>
          </>
        )}
      </div>
      {prompt.show && (
        <UndoWebCheckinPromotModel
          heading={aemLabels.undoWebCheckinPopUpHeading}
          continueLabel={aemLabels.undoWebCheckinPopUpContinue}
          cancelLabel={aemLabels.undoWebCheckinPopUpCancel}
          onClickCancel={onClickCancel}
          onClickContinue={onClickContinue}
        >
          <HtmlBlock html={aemLabels.undoWebCheckinPopUpMessage} />
        </UndoWebCheckinPromotModel>
      )}
    </div>
  );
};

export default WithPageLoader(UndoWebCheckIn);
