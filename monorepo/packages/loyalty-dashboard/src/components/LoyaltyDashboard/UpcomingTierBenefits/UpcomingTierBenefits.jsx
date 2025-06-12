import React, { useState } from 'react';
import PropTypes from 'prop-types';

const UpcomingTierBenefits = ({ upcomingTierBenefits }) => {
  const [sliderData, setSliderData] = useState(upcomingTierBenefits || []);

  return (
    sliderData?.length > 0 && (
    <div className="loyalty-db-upcoming-tier-benefits">
      <div className="loyalty-db-upcoming-tier-benefits__content">
        <p>{sliderData?.[0]?.title}</p>
        <h4 dangerouslySetInnerHTML={{ __html: sliderData?.[0]?.description?.html }} />
      </div>
      <div className="loyalty-db-upcoming-tier-benefits__slider">
        <div className="loyalty-db-upcoming-tier-benefits__slider-wrapper">
          {sliderData?.map((sliderItem) => {
            return (
              <div key={sliderItem?.key} className="loyalty-db-upcoming-tier-benefits__slider-item">
                <img src={sliderItem?.image?._publishUrl} alt={sliderItem?.imageAltText} />
              </div>
            );
          })}
          {sliderData?.length > 1 && (
          <button
            type="button"
            aria-label="Close"
            className="loyalty-db-upcoming-tier-benefits__slider-action"
            onClick={() => setSliderData([...sliderData].reverse())}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSliderData([...sliderData].reverse());
              }
            }}
          >
            <i className="icon-close-simple" />
          </button>
          )}
        </div>
      </div>
    </div>
    )
  );
};

UpcomingTierBenefits.propTypes = {
  upcomingTierBenefits: PropTypes.array,
};

export default UpcomingTierBenefits;
