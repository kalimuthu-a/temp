import React from 'react';
import { useSelector } from 'react-redux';

const PrintDgrInfo = () => {
  const { printItineraryInformation } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath?.item,
  )
  || {};
  const { dgrImage } = printItineraryInformation || {};
  return (
    dgrImage?._publishUrl ? (
      <div className="dgr-info">
        <img src={dgrImage?._publishUrl || ''} alt="Dgr Information" />
      </div>
    ) : null
  );
};

export default PrintDgrInfo;
