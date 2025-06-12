import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import Offcanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import camelCase from 'lodash/camelCase';

import FilterControlGroup from './FilterControlGroup';

import { defaultFilterState, getFiterForContext } from './filterUtil';
import useAppContext from '../../hooks/useAppContext';
import { srpActions } from '../../context/reducer';
import pushAnalytics from '../../utils/analyticsEvent';
import { ANALTYTICS } from '../../constants';

const FilterSlider = ({ setOpenFilter }) => {
  const [selectedFilters, setSelectedFilters] = useState(defaultFilterState);
  const {
    dispatch,
    state: { filters, additional, analyticsContext, sort },
  } = useAppContext();

  useEffect(() => {
    const applied = {};
    for (const key in filters) {
      if (Object.hasOwnProperty.call(filters, key)) {
        applied[key] = [...(filters[key]?.active || [])];
      }
    }
    setSelectedFilters((prev) => ({ ...prev, ...applied }));
  }, [filters]);

  const filterData = useMemo(() => {
    const aemFilters = {};
    const { filterValues } = additional;

    for (const value of filterValues) {
      const { heading, filtersList } = value;
      const headingValue = camelCase(heading);

      if (headingValue === 'stops') {
        aemFilters[headingValue] = filtersList.map((f, index) => ({
          ...f,
          name: f.value,
          value: index,
        }));
      }
      if (headingValue.includes('aircraft')) {
        aemFilters.aircrafts = filtersList.map((f) => ({
          ...f,
          name: f.value,
          value: f.value,
        }));
      }
      if (headingValue === 'departureTime') {
        aemFilters[headingValue] = filtersList.map((f) => ({
          ...f,
          name: f.value,
          value: f.key
            .split(':')[1]
            .split('-')
            .map((v) => v * 60)
            .join('-'),
        }));
      }
    }

    return aemFilters;
  }, []);

  const handleClick = (type, selectedOption) => {
    if (selectedFilters[type].includes(selectedOption.value)) {
      const updatedFilters = selectedFilters[type].filter(
        (option) => option !== selectedOption.value,
      );
      setSelectedFilters((prev) => ({ ...prev, [type]: updatedFilters }));
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [type]: [...selectedFilters[type], selectedOption.value],
      }));
    }
  };

  const onResetFilter = () => {
    dispatch({
      type: srpActions.APPLY_FILTERS,
      payload: {
        ...filters,
        stops: {
          value: new Set(),
          labels: new Set(),
          keyProp: new Set(),
          active: new Set(),
          key: 'stops',
        },
        departureTime: {
          value: new Set(),
          labels: new Set(),
          keyProp: new Set(),
          active: new Set(),
          key: 'designator.departure',
        },
        aircrafts: {
          value: new Set(),
          labels: new Set(),
          keyProp: new Set(),
          active: new Set(),
          key: 'aircraft',
        },
      },
    });
    setOpenFilter(false);
  };

  const onApplyFilter = () => {
    const { active } = filters.departureTime;
    const payload = getFiterForContext(selectedFilters, filterData, active);

    pushAnalytics({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.ON_CLICK_APPLY,
      data: {
        productInfo: {
          airportCodePair: analyticsContext.product.productInfo.airportCodePair,
          sector: analyticsContext.product.productInfo.sector,
        },
        search: {
          filters: {
            time: [...payload.departureTime.labels].join(','),
            stops: [...payload.stops.labels].join(','),
            aircraft: [...payload.aircrafts.labels].join(','),
          },
          sort: {
            price: sort?.keyProp === 'lowCostFirst' ? 'Low-High' : '',
          },
        },
      },
    });

    dispatch({
      type: srpActions.APPLY_FILTERS,
      payload: { ...filters, ...payload },
    });
    setOpenFilter(false);
  };

  return (
    <Offcanvas
      containerClassName="srp-filter-slider"
      onClose={() => {
        setOpenFilter(false);
      }}
      renderFooter={() => {
        return (
          <div className="srp-filter-slider-footer">
            <Button
              block
              color="primary"
              variant="outline"
              onClick={onResetFilter}
            >
              {additional.resetButtonLabel}
            </Button>
            <Button block onClick={onApplyFilter}>
              {additional.applyButtonLabel}
            </Button>
          </div>
        );
      }}
    >
      <Heading containerClass="p-2" heading="srp-filter-slider-header h4">
        {additional.filterLabel}
      </Heading>
      <FilterControlGroup
        heading="STOPS"
        data={filterData.stops}
        selectedFilters={selectedFilters.stops}
        groupType="stops"
        handleClick={handleClick}
      />

      <FilterControlGroup
        heading="DEPARTURE TIME"
        type="box"
        data={filterData.departureTime}
        selectedFilters={selectedFilters.departureTime}
        groupType="departureTime"
        handleClick={handleClick}
      />

      <FilterControlGroup
        heading="AIRCRAFTS"
        data={filterData.aircrafts}
        groupType="aircrafts"
        selectedFilters={selectedFilters.aircrafts}
        handleClick={handleClick}
        size="lg"
      />
    </Offcanvas>
  );
};

FilterSlider.propTypes = {
  setOpenFilter: PropTypes.any,
};

export default FilterSlider;
