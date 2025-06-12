import PropTypes from 'prop-types';

import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import SeatSelectionChip from '../SeatSelectionChip';

import { useSeatMapContext } from '../../store/seat-map-context';

import './SeatDetails.scss';
import CustomerFacingSeatsLabel from '../CustomerFacingSeatsLabel/CustomerFacingSeatsLabel';

const SeatDetails = ({
  passengerName,
  designators,
  fee,
  onAdd,
  onClose,
  clickedSeats,
  equipmentType,
}) => {
  const {
    seatAdditionalAemData: {
      emergencyRowSeatInformation: {
        heading,
        description,
        ctaLabel,
        secondaryCtaLabel,
      } = {},
      fleetEmergencyRowSeatInformation = {},
    } = {},
  } = useSeatMapContext();

  const matchedFleets = fleetEmergencyRowSeatInformation?.fleetType?.includes(equipmentType);
  const className = 'seat-details';

  const renderHeader = () => (
    <div className={`${className}--header`}>
      <span>{`XL - ${heading}`}</span>
      <Icon
        onClick={onClose}
        className={`icon-close-simple ${className}--close`}
        size="sm"
      />
    </div>
  );

  const renderFooter = () => (
    <div className={`${className}--footer`}>
      <Button
        block
        variant="outline"
        color="primary"
        size="small"
        containerClass={`${className}--cancel`}
        onClick={onClose}
      >
        {secondaryCtaLabel}
      </Button>
      <Button
        block
        variant="filled"
        color="primary"
        size="small"
        containerClass={`${className}--add`}
        onClick={onAdd}
      >
        {ctaLabel}
      </Button>
    </div>
  );

  return (
    <OffCanvas
      containerClassName={`${className}`}
      renderHeader={renderHeader}
      renderFooter={renderFooter}
      onClose={onClose}
    >
      <div className={`${className}--body`}>
        <p className="passenger-name">{passengerName}</p>
        <div className="clicked-seat-info">
          <SeatSelectionChip
            color="primary-main"
            containerClass="clicked-seat-number"
          >
            {designators}
          </SeatSelectionChip>
          <span className="clicked-price-info">{fee}</span>
        </div>

        <CustomerFacingSeatsLabel clickedSeats={clickedSeats} />

        <HtmlBlock
          className="seat-description"
          html={
            matchedFleets
              ? fleetEmergencyRowSeatInformation?.description?.html
              : description?.html
          }
        />
      </div>
    </OffCanvas>
  );
};

SeatDetails.propTypes = {
  passengerName: PropTypes.string,
  designators: PropTypes.string,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  fee: PropTypes.string,
  clickedSeats: PropTypes.array,
  equipmentType: PropTypes.string,
};

SeatDetails.defaultProps = {
  passengerName: '',
  designators: '',
  fee: '',
  clickedSeats: [],
};

export default SeatDetails;
