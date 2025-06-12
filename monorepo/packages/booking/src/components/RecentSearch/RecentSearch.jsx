import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

const RecentSearch = ({
  recentSearchLabel,
  paxLabel,
  item,
  onClickItem,
  passengersLabel,
}) => {
  const onClickHandler = () => {
    onClickItem(item);
  };

  return (
    <div
      className="recent-search-item"
      onClick={onClickHandler}
      role="presentation"
    >
      <div className="recent-search-item__left">
        <Text
          containerClass="text-primary-main"
          variation="body-large-medium"
          mobileVariation="body-small-medium"
        >
          {recentSearchLabel}
        </Text>
        <div className="trip-details">
          <Text variation="body-small-regular">{item.journeyinfo}</Text>
          <div className="row" />
          <Text variation="body-small-regular">{item.date}</Text>
          <div className="row" />
          <Text variation="body-small-regular">
            {item.count} {item.count > 1 ? passengersLabel : paxLabel}
          </Text>
        </div>
      </div>
      <div className="recent-search-item__right d-flex justify-content-center align-items-center">
        <Icon className="icon-arrow-top-right" size="sm" />
      </div>
    </div>
  );
};

RecentSearch.propTypes = {
  paxLabel: PropTypes.any,
  passengersLabel: PropTypes.string,
  recentSearchLabel: PropTypes.any,
  item: PropTypes.any,
  onClickItem: PropTypes.func,
};

export default RecentSearch;
