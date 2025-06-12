import { DAY_DEPARTURE_RANGE } from '../../constants';

export const defaultFilterState = {
  stops: [],
  departureTime: [],
  availableSeats: [],
};

export const getFiterForContext = (
  selectedFilters,
  filterData,
  otherFilters,
) => {
  const contextFilter = {
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
      key: 'designator.departure',
      active: new Set(),
    },
    aircrafts: {
      value: new Set(),
      labels: new Set(),
      keyProp: new Set(),
      key: 'aircraft',
      active: new Set(),
    },
  };

  for (const [key, values] of Object.entries(selectedFilters)) {
    if (Array.isArray(values)) {
      for (const value of values) {
        const item = filterData[key].find((i) => i.value === value);
        contextFilter[key].labels.add(item.name);
        contextFilter[key].value.add(item.value);
        contextFilter[key].keyProp.add(item.key);
        contextFilter[key].active.add(item.value);
      }
    }
  }

  if (otherFilters.has(DAY_DEPARTURE_RANGE)) {
    contextFilter.departureTime.active.add(DAY_DEPARTURE_RANGE);
  }

  return contextFilter;
};
