import React from 'react';
import './TipsCodeShare.scss';
import PropTypes from 'prop-types';
import TipsCodeShareCube from '../TipsCodeShareCube/TipsCodeShareCube';

const TipsCodeShare = ({ popupData }) => {
  return (
    <>
      <div className="tips-heading my-12">{popupData?.popUpHeading}</div>
      <div
        className="tips-para"
        dangerouslySetInnerHTML={{
          __html: popupData?.description?.html,
        }}
      />
      <TipsCodeShareCube additionalaemdata={popupData?.travelPartnerNameDescriptionList?.[0]} />
      <TipsCodeShareCube additionalaemdata={popupData?.travelPartnerNameDescriptionList?.[1]} />
    </>
  );
};

TipsCodeShare.propTypes = {
  popupData: PropTypes.object,
};

export default TipsCodeShare;
