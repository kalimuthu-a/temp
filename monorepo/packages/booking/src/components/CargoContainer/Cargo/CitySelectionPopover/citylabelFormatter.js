const citylabelFormatter = (city, defaultValue) => {
  if (!city) {
    return defaultValue;
  }

  const { stationCode, shortName } = city;
  let cityShortName = shortName;
  if (shortName.length > 6) {
    cityShortName = `${shortName.substring(0, 6)}...`;
  }

  return `${cityShortName}, ${stationCode}`;
};

export default citylabelFormatter;
