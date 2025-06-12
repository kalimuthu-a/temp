import PropTypes from 'prop-types';
import React, {
  Suspense,
  useMemo,
} from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import format from 'date-fns/format';

import { Calendar } from 'react-date-range';
import Popover from '../../../common/Popover/Popover';

import DateSelectorShimmer from './DateSelectorShimmer';
import FormField from '../../../Form/FormField';
import { useCargo } from '../../CargoContext';
import { cargoFormActions } from '../../CargoReducer';

const CargoDateSelector = ({
  containerClass,
  topLabel,
  middleLabel,
  hintLabel,
  formKey,
  value,
  calendarProps = {},
}) => {
  const {
    state: { journeys },
    dispatch,
  } = useCargo();

  const handleSelect = (item) => {
    dispatch({
      type: cargoFormActions.CHANGE_JOURNEY_ROW_ITEM,
      // payload: { journeys: { ...journeys, departureDate: item } },
      payload: {
        objData: { departureDate: item },
      },
    });
  };

  const formFieldProps = useMemo(() => {
    return {
      topLabel,
      middleLabel: value ? format(value, 'd MMM') : middleLabel,
      hintLabel: value ? format(value, 'EEEE') : hintLabel,
      filled: Boolean(value),
    };
  }, [value]);

  return (
    <Popover
      renderElement={() => {
        return (
          <FormField
            containerClass="notsearchable"
            {...formFieldProps}
            accessiblityProps={{
              'aria-label': formKey,
            }}
          />
        );
      }}
      renderPopover={() => {
        return (
          <Suspense fallback={<DateSelectorShimmer />}>
            <Calendar
              {...calendarProps}
              date={journeys?.departureDate}
              onChange={handleSelect}
              className="skyplus-calendar"
              showMonthAndYearPickers={false}
              direction="horizontal"
              months={2}
            />
          </Suspense>
        );
      }}
      containerClass={containerClass}
    />
  );
};

CargoDateSelector.propTypes = {
  calendarProps: PropTypes.object,
  containerClass: PropTypes.string,
  formKey: PropTypes.string,
  hintLabel: PropTypes.string,
  index: PropTypes.number,
  middleLabel: PropTypes.string,
  topLabel: PropTypes.string,
  value: PropTypes.any,
};

export default CargoDateSelector;
