import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import OfferDetailsSlider from './OfferDetailsSlider';
import useAppContext from '../../hooks/useAppContext';

import pushAnalytics from '../../utils/analyticsEvent';
import { ANALTYTICS } from '../../constants';

const OfferItem = ({ offer }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    state: { analyticsContext },
  } = useAppContext();

  const showSlider = () => {
    pushAnalytics({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.POP_UP_OPEN_OFFER_DETAILS,
      data: {
        productInfo: {
          airportCodePair: analyticsContext.product.productInfo.airportCodePair,
          sector: analyticsContext.product.productInfo.sector,
        },
      },
    });

    setShowDetails(true);
  };

  const hideSlider = () => {
    setShowDetails(false);
  };

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13) {
      showSlider();
    }
  };

  const { discountcashback, sliderTitle, image } = offer;

  return (
    <>
      <div
        className="srp-offers-list-item"
        onClick={showSlider}
        onKeyDown={onKeyDownHandler}
        tabIndex="0"
        role="button"
        aria-label="offers"
      >
        <img
          src={image?._publishUrl}
          className="srp-offers-list-item--image"
          alt="Offer"
        />
        <div className="srp-offers-list-item--offer">
          <Text
            variation="sh3"
            containerClass="upto-offer"
            mobileVariation="sh8"
          >
            {discountcashback}
          </Text>
          <Text
            variation="body-medium-regular"
            containerClass="offer-code"
            mobileVariation="body-small-regular"
          >
            <HtmlBlock html={sliderTitle?.html} tagName="p" />
          </Text>
        </div>
      </div>
      {showDetails && <OfferDetailsSlider onClose={hideSlider} offer={offer} />}
    </>
  );
};

OfferItem.propTypes = {
  offer: PropTypes.shape({
    code: PropTypes.any,
    discountcashback: PropTypes.any,
    image: PropTypes.shape({
      _publishUrl: PropTypes.any,
    }),
    tcDescription: PropTypes.any,
    sliderTitle: PropTypes.any,
    tcLabel: PropTypes.any,
  }),
};

export default OfferItem;
