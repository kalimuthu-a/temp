import { API_LIST } from '.';
import { USER_TYPES } from '../constants';

const getMyGSTDetailsAemData = async (userType) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let apiUrl = API_LIST.AEM_GST_MEMBER;

  if (userType === USER_TYPES?.USER) {
    apiUrl = API_LIST.AEM_GST_MEMBER;
  } else if (userType === USER_TYPES?.SME_ADMIN) {
    apiUrl = API_LIST.AEM_GST_SME_ADMIN;
  }

  try {
    const response = await fetch(apiUrl, config);
    const data = await response.json();
    return data?.data?.accountGstDetailsByPath?.item;
  } catch (e) {
    console.log(e);
  }
};

export { getMyGSTDetailsAemData };
