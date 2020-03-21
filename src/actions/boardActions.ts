import { ILoginParams } from '../types';
import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { ISprint, IStory, IBoard } from 'types';
import { getNumberValue } from 'utils/Helpers';

export function fetchBoard(boardId: number) {
  const endpoint = `${config.API_URL}/login`;

  return {
    type: 'FETCH_BOARD',
    callApi: () => ApiService.get(`/board/${boardId}`),
    payload: { request: { data: { boardId } }, success: { data: {} } },
  } as const;
}

export function deleteBoard(boardId: number) {
  return {
    type: 'DELETE_BOARD',
    callApi: () => ApiService.del(`${config.API_URL}/board/${boardId}`),
    payload: { request: { data: { boardId } }, success: { data: {} } },
  } as const;
}

export function createSprint(boardId: number, sprint: ISprint) {
  const { name, capacity, goal } = sprint;
  const data = {
    name,
    capacity,
    goal,
  };

  return {
    type: 'CREATE_SPRINT',
    callApi: () => ApiService.post(`${config.API_URL}/board/${boardId}/sprints`, { data }),
    payload: { request: { data: { boardId } }, success: { data: {} as ISprint } },
  } as const;
}

export function updateSprint(sprint: ISprint) {
  const { id, name, capacity, goal } = sprint;

  const data = {
    name,
    capacity,
    goal,
  };

  return {
    type: 'UPDATE_SPRINT',
    callApi: () => ApiService.put(`${config.API_URL}/sprint/${id}`, { data }),
    payload: { request: { data: { sprint } }, success: { data: {} as ISprint } },
  } as const;
}

export function deleteSprint(id: number) {
  return {
    type: 'DELETE_SPRINT',
    callApi: () => ApiService.del(`${config.API_URL}/sprint/${id}`),
    payload: { request: { data: { id } }, success: { data: {} as ISprint } },
  } as const;
}

export function createStory(boardId: number, epicId: number, description: string, weight: number) {
  const data = {
    description,
    weight,
  };

  return {
    type: 'CREATE_STORY',
    callApi: () => ApiService.post(`/board/${boardId}/epic/${epicId}/tickets`, { data }),
    payload: { request: { data: { boardId, epicId } }, success: { data: {} as IStory } },
  } as const;
}

/**
 * We may be deprecating the term Ticket and use Story. Occurrences of Ticket here
 * indicate changes that may be required in the backend.
 */
export function updateStory(boardId: number, story: IStory) {
  const { pin, id, epic: epicId, weight } = story;
  const data = {
    ...story,
    epic: getNumberValue(epicId),
    weight: getNumberValue(weight),
  };
  let changePin = () =>
    pin
      ? ApiService.post(`/board/${boardId}/pins`, { data: { ticketId: id, sprintId: pin } })
      : ApiService.del(`/board/${boardId}/pins`, { data: { ticketId: id } });

  return {
    type: 'UPDATE_STORY',
    callApi: () =>
      Promise.all([
        ApiService.put(`/ticket/${id}`, {
          data,
        }),
        ApiService.put(`/epic/${epicId}/ticket/${id}`),
        changePin(),
      ]),
    payload: {
      request: { data: { story: data } },
      success: { data: {} as IStory },
    },
  } as const;
}

export function deleteStory(id: number, sprintId: number) {
  return {
    type: 'DELETE_STORY',
    callApi: () => ApiService.del(`/ticket/${id}`),
    payload: { request: { data: { storyId: id, sprintId } }, success: { data: {} as ISprint } },
  } as const;
}

export function solve(boardId: number) {
  return {
    type: 'SOLVE',
    callApi: () => ApiService.post(`/board/${boardId}`),
    payload: { request: { data: { boardId } }, success: { data: {} as IBoard } },
  } as const;
}

export function addDependency(boardId: number, fromStoryId: number, toStoryId: number) {
  return {
    type: 'ADD_DEPENDENCY',
    callApi: () =>
      ApiService.post(`/board/${boardId}/dependencies`, {
        data: { fromTicketId: fromStoryId, toTicketId: toStoryId },
      }),
    payload: {
      request: { data: { boardId, fromStoryId, toStoryId } },
    },
  } as const;
}

export function deleteDependency(boardId: number, fromStoryId: number, toStoryId: number) {
  return {
    type: 'DELETE_DEPENDENCY',
    callApi: () =>
      ApiService.del(`/board/${boardId}/dependencies`, {
        data: { fromTicketId: fromStoryId, toTicketId: toStoryId },
      }),
    payload: {
      request: { data: { boardId, fromStoryId, toStoryId } },
    },
  } as const;
}

export function exportCsv(boardId: number) {
  return {
    type: 'EXPORT_CSV',
    callApi: () => ApiService.get(`/board/${boardId}/csv`, { headers: { Accept: 'text/csv' } }),
    payload: { request: { data: { boardId } } },
  } as const;
}

export function uploadCsv(boardId: number, file) {
  const formData = new FormData();
  formData.append('file', file);

  return {
    type: 'UPLOAD_CSV',
    callApi: () =>
      ApiService.post(`/board/${boardId}/csv`, {
        data: formData,
        headers: { type: '' },
      }),
    payload: { request: { data: { boardId } } },
  } as const;
}
