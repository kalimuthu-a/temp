/* eslint-disable no-nested-ternary */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FlightJourneyTabs from 'skyplus-design-system-app/dist/des-system/FlightJourneyTab';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { formatDate, UTIL_CONSTANTS } from '../../../utils';
import { aemContent } from '../../../../public/mockApi/aemContent';
import { AppContext } from '../../../context/AppContext';

const BookingInfo = ({
  itineraryData,
  isVisaBooking,
  travellerPax,
  stayDuration,
  bookingIdLabel,
  heading,
  isVisaDetail,
  pnr }) => {
  const {
    state: {
      visaPaxSelectByPath,
    },
  } = React.useContext(AppContext);
  const { paxLabel } = visaPaxSelectByPath?.items || {};
  const { journeysDetail, bookingDetails, passengers } = itineraryData || {};
  // eslint-disable-next-line no-unused-vars, no-unsafe-optional-chaining
  const { codeShare, pnrLabel,
    partnerPnrBookingLabel, pnrStatus } = aemContent?.data?.sprContent || {}; // NOSONAR
  const [sectors, setSectors] = useState([]);

  const [tripIndex, setTripIndex] = useState(0);
  const pnrLabelText = pnrLabel?.replace(
    '{pnr}',
    '',
  );
  const pnrLabelValue = pnrLabel?.replace('PNR:', '')?.replace(
    '{pnr}',
    bookingDetails?.recordLocator || '',
  );

  const journeyDetailFlightDate = journeysDetail?.map((item) => {
    return formatDate(
      item?.journeydetail?.departure,
      UTIL_CONSTANTS.DATE_SPACE_DDMMMMYYYY,
    );
  });

  useEffect(() => {
    const sectorList = [];
    if (sectors?.length === 0 && journeysDetail?.length > 0) {
      journeysDetail?.forEach((ssrObj, ssrIndex) => {
        const sectorObj = {
          origin: ssrObj?.journeydetail?.origin,
          destination: ssrObj?.journeydetail?.destination,
          key: ssrIndex,
        };
        sectorList.push(sectorObj);
      });
      setSectors(sectorList);
    }
  }, [journeysDetail]);

  const isCodeshareEnabled = bookingDetails?.recordLocators?.length > 0;
  const pnrNotGeneratedLabel = pnrStatus?.notGenerated;
  return (
    <div className="booking-info">
      <div className="booking-info-header">
        {(isVisaDetail && (
          <div className="flight-journey-tab-wrapper">
            <div className="flight-journey-tab-container oneway justify-content-center">
              <div className="flight-journey-tab-container__leg">
                <HtmlBlock
                  className="text-uppercase text-primary fw-semibold"
                  html={heading || 'DUBAI Tourist VISA'}
                />
              </div>
            </div>
          </div>

        )) || ((sectors?.length > 0) && (
          <FlightJourneyTabs
            sectors={sectors}
            onChangeCallback={(ssrIndex) => (ssrIndex !== tripIndex ? setTripIndex(ssrIndex) : '')}
            containerClass={bookingDetails?.journeyType?.toLowerCase()}
          />
        )
        )}

      </div>
      <div className={`booking-info-container ${isCodeshareEnabled ? 'codeshare' : ''}`}>
        <div className={`booking-info-container-other-info ${isCodeshareEnabled ? 'codeshare-other-info' : ''}`}>
          {
            !isVisaBooking ? (journeysDetail?.length > 0) && journeyDetailFlightDate && (
              <div className="booking-info-container-other-info__date">
                <i className="icon-calender" />
                <span>{journeyDetailFlightDate?.join('-')}</span>
              </div>
            )
              : (
                <div className="booking-info-container-other-info__date">
                  <i className="icon-calender" />
                  <span>{stayDuration}</span>
                </div>
              )
          }
          {passengers?.length > 0 ? (
            <div className="booking-info-container-other-info__pax-info">
              <i className="icon-Passenger" />
              <span>{`${passengers?.length} ${paxLabel || 'pax'
              }`}
              </span>
            </div>
          ) : isVisaBooking
            ? (
              <div className="booking-info-container-other-info__pax-info">
                <i className="icon-Passenger" />
                <span>{`${travellerPax} ${paxLabel || 'pax'
                }`}
                </span>
              </div>
            ) : null}
        </div>

        {isCodeshareEnabled
          ? (
            <div className="booking-info-container-pnrs-block">
              <div className="booking-info-container-transaction transaction">
                <div className="booking-info-container-transaction-block">
                  <div className="booking-info-container-transaction-pnr transaction-prn">
                    <span className="icon-flight">
                      <span className="path1" />
                      <span className="path2" />
                      <span className="path3" />
                      <span className="path4" />
                    </span>
                    <span className="booking-info-container-transaction-pnr-label">
                      {pnrLabelText}
                    </span>
                    <strong className="booking-info-container-transaction-pnr-value">
                      {pnrLabelValue}
                    </strong>
                  </div>
                </div>
              </div>
              {bookingDetails?.recordLocators?.length > 0 && (
                bookingDetails?.recordLocators.map((recordItem) => {
                  const segmentCodeshareObj = codeShare?.find(
                    (cItem) => cItem?.carrierCode === recordItem?.owningSystemCode,
                  );
                  return (
                    <div className="booking-info-container-partner-bookingstatus" key={recordItem?.recordCode}>
                      <div className="booking-info-container-partner-bookingstatus-bookingreference">
                        {segmentCodeshareObj?.carrierCodeIcon
                          && (
                            <img
                              src={segmentCodeshareObj?.carrierCodeIcon?._publishUrl}
                              className="flightLogo"
                              alt=""
                            />
                          )}
                        {partnerPnrBookingLabel || 'Partner PNR:'}
                      </div>
                      <div className="booking-info-container-partner-bookingstatus-pnrstatus">

                        <div className="booking-info-container-partner-bookingstatus-pnrstatus-pnr">
                          {recordItem?.recordCode
                            ? (
                              <span className="booking-info-container-partner-bookingstatus-pnrstatus-pnr-label">
                                {recordItem?.recordCode}
                              </span>
                            )
                            : (
                              <span className="booking-info-container-transaction__withoutprn mx-0">
                                <i className="icon-close-circle" />{pnrNotGeneratedLabel}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )
          : (
            <div className="booking-info-container-pnrs-info">
              <div className="booking-info-container-transaction">
                <div className="booking-info-container-transaction-block">
                  <div className="booking-info-container-transaction-pnr">
                    <span className="booking-info-container-transaction-pnr-label">
                      {bookingIdLabel || 'Booking Id: '}
                    </span>
                    <strong className="booking-info-container-transaction-pnr-value">
                      {isVisaBooking ? pnr : pnrLabelValue}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
BookingInfo.propTypes = {
  itineraryData: PropTypes.object,
  isVisaBooking: PropTypes.bool,
  travellerPax: PropTypes.any,
  stayDuration: PropTypes.string,
  pnr: PropTypes.string,
  bookingIdLabel: PropTypes.any,
  heading: PropTypes.any,
  isVisaDetail: PropTypes.any,
};

export default BookingInfo;
