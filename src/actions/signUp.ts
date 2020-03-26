import { ISignUpParams } from '../types';
import ApiService from 'utils/ApiService';

export function signUp(params: ISignUpParams) {
  return {
    type: 'SIGN_UP',
    callApi: () => ApiService.post(`/register`, { data: params }),
    payload: { request: {}, success: { data: {} } },
  } as const;
}
