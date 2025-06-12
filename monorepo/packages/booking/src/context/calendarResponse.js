export default () => {
  const calendarResponses = {};

  const appendNewData = (origin, destination, data) => {
    const key = `${origin}-${destination}`;

    if (!Reflect.has(key)) {
      calendarResponses[key] = new Map();
    }

    calendarResponses[key] = new Map([...calendarResponses[key], ...data]);
  };

  return {
    appendNewData,
  };
};
