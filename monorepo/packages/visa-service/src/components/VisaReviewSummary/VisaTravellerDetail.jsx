import React from 'react';
import PropTypes from 'prop-types';
import Offcanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import VisaTravellerForm from '../VisaTravellerDetails/VisaTravellerForm/VisaTravellerForm';
import { AppContext } from '../../context/AppContext';

const VisaTravellerDetail = ({ handleClose, viewPaxId }) => {
  // viewPaxId is index
  const {
    state: {
      visaTravelerDetails,
    },
  } = React.useContext(AppContext);

  return (
    <Offcanvas
      containerClassName="visa-view-detail-slider"
      onClose={() => handleClose(false)}
    >
      <div className="visa-review-summary-traveler-details">
        <VisaTravellerForm index={viewPaxId} formData={visaTravelerDetails} pageType="review-summary" />
      </div>

    </Offcanvas>
  );
};

export default VisaTravellerDetail;

VisaTravellerDetail.propTypes = {
  handleClose: PropTypes.func,
  viewPaxId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
