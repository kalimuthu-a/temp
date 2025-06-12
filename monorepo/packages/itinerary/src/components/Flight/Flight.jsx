import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import NextChip from 'skyplus-design-system-app/dist/des-system/NextChip';
import DepartingFlight from './DepartingFlight';
import SectorDetails from './SectorDetails';
import FlightDetails from './FlightDetails';
import { formatDate, UTIL_CONSTANTS, dateDiffToString } from '../../utils';
import { findTripType } from '../Passengers/dataConfig';
import { CONSTANTS } from '../../constants';
import PassengerDetails from './PassengerDetails';

const Flight = () => {
  const mfDataObj = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const mfDataObjLabel = mfDataObj?.itineraryMainByPath?.item;
  const { passengersAndAddonsLabel, partnerPnrBookingLabel,
    codeShare, pnrStatus } = mfDataObjLabel || {};
  const codeShareFlightAEMData = mfDataObjLabel?.codeShare || [];
  // eslint-disable-next-line no-unused-vars
  const [airlineListObj, setAirlineListObj] = useState({}); // NOSONAR
  const checkInBagInfo = mfDataObjLabel?.checkInBagInfo?.replace('{checkInBaggage}', '');
  const handBagInfo = mfDataObjLabel?.handBagInfo?.replace('{cabinBaggage}', '');
  const excessBaggageInfo = mfDataObjLabel?.codeShareExcessBaggageInfo;
  const pnrLabel = mfDataObjLabel?.pnrLabel?.replace('{pnr}', '');
  const bookingDetails = useSelector((state) => state.itinerary?.apiData?.bookingDetails) || [];
  const journeyDetail = useSelector((state) => state.itinerary?.apiData?.journeysDetail) || [];
  const { passengers } = useSelector((state) => state.itinerary?.apiData) || [];
  const tripType = findTripType(journeyDetail);
  const [isListLoading, setListLoading] = useState(false); // NOSONAR
  const { flightLabel } = mfDataObjLabel;
  const { departing, returning } = flightLabel;

  const constructAirlineList = () => {
    const obj = {};
    journeyDetail.forEach((jItem) => {
      jItem?.segments.forEach((sItem) => {
        const isOperatedByCode = sItem?.legs && sItem?.legs[0]?.legDetails?.operatingCarrier;
        const identifierObj = isOperatedByCode && sItem?.externalIdentifier?.carrierCode
          ? sItem.externalIdentifier
          : sItem?.segmentDetails?.identifier;
        if (!jItem?.segments.identifierObj?.carrierCode) return;
        const currentSegmentCodeshareObjForExternal = codeShareFlightAEMData?.find(
          (cItem) => cItem.carrierCode === identifierObj?.carrierCode,
        );
        obj[identifierObj?.carrierCode] = currentSegmentCodeshareObjForExternal || {};
      });
    });
    setAirlineListObj(obj);
  };

  const handleRedirection = (url) => {
    if (url) {
      window.open(
        url?.replace('pnrStr', bookingDetails?.recordLocator),
        '_blank',
      );
    }
  };

  const getTime = (journey) => {
    const { hh: journeyHr, mm: journeyMin, days: journeyDays } = dateDiffToString(
      journey?.journeydetail?.utcdeparture,
      journey?.journeydetail?.utcarrival,
      true,
    );
    let journeyHrUpdated = journeyHr < 10 ? Number(journeyHr) : journeyHr;
    if (journeyDays > 0) {
      journeyHrUpdated = Number(journeyHrUpdated) + (Number(journeyDays) * 24);
    }
    return `${journeyHrUpdated}h ${journeyMin}m`;
  };

  useEffect(() => {
    if (!isListLoading && journeyDetail?.length > 0 && mfDataObj !== '{}') {
      setListLoading(true);
      constructAirlineList();
    }
  }, [!isListLoading, journeyDetail?.length > 0]);

  const getPartnerPNR = (seg, partnerPNR) => {
    const matchSegment = seg?.find(segValue => segValue.externalIdentifier);
    const finalObj = partnerPNR.find(pnrInfo => pnrInfo.systemDomainCode === matchSegment?.designator?.origin);
    return finalObj;
  }
  return (
    <div className="flight-details">
      {journeyDetail?.length > 0 && journeyDetail.map((jItem, index) => {
        let flightDetailLabel = departing;
        let ico = 'icon-depart-flight';
        if (tripType === CONSTANTS.PNR_TYPE.ROUND_TRIP && index === 1) {
          flightDetailLabel = returning;
          ico = 'icon-return-flight';
        } else if (tripType === CONSTANTS.PNR_TYPE.MULTY_CITY) {
          const { originCityName, destinationCityName } = jItem.journeydetail;
          const multiCityFlightLabel = `${originCityName} - ${destinationCityName}`;
          flightDetailLabel = multiCityFlightLabel;
        }
        const checkInBaggageWeightValue = `${jItem.journeydetail.baggageData.checkinBaggageWeight}Kg`;
        const handBaggageWeightValue = `${jItem?.journeydetail?.baggageData?.handBaggageWeight}Kg`;
        const codeShareExcessBaggageInfo = excessBaggageInfo?.replace(
          '{checkinBaggageCount}',
          jItem?.journeydetail?.baggageData?.checkinBaggageCount,
        ).replace('{checkInBaggage}', jItem?.journeydetail?.baggageData?.checkinBaggageWeight);
        const terminals = [{
          departureTerminal: jItem?.segments[0]?.legs[0]?.legDetails?.departureTerminal,  // eslint-disable-line
          arrivalTerminal: jItem?.segments[jItem?.segments?.length - 1]?.legs[0]?.legDetails?.arrivalTerminal,
        }];
        const { productClass } = jItem || {};
        const isNext = productClass === 'BR' || productClass === 'BC';

        const fareType = mfDataObjLabel?.paymentDetails?.fareTypesList?.find(
          (fareTypes) => {
            return fareTypes?.productClass === productClass;
          },
        );

        return (
          <React.Fragment key={uniq()}>
            <div
              className={`flight-details__heading ${index > 0 ? 'space-top' : ''
              }`}
            >
              {flightDetailLabel}
            </div>
            <div className="flight-details__title-wrapper">
              <div className="flight-details__flight">
                {mfDataObjLabel?.flightDetailsLabel}
              </div>
              {/* eslint-disable-next-line sonarjs/no-identical-functions , sonarjs/no-duplicate-string */}
              <div
                className="flight-details__flight-check-cta"
                role="button"
                tabIndex="0"
                onClick={() => {
                  handleRedirection(mfDataObjLabel?.checkFlightStatusLink);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRedirection(mfDataObjLabel?.checkFlightStatusLink);
                }}
              >
                {mfDataObjLabel?.checkFlightStatus}
              </div>{' '}
              {/* NOSONAR */}
            </div>
            {isNext && <NextChip>{fareType?.fareLabel}</NextChip>}
            <div
              className={`flight-details__flights-result
              ${isNext && 'flight-details__flights-result--isNext'}`}
              key={uniq() + 1}
            >
              <DepartingFlight
                flight={flightDetailLabel}
                flightPnrLabel={pnrLabel}
                flightPNR={bookingDetails.recordLocator}
                flightType={
                  jItem.stops > 0 ? `${jItem.stops} Stop` : 'Non Stop'
                }
                flightDate={formatDate(
                  jItem
                  && jItem.journeydetail
                  && jItem
                  && jItem.journeydetail.departure,
                  UTIL_CONSTANTS.DATE_SPACE_DDDMMM,
                )}
                isNext={isNext}
                icon={ico}
                partnerPnrbookingLabel={
                  partnerPnrBookingLabel || 'Partner PNR:'
                }
                partnerPnrDetail={getPartnerPNR(jItem.segments, bookingDetails.recordLocators)}
                isCodeShareFlight={getPartnerPNR(jItem.segments, bookingDetails.recordLocators)}
                codeShare={codeShare}
                notGeneratedLabel={pnrStatus?.notGenerated || 'Not generated'}
              />
              <div className="flight-details__wrapper">
                <SectorDetails
                  flightTerminal={terminals}
                  flightDestinationCode={jItem?.journeydetail.destination}
                  flightOriginCode={jItem?.journeydetail.origin}
                  fromDestination={
                    jItem
                    && jItem.journeydetail
                    && jItem.journeydetail.originCityName
                  }
                  flightTime={() => getTime(jItem)}
                  flightType={
                    jItem.stops > 0 ? `${jItem.stops} Stop` : 'Non Stop'
                  }
                  toDestination={
                    jItem
                    && jItem.journeydetail
                    && jItem.journeydetail.destinationCityName
                  }
                />
                {jItem?.segments.map((sItem, sIndex) => {
                  return sItem.legs.map((legItem, lIndex) => {
                    return (
                      <FlightDetails
                        key={uniq()}
                        segmentIndex={sIndex}
                        segmentList={jItem?.segments}
                        currentLeg={legItem}
                        nextLeg={
                          sItem?.legs[lIndex + 1]
                          || jItem?.segments[sIndex + 1]?.legs[0]
                          || null
                        }
                        jItem={jItem}
                      />
                    );
                  });
                })}
                <div className="flight-baggage-container">
                  <div className="flight-baggage-info">
                    <div className="flight-baggage-label">
                      {mfDataObjLabel?.baggageInfoLabel}
                    </div>
                    <div className="flight-baggage-cabin__wrapper">
                      <div className="checkin">
                        <span className="icon-cabin-bag" />
                        <span className="checkin-value">
                          {handBaggageWeightValue}
                        </span>
                        {handBagInfo}
                      </div>
                      <div className="cabin">
                        <span className="icon-checkin-bag" />
                        <span className="cabin-value">
                          {checkInBaggageWeightValue}
                        </span>
                        {checkInBagInfo}
                      </div>
                    </div>
                  </div>
                  {bookingDetails?.recordLocators?.length > 0
                    && <div className="flight-baggage-codeshare">({codeShareExcessBaggageInfo})</div>}
                </div>
              </div>
            </div>
            <div className="passenger-details-title skyplus-text  sh6">
              {passengersAndAddonsLabel}
            </div>
            <PassengerDetails jKey={jItem.journeyKey} />
          </React.Fragment>
        );
      })}
      {journeyDetail?.length === 0 && passengers?.length > 0 ? (
        <>
          <div className="passenger-details-title skyplus-text cancel-flight sh6">
            {passengersAndAddonsLabel}
          </div>
          {passengers?.map((pItem) => {
            const passengerTitle = pItem?.name
              ? `${pItem?.name?.first.charAt(0)}${pItem?.name?.last.charAt(0)}`
              : '';
            const fullName = pItem?.name
              ? `${pItem?.name?.first} ${pItem?.name?.last}`
              : '';
            return (
              <div className={`passenger-details cancel-flight
              ${(bookingDetails?.bookingStatus?.toLocaleLowerCase()
                  === CONSTANTS.BOOKING_STATUS.HOLD_CANCELLED.toLocaleLowerCase())
                ? 'cancelled' : ''}`}
              >
                <div className="passenger-details__top-section">
                  <div className="passenger-details__top-section__sm-name skyplus-text sh7">
                    {passengerTitle}
                  </div>
                  <div className="passenger-details__top-section-container">
                    <div
                      className="passenger-details__top-section__full-name
                             skyplus-text sh6"
                      aria-hidden="true"
                    >
                      <span className="passenger-details__top-section__full-name">
                        {fullName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
};

Flight.propTypes = {};
export default Flight;
