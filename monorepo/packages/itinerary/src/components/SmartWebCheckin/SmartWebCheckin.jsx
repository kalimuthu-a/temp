import React from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { useSelector } from 'react-redux';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { getQueryStringByParameterName } from '../../utils';

const SmartWebCheckin = () => {
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const {
    smartWebCheckInImage,
    smartWebCheckInTitle,
    smartWebCheckInSubtext,
    smartWebCheckInOptions,
    viewLabel,
  } = mfData?.itineraryMainByPath?.item || '';
  const isBookingFlowPage = getQueryStringByParameterName('isBookingFlow') === '1';
  return (
    <div className={`smart-web-checkin ${isBookingFlowPage ? 'booking-flow' : ''}`}>
      <div className="top-part">
        <Heading containerClass="title" heading="h0" mobileHeading="h1">
          {smartWebCheckInTitle}
        </Heading>
        <div className="view-link">
          <HtmlBlock
            html={viewLabel?.html}
          />
          <i className="icon-accordion-left-24" />
        </div>
      </div>
      <Heading heading="h4" mobileHeading="h3" containerClass="sub-title">
        <div
          dangerouslySetInnerHTML={{ __html: smartWebCheckInSubtext?.html }}
        />
      </Heading>
      <div className="benefits">
        <div
          className="benefits-list"
          dangerouslySetInnerHTML={{ __html: smartWebCheckInOptions?.html }}
        />
        <img
          src={smartWebCheckInImage?._publishUrl}
          alt="baggage"
          className="benefits-img"
          loading="lazy"
        />
      </div>
    </div>
  );
};
export default SmartWebCheckin;
