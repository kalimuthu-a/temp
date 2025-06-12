import PropTypes from 'prop-types';
import React, {
  useEffect,
} from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import StepperInput from 'skyplus-design-system-app/dist/des-system/StepperInput';

import Popover from '../../../common/Popover/Popover';

import useAppContext from '../../../../hooks/useAppContext';
import FormField from '../../../Form/FormField';
import { useCargo } from '../../CargoContext';
import { cargoFormActions } from '../../CargoReducer';

const QuantitySelector = ({
  containerClass,
}) => {
  const {
    state: { quantity },
    dispatch,
  } = useCargo();

  const {
    state: { main },
  } = useAppContext();

  // const [isMobile] = useIsMobileBooking();

  const onChangeQuantity = (key) => {
    dispatch({
      type: cargoFormActions.CHANGE_QUANTITY,
      payload: { quantity: Number(key) },
    });
  };

  useEffect(() => {
    dispatch({
      type: cargoFormActions.CHANGE_QUANTITY,
      payload: { quantity: Number(main?.minQuantity) },
    });
  }, []);

  return (
    <Popover
      renderElement={() => {
        return (
          <FormField
            containerClass="notsearchable"
            topLabel={main?.quantityLabel}
            middleLabel={quantity}
            hintLabel={main?.noOfItems}
            filled
            accessiblityProps={{
              'aria-label': 'Quantity Selection',
            }}
          />
        );
      }}
      renderPopover={() => {
        return (
          <div className="quantity-selector">
            <div className="quantity-selector__label">{main?.quantityLabel}<span>( {main?.noOfItems} )</span></div>
            <StepperInput
              minValue={Number(main?.minQuantity)}
              value={quantity}
              maxValue={Number(main?.maxQuantity)}
              onChange={onChangeQuantity}
            />
          </div>

        );
      }}
      containerClass={containerClass}
    />
  );
};

QuantitySelector.propTypes = {
  containerClass: PropTypes.string,
};

export default QuantitySelector;
