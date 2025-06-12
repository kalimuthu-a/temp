import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import Slider from '../Slider';
import TripDetailsSegment from '../TripDetailsSegment/TripDetailsSegment';
import { useTripSummaryContext } from '../../store/trip-summary-context';
import './TripSummaryDetailsModal.scss';
import { getFareTypeLabel, getIsInternational } from '../../utils';
import PaxDetails from '../PaxDetails';
import { handleNorseFlights, norsePriceObj } from '../../utils/norseFlights';

const TripSummaryDetailsModal = ({ onClose, paxInfo }) => {
  const { tripSummaryData, aemData, aemAdditionalData } = useTripSummaryContext();
  const [slide, setSlide] = useState(false);
  const delay = 500;

  useEffect(() => {
    setSlide(true);
    const bgthemeData = document?.body?.dataset;
    const targetEle = document.getElementById('trip-slider-bg');
    if (bgthemeData?.themeImage && targetEle) {
      targetEle.style.backgroundImage = `url(${bgthemeData.themeImage})`;
      targetEle.style.backgroundRepeat = 'no-repeat';
      targetEle.style.backgroundSize = '100% 100%';
      targetEle.style.backgroundPosition = 'top center';
    }
  }, []);

  const [fareObj] = getFareTypeLabel(aemAdditionalData, tripSummaryData);
  const fareObjTemp = Array.isArray(fareObj) ? fareObj[0] : fareObj;
  const [firstJourney] = tripSummaryData?.journeysDetail || [{}];
  const isInternational = getIsInternational(firstJourney);

  const {
    values = [],
    secondaryValues = [],
  } = handleNorseFlights(tripSummaryData?.journeysDetail?.[0]?.segments?.[0], fareObjTemp?.servicesWithFleetType);
  const fareTypeServices = values?.length > 0 ? values : fareObjTemp?.services;
  const fleetFareType = norsePriceObj(secondaryValues);

  const getCancellationAmount = (idx = 0) => {
    const key = isInternational
      ? `internationalCancellationCharges${idx + 1}`
      : `domesticCancellationCharges${idx + 1}`;
    return values?.length > 0 ? fleetFareType?.[key] ?? 0 : fareObjTemp?.[key] ?? 0;
  };

  const getChangeAmount = (idx = 0) => {
    const key = isInternational ? `internationalChangeCharges${idx + 1}` : `domesticChangeCharges${idx + 1}`;
    return values?.length > 0 ? fleetFareType?.[key] ?? 0 : fareObjTemp?.[key] ?? 0;
  };
  const getServiceItem = (val) => {
    let updatedVal = val;
    const baggageData = firstJourney?.journeydetail?.baggageData;
    updatedVal = updatedVal?.replace('{cabinBaggage}', baggageData?.handBaggageWeight);
    updatedVal = updatedVal?.replace('{checkinBaggage}', baggageData?.checkinBaggageWeight);
    updatedVal = updatedVal?.replace('{cancellationCharges1}', getCancellationAmount());
    updatedVal = updatedVal?.replace('{changeCharges1}', getChangeAmount());
    return updatedVal;
  };

  return (
    <Slider
      customClass="trip-summary-details-modal"
      open={slide}
      closeHandler={onClose}
      delay={delay}
    >
      <div className="trip-summary-details" id="trip-slider-bg">
        <div className="trip-summary-details__head">
          <button
            type="button"
            className="trip-summary-details__close"
            onClick={onClose}
            aria-label="close-button"
          >
            <span className="icon-close-simple" />
          </button>
        </div>
        <div className="trip-summary-details__body">
          <h4
            dangerouslySetInnerHTML={{
              __html: aemData?.reviewSummaryRteLabel?.html || '',
            }}
          />
          {tripSummaryData?.journeysDetail?.map((jItem, idx) => {
            return (
              <TripDetailsSegment
                tripSummaryData={tripSummaryData}
                journeyIndex={idx}
                key={jItem?.journeyKey}
                aemData={aemData}
                aemAdditionalData={aemAdditionalData}
              />
            );
          })}
          <PaxDetails paxInfo={paxInfo} isFromSlider />
          <div className="fare-inclusion">
            <h6>{fareObjTemp?.fareInclusionLabel || 'Fare inclusion'}</h6>
            <ul className="fare-inclusion__list text-tertiary px-2 lh-2 mt-4">
              {
                fareTypeServices?.map((service) => {
                  const text = service?.description?.html && getServiceItem(service?.description?.html);
                  return text && (
                    <li
                      className="d-flex"
                      key={uniq()}
                      dangerouslySetInnerHTML={{
                        __html: text,
                      }}
                    />
                  );
                })
              }
              {/* <li>7 kg Cabin bag</li>
              <li>Free Standard seat</li>
              <li>Free Meal</li>
              <li>3500 Flat Cancellation fee</li>
              <li>15 Kg Check in bag</li>
              <li>Free fast forward</li>
              <li>Free Meal</li>
              <li>Free date change charge*</li> */}
            </ul>
          </div>
        </div>
      </div>
    </Slider>
  );
};

TripSummaryDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  paxInfo: PropTypes.array,
};

export default TripSummaryDetailsModal;
