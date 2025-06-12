export const validator = (regEx) => (value) => {
  if (!value) {
    return false; // Always return false for falsy values
  }
  const stringifiedValue = `${value}`;
  return !!regEx.exec(stringifiedValue); // Use exec() method instead
};

export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_login';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    console.log(error);
    return defaultObj;
  }
};
