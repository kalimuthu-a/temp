export const combinabilityDataMap = (data = []) => {
  const combinabilityMap = new Map();

  data.forEach((config) => {
    const { productClass, pClassList } = config;

    const combinabilityData = pClassList.split(',');
    combinabilityData.sort();

    combinabilityMap.set(productClass, {
      ...config,
      combinabilityData,
      pClassList: combinabilityData.join(','),
    });
  });

  return combinabilityMap;
};

export const defaultFilterState = {
  stops: {
    value: new Set(),
    labels: new Set(),
    keyProp: new Set(),
    key: 'stops',
    active: new Set(),
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
  isNext: false,
};

export const upgradeFares = (selectedFares, productClass) => {
  return selectedFares.map((row) => {
    if (!row) {
      return row;
    }
    const { passengerFares } = row;

    if (row.fare && row.fare.combinabilityData.includes(productClass)) {
      return row;
    }

    const fare = passengerFares.find((r) => r.productClass === productClass);

    if (!fare) {
      return null;
    }
    return {
      ...row,
      fare,
    };
  });
};

export const isCombinableClass = (selectedFaresCombinability, pClass) =>
  selectedFaresCombinability?.every((row) => row?.includes(pClass));
