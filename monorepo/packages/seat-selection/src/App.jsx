import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import SeatSelectionApp from './components/SeatSelectionApp';

import { SeatMapContextProvider, useSeatMapContext } from './store/seat-map-context';
import { CONSTANTS } from './constants';

import './index.scss';

const App = () => {
  const { setIsModifyFlow, setIsCheckInFlow, isModifyFlow, setPageloadStart, isCheckInFlow } = useSeatMapContext();
  const [isSeatSelectionMF, setIsSeatSelectionMF] = useState(false);

  const backHandler = useCallback(() => {
    setIsSeatSelectionMF(false);
    const dispatcheventToOpenMf = (config) => {
      // eslint-disable-next-line no-console

      return new CustomEvent(CONSTANTS.MAKE_ME_EXPAND_V2, config);
    };

    document.dispatchEvent(
      dispatcheventToOpenMf({
        bubbles: true,
        detail: {
          from: CONSTANTS.SEAT_SELECTION_MF,
          mfToOpen: CONSTANTS.ADDON,
        },
      }),
    );
  }, []);

  const headerTitleUpdate = () => {
    const headerTitleUpdateEvent = (data) => new CustomEvent(CONSTANTS.HEADER_CONTENT_UPDATE_EVENT, data);
    document.dispatchEvent(
      headerTitleUpdateEvent({
        bubbles: true,
        detail: { title: 'Seat selection', onClickBack: backHandler },
      }),
    );
  };

  useEffect(() => {
    let pageType = '';
    let checkinPagetype = '';

    // scroll seat page to top
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // handling page refresh
    const hashParam = window.location.hash?.substring(1);
    if (hashParam.includes(CONSTANTS.SEAT)) {
      setIsSeatSelectionMF(true);
      // Starting timer for pageload performance calculation
      const originTime = Date.now();
      setPageloadStart(originTime);
      headerTitleUpdate();
    }

    try {
      const parsedPageTypeData = document
        .querySelector("div[data-component='mf-seat-selection-v2']")
        .getAttribute('data-page-type');

      pageType = [
        CONSTANTS.SEAT_SELECTION_MODIFY_PAGE_TYPE,
        CONSTANTS.SEAT_SELECTION_ADDON_CHECKIN,
        CONSTANTS.ADDON_SEAT_SELECTION_MODIFICATION,
      ].includes(parsedPageTypeData)
        ? parsedPageTypeData
        : ''; // if query parma not available then it will look for data attr

      checkinPagetype = [CONSTANTS.SEAT_SELECTION_ADDON_CHECKIN, CONSTANTS.ADDON_CHECKIN].includes(parsedPageTypeData)
        ? parsedPageTypeData
        : '';
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('data-page-type attribute not found');
    }

    if (pageType) {
      setIsModifyFlow({
        flowType: pageType,
        enable: true,
      });
    }
    if (checkinPagetype) {
      setIsCheckInFlow({
        flowType: checkinPagetype,
        enable: true,
      });
    }

    const expandEventFromAddon = ({ detail }) => {
      if (detail?.mfToOpen === CONSTANTS.SEAT_SELECTION_MF) {
        setIsSeatSelectionMF(true);
        window.location.hash = CONSTANTS.SEAT;
        // Starting timer for pageload performance calculation
        const originTime = Date.now();
        setPageloadStart(originTime);
        headerTitleUpdate();
      } else if (detail?.mfToOpen === CONSTANTS.ADDON) {
        window.location.hash = 'addon';
        setIsSeatSelectionMF(false);
      } else {
        setIsSeatSelectionMF(false);
      }
    };

    document.addEventListener(CONSTANTS.MAKE_ME_EXPAND_V2, expandEventFromAddon);
    return () => {
      document.removeEventListener(CONSTANTS.MAKE_ME_EXPAND_V2, expandEventFromAddon);
    };
  }, []);

  useEffect(() => {
    const isModificationFlow = isModifyFlow?.enable
      && isModifyFlow.flowType === CONSTANTS.SEAT_SELECTION_MODIFY_PAGE_TYPE;
    // const isWebCheckInFlow = isCheckInFlow?.enable && webCheckInPageTypes.includes(isCheckInFlow.flowType);

    if (isModificationFlow) {
      setIsSeatSelectionMF(true);

      // Starting timer for pageload performance calculation
      const originTime = Date.now();
      setPageloadStart(originTime);
      window.location.hash = CONSTANTS.SEAT;
      const dataToPassLoading = {
        from: 'seatSelection',
        isLoading: false,
      };
      const dispatchLoadingEvent = (config) => new CustomEvent(CONSTANTS.EVENT_PASSENGEREDIT_TOGGLE_LOADING, config);

      setTimeout(() => {
        document.dispatchEvent(
          dispatchLoadingEvent({
            bubbles: true,
            detail: { ...dataToPassLoading },
          }),
        );
      }, 1000);
    }
  }, [isModifyFlow, isCheckInFlow]);

  return (
    isSeatSelectionMF && <SeatSelectionApp backHandler={backHandler} />
  );
};

let rootElement = null;

function seatSelectAppInit(ele, configData = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }
    rootElement.render(
      <SeatMapContextProvider>
        <App configData={configData?.configData?.data || {}} />
      </SeatMapContextProvider>,
    );
  }
}

if (document.querySelector('#__mf_seat_selection')) {
  seatSelectAppInit(document.getElementById('__mf_seat_selection'), {});
}

// eslint-disable-next-line import/prefer-default-export
export { seatSelectAppInit };
