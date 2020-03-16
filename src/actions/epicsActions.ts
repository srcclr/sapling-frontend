import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { IEpic } from 'types';

export function fetchEpicsList(boardId: number) {
  return {
    type: 'FETCH_EPICS_LIST',
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
