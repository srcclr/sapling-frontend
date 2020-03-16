import _ from 'lodash';

import ApiService from 'utils/ApiService';
import config from 'utils/config';

export function updateMe(data) {
  return {
    type: 'UPDATE_ME',
    payload: data,
  } as const;
}

export function updateIsLoggedIn(isLoggedIn: boolean) {
  return {
    type: 'UPDATE_IS_LOGGED_IN',
    payload: {
      isLoggedIn,
    },
  } as const;
}

export function fetchMe() {
  const endpoint = `${config.API_URL}/me`;

  return {
    type: 'FETCH_ME',
    callApi: () => ApiService.get(endpoint),
    payload: { request: {}, success: {} },
  } as const;
}
