import React from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import ModalLayout from '../ModalLayout/ModalLayout';
import PassengerList from '../PassengerList';

import './ChceckinPopup.scss';
import { useSeatMapContext } from '../../store/seat-map-context';

const ChceckinPopup = ({
  onClose,
  setSelectedPassengerSeat,
  setIsSeatSelectedForPassenger,
  passengers,
  validSeats,
  fareDetails,
  handleSkipCheckinPopup,
}) => {
  const { seatAdditionalAemData: {
    autoCheckinPopup = {},
  } = {} } = useSeatMapContext();
  return (
    <ModalLayout onClose={onClose}>
      <div className="checkin-popup">
        <div className="checkin-popup__label">{autoCheckinPopup?.heading || 'CHECK-IN'}</div>
        <div
          className="checkin-popup__title"
          dangerouslySetInnerHTML={{
            __html: autoCheckinPopup?.subHeading?.html,
          }}
        />
        {passengers.length > 1 && (
        <PassengerList
          setSelectedPassengerSeat={setSelectedPassengerSeat}
          setIsSeatSelectedForPassenger={setIsSeatSelectedForPassenger}
          passengers={passengers}
          fareDetails={fareDetails}
          validSeats={validSeats}
        />
        )}
        <div
          className="checkin-popup__note"
          dangerouslySetInnerHTML={{
            __html: autoCheckinPopup?.description?.html,
          }}
        />

        <div className="checkin-popup__button">
          <Button
            variant="outline"
            color="primary"
            size="medium"
            onClick={onClose}
            containerClass="mt-12 skyplus-addon-mf__modal-button"
          >
            { (`${autoCheckinPopup?.ctaLabel}`) || 'Select seat'}
          </Button>

          <Button
            variant="filled"
            color="primary"
            size="medium"
            onClick={handleSkipCheckinPopup}
            containerClass="mt-12 skyplus-addon-mf__modal-button"
          >
            {autoCheckinPopup?.secondaryCtaLabel || 'Skip seat'}
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};

ChceckinPopup.propTypes = {
  onClose: PropTypes.func,
  setSelectedPassengerSeat: PropTypes.func,
  setIsSeatSelectedForPassenger: PropTypes.func,
  passengers: PropTypes.object,
  validSeats: PropTypes.object,
  fareDetails: PropTypes.object,
  handleSkipCheckinPopup: PropTypes.func,
};

export default ChceckinPopup;
