import React from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import VisaPaxSelection from '../../commonComponents/VisaPaxSelection/VisaPaxSelection';
import { AppContext } from '../../../context/AppContext';
import VisaBookingCard from '../../commonComponents/VisaBookingCard/VisaBookingCard';

const TrackVisa = () => {
  const {
    state: {
      visaPaxSelectByPath,
    },
  } = React.useContext(AppContext);
  const { travellersLabel } = visaPaxSelectByPath?.items || {};

  const handleClose = (e) => {
    if (e?.preventDefault) {
      e?.preventDefault();
    }
    // setConfig(null);
  };

  const visaBookingDetailsProps = {
    bookingIdLabel: visaPaxSelectByPath?.bookingIdLabel,
    isIconRequired: false,
  };
  return (
    <div className="track-visa-status">
      <VisaBookingCard
        bookingDetails={visaBookingDetailsProps}
      />
      <Heading
        heading="h5"
        mobileHeading="h5"
        containerClass="visa-pax-selection-taveller"
      >
        {travellersLabel || 'Traveller(s)'}
      </Heading>
      <VisaPaxSelection
        onClose={handleClose}
        trackVisaStatus
      />
    </div>
  );
};
export default TrackVisa;
