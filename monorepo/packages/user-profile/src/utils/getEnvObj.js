const getMyBookingsEnvObj = (environmentKey) => {
  const defaultObj = {};
  const envKey = environmentKey;
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return defaultObj;
  }
};

export default getMyBookingsEnvObj;
