import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { IBoard } from 'types';

export function fetchBoardList() {
  const endpoint = `${config.API_URL}/boards`;

  return {
    type: 'FETCH_BOARD_LIST',
    callApi: () => ApiService.get(endpoint),
    payload: { request: {}, success: { data: [] as IBoard[] } },
  } as const;
}

export function createBoard(boardName: string, ownerId: number) {
  const endpoint = `${config.API_URL}/boards`;
  const data = {
    name: boardName,
    owner: ownerId,
  };
  return {
    type: 'CREATE_BOARD',
    callApi: () => ApiService.post(endpoint, { data }),
    payload: { request: {}, success: { data: {} as IBoard } },
  } as const;
}
