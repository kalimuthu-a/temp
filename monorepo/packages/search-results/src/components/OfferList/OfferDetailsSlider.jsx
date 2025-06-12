import PropTypes from 'prop-types';
import React, { useState } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import useAppContext from '../../hooks/useAppContext';

const OfferDetailsSlider = ({ onClose, offer }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const { code, description, image, tcDescription, note, tcLabel } = offer;

  const {
    state: { additional },
  } = useAppContext();

  const onClickCopy = () => {
    try {
      navigator.clipboard.writeText(code);

      setShowTooltip(true);

      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    } catch (error) {
      // Error Hanlding
    }
  };

  return (
    <OffCanvas
      containerClassName="offer-details-slider mobile-variation1"
      onClose={onClose}
    >
      <Heading heading="h0 offer-heading">
        {additional.offerDetailsLabel}
      </Heading>
      <div className="offer-item">
        <img
          src={image._publishUrl}
          className="offer-item--image"
          alt="Offer"
        />
        <div className="offer-item--offer">
          <Heading heading="h4">
            <HtmlBlock html={description.html} />
          </Heading>
          <Text
            variation="body-small-regular note"
            containerClass="text-text-secondary"
          >
            <HtmlBlock html={note} tagName="p" />
          </Text>
        </div>
      </div>
      <div className="offer-seperator">&nbsp;</div>
      <div className="offer-details-slider-details">
        <div className="d-flex gap-8 mb-8">
          <div className="d-flex flex-column bl-dashed">
            <h6>{additional?.codeLabel}</h6>
            <Text containerClass="text-text-green body-large-medium">
              {code}
            </Text>
          </div>
          <Text variation="d-flex flex-column body-small-regular text-text-secondary">
            {additional?.redeemCode}
          </Text>
        </div>
        <Text variation="body-medium-medium" containerClass="key-terms">
          {tcLabel}
        </Text>
        <Text variation="body-medium-light">
          <HtmlBlock html={tcDescription.html} className="terms" />
        </Text>

        <div className={`tooltip ${showTooltip ? 'visible' : ''}`}>
          <span className="tooltiptext" id="myTooltip">
            {additional?.copiedToClipboard}
          </span>
        </div>
        <Button
          containerClass="text-center mt-16 d-flex justify-content-center"
          onClick={onClickCopy}
        >
          {additional?.copyCodeLabel?.replace('{}', code)}
        </Button>
      </div>
    </OffCanvas>
  );
};

OfferDetailsSlider.propTypes = {
  offer: PropTypes.any,
  onClose: PropTypes.any,
};

export default OfferDetailsSlider;
