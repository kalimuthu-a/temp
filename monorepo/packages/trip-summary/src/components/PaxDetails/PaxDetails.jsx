import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './PaxDetails.scss';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import { useTripSummaryContext } from '../../store/trip-summary-context';
import ssrCodeData from '../../mock/ssr';
import PaxListV2 from '../PaxListV2/PaxListV2';

const PaxDetails = ({ paxInfo, isFromSlider }) => {
  const { tripSummaryData, aemData, ssrCodeMapping } = useTripSummaryContext();
  const { passengers } = tripSummaryData || {};
  const accordionBodyRef = useRef();
  const ssrCodeList = ssrCodeMapping || ssrCodeData.data || [];

  const toggleAccordion = (isExPandNeed) => {
    if (!accordionBodyRef.current) return null;
    if (isExPandNeed) accordionBodyRef?.current?.classList?.toggle('expanded-accordion');
    if (accordionBodyRef?.current?.classList?.contains('expanded-accordion')) {
      accordionBodyRef.current.style.height = 'auto';
    } else {
      accordionBodyRef.current.style.height = '0px';
    }
    return null;
  };

  useEffect(() => {
    toggleAccordion();
  }, []);

  const converObj = {};
  ssrCodeList?.forEach((itm) => {
    converObj[itm.ssrCode] = itm.name;
  });
  if (paxInfo?.length < 1) {
    // if there is no pax with name then dont show the expand view
    return null;
  }
  if (isFromSlider) {
    return <PaxListV2 passengerList={paxInfo} />;
  }

  return (
    <div className={`pax-details-accordion ${isFromSlider ? 'pax-details--fromslider' : ''}`}>
      <button
        type="button"
        className="pax-details__head btn-unstyled w-100 p-6 flex-h-between"
        onClick={() => toggleAccordion(true)}
      >
        <span className="pax-details__head__label">
          {passengers?.length} {aemData?.passengerTravellingLabel}{' '}
        </span>
        <i className="icon-accordion-down-simple icon-size-sm" />
      </button>
      <div className={`pax-details__body px-6 ${isFromSlider ? ' expanded-accordion' : ''}`} ref={accordionBodyRef}>
        {paxInfo?.map((pax, index, thisArray) => {
          const isInfant = pax?.infant?.name?.first;
          const infantNameObj = pax?.infant?.name || {};
          return (
            <div className="pax-details__item lh-2" key={uniq()}>
              <span className="pax-details__name__container">
                <span className="pax-details__name">{pax.paxNameStr}</span>
                {isInfant && (
                <span className="infant">
                  <i className="icon-link" />{infantNameObj.first}{' '}{infantNameObj.last}
                </span>
                )}
              </span>
              {pax.journey?.map((jItem) => {
                const ssrCodeListArr = jItem.ssrs.map((i) => i.ssrCode);
                const seatListArr = jItem.seats.map((i) => i.label);
                const ssrList = [...new Set(ssrCodeListArr)].map((code) => converObj[code]);
                const ssrListStrig = ssrList.join(', ');
                const seatListArrString = seatListArr.join(', ');
                return (
                  <div className="pax-ssr-row" key={uniq()}>
                    <span className="text-secondary">{jItem.label}</span>
                    <span className="text-tertiary">
                      {seatListArrString.length > 0 && (
                        <i className="icon-seat px-1" />
                      )}
                      {seatListArrString}{(seatListArr.length > 0 && ssrCodeListArr.length > 0) && ' | '} {ssrListStrig}
                    </span>
                  </div>
                );
              })}
              {thisArray.length !== index + 1 && <div className="divider" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

PaxDetails.propTypes = {
  paxInfo: PropTypes.array,
  isFromSlider: PropTypes.bool,
};

export default PaxDetails;
