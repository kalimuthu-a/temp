import React, { useMemo } from 'react';
import Popover from 'skyplus-design-system-app/dist/des-system/Popover';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { emptyFn } from 'skyplus-design-system-app/dist/des-system/utils';
import isEqual from 'lodash/isEqual';

import useAppContext from '../../../hooks/useAppContext';
import { srpActions } from '../../../context/reducer';
import SortItem from './SortItem';
import { customEvents } from '../../../constants';
import { key as keyboardsKey } from '../../../utils/a11y';

const SortPopover = () => {
  const {
    state: { sort, additional, isEarn },
    dispatch,
  } = useAppContext();

  const onClickPopoverItem = (e) => {
    setTimeout(() => {
      document.dispatchEvent(new Event(customEvents.CLICK));
    }, 100);

    const payload = isEqual(sort, e) ? {} : e;
    dispatch({ type: srpActions.SET_SORT, payload });
  };

  const sortItems = useMemo(() => {
    return additional?.sortFilterList?.reduce(
      (acc, r) =>
        (isEarn || r.key !== 'highestPoints'
          ? [...acc, { ...r, keyProp: r.key }]
          : acc),
      [],
    );
  }, []);

  const onKeyUpHandler = (e) => {
    e.preventDefault();
    if (e.key === keyboardsKey.enter) {
      e.target.click();
    }
  };
  return (
    <Popover
      containerClass="search-results-sort-popover cursor-pointer"
      setToggleModal={emptyFn}
      renderElement={() => (
        <div
          className="d-flex gap-2"
          key="1234567890"
          tabIndex="0"
          aria-label="Sort Filter"
          role="button"
          onKeyUp={onKeyUpHandler}
        >
          <Icon
            className="icon-switch_destination text-primary-main rotate-90"
            size="md"
          />
        </div>
      )}
      renderPopover={() => (
        <div className="search-results-sort-popover-content">
          <div tabIndex={-1} aria-label={`Popup title ${additional.sortTitle}`}>
            <Heading
              heading="body-small-light"
              mobileHeading="h0"
              containerClass="text-tertiary mb-4 px-8"
            >
              {additional.sortTitle}
            </Heading>
          </div>
          <div className="search-results-sort-popover-content--list">
            {sortItems.map((item) => (
              <SortItem
                key={item.value}
                {...item}
                active={item.value === sort.value}
                onClick={onClickPopoverItem}
              />
            ))}
          </div>
        </div>
      )}
    />
  );
};

SortPopover.propTypes = {};

export default SortPopover;
