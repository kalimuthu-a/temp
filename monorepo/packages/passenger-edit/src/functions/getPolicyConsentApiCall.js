import { API_LIST } from '../services';
import getSessionToken from '../utils/storage';

// eslint-disable-next-line sonarjs/cognitive-complexity
const getPolicyConsent = async () => {
  const token = getSessionToken();
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      user_key: API_LIST?.USER_KEY_PRIVACY_POLICY,
    },
  };
  return await fetch(`${API_LIST?.POLICY_CONSENT}?FormName=BookingContact`, config).then((response) => response.json());
};

export default getPolicyConsent;
