const COOKIE_KEYS = {
  AUTH: 'auth_token',
  ROLE: 'aemLoginStatus',
  USER: 'auth_user',
  ROLE_DETAILS: 'role_details', // { roleName: "ABC", roleCode: "dfsf"} - role codes
  PERSONA_TYPE: 'personasType', // ABC - page Type - Member
  CLARITY_ID: '_clck',
  CIAM_POLICY: 'ciam_policy',
  CIAM_REFRESH_TOKEN: 'ciam_refresh_token',
  REFRESH_TOKEN_EXPIRE_TIME: 'refresh_token_expire_time',
  WALLET_USER: 'isWallet',
};

export default COOKIE_KEYS;
