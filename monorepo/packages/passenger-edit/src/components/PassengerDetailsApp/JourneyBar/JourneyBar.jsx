import React from 'react';
import PropTypes from 'prop-types';
import './JourneyBar.scss';
import { uniq } from 'skyplus-design-system-app/src/functions/utils';
import { getBWCntxtVal } from '../../../utils/localStorageUtils';
import paxSummary from './helper/paxSummaryText';

const JourneyBar = ({ ssrData }) => {
  const seatPaxInfo = getBWCntxtVal()?.seatWiseSelectedPaxInformation;

  if (!ssrData) {
    return null;
  }

  return (
    <div className="p-2 pb-6 p-md-0 journey-bar-container
     mt-14 mb-8 my-md-8 bg-secondary-white"
    >
      <div className="journey-bar__leg d-flex justify-content-around
      align-items-center py-4 px-8 bg-primary-main rounded-pill"
      >
        {ssrData?.map((item, index) => {
          return (
            <React.Fragment key={uniq()}>
              <div className="d-flex text-white body-medium-medium">
                <span className="d-flex align-items-center justify-content-center">{item?.journeydetail?.origin}</span>
                <span>{item?.journeydetail?.destination}</span>
              </div>
              {ssrData.length !== index + 1 ? (
                <span className="bg-sel-con-disabled-text mx-2 journey-bar-pipe" />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
      <div className="d-md-none body-small-regular text-center mt-5 text-tertiary">
        {paxSummary(seatPaxInfo)}
      </div>
    </div>
  );
};

JourneyBar.propTypes = {
  ssrData: PropTypes.arrayOf(PropTypes.object),
};

export default JourneyBar;
