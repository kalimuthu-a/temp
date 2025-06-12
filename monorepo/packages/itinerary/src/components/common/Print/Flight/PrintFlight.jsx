/* eslint-disable i18next/no-literal-string */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import NextChip from 'skyplus-design-system-app/dist/des-system/NextChip';

import { CONSTANTS } from '../../../../constants';
import { convertZuluToSplitted, dateDiffToString, formatDate, UTIL_CONSTANTS } from '../../../../utils';
import { findTripType, getSegmentBasedPassengerInfo } from '../../../Passengers/dataConfig';
import PassengerBarcode from '../../../PassengerBarcode/PassengerBarcode';

const PrintFlight = ({ passengerKey }) => {
  const mfDataObj = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const journeyDetail = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const passengerDetail = useSelector((state) => state.itinerary?.apiData?.passengers) || [];
  const { printItineraryInformation } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  ) || {};
  const isThroughFlight = journeyDetail?.[0]?.flightType?.toUpperCase() === CONSTANTS.FLIGHT_TYPE.THROUGH;
  const { itineraryMainByPath } = mfDataObj;
  const { codeShare, udaanLogoImage,
    flightLabel } = itineraryMainByPath && itineraryMainByPath.item;
  const changeOfAircraft = (nextLeg, currentLeg) => {
    const { legDetails: nextLegDetails } = nextLeg || {};
    const { legDetails: currentLegDetails } = currentLeg || {};
    if (nextLegDetails.utcdeparture && nextLegDetails.utcarrival) {
      const isAppendZeroInTime = true;
      const { hh, mm, days } = dateDiffToString(
        currentLegDetails.utcarrival,
        nextLegDetails.utcdeparture,
        isAppendZeroInTime,
      );
      let travelHrUpdated = hh;
      if (days > 0) { // if we have time difference in days then we have add those to hours count
        travelHrUpdated = Number(travelHrUpdated) + (Number(days) * 24);
      }
      const timeStr = travelHrUpdated > 0 ? `${travelHrUpdated} Hours ${mm} Mins` : `${mm} Mins`;
      const layOverStr = `${timeStr} layover at ${currentLegDetails?.destinationCityName}`;
      // const changeStr = `Change of aircraft`;
      const changeStr = isThroughFlight ? 'Deboarding aircraft may not be allowed' : 'Change of aircraft';
      return (
        <div className="print-flight-details__change-aircraft">
          {layOverStr} {changeStr}
        </div>
      );
    }
    return null;
  };

  const getTravelTime = (from, to) => {
    const startDate = new Date(from);
    // Do your operations
    const endDate = new Date(to);
    const { hh, mm, days } = dateDiffToString(startDate, endDate);

    let travelHrUpdated = hh;
    if (days > 0) { // if we have time difference in days then we have add those to hours count
      travelHrUpdated = Number(travelHrUpdated) + (Number(days) * 24);
    }
    return `${travelHrUpdated}h ${mm}m`;
  };

  const getTime = (date) => {
    const { timehh, timemm } = convertZuluToSplitted(date);
    return `${timehh}:${timemm}`;
  };

  const renderFlightDetails = (legObj, currentLeg, barcodeString, showUdaanLogo) => {
    const { legDetails: currentLegDetails } = currentLeg || {};
    // console;
    return (
      <>
        <div className="print-flight-details__flights-result">
          {barcodeString && (
          <PassengerBarcode
            barValue={barcodeString}
          />
          )}
          {showUdaanLogo && (
            <div className="print-flight-details__udanlogo">
              <img
                style={{ height: '60px' }}
                src={udaanLogoImage?._publishUrl || ''}
                alt="udaan login"
                loading="lazy"
              />
            </div>
          )}
          <div className="print-flight-details__content">
            <div className="print-flight-details__depart-dest-city left-section">
              <p className="print-flight-details__depart-dest-city__destination">
                {legObj.fromDestination}
              </p>
              <p className="print-flight-details__depart-dest-city__terminal">
                {legObj.fromAirport}
              </p>
              <p className="print-flight-details__depart-dest-city__time">
                {getTime(currentLegDetails.departure)} hrs,{' '}
                {formatDate(
                  currentLegDetails.departure,
                  UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY,
                )}
              </p>
            </div>

            <div className="print-flight-details__depart-dest-piconp">
              <span className="print-flight-details__border-line left" />
              <p className="print-flight-details__depart-dest-piconp__reach-time">
                <span>Travel Time</span>
                {getTravelTime(
                  currentLegDetails.utcdeparture,
                  currentLegDetails.utcarrival,
                )}
              </p>
              <span className="print-flight-details__border-line right" />
            </div>

            <div className="print-flight-details__depart-dest-city right-section">
              <p className="print-flight-details__depart-dest-city__destination">
                {legObj.toDestination}
              </p>
              <p className="print-flight-details__depart-dest-city__terminal">
                {legObj.toAirport}
              </p>
              <p className="print-flight-details__depart-dest-city__time">
                {getTime(currentLegDetails.arrival)} hrs,{' '}
                {formatDate(
                  currentLegDetails.arrival,
                  UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY,
                )}
              </p>
            </div>
          </div>
        </div>
        {legObj?.nextLeg
          && changeOfAircraft(legObj?.nextLeg, legObj?.currentLeg)}
      </>
    );
  };
  const renderEquipmentType = (currentLegDetails) => {
    const equipmentType = currentLegDetails?.equipmentType || '';
    const currentEquipmentData = codeShare?.find((i) => i?.equipmentType === equipmentType);
    return currentEquipmentData?.equipmentTypeLabel || equipmentType;
  };
  const renderFlightHeaderDetails = (obj, segIndex, currentLeg) => {
    const { legDetails: currentLegDetails } = currentLeg || {};
    const { legs, international } = obj.sItem;

    const departDate = new Date(currentLegDetails.departure);
    const minusMin = (international) ? 75 : 60;

    departDate.setMinutes(departDate.getMinutes() - minusMin);

    const { timehh: departureHour, timemm: departureMinute } = convertZuluToSplitted(departDate);
    const checkInClosesStr = `${departureHour}:${departureMinute}`;

    const EquipCode = renderEquipmentType(currentLegDetails);
    const isOperatedByCode = legs && legs[0]?.legDetails?.operatingCarrier;
    const identifierObj = (isOperatedByCode && obj?.externalIdentifier?.carrierCode)
      ? obj.externalIdentifier : obj?.segmentIdentifier;
    const currentSegmentCodeshareObj = codeShare?.find((
      cItem,
    ) => (cItem.carrierCode === identifierObj?.carrierCode));
    const flightStr = `${obj?.segmentIdentifier?.carrierCode} ${obj?.segmentIdentifier?.identifier}`;
    return (
      <ul className="print-flight-details__flt-status-list">
        <li>
          {currentSegmentCodeshareObj?.carrierCodePopupIcon && (
          <img
            className="icon-indigo-flight"
            src={currentSegmentCodeshareObj?.carrierCodePopupIcon?._publishUrl}
            alt="indigo"
            style={{ width: '15px', height: '15px' }}
            loading="lazy"
          />
          )}
        </li>
        <li>
          <span className="print-flight-details__flt-status-list__flight-type">
            {segIndex === 0 && obj.flightModeLabel}
          </span>

          <sup />
        </li>
        <li>{' '}
          {flightStr} {EquipCode && `(${EquipCode})`} <sup />
        </li>
        <li>
          {' '}{formatDate(
            departDate,
            UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY,
          )}<sup />
        </li>
        <li>
          {flightLabel?.BagdropClose}:
          {' '}{checkInClosesStr} hrs
        </li>
        {obj.fareLabel && <NextChip>{obj.fareLabel}</NextChip>}
      </ul>
    );
  };

  const tripType = findTripType(journeyDetail);

  const nextFareLabels = useMemo(() => {
    const mappedData = new Map();
    const { paymentDetails: { fareTypesList } } = itineraryMainByPath.item || {
      paymentDetails: { fareTypesList: [] },
    };

    fareTypesList.forEach((item) => {
      const { productClass, fareLabel } = item;
      if (['BR', 'BC'].includes(productClass)) {
        mappedData.set(productClass, fareLabel);
      }
    });
    return mappedData;
  }, []);

  return (
    <div>
      <div className="print-flight-details">
        {journeyDetail.map((jItem, index) => {
          const { showUdaanLogo } = jItem;
          let str = flightLabel?.Departing;
          if (tripType === CONSTANTS.PNR_TYPE.ROUND_TRIP && index === 1) {
            str = flightLabel?.Returning;
          }
          const obj = {
            flightType: jItem.stops > 0 ? `${jItem.stops} Stop` : 'Non Stop',
            flightDate: formatDate(
              jItem
                && jItem.journeydetail
                && jItem
                && jItem.journeydetail.departure,
              UTIL_CONSTANTS.DATE_SPACE_DDMMMYYYY,
            ),
            flightModeLabel: str,
          };

          const nextFareType = ['BR', 'BC'].includes(jItem.productClass);
          obj.fareLabel = nextFareType ? nextFareLabels.get(jItem.productClass) : '';
          return (
            <div
              key={uniq()}
              className="print-flight-details__container pageBreak-container"
            >
              {jItem?.segments.map((sItem, segIndex) => {
                const currentPassenger = passengerDetail?.find(
                  (pItem) => pItem.passengerKey === passengerKey,
                );
                const passengerUiData = (currentPassenger
                    && getSegmentBasedPassengerInfo(
                      [currentPassenger],
                      sItem.segmentKey,
                    ))
                  || {};
                let barcodeString = '';
                if (passengerUiData && passengerUiData[0]) {
                  barcodeString = passengerUiData[0].matchedJourney?.matchedSegment
                    ?.barcodestring;
                }
                return (
                  <React.Fragment key={uniq()}>
                    {sItem.legs.map((legItem, lIndex) => {
                      const legDetails = legItem?.legDetails || {};
                      const arrivalTerminalStr = (legDetails.departureTerminal
                          && ` (Terminal ${legDetails.departureTerminal})`)
                        || '';
                      const destinationTerminalStr = (legDetails.arrivalTerminal
                          && ` (Terminal ${legDetails.arrivalTerminal})`)
                        || '';
                      const legObj = {
                        segmentIndex: index,
                        segmentList: jItem.segments,
                        currentLeg: legItem,
                        // eslint-disable-next-line no-nested-ternary
                        nextLeg: sItem.legs[lIndex + 1]
                          ? sItem.legs[lIndex + 1]
                          : jItem.segments[uniq() + 1]
                            ? jItem.segments[uniq() + 1]?.legs[0]
                            : null,
                        fromDestination: legDetails.originCityName,
                        toDestination: legDetails.destinationCityName,
                        fromAirport: `${legDetails.origin} - ${legDetails.originName}${arrivalTerminalStr}`,
                        toAirport: `${legDetails.destination} - ${legDetails.destinationName}${destinationTerminalStr}`,
                      };
                      obj.segmentIdentifier = sItem?.segmentDetails?.identifier || {};
                      obj.externalIdentifier = sItem?.externalIdentifier || {};
                      obj.sItem = sItem || {};
                      return (
                        <React.Fragment key={uniq()}>
                          {renderFlightHeaderDetails(obj, segIndex, legItem)}

                          {renderFlightDetails(
                            legObj,
                            legItem,
                            barcodeString,
                            showUdaanLogo,
                          )}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
      <div
        className="print-disclaimer"
        dangerouslySetInnerHTML={{
          __html: printItineraryInformation?.printDisclaimer?.html,
        }}
      />
    </div>
  );
};

PrintFlight.propTypes = {
  passengerKey: PropTypes.string,
};

export default PrintFlight;
