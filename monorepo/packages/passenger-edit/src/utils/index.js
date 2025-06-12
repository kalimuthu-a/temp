const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_passenger_edit';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return defaultObj;
  }
};

export const isSSRPresentAtleastForOneJourney = (ssrArray, ssrCode) => {
  let isFound = false;
  ssrArray.forEach(() => {
    let foundSSRItem = false;
    if (Array.isArray(ssrCode)) {
      const foundSSRCategory = ssrArray?.find((jssrItem) => ssrCode.includes(jssrItem.category));
      foundSSRItem = foundSSRCategory?.ssrs?.find((ssrSubItem) => ssrCode.includes(ssrSubItem?.ssrCode));
    } else {
      const foundSSRCategory = ssrArray?.find((jssrItem) => jssrItem.category === ssrCode);
      foundSSRItem = foundSSRCategory?.ssrs?.find((ssrSubItem) => ssrSubItem?.ssrCode === ssrCode);
    }

    if (foundSSRItem?.ssrCode) {
      isFound = true;
    }
  });
  return isFound;
};

export default getEnvObj;
