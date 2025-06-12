import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

import format from 'date-fns/format';
import classNames from 'classnames';

import { dateFormats } from '../../constants';
import { key } from '../../utils/a11y';

const FlightDateCarouselItem = ({
  onClickDate,
  date,
  selected,
  price,
  category,
  isBurn,
}) => {
  const onClickHandler = (e) => {
    onClickDate(e, date);
  };

  /**
   *
   * @param {import("react").KeyboardEvent<HTMLDivElement>} e
   */
  const onKeyUpHandler = (e) => {
    if (e.key === key.enter) {
      const activeSlide =
        e.currentTarget?.parentElement?.parentElement?.querySelector(
          '.swiper-slide-active',
        );
      if (activeSlide) {
        const dateForPayload = JSON.parse(
          activeSlide.firstChild.getAttribute('data-value'),
        );
        dateForPayload.d = new Date(dateForPayload.d);

        onClickDate(
          {
            currentTarget: {
              parentElement: {
                ariaLabel: activeSlide.ariaLabel,
              },
            },
          },
          dateForPayload,
        );
      }
    }
  };

  const className = classNames(
    'flight-date-carousel-container__item',
    { selected },
    { disabled: date.disabled },
  );

  const dateToDisplay = format(date.d, dateFormats.EEEddLLL);

  return (
    <div
      className={className}
      onClick={onClickHandler}
      role="gridcell"
      tabIndex={0}
      onKeyUp={onKeyUpHandler}
      aria-selected={selected}
      aria-label={`Select Date for ${dateToDisplay}`}
      data-value={JSON.stringify(date)}
    >
      <Text
        variation="body-small-regular"
        mobileVariation=""
        containerClass="date"
      >
        {dateToDisplay}
      </Text>

      <Text
        variation="body-medium-regular"
        mobileVariation=""
        containerClass="price"
      >
        {isBurn && <Icon className="icon-bluechip-point bluechip-icon" size="xs" />} {price}
      </Text>
      <div
        className={`category mt-4 flight-date-carousel-container__item__border--${category}`}
      />
    </div>
  );
};

FlightDateCarouselItem.propTypes = {
  date: PropTypes.any,
  selected: PropTypes.bool,
  onClickDate: PropTypes.func,
  price: PropTypes.string,
  category: PropTypes.string,
  isBurn: PropTypes.bool,
};

export default React.memo(FlightDateCarouselItem);
