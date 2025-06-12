import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Progress from 'skyplus-design-system-app/dist/des-system/Progress';
import {
  useCustomEventListener,
  useCustomEventDispatcher,
} from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import FlightDetails from '../FlightDetails';
import PaxDetails from '../PaxDetails';
import TripSummaryDetailsModal from '../TripSummaryDetailsModal';
import { useTripSummaryContext } from '../../store/trip-summary-context';
import './TripSummary.scss';
import { CONSTANTS, EVENTS, EXTRASEAT_TAG } from '../../constants';
import {
  getAEMAdditionalData,
  getAEMData,
  getFareSummaryApiData,
  getSsrCodeMapping,
} from '../../services';
import { getFareTypeLabel, getPaxAndExtraSeatCounts } from '../../utils';
// import analyticEvents from '../../utils/analyticEvents';

const STEPLIST = {
  PE: 'pe',
  ADDON: 'add on',
  SEAT: 'seat',
  PAYMENT: 'payment',
};
const TripSummary = ({ apiData, apiSSRData }) => {
  const {
    tripSummaryData,
    aemData,
    aemAdditionalData,
    updateTripSummaryData,
    updateAemData,
    updateAemAdditionalData,
    updateSsrCodeMapping,
    ssrCodeMapping,
  } = useTripSummaryContext();
  const [isOpen, setIsOpen] = useState(false);
  const [paxWiseSeatCounts, setPaxWiseSeatCounts] = useState({});
  const [activeStep, setActiveStep] = useState(STEPLIST.PE);
  const [paxInfo, setPaxInfo] = useState([]);
  const { passengers, journeysDetail } = tripSummaryData || {};
  const [isIframe, setIsIframe] = useState(false);
  const [stepList, setStepList] = useState([]);
  const dispatchAPILoadedEvent = useCustomEventDispatcher();
  const currencyCode = tripSummaryData?.priceBreakdown?.currencyCode;

  const converSSRCodeObj = {};
  ssrCodeMapping?.forEach((itm) => {
    converSSRCodeObj[itm.ssrCode] = itm.name;
  });

  const ref = useRef(null);

  useEffect(() => {
    // when active section changes, we need to close the slider if its opened
    if (isOpen)setIsOpen(false);
  }, [activeStep]);

  const updateStepperList = () => {
    const stepListObjTemp = { ...STEPLIST };

    const typeCodeList = passengers?.map((i) => i?.passengerTypeCode) || [];
    const uniquePassengerTypeList = [...new Set(typeCodeList)];
    // taking all the passengerType and checking only CHD passenger there
    if (uniquePassengerTypeList.length === 1 && uniquePassengerTypeList[0] === CONSTANTS.CHILD_PAX_TYPE) {
      delete stepListObjTemp.SEAT;
      // for isUnaccompaniedMinor we should not show seat,as its not eligible
    }
    setStepList(Object.values(stepListObjTemp));
  };

  const getAPISSrForPaxForJourney = (paxKey, jKey) => {
    const ssrs = [];
    const currentPax = passengers?.find(
      (pItem) => pItem?.passengerKey === paxKey,
    );
    const currentJourney = currentPax?.seatsAndSsrs?.journeys?.find(
      (jItem) => jItem.journeyKey === jKey,
    );

    currentJourney?.segments?.forEach((sItem) => {
      ssrs.push(...(sItem.ssrs || []));
    });
    return ssrs;
  };
  const getAPISeatForPaxForJourney = (paxKey, jKey) => {
    const ssrs = [];
    const currentPax = passengers?.find(
      (pItem) => pItem?.passengerKey === paxKey,
    );
    const currentJourney = currentPax?.seatsAndSsrs?.journeys?.find(
      (jItem) => jItem.journeyKey === jKey,
    );

    currentJourney?.segments?.forEach((sItem) => {
      const seatList = [];
      sItem?.seats?.forEach((seatItem) => {
        const obj = {
          label: `${seatItem.unitDesignator} ${seatItem.type}`,
          passengerKey: paxKey,
        };
        seatList.push(obj);
      });
      ssrs.push(...seatList);
    });
    return ssrs;
  };

  const constructPaxData = (passengersTemp) => {
    if (!passengersTemp?.[0]?.name?.first) {
      return null;
    }
    const out = [];
    passengersTemp?.forEach((pItem) => {
      const obj = {
        paxNameStr: '',
        journey: [],
        passengerKey: pItem.passengerKey,
        name: pItem.name,
        infant: pItem?.infant || {},
      };
      obj.paxNameStr = `${pItem?.name?.first}  ${pItem?.name?.last}`;
      journeysDetail?.forEach((jItem) => {
        const jObj = {
          journeyKey: jItem.journeyKey,
          label: '',
          segments: [],
          ssrs: [],
          seats: [],
        };
        jObj.label = `${jItem.journeydetail.origin}-${jItem.journeydetail.destination}`;
        jObj.ssrs = getAPISSrForPaxForJourney(
          pItem.passengerKey,
          jObj.journeyKey,
        );
        jObj.seats = getAPISeatForPaxForJourney(
          pItem.passengerKey,
          jObj.journeyKey,
        );
        obj.journey.push(jObj);
      });

      out.push(obj);
    });
    setPaxInfo(out);
    return '';
  };

  const fetchAEMData = () => {
    Promise.all([getAEMData(), getAEMAdditionalData()])
      .then(([aemRes, aemAdditionalRes]) => {
        updateAemData(aemRes);
        updateAemAdditionalData(aemAdditionalRes);
      })
      .catch(() => {
        // TODO: Error handling,
        // TODO: show toaster message to the user,
        // TODO: send to analytics and kibana
        // eslint-disable-next-line no-console
      });
  };

  const sendHeightMessage = () => {
    const content = ref.current;
    const height = content.scrollHeight;
    const data = { height, tag: 'MerchantIFrameTopRight' };
    window.parent.postMessage(JSON.stringify(data), '*');
  };

  const updateActiveSectionFromUrl = () => {
    const hashParam = window.location.hash?.substring(1);
    let activeTab = STEPLIST.PE;
    if (hashParam.includes(CONSTANTS.QUERYPARAM_ADDON)) {
      activeTab = STEPLIST.ADDON;
    } else if (hashParam.includes(CONSTANTS.QUERYPARAM_SEAT)) {
      activeTab = STEPLIST.SEAT;
    }
    setActiveStep(activeTab);
  };

  useEffect(() => {
    fetchAEMData();
    updateActiveSectionFromUrl();
    const observer = new MutationObserver(sendHeightMessage);
    const config = { attributes: true, childList: true, subtree: true };
    // commenting this to avoid multiple page load event call on passnger edit page
    // analyticEvents({
    //   data: {
    //     _event: 'pageload',
    //   },
    //   event: 'pageload',
    // });
    // eslint-disable-next-line no-restricted-globals
    if (window === top) {
      updateTripSummaryData(apiData);
      if (apiSSRData) updateSsrCodeMapping(apiSSRData);
    } else {
      setIsIframe(true);
      ref.current?.classList.add('d-none');
      Promise.all([getFareSummaryApiData(),
        getSsrCodeMapping()])
        .then(([fareSummaryRes, ssrCodeMappingRes]) => {
          updateTripSummaryData(fareSummaryRes);
          updateSsrCodeMapping(ssrCodeMappingRes);
          dispatchAPILoadedEvent(EVENTS.TRIP_SUMMARY_IFRAME_LOADED, {
            iframeLoaded: true,
          });
        })
        .catch(() => {
          // eslint-disable-next-line no-console
        });
      observer.observe(ref.current, config);

      setTimeout(() => {
        sendHeightMessage();
      }, 100);
    }
    return () => observer.disconnect();
  }, []);

  useCustomEventListener(EVENTS.REVIEW_SUMMARY_API_DATA, (detail) => {
    // event will be dispatched from Faresummary API when we make apicall.
    if (detail?.fareSummaryData) {
      updateTripSummaryData(detail.fareSummaryData);
    }
    if (detail?.ssrData) {
      updateSsrCodeMapping(detail.ssrData);
    }
  });

  useEffect(() => {
    if (tripSummaryData) {
      setPaxWiseSeatCounts(getPaxAndExtraSeatCounts(tripSummaryData));
      constructPaxData(passengers);
      ref.current?.classList.remove('d-none');
      updateStepperList();
    }
  }, [tripSummaryData]);

  const getExtraSeatText = (paxObj, doubleSeat, tripleSeat) => {
    let extraSeatText = '';
    if (paxObj[EXTRASEAT_TAG.DOUBLE] > 0 || paxObj[EXTRASEAT_TAG.TRIPLE] > 0) {
      extraSeatText += ' (';
      if (paxObj[EXTRASEAT_TAG.DOUBLE] > 0) {
        extraSeatText += `${paxObj[EXTRASEAT_TAG.DOUBLE]} ${
          doubleSeat?.addSeatLabel
        }`;
        if (paxObj[EXTRASEAT_TAG.TRIPLE] > 0) {
          extraSeatText += ' & ';
        }
      }
      if (paxObj[EXTRASEAT_TAG.TRIPLE] > 0) {
        extraSeatText += `${paxObj[EXTRASEAT_TAG.TRIPLE]} ${
          tripleSeat?.addSeatLabel
        }`;
      }
      extraSeatText += ')';
    }
    return extraSeatText;
  };

  const getTextForPaxWiseCount = () => {
    let textForPaxWiseCount = '';
    const [doubleSeat, tripleSeat] = aemData?.extraSeatData || [];

    for (const [pax, paxObj] of Object.entries(paxWiseSeatCounts)) {
      const paxListItem = aemData?.paxList?.find(
        (item) => item.discountCode === pax || item.typeCode === pax,
      ) || {};
      if (paxObj.count > 0) {
        textForPaxWiseCount += `${paxObj.count} ${paxListItem.paxTitle}`;
      }
      textForPaxWiseCount += getExtraSeatText(paxObj, doubleSeat, tripleSeat);
      textForPaxWiseCount += ', ';
    }
    return textForPaxWiseCount.replace(/,\s*,/g, ',').replace(/,\s*$/, '').trim();
  };
  const handleActiveSectionChange = (detail) => {
    let activeTab = STEPLIST.PE;
    if (detail?.mfToOpen === CONSTANTS.EVENT_TOGGLE_SECTION_ACTION_ADDON) {
      activeTab = STEPLIST.ADDON;
    } else if (
      detail?.mfToOpen === CONSTANTS.EVENT_TOGGLE_SECTION_ACTION_SEAT
    ) {
      activeTab = STEPLIST.SEAT;
    }
    if (detail?.payload) {
      constructPaxData(detail.payload?.passengers || []);
    }
    setActiveStep(activeTab);
  };

  // eslint-disable-next-line no-unused-vars
  const [fareObj, fareLabel] = getFareTypeLabel(aemAdditionalData, tripSummaryData);
  useCustomEventListener(EVENTS.MAKE_ME_EXPAND_V2, handleActiveSectionChange);

  const eventHandlerForAddon = (detail) => {
    if (Object.keys(detail).length > 0) {
      const temp = [...paxInfo];
      temp?.forEach((pItem, pIndex) => {
        pItem.journey.forEach((jItem, index) => {
          temp[pIndex].journey[index].ssrs = [];
          const addonForThis = detail[jItem.journeyKey]?.data || [];
          addonForThis?.forEach((aJItem) => {
            if (aJItem.passengerKey === pItem.passengerKey) temp[pIndex].journey[index].ssrs.push(aJItem);
          });
        });
      });

      setPaxInfo(temp);
    }
  };

  const validateFreeMealSeat = (selectedSeat) => {
    let cpmlObj = {};
    if (selectedSeat?.xlSeatFreemeal) {
      cpmlObj = {
        ssrCode: CONSTANTS.CPML,
        value: 0,
        ssrName: CONSTANTS.CPML,
        multiplier: 1,
      };
    }
    return (Object.keys(cpmlObj).length > 0) ? cpmlObj : null;
  };
  const eventHandlerForSeat = (detail) => {
    const temp = [...paxInfo];
    temp?.forEach((pItem, pIndex) => {
      const paxNameKey = `${pItem.name?.title}${pItem.name?.first}${pItem.name?.last}`;
      pItem.journey.forEach((jItem, index) => {
        if (detail[jItem.journeyKey]) {
          temp[pIndex].journey[index].seats = [];
          const nofreeMealSSRs = temp[pIndex].journey[index].ssrs.filter((ssrItem) => ssrItem?.ssrCode !== CONSTANTS.CPML);
          temp[pIndex].journey[index].ssrs = nofreeMealSSRs;
          const seatForThis = detail[jItem.journeyKey]?.seats || [];
          seatForThis?.forEach((aJItem) => {
            const paxNameKeyFromEventData = `${aJItem?.name?.title}${aJItem?.name?.first}${aJItem?.name?.last}`;
            if (paxNameKeyFromEventData === paxNameKey) {
              const obj = {
                label: `${aJItem.unitDesignator}  ${aJItem.type}`,
                passengerKey: aJItem.passengerKey,
              };
              temp[pIndex].journey[index].seats.push(obj);
              const selectedFreeMeal = validateFreeMealSeat(aJItem);
              if (selectedFreeMeal && Object.keys(selectedFreeMeal).length) {
                const ssrLabel = converSSRCodeObj[selectedFreeMeal.ssrCode] || selectedFreeMeal.ssrName;
                const formattedAmount = formatCurrency(selectedFreeMeal?.value ?? 0, currencyCode, { minimumFractionDigits: 0 });
                const freeMealItem = {
                  ssrName: ssrLabel,
                  value: formattedAmount,
                  ...selectedFreeMeal,
                };
                temp[pIndex].journey[index].ssrs.push(freeMealItem);
              }
            }
          });
        }
      });
    });

    setPaxInfo(temp);
  };

  document.addEventListener(
    EVENTS.EVENT_ADDONSELECTION_REVIEW_SUMMARY_TRIGGER,
    (eve) => {
      eventHandlerForAddon(eve.detail);
    },
  );
  document.addEventListener(
    EVENTS.EVENT_SEATSELECTION_REVIEW_SUMMARY_TRIGGER,
    (eve) => {
      eventHandlerForSeat(eve.detail);
    },
  );
  return (
    <div className="trip-summary-app" ref={ref}>
      {!isIframe && (
      <Progress
        customClass="booking-progress"
        allSteps={stepList}
        currentStep={isIframe ? STEPLIST.PAYMENT : activeStep}
        titlePos="top"
      />
      ) }
      <div className={`trip-summary ${isIframe ? 'trip-summary--iframe' : ''}`}>
        <div className="trip-summary-header flex-h-between">
          <div
            dangerouslySetInnerHTML={{
              __html: aemData?.reviewSummaryRteLabel?.html || '',
            }}
          />
          <span className="trip-summary-title--mob">
            <p
              dangerouslySetInnerHTML={{
                __html: aemData?.reviewSummaryRteLabel?.html || '',
              }}
            />
          </span>
          {!isIframe && (
          <button
            type="button"
            className="btn-link btn-link--arrow"
            onClick={() => setIsOpen(true)}
          >
            {aemData?.reviewSummaryDetailsCtaLabel || 'View Details'}
          </button>
          )}
        </div>
        <div
          className={`trip-summary-body ${
            isIframe ? 'trip-summary-body--iframe' : ''
          }`}
        >
          <div className="pax-count text-tertiary">
            {getTextForPaxWiseCount()}
          </div>
          <div className="flight-summary flex-h-between">
            <h5>{aemData?.flightSummaryLabel || 'Flight Summary'}</h5>
          </div>
          {tripSummaryData?.journeysDetail?.map((journey, idx) => {
            return (
              <FlightDetails
                key={journey?.journeyKey}
                journeysDetail={tripSummaryData?.journeysDetail}
                journeyIndex={idx}
                aemData={aemData}
                fareObj={fareObj}
              />
            );
          })}

          <PaxDetails paxInfo={paxInfo} />
        </div>
      </div>
      {isOpen && (
      <TripSummaryDetailsModal
        onClose={() => setIsOpen(false)}
        paxInfo={paxInfo}
      />
      )}
    </div>

  );
};

TripSummary.propTypes = {
  apiData: PropTypes.object,
  apiSSRData: PropTypes.any,
};

export default TripSummary;
