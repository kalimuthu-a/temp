import get from 'lodash/get';

const aemService = async (url, key, defaultValue = {}) => {
  let data = {};
  try {
    data = await fetch(url).then((response) => response.json());
  } catch (error) {
    // Error Handling
  }
  return get(data, key, defaultValue);
};

export default aemService;
