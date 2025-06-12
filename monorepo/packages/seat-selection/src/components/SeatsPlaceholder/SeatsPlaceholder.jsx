import React, { useEffect } from 'react';
import './SeatsPlaceholder.scss';

const shimmerClass = 'seats-shimmer--animate';

const DestinationToggleShimmer = () => (
  <div className="destination-toggle destination-toggle-shimmer ">
    {Array.from({ length: 3 }, (_, i) => (
      <div
        className={`destination-segment-btn destination-segment-btn--shimmer ${shimmerClass}`}
        key={`destination-segment-btn--shimmer${i}`}
      />
    ))}
  </div>
);

const RecommendationShimmer = () => (
  <div className="recommended-seats">
    <div className={`recommended-seats-accordian-header ${shimmerClass}`} />
    <div className="recommended-seats-accordian-body">
      <div className={`title ${shimmerClass}`} />
      {Array.from({ length: 2 }, (_, i) => (
        <div
          className={`recommended-seats-shimmer ${shimmerClass}`}
          key={`recommended-seats-shimmer${i}`}
        />
      ))}
    </div>
  </div>
);

const PassengerSlidesShimmer = () => (
  <div className="passengers-list">
    <div className="skyplus-slider passengers-list--slider-shimmer">
      <div className="swiper-des swiper-initialized swiper-horizontal swiper-css-mode swiper-navigation-disabled">
        <div
          className="swiper-wrapper"
          id="swiper-wrapper-f697dc3ff16fee9b"
          aria-live="polite"
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div
              className="swiper-slide passenger-slides"
              role="group"
              aria-label="1 / 3"
              key={`swiper-slide passenger-slides${i}`}
              style={{ width: '189px', marginRight: '16px' }}
            >
              <div className="passenger" role="presentation">
                <span className={`name ${shimmerClass}`} />
                <div
                  className="skyplus-chip seat-selection--chip hidden"
                  role="presentation"
                >
                  <div className="skyplus-chip-filled-col-primary-main-size-xs-bg-none-txtcol-">
                    <span />
                  </div>
                </div>
                <span className="amount" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SeatTypesShimmer = () => (
  <div className="filter">
    {['allSeats', 'premium', 'xlSeat', 'standardSeat', 'freeSeat'].map(
      (el) => (
        <button
          type="submit"
          className={`seat-types-shimmer--buttons ${el}`}
          key={el}
          aria-label="seat-types-shimmer--buttons"
        >
          <span className={`title ${shimmerClass}`} />
          <span className={`subtitle ${shimmerClass}`} />
        </button>
      ),
    )}
  </div>
);

const LegendsShimmer = () => (
  <div className="legend legend-shimmer">
    {['assigned', 'nonreclining', 'occupied'].map((el) => (
      <div className={`sub-legend-${el}`} key={el}>
        <span className={`legend-name ${shimmerClass}`} />
      </div>
    ))}
  </div>
);
const SeatmapShimmer = () => (
  <div className={`seat-map-wrapper seat-map-shimmer ${shimmerClass}`} />
);

const SeatsPlaceholder = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  return (
    <div className="seats-shimmer-wrapper">
      <DestinationToggleShimmer />
      <RecommendationShimmer />
      <PassengerSlidesShimmer />
      <SeatTypesShimmer />
      <LegendsShimmer />
      <SeatmapShimmer />
    </div>
  );
};

export default SeatsPlaceholder;
