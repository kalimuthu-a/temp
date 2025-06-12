import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';

const Baggage = ({ item, baggageData }) => {
  const { image, title, description } = item;

  return (
    <div className="fare-details__baggage__content__row d-flex justify-content-between">
      <div>
        <Text
          variation="body-medium-medium"
          mobileVariation="body-small-medium"
          containerClass="title text-text-primary"
        >
          {title}
        </Text>
        <HtmlBlock
          className="description"
          html={formattedMessage(description?.html, {
            cabinBaggage: baggageData.handBaggageWeight,
            checkinBaggage: baggageData.checkinBaggageWeight,
            cabinBaggageQuanity: baggageData.handBaggageCount,
          })}
        />
      </div>
      <div>
        <img
          src={image._publishUrl}
          alt="baggage"
          className="fare-details__baggage__content__row--image"
        />
      </div>
    </div>
  );
};

Baggage.propTypes = {
  baggageData: PropTypes.shape({
    checkinBaggageWeight: PropTypes.any,
    handBaggageCount: PropTypes.any,
    handBaggageWeight: PropTypes.any,
  }),
  item: PropTypes.shape({
    description: PropTypes.shape({
      html: PropTypes.any,
    }),
    image: PropTypes.any,
    title: PropTypes.any,
  }),
};

export default Baggage;
