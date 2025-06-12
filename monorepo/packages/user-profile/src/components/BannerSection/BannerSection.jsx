import React from 'react';
import PropTypes from 'prop-types';

function BannerSection({ aemData }) {
  return (
    <div className="banner-section">
      <img src={aemData?.bannerImage?._publishUrl} alt="support" />
      <div className="banner-section__text-content">
        <p className="sub-title">{aemData?.customerSupportTitle}</p>
        <span className="title">{aemData?.lookingForDescription}</span>
      </div>
    </div>
  );
}

BannerSection.propTypes = {
  aemData: PropTypes.object,
};

export default BannerSection;
