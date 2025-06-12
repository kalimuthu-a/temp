export const uniq = () => {
  return `id--${new Date().getTime()}${(Math.random() + 1)
    .toString(36)
    .substring(2)}`;
};
export const emptyFn = () => {};

export function delay(delayInms) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayInms * 1000);
  });
}

/**
 *
 * @description A utility function to convert placeholder into values within string
 *
 * @example
 * formattedMessage("{name} and age is {age}" , {name: "Name", age: 1000})
 *
 * @param {string} rawString
 * @param {{[key: string]: string}} value
 * @returns {string}
 */
export const formattedMessage = (rawString, value) => {
  let outputString = typeof rawString === 'string' ? rawString : String(rawString ?? '');
 
  if (!outputString) {
    console.error('Invalid rawString:', rawString);
    return '';
  }
  const entries = Object.entries(value || {});
  entries.forEach(([key, v]) => {
    const find = `{${key}}`;
    const regExp = new RegExp(find, 'g');
    outputString = outputString.replace(regExp, String(v ?? ''));
  });
 
  return outputString;
};

export const getPageLoadTime = () => {
  const navPerformance = window.performance.getEntriesByType('navigation')[0];
  return parseFloat(navPerformance.duration / 1000).toFixed(2);
};

export const calculateAge = (dobString) => {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const monthDifference = today.getMonth() - dob.getMonth();
  const dayDifference = today.getDate() - dob.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age -= 1;
  }
  return age;
};

export const getCurrencyPrice = (price) => {
  return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const redirectTo = (url, target = '_blank') => {
  window.open(url, target);
};

export const getSwiperTitle = ({
  stripType,
  stripVariations,
  hotelRecommendations,
  arrivalCityName,
  swiperConfig,
}) => {
  const { HOTELSTRIP } = stripVariations;

  if (stripType === HOTELSTRIP) {
    const updatedSwiperConfig = {
      ...swiperConfig,
      navigation: {
        ...swiperConfig.navigation,
        enabled: true,
      },
    };

    return {
      title: hotelRecommendations?.description?.html?.replace(
        '{city}',
        arrivalCityName,
      ),
      swiperClass: 'mobile-slider hotel-slider swiper-md ',
      swiperConfig: updatedSwiperConfig,
    };
  }
  return {};
};
