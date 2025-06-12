import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';

import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';

import SeatSelectionChip from '../SeatSelectionChip';
import { useSeatMapContext } from '../../store/seat-map-context';
import { getFormattedSeats, getPaxByNameKey, getSelectedSeatsFee } from '../../utils';

import './PassengerList.scss';

const PassengerList = ({
  passengers,
  fareDetails,
  setSelectedPassengerSeat,
  setIsSeatSelectedForPassenger,
  lowestSeatPrice }) => {
  const {
    seatMainAemData,
    selectedPassenger,
    updatePassengerSelected,
    getSelectedSegmentObj,
    updateFareData,
    isSoloFemalePassenger: isFemaleTraveler,
    loyalty,
    isLoyaltyEnabled,
    authUser,
    seatAdditionalAemData,
  } = useSeatMapContext();
  const [isMobile] = useIsMobile();
  const swiperRef = useRef(null);
  const autoScrollCount = isMobile ? 2 : 3;
  // female friendly tag only for solo females
  const isSoloFemalePassenger = isFemaleTraveler && (passengers?.length === 1);

  useEffect(() => {
    if (passengers?.length) {
      const [firstPassenger] = passengers;
      updatePassengerSelected(firstPassenger);
    }
  }, [passengers?.length]);

  useEffect(() => {
    if (passengers.length > autoScrollCount && swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper?.current;

      const activeIndex = passengers
        .findIndex((passenger) => passenger?.passengerKey === selectedPassenger?.passengerKey);

      if (activeIndex >= autoScrollCount) swiperInstance.slideTo(activeIndex, 1000, false);
    }
  }, [passengers?.length, selectedPassenger]);

  const getSelectedSeats = useCallback(
    (key, name, extraSeatTag) => {
      const selectedSegment = getSelectedSegmentObj();

      if (Object.keys(selectedSegment).length) {
        const { passengerSegment = {} } = selectedSegment;
        const { [key]: { seats } = {} } = passengerSegment;
        let seatsSelected = seats;

        if (seatsSelected?.length) {
          if (extraSeatTag) {
            const paxByNameKey = getPaxByNameKey(passengerSegment);
            const { title, first, last } = name;
            const nameKey = `${title}_${first}_${last}`;
            const pax = paxByNameKey[nameKey];
            seatsSelected = pax?.map((px) => px.seats[0]);
          }

          const fareData = fareDetails?.[key];
          const seatDescription = getFormattedSeats(seatsSelected.map(
            ({ designator, unitDesignator }) => designator || unitDesignator,
          ));
          const { formattedFee, formattedOriginalPrice } = getSelectedSeatsFee(seatsSelected, fareData) || {};

          return [seatDescription, formattedFee, formattedOriginalPrice];
        }
      }

      return ['', null];
    },
    [getSelectedSegmentObj, fareDetails],
  );

  useEffect(() => {
    if (fareDetails && selectedPassenger) {
      const { passengerKey, name, extraSeatTag } = selectedPassenger;

      updateFareData(fareDetails[passengerKey]);

      const [selectedSeats] = getSelectedSeats(passengerKey, name, extraSeatTag);
      setSelectedPassengerSeat(selectedSeats);
    }
  }, [fareDetails, selectedPassenger]);

  const swiperConfig = {
    cssMode: true,
    direction: 'horizontal',
    navigation: {
      enabled: false,
    },
    pagination: {
      clickable: true,
      el: '.swiper-pagination',
      renderBullet: (index, className) => {
        return `<span class="${className}"></span>`;
      },
    },
    grid: {
      rows: 1,
      fill: 'column',
    },
    ...(!isSoloFemalePassenger && {
      spaceBetween: isMobile ? 8 : 16,
      slidesPerView: isMobile ? 2.5 : 3.8,
    }),
  };

  return (
    <div className="passengers-list">
      <SwiperComponent
        swiperConfig={swiperConfig}
        containerClass="passengers-list--slider"
        ref={swiperRef}
      >
        {passengers?.map((passenger) => {
          const { passengerKey, name, extraSeatTag } = passenger;
          const [
            selectedSeats,
            formattedFee,
            formattedOriginalPrice,
          ] = getSelectedSeats(passengerKey, name, extraSeatTag);
          const originalPrice = Number(formattedOriginalPrice?.replace(/[^0-9.-]+/g, '')) || 0;
          if (passengerKey === selectedPassenger?.passengerKey) {
            setIsSeatSelectedForPassenger(selectedSeats);
          }

          return (
            <SwiperComponent.Slide
              className="passenger-slides"
              key={passengerKey}
            >
              <div
                className={`passenger ${
                  isSoloFemalePassenger ? 'solo-female-seat-details' : ''
                } ${
                  passengerKey === selectedPassenger?.passengerKey
                    ? 'passenger-selected'
                    : ''
                }`}
                onClick={() => {
                  updatePassengerSelected(passenger);
                  setSelectedPassengerSeat(selectedSeats);
                }}
                role="presentation"
              >
                <span className="name">{`${name?.first} ${name?.last}`}</span>
                <SeatSelectionChip
                  color="primary-main"
                  containerClass={!selectedSeats ? 'hidden' : ''}
                >
                  {selectedSeats}
                </SeatSelectionChip>
                {isSoloFemalePassenger && <div />}
                {selectedSeats ? (
                  <>
                    <div className="amount-wrapper d-flex align-items-center gap-2">
                      <span className="amount">{formattedFee}</span>
                      {!!originalPrice && <span className="price">{formattedOriginalPrice}</span>}
                    </div>
                    {isLoyaltyEnabled
                      && authUser?.loyaltyMemberInfo?.FFN
                      && !!originalPrice
                      && loyalty?.discount?.[0]?.discountPer > 0 && (
                        <div className="discounted-price-percentage">
                          <span
                            className="discounted-price-percentage-content body-extra-small-regular text-center
                            py-1 px-4 gap-2"
                          >
                            {`${loyalty?.discount?.[0]?.discountPer}% off`}
                          </span>
                        </div>
                    )}
                  </>
                ) : (
                  <span className="no-seat-error mt-4">
                    {seatAdditionalAemData?.seatNotSelectedLabel || 'Seat not selected'}
                    {lowestSeatPrice
                    && (
                    <span className="mt-4 d-block">
                      {seatAdditionalAemData?.lowestPriceLabel || 'Lowest price: ₹'} {lowestSeatPrice}
                    </span>
                    )}
                  </span>
                )}

                {isSoloFemalePassenger && (
                  <SeatSelectionChip
                    color="secondary-light"
                    txtcol="system-information"
                  >
                    {seatMainAemData?.femaleFriendlyTag}
                  </SeatSelectionChip>
                )}
              </div>
            </SwiperComponent.Slide>
          );
        })}
      </SwiperComponent>
    </div>
  );
};

PassengerList.propTypes = {
  passengers: PropTypes.array.isRequired,
  fareDetails: PropTypes.shape({}),
  setSelectedPassengerSeat: PropTypes.func,
  setIsSeatSelectedForPassenger: PropTypes.func,
  lowestSeatPrice: PropTypes.string,
};

export default PassengerList;
