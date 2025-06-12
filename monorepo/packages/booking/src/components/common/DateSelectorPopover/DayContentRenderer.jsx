import format from 'date-fns/format';
import React from 'react';
import { PayWithModes, Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import { dateFormats } from '../../../constants';
/**
 *
 * @param {*} date
 * @param {*} holidays
 * @param {Map<string, {category: string, date: string, price: string }>} fareCalendar
 * @returns
 */
function DayContentRenderer(date, holidays, fareCalendar, loading, payWith, pageType) {
  const displayDate = date?.getDate();
  const dateFormat = format(date, dateFormats.yyyyMMdd);

  const {
    price,
    category = '',
    priceAmount = 0,
  } = fareCalendar.get(dateFormat) ?? {
    price: null,
    category: 'null',
  };

  const className = `custom-calendar-day ${priceAmount > 0 ? category : null}`;

  return (
    <div className={className}>
      <span className="date">{displayDate}</span>
      {price && priceAmount > 0 && payWith === PayWithModes.CASH && pageType !== Pages.XPLORE ? (
        <span className={`price ${category}`}>{price}</span>
      ) : null}
    </div>
  );
}

export default DayContentRenderer;
