import classNames from 'classnames';
import React from 'react';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { URLS } from '../../../constants';

const DateSelectorShimmer = () => {
  const length = parseInt(URLS.displayCalenderMonths, 10);

  const renderDatesRow = () => {
    const key = uniq();

    return (
      <div className="shimmer-row row-twin-calendar--dates mb-12" key={key}>
        {Array.from({ length: 7 }).map(() => (
          <div className="shimmer-cell" key={uniq()} />
        ))}
        <div />
        {length > 1 &&
          Array.from({ length: 7 }).map(() => (
            <div className="shimmer-cell" key={uniq()} />
          ))}
      </div>
    );
  };

  const className = classNames({
    'date-selection-shimmer': true,
    [`layout-${URLS.displayCalenderMonths}`]: true,
  });

  return (
    <div className={className}>
      <div className="shimmer-row row-1-3-3-7-3-3-1 mb-12">
        <div className="shimmer-cell" />
        <div />
        <div className="shimmer-cell" />
        <div />
        <div className="shimmer-cell" />
        <div />
        <div className="shimmer-cell" />
      </div>
      <div className="shimmer-row row-twin-calendar mb-12">
        {Array.from({ length: 7 }).map(() => (
          <div className="shimmer-cell" key={uniq()} />
        ))}
        <div />
        {Array.from({ length: 7 }).map(() => (
          <div className="shimmer-cell" key={uniq()} />
        ))}
      </div>
      {Array.from({ length: 5 }).map(renderDatesRow)}
    </div>
  );
};

export default DateSelectorShimmer;
