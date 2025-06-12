import React from 'react';
import { useSelector } from 'react-redux';

const PrintMoreInformation = () => {
  const mfAdditionalData = useSelector((state) => state.itinerary?.mfAdditionalDatav2) || {};
  const { itineraryAdditionalByPath } = mfAdditionalData;
  const { printItineraryInformation } = itineraryAdditionalByPath?.item || {};
  const renderDetails = (content) => { // NOSONAR
    return <div dangerouslySetInnerHTML={{ __html: content?.html }} /> || '';
  };

  const renderExpandItem = (item) => {
    return (
      <div>
        {item?.html && (
        <div className="print-more-info-service-table">
          {renderDetails(item)}
        </div>
        )}
      </div>
    );
  };
  return (
    <div className="print-more-info">
      { renderExpandItem(printItineraryInformation?.notetermsandconditions)}
    </div>
  );
};

export default PrintMoreInformation;
