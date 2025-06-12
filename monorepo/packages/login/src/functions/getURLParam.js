export const getURLParam = (
  windowLocationObject,
  expectedKey,
  expectedValue,
) => {
  const params = windowLocationObject?.search
    ?.substring(windowLocationObject?.search?.indexOf('?') + 1)
    .split('&');
  let loginTypeParam = null;
  if (params && params.length) {
    for (const param of params) {
      const [key, value] = param.split('=');
      if (key && key === expectedKey && value && value === expectedValue) {
        loginTypeParam = { key, value };
        break;
      }
    }
  }
  return loginTypeParam;
};
