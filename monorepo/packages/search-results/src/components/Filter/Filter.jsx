import React, { useMemo, useState, useEffect } from 'react';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';

import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import NextChip from 'skyplus-design-system-app/dist/des-system/NextChip';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { key as keyboardsKey } from '../../utils/a11y';

import FilterSlider from './FilterSlider';
import SortPopover from './SortPopover';
import useAppContext from '../../hooks/useAppContext';

import { srpActions } from '../../context/reducer';
import { DAY_DEPARTURE_RANGE } from '../../constants';
import Check from '../Icons/Check';

const Filter = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const {
    state: { filters, main, sort, isProjectNextEnabled },
    dispatch,
  } = useAppContext();

  const onClickFilter = () => {
    setOpenFilter(true);
  };

  const deriveAppliedFiters = useMemo(() => {
    const appliedFilters = [];
    const sortKeys = [
      'lowCostFirst',
      'earlyDeparture',
      'lateDeparture',
      'duration',
    ];

    map(main.filters, (value, keyProp) => {
      let key = { keyProp };

      if (keyProp === 'next') {
        key = {
          keyProp: 'next',
        };
      } else if (keyProp === 'nonStop') {
        key = {
          keyProp: 'nonStop',
          formKey: 'stops',
          filterValue: 0,
          active: filters.stops.active.has(0),
        };
      } else if (keyProp === 'dayDeparture') {
        key = {
          keyProp: 'dayDeparture:6-16',
          formKey: 'departureTime',
          filterValue: DAY_DEPARTURE_RANGE,
          active: filters.departureTime.active.has('360-960'),
        };
      } else if (keyProp === 'oneStop') {
        key = {
          keyProp: 'oneStop',
          formKey: 'stops',
          filterValue: 1,
          active: filters.stops.active.has(1),
        };
      }

      appliedFilters.push({
        value,
        active: false,
        type: sortKeys.includes(keyProp) ? 'sort' : 'filter',
        ...key,
      });
    });

    const findAppliedFilterIndex = (keyPropLocal) =>
      appliedFilters.findIndex((f) => f.keyProp === keyPropLocal);

    for (const [filterKey, filterObj] of Object.entries(filters)) {
      const filterLabels = [...(filterObj?.labels || [])];
      const filterKeyProp = [...(filterObj?.keyProp || [])];
      const filterValue = [...(filterObj?.value || [])];
      const filterActive = [...(filterObj?.active || [])];

      filterKeyProp.forEach((keyPropLocal, index) => {
        const findIndex = findAppliedFilterIndex(keyPropLocal);

        if (findIndex >= 0) {
          appliedFilters[findIndex].active = filterActive.includes(
            filterValue[index],
          );
        } else {
          appliedFilters.push({
            value: filterLabels[index],
            active: filterActive.includes(filterValue[index]),
            type: 'filter',
            keyProp: filterKeyProp[index],
            formKey: filterKey,
            filterValue: filterValue[index],
          });
        }
      });
    }

    if (sort.keyProp) {
      const sortItemIndex = findAppliedFilterIndex(sort.keyProp);

      if (sortItemIndex >= 0) {
        appliedFilters[sortItemIndex].active = true;
      } else {
        appliedFilters.push({
          active: true,
          keyProp: sort.keyProp,
          type: 'sort',
          value: sort.value,
        });
      }
    }

    return appliedFilters;
  }, [filters, sort]);

  const onClickFilterItem = (item) => {
    const { formKey, active, keyProp, filterValue } = item;
    let payload = {
      keyProp,
      value: item.value,
    };
    if (item.type === 'sort') {
      if (active) {
        payload = {};
      }
      dispatch({ type: srpActions.SET_SORT, payload });
    } else if (item.type === 'filter') {
      const filterPayload = cloneDeep(filters);
      if (active) {
        filterPayload[formKey].active.delete(filterValue);
      } else {
        filterPayload[formKey].active.add(filterValue);
      }

      dispatch({ type: srpActions.APPLY_FILTERS, payload: filterPayload });
    }
  };

  const onKeyUpHandler = (e) => {
    e.preventDefault();
    if (e.key === keyboardsKey.enter) {
      e.target.click();
      onClickFilter();
    }
  };

  const onClickNextOnly = () => {
    const filterPayload = cloneDeep(filters);
    filterPayload.isNext = !filters.isNext;

    dispatch({ type: srpActions.APPLY_FILTERS, payload: filterPayload });
  };
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop < lastScrollTop) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollTop(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return (
    <div className={`srp-filter-container ${isVisible ? ' ' : 'hidden-fillter'}`}>
      <div className="srp-filter-container-left d-flex align-items-center">
        {deriveAppliedFiters.map((item) => (
          item?.keyProp === 'next' && isProjectNextEnabled ? (
            <NextChip withBorder onClick={onClickNextOnly}>
              {filters.isNext && <Check />}
              {main.filters.next}
            </NextChip>
          ) : (
            <Chip
              containerClass={item.active ? 'filter-active' : 'filter'}
              key={item.value}
              variant={item.active ? 'filled' : 'outlined'}
              border={item.active ? 'secondary-main' : 'alice-blue'}
              txtcol={item.active ? 'text-primary' : 'text-secondary'}
              size="md"
              color="secondary-light"
              onClick={() => {
                onClickFilterItem(item);
              }}
            >
              <span
                className="text-tertiary"
                tabIndex={0}
                aria-label={`Filter applied ${item.value} flights only`}
                onKeyUp={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onClickFilterItem(item);
                  }
                }}
                role="button"
              >
                {item.value}
              </span>
            </Chip>
          )
        ))}
      </div>
      <div className="icon-container d-flex justify-content-end align-items-center">
        <SortPopover />
        <div
          className="d-flex gap-2 cursor-pointer"
          onClick={onClickFilter}
          role="button"
          aria-label="Show Filter"
          onKeyUp={onKeyUpHandler}
          tabIndex="0"
        >
          <Icon className="icon-filter-icon" size="sm text-primary-main" />
        </div>
      </div>
      {openFilter && <FilterSlider setOpenFilter={setOpenFilter} />}
    </div>
  );
};

Filter.propTypes = {};

export default Filter;
