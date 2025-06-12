import PropTypes from 'prop-types';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { specialFareCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import { useCustomEventDispatcher } from 'skyplus-design-system-app/dist/des-system/customEventHooks';

import classNames from 'classnames';
import FareType from './FareType';
import ImageGrid from './FareType/ImageGrid';
import { customEvents, FARE_CLASSES } from '../../constants';
import KnowMore from './KnowMore/KnowMore';
import { handleNorseFlights } from '../../utils/norseFlights';
import useAppContext from '../../hooks/useAppContext';

const FareTypeContainer = ({
  additional,
  isProjectNextEnabled,
  passengerFares,
  flightDetailsDescriptiona11y,
  journeyKey,
  onClickFareTypeHandler,
  fareAvailabilityKey,
  showFlightDetailSlider,
  FareClass,
  isInternational,
  segments,
}) => {
  const [showKnowMore, setShowKnowMore] = useState(false);
  const dispatchEvent = useCustomEventDispatcher();

    const {
    state: {
      searchContext,
    },
    dispatch,
  } = useAppContext();

  const onClickKnowMore = () => {
    setShowKnowMore(true);
  };

  const onCloseKnowMore = () => {
    setShowKnowMore(false);
  };

  const { filteredPassengerFares, productClasses } = useMemo(() => {
    const _filteredPassengerFares = [];
    const _productClasses = [];

    passengerFares.forEach((passengerFare) => {
      const { productClass } = passengerFare;

      if (FareClass === passengerFare.FareClass) {
        _filteredPassengerFares.push(passengerFare);
        _productClasses.push(productClass);
      }
    });

    return {
      filteredPassengerFares: _filteredPassengerFares,
      productClasses: _productClasses,
    };
  }, [FareClass]);

  useLayoutEffect(() => {
    try {
      const addonHeading = document.querySelector('.heading-services');
      const baggageHeading = document.querySelector('.heading-baggage');
      const cancelHeading = document.querySelector('.heading-changeCancel');
      const addonHeadingLabel = document.querySelector(
        '.inclusion__text.services',
      );

      if (addonHeading && addonHeadingLabel) {
        const diffA = addonHeading.offsetTop + 20 - addonHeadingLabel.offsetTop;
        addonHeadingLabel.style.transform = `translateY(${diffA}px)`;
        addonHeadingLabel.style.visibility = 'visible';
      } else {
        addonHeadingLabel.style.visibility = 'hidden';
      }

      const baggageHeadingLabel = document.querySelector(
        '.inclusion__text.baggage',
      );

      if (baggageHeading && baggageHeadingLabel) {
        const diffB =
          baggageHeading.offsetTop + 20 - baggageHeadingLabel.offsetTop;
        baggageHeadingLabel.style.transform = `translateY(${diffB}px)`;
        baggageHeadingLabel.style.visibility = 'visible';
      } else {
        baggageHeadingLabel.style.visibility = 'hidden';
      }
      const cancelHeadingLabel = document.querySelector(
        '.inclusion__text.changeCancel',
      );

      if (cancelHeading && cancelHeadingLabel) {
        const diffC =
          cancelHeading.offsetTop + 20 - cancelHeadingLabel.offsetTop;

        cancelHeadingLabel.style.transform = `translateY(${diffC}px)`;
        cancelHeadingLabel.style.visibility = 'visible';
      } else {
        cancelHeadingLabel.style.visibility = 'hidden';
      }
    } catch (error) {
      ///
    }
  }, [FareClass]);

  const agentLayout = filteredPassengerFares.length >= 4;

  const fareTypeContainerClassName = classNames('fare-type', {
    'hide-wrapper': agentLayout,
  });

  // Handling Generates an image grid based on Norse flight segments and service images.
  const handlerImageGrid = () => {
    // Process and retrieve a result array based on flight segments and fleet-specific service images
    const {values = []} = handleNorseFlights(segments[0], additional?.fleetAndSectorSpecificNextServiceImages);
    return values.length > 0 ? values : additional?.nextServiceImages;
  };
   const dispatchModifyTab =(event)=>{
    event.preventDefault(); 
    dispatchEvent(customEvents.MODIFY_BOOKING, { event: customEvents.MODIFY_BOOKING });
  }

  return (
    <div
      className="fare-accordion__body fare-accordion__body--expanded"
      aria-live="polite"
    >
      <div className="fare-accordion__body__fare-section">
        {!agentLayout && (
          <div className="fare-head-wrapper">
            <Text variation="body-small-medium" containerClass="title">
              {additional.fareTypesLabel}
            </Text>
            <div
              className="know-more cursor-pointer"
              onClick={onClickKnowMore}
              role="presentation"
            >
              {additional.knowMoreLabel}
            </div>
            <div className="inclusion">
              {additional.servicesTitle.map(({ key, value }) => (
                <Text
                  variation="body-small-medium"
                  containerClass={`inclusion__text ${key}`}
                  key={value}
                >
                  {value}
                </Text>
              ))}
            </div>
          </div>
        )}
        <div className={fareTypeContainerClassName}>
          {filteredPassengerFares.map((passengerFare) => (
            <FareType
              {...passengerFare}
              selected={
                passengerFare.fareAvailabilityKey === fareAvailabilityKey
              }
              key={passengerFare.fareAvailabilityKey}
              onClick={onClickFareTypeHandler}
              journeyKey={journeyKey}
              services={additional.servicesTitle.map((i) => i.key)}
              isInternational={isInternational}
              hideChip={
                agentLayout &&
                passengerFare.specialFareCode === specialFareCodes.UMNR
              }
              segments={segments}
            />
          ))}
          {isProjectNextEnabled && FareClass === FARE_CLASSES.BUSINESS && (
            <ImageGrid
              fareItemsLength={filteredPassengerFares?.length}
              items={handlerImageGrid()}
            />
          )}
        </div>
      </div>

      {agentLayout ? (
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center justify-content-center gap-4 agent-portal">
            <Text variation="body-small-medium" containerClass="title ">
              {additional.fareTypesLabel}
            </Text>
            <div
              className="know-more cursor-pointer"
              onClick={onClickKnowMore}
              role="presentation"
            >
              {additional.knowMoreLabel}
            </div>
          </div>
          <HtmlBlock
            className="fare-accordion__body__know-more body-small-light d-block mx-12"
            html={flightDetailsDescriptiona11y}
            tagName="span"
            onClick={showFlightDetailSlider}
          />
        </div>
      ) : (
        <div className="d-flex justify-content-between">
          <HtmlBlock
            className="fare-accordion__body__know-more body-small-light d-block mx-12"
            html={flightDetailsDescriptiona11y}
            tagName="span"
            onClick={showFlightDetailSlider}
          />
         {additional?.returnTripUpsellText?.html && searchContext?.isRoundTrip() && (
            <div className="fare-accordion__body__know-more body-small-light d-block mx-12">
              <div className="d-flex upsell">
                  {additional?.returnTripUpsellIcon && (
                    <img src={additional?.returnTripUpsellIcon?._publishUrl} alt={additional?.returnTripUpsellText?.html} className="upsell_icon" />
                  )}
                  <HtmlBlock
                    html={additional?.returnTripUpsellText?.html}
                    tagName="span"
                    onClick={dispatchModifyTab}
                  />
              </div>
            </div>
          )}

        </div>
      )}

      {showKnowMore && (
        <KnowMore
          onClose={onCloseKnowMore}
          productClasses={productClasses}
          isInternational={isInternational}
          passengerFares={passengerFares}
          segments={segments}
        />
      )}
    </div>
  );
};

FareTypeContainer.propTypes = {
  additional: PropTypes.any,
  fareAvailabilityKey: PropTypes.any,
  flightDetailsDescriptiona11y: PropTypes.any,
  isProjectNextEnabled: PropTypes.any,
  journeyKey: PropTypes.any,
  onClickFareTypeHandler: PropTypes.func,
  showFlightDetailSlider: PropTypes.any,
  passengerFares: PropTypes.array,
  FareClass: PropTypes.string,
  expanded: PropTypes.bool,
  isInternational: PropTypes.bool,
  segments: PropTypes.any,
};

export default FareTypeContainer;
