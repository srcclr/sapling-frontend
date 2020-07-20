import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { IBoard } from 'types';
import { IBoardListItem } from 'store/IStoreState';

export function openedBoardList(socketWrapper) {
  const message = { type: 'OpenedBoardList' };

  return {
    type: 'OPENED_BOARD_LIST',
    sendMessage: () => socketWrapper.send(message),
    payload: { request: {}, success: { boards: [] as IBoardListItem[] } },
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

export function updateIsInitialLoad(isInitialLoad: boolean) {
  return {
    type: 'UPDATE_BOARD_LIST_IS_INITIAL_LOAD',
    payload: {
      isInitialLoad,
    },
  };
}
