import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import InfoAlert from '../../components/common/Alerts/InfoAlert';
import useAppContext from '../../hooks/useAppContext';

const AddServices = () => {
  const {
    state: { aemModel },
  } = useAppContext();

  const { seatTitle, seatDescription } = aemModel.checkinPassenger;

  return (
    <div className="wc-smartcheckin__right">
      <InfoAlert containerClassName="seat-info">
        <Text containerClass="title">{seatTitle}</Text>
        <Text containerClass="desc">{seatDescription}</Text>
      </InfoAlert>
    </div>
  );
};

AddServices.propTypes = {};

export default AddServices;
