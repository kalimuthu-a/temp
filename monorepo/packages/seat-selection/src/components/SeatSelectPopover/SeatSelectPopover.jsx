import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import SeatSelectionChip from '../SeatSelectionChip';
import { useSeatMapContext } from '../../store/seat-map-context';
import CustomerFacingSeatsLabel from '../CustomerFacingSeatsLabel/CustomerFacingSeatsLabel';
import { CONSTANTS } from '../../constants';
import './SeatSelectPopover.scss';

const SeatSelectPopover = ({
  passengerName,
  designators,
  fee,
  onClose,
  onAdd,
  formattedOriginalPrice,
  seatType,
  pos,
  clickedSeats,
  hoverPopUp,
  isTouchScreen,
  isXlSeatFreeMeal,
  isFemaleOccupiedSeat,
  equipmentType,
  classType,
}) => {
  const seatSelectPopupRef = useRef(null);
  const {
    seatAdditionalAemData: { seatDetails = [], seatFleetSectorDetails = [] } = {},
    seatMainAemData: { femaleOccupied = '' } = {},
    loyalty,
    isLoyaltyEnabled,
    authUser,
  } = useSeatMapContext();

  const getSeatDetailsAem = () => {
    const matchedFleets = seatFleetSectorDetails
      ?.filter(fleets => fleets
        ?.fleetType
        ?.includes(equipmentType))

    if (matchedFleets?.length) {
      const fleetClassSeats = matchedFleets
        ?.filter((fleetSeatDetails) =>
          fleetSeatDetails?.classType?.toLowerCase() === classType?.toLowerCase()
        )
      if (fleetClassSeats?.length) {
        return fleetClassSeats;
      }
    }
    return seatDetails;
  }

  const {
    seatImageAltText = '',
    seatImagePath,
    freeMealText = '',
  } = getSeatDetailsAem()?.find((sd) =>
    sd.seatType.toLowerCase() === seatType?.toLowerCase()
    || sd.seatType.toLowerCase() === CONSTANTS.SEAT_CLASS_NEXT.trim().toLowerCase())
    || {};
  const { _publishUrl = '' } = seatImagePath || {};
  const originalPrice = Number(formattedOriginalPrice?.replace(/[^0-9.-]+/g, '')) || 0;
  useEffect(() => {
    if (isFemaleOccupiedSeat) {
      return;
    }
    seatSelectPopupRef.current.focus();

    const trapFocus = (e) => {
      const focusableElements = seatSelectPopupRef.current.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      trapFocus(e);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    isFemaleOccupiedSeat ? (
      <div
        aria-label="seat-select-popover"
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
        style={{ left: pos.left, top: pos.topFemaleOccupiedSeat }}
        ref={seatSelectPopupRef}
        className="seat-select-popover female-occupied"
      >
        <p className="seat-select-popover__description text-center">
          {femaleOccupied || 'Occupied by a female passenger'}
        </p>
      </div>
    ) : (
      <div
        className="seat-select-popover"
        aria-label="seat-select-popover"
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
        style={{ left: pos.left, top: pos.top }}
        ref={seatSelectPopupRef}
      >
        {isXlSeatFreeMeal && (
          <div className="xlSeatFreeMealLabel">
            <p>{isXlSeatFreeMeal ? freeMealText : null}</p>
          </div>
        )}
        {isXlSeatFreeMeal && <div className="xlSeatFreeMealBordertop" />}
        <div className="seat-select-popover__header mt-4">
          <h4 className="passenger-name">{passengerName} </h4>
          {(!hoverPopUp || isTouchScreen) && (
          <Icon
            onClick={onClose}
            tabIndex="0"
            aria-label="close popup"
            role="button"
            className="icon-close-simple close-icon"
            size="sm"
          />
          )}
        </div>

        {/* as part of WEB-3843, we do not need to show female friendly seat, so commenting below code */}
        {/* {isFemaleFriendlyText && (
        <p className="seat-select-popover__description">{femaleFriendlyText}</p>
      )} */}

        <div className="seat-select-popover__img--container">
          <SeatSelectionChip
            color="primary-main"
            containerClass="seat-details-selected"
          >
            {designators}
          </SeatSelectionChip>
          <img src={_publishUrl} alt={seatImageAltText} />
        </div>
        <CustomerFacingSeatsLabel clickedSeats={clickedSeats} />

        <div className="seat-select-popover__fare--details">
          <p className="discountedPrice">{fee}</p>
          {!!originalPrice && <p className="price">{formattedOriginalPrice}</p>}

          {isLoyaltyEnabled
          && authUser?.loyaltyMemberInfo?.FFN
          && !!originalPrice
          && loyalty?.discount?.[0]?.discountPer > 0 && (
            <p
              className="discountedPricePercentage body-extra-small-regular text-center
              d-flex justify-content-center align-items-center pb-1 mt-6 px-4 gap-2"
            >
              {`${loyalty?.discount?.[0]?.discountPer}% off`}
            </p>
          )}

          {(!hoverPopUp || isTouchScreen) && (
          <Button
            size="small"
            onClick={onAdd}
            containerClass="add-icon-wrapper"
            aria-label="add seat"
          >
            <Icon className="icon-arrow-top-right" size="sm" />
          </Button>
          )}
        </div>
      </div>
    ));
};

SeatSelectPopover.propTypes = {
  passengerName: PropTypes.string,
  designators: PropTypes.string,
  fee: PropTypes.string,
  formattedOriginalPrice: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  seatType: PropTypes.string,
  clickedSeats: PropTypes.array,
  pos: PropTypes.object,
  hoverPopUp: PropTypes.bool.isRequired,
  isTouchScreen: PropTypes.bool,
  isXlSeatFreeMeal: PropTypes.string,
  isFemaleOccupiedSeat: PropTypes.bool,
  equipmentType: PropTypes.string,
  classType: PropTypes.string,
};

SeatSelectPopover.defaultProps = {
  passengerName: '',
  designators: '',
  fee: '',
  formattedOriginalPrice: '',
  seatType: '',
  clickedSeats: [],
  isTouchScreen: false,
  isXlSeatFreeMeal: '',
  isFemaleOccupiedSeat: false,
  classType: '',
  equipmentType: '',
};

export default SeatSelectPopover;
