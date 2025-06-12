import { API_LIST } from '.';

const getSavedPassengerAemData = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(API_LIST?.AEM_SAVED_PASSENGER_MEMBER, config);
    const data = await response.json();
    return data?.data?.accountSavedPassengerByPath?.item;
  } catch (e) {
    console.log(e);
  }
};

export { getSavedPassengerAemData };
