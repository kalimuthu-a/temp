import React from 'react';
import { useSelector } from 'react-redux';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import PrintFlight from '../Flight/PrintFlight';
import PrintBaggageInformation from '../PrintBaggageInformation/PrintBaggageInformation';
import { CONSTANTS } from '../../../../constants';
import PrintBookingInfo from '../PrintBookingInfo';
import InfantIcon from '../../../../styles/images/infant-filled.jpg';

const PrintPassenger = () => {
  const passengerDetail = useSelector((state) => state.itinerary?.apiData?.passengers) || [];
  const ssrListAbbreviation = useSelector((state) => state.itinerary?.ssrListAbbreviation) || [];
  const converObj = {};
  ssrListAbbreviation.forEach((itm) => {
    converObj[itm.ssrCode] = itm.name;
  });
  const { paxList, checkedInLabel, noShowLabel, printItineraryInformation, frequentFlyerNo } = useSelector(
    (state) => state.itinerary?.mfDatav2?.itineraryMainByPath?.item,
  ) || {};
  const { passengerInformationLabel, seatLabel, eAddOnsLabel } = useSelector(
    (state) => state.itinerary?.mfDatav2?.mfAdditionalDatav2?.item,
  ) || {};

  const renderChip = (liftStatus) => {
    if (liftStatus === CONSTANTS.API_LIFT_STATUS.CHECKEDIN) {
      return (
        <span className="print-sector-chip print-sector-chip-checked-in" key={uniq()}>
          <i className="icon icon-web_checkin" />
          {checkedInLabel || 'Checked-In'}
        </span>
      );
    }
    if (liftStatus === CONSTANTS.API_LIFT_STATUS.NOSHOW) {
      return (
        <span className="print-sector-chip print-sector-chip-no-show" key={uniq()}>
          <span className="icon-close-circle icon-style-common" />
          {noShowLabel || 'No-show'}
        </span>
      );
    }
    return null;
  };

  const renderPassengerBox = (pItem) => {
    let passengerType = '';
    if (
      pItem?.passengerTypeCode === 'ADT'
      || pItem?.passengerTypeCode === 'SRCT'
    ) {
      passengerType = 'Adult';
    } else if (pItem?.passengerTypeCode === 'CHD') {
      passengerType = 'Child';
    } else if (pItem?.passengerTypeCode === 'INF') {
      passengerType = 'Infant';
    } else {
      passengerType = 'Adult';
    }

    let jouneryInfoNotThereInPassenger = true;

    if (pItem && pItem?.seatsAndSsrs?.journeys?.length > 0) {
      jouneryInfoNotThereInPassenger = false;
    }
    const isInfantAttached = pItem?.infant?.name?.first || false;
    const paxLeng = passengerDetail?.length || 0;
    const infantLabel = paxList?.filter((pax) => pax?.typeCode === CONSTANTS.PASSENGER_TYPE.INFANT)?.[0]?.paxLabel;
    const ffNumberLabel = pItem?.program?.number && `${frequentFlyerNo}: ${pItem?.program?.number}`;
    return (
      <div className={`passenger-details-box ${paxLeng > 0 ? 'pageBreak__after' : ''}`} key={uniq()}>
        <PrintBookingInfo />
        <div className="print-passenger__heading">{passengerInformationLabel || 'Passenger Information'}</div>
        <div className="print-passenger" key={uniq()}>
          <div className="print-passenger__content">
            <div className="print-passenger__details">
              <div>
                <p className="print-passenger__details__name">
                  <span className="print-passenger__details__name--title">
                    {pItem?.name?.title}
                  </span>{' '}
                  {pItem?.name?.first} {pItem?.name?.last}
                  <span className="print-passenger__details__type">
                    {passengerType}
                  </span>
                  {!!ffNumberLabel && (
                  <span className="print-passenger__details__type">
                    {ffNumberLabel}
                  </span>
                  )}
                </p>
                {isInfantAttached && (
                  <p className="print-passenger__details__name">
                    <img
                      className="print-passenger__details__name--infant-piconp"
                      src={InfantIcon}
                      alt="Infant icon"
                      loading="lazy"
                    />
                    {/* <i className="print-passenger__details__name--infant-piconp
                    icomoon-baby-piconp icon-link" /> */}
                    {pItem?.infant?.name?.first} {pItem?.infant?.name?.last}
                    <span className="print-passenger__details__type">
                      {infantLabel || 'Infant'}
                    </span>
                  </p>
                )}
                {!jouneryInfoNotThereInPassenger && (
                  <div className="print-passenger-row">
                    <b className="print-passenger-col">{printItineraryInformation?.sectorLabel || 'Sector'}</b>
                    <b className="print-passenger-col">{seatLabel || 'Seat'}</b>
                    <b className="print-passenger-col">{eAddOnsLabel || '6E Add-ons'}</b>
                  </div>
                )}
                {pItem?.seatsAndSsrs?.journeys?.map((journey) => {
                  return journey?.segments?.map((sItem) => {
                    const hasInfant = sItem?.hasInfant;
                    const seatsList = sItem?.seats || [];
                    const ssrsList = sItem?.ssrs || [];

                    let seatStr = '';
                    const ssrStr = [];
                    seatsList.forEach((seatItem) => {
                      seatStr += seatItem.unitDesignator
                        ? seatItem.unitDesignator
                        : '';
                      if (seatItem.type) seatStr += `(${seatItem.type}) `;
                    });
                    ssrsList.forEach((ssrItem) => {
                      ssrStr.push(
                        converObj[ssrItem.ssrCode] || ssrItem.ssrCode,
                      );
                    });
                    if (hasInfant) {
                      ssrStr.push(' Infant');
                    }
                    const liftStatus = sItem?.liftStatus;

                    return (
                      <div key={uniq()} className="print-passenger-row">
                        <b className="print-passenger-col">
                          {sItem?.segmentDetails?.origin}-
                          {sItem?.segmentDetails?.destination}
                          {renderChip(liftStatus)}
                        </b>
                        <span className="print-passenger-col">{seatStr || '-'}</span>
                        <span className="print-passenger-col">
                          {(ssrStr.length > 0 && ssrStr.join(', ')) || '-'}
                        </span>
                        <br />
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>
        </div>
        {!jouneryInfoNotThereInPassenger && (
          <>
            <PrintFlight passengerKey={pItem?.passengerKey} />{' '}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {passengerDetail
        && passengerDetail.map((pItem) => {
          return renderPassengerBox(pItem);
        })}
      <PrintBaggageInformation key={uniq()} />
    </>
  );
};

PrintPassenger.propTypes = {};

export default PrintPassenger;
