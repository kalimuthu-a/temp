import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker as Calender } from 'react-date-range';
// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangePicker = ({ startDate, endDate, onDateChange, minDate, maxDate }) => {
  const [state, setState] = useState({
    startDate: startDate || new Date(),
    endDate: endDate || new Date(),
    key: 'selection',
    minDate: minDate || new Date(),
    maxDate: maxDate || new Date(),
  });

  const handleSelect = (ranges) => {
    setState({
      ...state,
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });

    if (onDateChange) {
      onDateChange(ranges.selection.startDate, ranges.selection.endDate);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Calender
      ranges={[state]}
      onChange={handleSelect}
      showSelectionPreview={false}
      moveRangeOnFirstSelection={false}
      months={1}
      direction="horizontal"
      showMonthAndYearPickers
      showDateDisplay={false}
      editableDateInputs={false}
      showDateRanges={false}
      minDate={minDate}
      maxDate={maxDate}
      className="custom-date-range-picker"
    />
  );
};
DateRangePicker.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  onDateChange: PropTypes.func,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
};
export default DateRangePicker;
