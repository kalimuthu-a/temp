import React from 'react';
import BannerInfo from './common/bannerInfo/BannerInfo';
import LastTrip from './last-trip/LastTrip';

function Help() {
  return (
    <div className="user-profile-help-container">
      <BannerInfo />
      <LastTrip />
      {/* <QuickLinks></QuickLinks> */}
    </div>
  );
}
Help.propTypes = {};
export default Help;
