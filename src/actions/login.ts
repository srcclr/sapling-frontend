import { ILoginParams } from '../types';
import ApiService from 'utils/ApiService';
import config from 'utils/config';

export function loginWithUserName(params: ILoginParams) {
  const endpoint = `${config.API_URL}/login`;

  return {
    type: 'LOGIN_WITH_USERNAME',
    callApi: () => ApiService.post(endpoint, { data: params }),
    payload: { request: {}, success: { data: {} } },
  } as const;
}
