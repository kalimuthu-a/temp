import React from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import Text from 'skyplus-design-system-app/dist/des-system/Text';

function LastTrip() {
  return (
    <div className="mp-last-trip">
      <div className="d-flex mp-last-trip__heading">
        <Heading heading="h4" mobileHeading="h5">Your <span>last trips</span></Heading>
        <div><a href="/">View All</a></div>
      </div>
      <div className="mp-last-trip__container">
        <div className="mp-last-trip__container__pnr">
          <Heading>Flight to Delhi</Heading>
          <div className="mp-last-trip__container__pnr-detail">
            <span>PNR: WKNPNZ</span>
            <Chip size="sm" containerClass="mp-last-trip__container__pnr-chip">Complete</Chip>
          </div>
        </div>
        <div className="mp-last-trip__container__flight-details">
          <Chip size="sm" containerClass="mp-last-trip__container__flight-details-chip pt-5">Flown</Chip>
          <Text containerClass="mb-5">6E 12345</Text>
          <div className="mp-last-trip__journey-detail">
            <div className="mp-last-trip__journey-detail__from">
              <span>07:00</span>
              <h4>DEL</h4>
              <span>Mumbai, T3</span>
            </div>
            <div className="mp-last-trip__journey-detail__duration">
              <p>4h 15M</p>
              <p className="pt-2">Non-Stop</p>
            </div>
            <div className="mp-last-trip__journey-detail__to">
              <span>11:15 </span>
              <h4>BOM</h4>
              <span>Delhi, T2</span>
            </div>
          </div>
          <div className="mp-last-trip__dotted" />
        </div>
      </div>
    </div>
  );
}
LastTrip.propTypes = {};
export default LastTrip;
