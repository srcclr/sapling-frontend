import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { IEpic } from 'types';

// This is a workaround and is obviously a duplicate.
// Until we have a better endpoint to get epics and sprints at one go,
// we will use this for the inter board dependency use case.
// Main purpose of this now is for cross board dependencies to show options
// of epics to select from from another board.
// This is not handled by the reducer as we are consuming the response
// from the component itself.

export function fetchEpicsListByBoardId(boardId: number) {
  return {
    type: 'FETCH_EPICS_LIST_BY_BOARD_ID',
    callApi: () => ApiService.get(`/board/${boardId}/epics`),
    payload: { request: { data: { boardId } }, success: { data: [] as IEpic[] } },
  } as const;
}

export function deleteEpic(epicId: number) {
  return {
    type: 'DELETE_EPIC',
    callApi: () => ApiService.del(`/epic/${epicId}`),
    payload: { request: { data: { epicId } }, success: { data: {} } },
  } as const;
}

export function createEpic(boardId: number, epicName: string, priority: number) {
  const data = {
    name: epicName,
    priority,
  };

  return {
    type: 'CREATE_EPIC',
    callApi: () => ApiService.post(`/board/${boardId}/epics`, { data }),
    payload: { request: { data: { boardId } }, success: { data: {} } },
  } as const;
}
