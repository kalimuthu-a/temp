import PropTypes from 'prop-types';
import React from 'react';

const getDates = () => {
  const today = new Date();
  const dates = [];

  for (let i = 1; i <= 3; i += 1) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    dates.push(nextDate.toLocaleDateString('en-GB', options).replace(',', ''));
  }
  return dates;
};

const DateSelectorXplore = ({ onChangeDate }) => {
  const dates = getDates();

  const onClickItem = (date) => {
    const dateObj = {
        selection: {
            startDate: new Date(date),
            endDate: new Date(date),
            key: 'selection',
        },
    };
    onChangeDate({ value: dateObj });
};

/**
 * Handles the key up event on the city item.
 *
 * @param {KeyboardEvent} e - The key up event.
 */
const onKeyUp = (e) => {
  if (e.key === 'Enter' || e.key === 'Space') {
    // console.log('Enter pressed');
  }

  if (e.key === 'ArrowDown') {
    e?.currentTarget?.nextSibling?.focus();
  }

  if (e.key === 'ArrowUp') {
    e.currentTarget?.previousSibling?.focus();
  }
};

return (
  <>
    {dates.map((date) => (
      <div key={date} className="">
        <div
          onClick={() => onClickItem(date)}
          tabIndex="0"
          aria-controls="dropdown-menu"
          aria-expanded={false}
          role="combobox"
          className="city-selection__list-item date-select_xplore gap-6"
          onKeyUp={onKeyUp}
        >
          {date}
        </div>
      </div>
    ))}
  </>
);
};

DateSelectorXplore.propTypes = {
  onChangeDate: PropTypes.func.isRequired,

};

export default DateSelectorXplore;
