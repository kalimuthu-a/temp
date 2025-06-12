/* eslint-disable react/no-unstable-nested-components */
import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const TimingHoliday = ({ timeHolidaysData }) => {
  const TimeHolidaysRenderer = () => {
    return (
      <div className="schedule-item">
        <div className="schedule-text">
          <div className="schedule-title">
            <Icon className="icons icon-calender" size="md" />

            <div>
              <div className="heading">{timeHolidaysData?.[0]?.value}</div>
              <HtmlBlock
                className="error mx-8 mt-2 mb-4 body-small-regular error6e datetime"
                html={timeHolidaysData?.[0]?.description?.html}
              />
            </div>
          </div>
          <div className="schedule-title">
            <Icon className={`icons ${timeHolidaysData?.[1]?.icon}`} size="md" />
            <div>
              <div className="heading">{timeHolidaysData?.[1]?.value}</div>
              <HtmlBlock
                className="error mx-8 mt-2 mb-4 body-small-regular error6e datetime"
                html={timeHolidaysData?.[1]?.description?.html}
              />
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="schedule-container">
      {timeHolidaysData?.length > 0 ? <TimeHolidaysRenderer /> : null}
    </div>

  );
};

TimingHoliday.propTypes = {
  timeHolidaysData: PropTypes.array,
};

export default TimingHoliday;
