import React from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

function BannerInfo() {
  return (
    <div className="mp-banner-info">
      <Heading heading="h4" mobileHeading="h5">You have<span> 1 Active Refund </span></Heading>
      <Button containerClass="mp-banner-info__view-btn">
        View my Refunds
      </Button>
    </div>
  );
}
BannerInfo.propTypes = {};
export default BannerInfo;
