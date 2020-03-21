import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { ICrossDeps } from 'types';

export function fetchDependencies() {
  const endpoint = `${config.API_URL}/boards/dependencies`;

  return {
    type: 'FETCH_CROSS_BOARD_DEPENDENCIES',
    callApi: () => ApiService.get(endpoint),
    payload: { request: {}, success: { data: null as ICrossDeps } },
  } as const;
}
