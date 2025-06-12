import React from 'react';

/**
 *
 * @param {*} date
 * @param {*} holidays
 * @returns
 */
function DayContentRenderer(date) {
  const displayDate = date?.getDate();

  return (
    <div className="custom-calendar-day">
      <span>{displayDate}</span>
    </div>
  );
}

export default DayContentRenderer;
