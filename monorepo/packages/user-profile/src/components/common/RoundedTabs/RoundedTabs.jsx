import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/src/functions/utils';

const variations = {
  tabs: 'tabs',
  capsule: 'capsule',
};

const RoundedTabs = ({ list, activeTab, onClickHandlerSingle, variation = variations.tabs }) => {
  const onTabClick = (e, func) => {
    if (onClickHandlerSingle) {
      onClickHandlerSingle(e);
    } else {
      func(e);
    }
  };

  if (variation === variations.tabs) {
    return (
      <ul
        className="p-2 bg-white d-flex align-items-center rounded-pill border"
        style={{ borderColor: 'var(--secondary-deep) !important' }}
      >
        {list?.map((item) => (
          <li
            className={`${
              activeTab === item?.title ? 'bg-primary-main' : ''
            } flex-grow-1 flex-shrink-1 w-100 py-4 px-8 text-center rounded-pill cursor-pointer`}
            key={uniq()}
          >
            <button
              type="button"
              name={item?.title}
              onClick={(e) => onTabClick(e, item.onClickHandler)}
              className={`${
                activeTab === item?.title ? 'text-white' : 'text-tertiary'
              } bg-transparent border-0 btn d-block w-100 h-100`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  if (variation === variations.capsule) {
    return (
      <ul
        className="trips-status-filter align-items-center d-flex p-2 gap-4 mt-16 mb-6 my-md-10 overflow-auto"
      >
        {list?.map((item) => (
          <li
            className={`${
              activeTab === item?.title ? 'bg-primary-main' : ''
            } cursor-pointer   rounded-pill text-center`}
            key={uniq()}
          >
            <button
              type="button"
              name={item?.title}
              onClick={(e) => onTabClick(e, item.onClickHandler)}
              className={`${activeTab === item?.title
                ? 'bg-secondary-light border-secondary text-primary'
                : 'bg-white border-primary text-secondary'
              } rounded-pill px-6 py-4 tags-small d-block w-100 h-100 text-nowrap`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    );
  }
  return <div />;
};

RoundedTabs.propTypes = {
  list: PropTypes.array,
  onClickHandlerSingle: PropTypes.func,
  activeTab: PropTypes.string,
  variation: PropTypes.string,
};

export default RoundedTabs;
