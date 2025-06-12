import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import FareSummaryTable from './FareSummaryTable';
import { convertNumberWithCommaSep } from '../../utils';

const MilesFare = ({ priceObj, currencyCode }) => {
  const mfDataObj = useSelector((state) => state.itinerary?.mfDatav2?.itineraryMainByPath?.item) || {};
  const seatWiseInfoAem = mfDataObj?.paymentDetails?.sectionWiseEarnedMiles || [];
  const aemConfigObj = seatWiseInfoAem?.reduce((obj, item) => {
    // eslint-disable-next-line no-param-reassign
    obj[item.key.trim()] = item.value;
    return obj;
  }, {});
  return (
    <FareSummaryTable {...{ currencyCode }}>
      { priceObj?.promisPoints?.map((pPointItem) => {
        if (pPointItem?.code?.toLowerCase() === 'total' || !pPointItem?.value || pPointItem?.value === '0') return;
        const label = aemConfigObj?.[pPointItem?.code] || pPointItem?.name || pPointItem?.code || '';
        // eslint-disable-next-line consistent-return
        return (
          <li className="price-summary__list__list-item" key={uniq() + 1}>
            <span className="price-summary__list__heading">
              {label}
            </span>
            <span className="price-summary__list__price">
              {convertNumberWithCommaSep(pPointItem?.value)}
            </span>
          </li>
        );
      })}
    </FareSummaryTable>
  );
};

MilesFare.propTypes = {
  // ssrAmountList: PropTypes.array,
  // converSSRObj: PropTypes.object,
  currencyCode: PropTypes.string,
  priceObj: PropTypes.object,
};

export default MilesFare;
