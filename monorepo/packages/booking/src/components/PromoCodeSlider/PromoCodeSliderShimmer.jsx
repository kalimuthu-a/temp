import React from 'react';
import PropTypes from 'prop-types';

import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';

const PromoCodeSliderShimmer = ({ onCloseSlider }) => {
  return (
    <OffCanvas
      containerClassName="promocode-slider-shimmer"
      onClose={onCloseSlider}
      ariaLabel="close-promocode"
    >
      <div className="shimmer-row ht-16 row-2-0-1 my-12">
        <div className="shimmer-cell" />
        <div />
        <div />
      </div>

      <div className="shimmer-row ht-16 row-1 my-12">
        <div className="shimmer-cell" />
      </div>

      <div className="shimmer-row ht-16 row-2-0-1 my-12">
        <div className="shimmer-cell" />
        <div />
        <div />
      </div>

      <div className="shimmer-row ht-36 row-1 my-12">
        <div className="shimmer-cell" />
      </div>

      <div className="shimmer-row ht-16 row-1-1 my-12">
        <div className="shimmer-cell" />
        <div />
      </div>

      <div className="shimmer-row ht-160 row-1 my-12">
        <div className="shimmer-cell" />
        <div />
      </div>

      <div className="shimmer-row ht-160 row-1 my-12">
        <div className="shimmer-cell" />
        <div />
      </div>

      <div className="shimmer-row ht-160 row-1 my-12">
        <div className="shimmer-cell" />
        <div />
      </div>

    </OffCanvas>
  );
};

PromoCodeSliderShimmer.propTypes = {
  onCloseSlider: PropTypes.func,
};

export default PromoCodeSliderShimmer;
