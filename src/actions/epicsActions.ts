import { IEmptyAction } from 'actions/sharedActions';
import { Action, ActionCreatorsMapObject } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import IStoreState from 'store/IStoreState';
import ApiService from 'utils/ApiService';
import { IEpic, ISprint, ITicket } from 'types';

// Declare an enum of Action type constants

export enum ActionTypeKeys {
  FETCH_EPIC_REQUEST = 'FETCH_EPIC_REQUEST',
  FETCH_EPIC_SUCCESS = 'FETCH_EPIC_SUCCESS',
  FETCH_EPIC_FAILURE = 'FETCH_EPIC_FAILURE',
  FETCH_EPICS_LIST_REQUEST = 'FETCH_EPICS_LIST_REQUEST',
  FETCH_EPICS_LIST_SUCCESS = 'FETCH_EPICS_LIST_SUCCESS',
  FETCH_EPICS_LIST_FAILURE = 'FETCH_EPICS_LIST_FAILURE',
  RESET_BOARD = 'RESET_BOARD',
}

// Payload interfaces
// Action interfaces

export interface IResetEpic {
  readonly type: ActionTypeKeys.RESET_BOARD;
}

export interface IFetchEpicRequestAction {
  readonly type: ActionTypeKeys.FETCH_EPIC_REQUEST;
}

export interface IFetchEpicSuccessAction {
  readonly type: ActionTypeKeys.FETCH_EPIC_SUCCESS;
  readonly payload: {
    data: IEpic;
  };
}

export interface IFetchEpicFailureAction {
  readonly type: ActionTypeKeys.FETCH_EPIC_FAILURE;
  readonly payload: {
    error: string;
  };
}
export interface IFetchEpicsListRequestAction {
  readonly type: ActionTypeKeys.FETCH_EPICS_LIST_REQUEST;
}

export interface IFetchEpicsListSuccessAction {
  readonly type: ActionTypeKeys.FETCH_EPICS_LIST_SUCCESS;
  readonly payload: {
    data: IEpic[];
  };
}

export interface IFetchEpicsListFailureAction {
  readonly type: ActionTypeKeys.FETCH_EPICS_LIST_FAILURE;
  readonly payload: {
    error: string;
  };
}

// Action creators

export function resetEpic(): IResetEpic {
  return {
    type: ActionTypeKeys.RESET_BOARD,
  };
}

export function fetchEpicRequest(): IFetchEpicRequestAction {
  return {
    type: ActionTypeKeys.FETCH_EPIC_REQUEST,
  };
}

export function fetchEpicSuccess(res: IEpic): IFetchEpicSuccessAction {
  return {
    type: ActionTypeKeys.FETCH_EPIC_SUCCESS,
    payload: {
      data: res,
    },
  };
}

export function fetchEpicFailure(error): IFetchEpicFailureAction {
  return {
    type: ActionTypeKeys.FETCH_EPIC_FAILURE,
    payload: { error },
  };
}

export function fetchEpicsListRequest(): IFetchEpicsListRequestAction {
  return {
    type: ActionTypeKeys.FETCH_EPICS_LIST_REQUEST,
  };
}

export function fetchEpicsListSuccess(res: IEpic[]): IFetchEpicsListSuccessAction {
  return {
    type: ActionTypeKeys.FETCH_EPICS_LIST_SUCCESS,
    payload: {
      data: res,
    },
  };
}

export function fetchEpicsListFailure(error): IFetchEpicsListFailureAction {
  return {
    type: ActionTypeKeys.FETCH_EPICS_LIST_FAILURE,
    payload: { error },
  };
}

// Action thunks

export function fetchEpicsList(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchEpicsListRequest());

    return ApiService.get(`/board/${boardId}/epics`)
      .then(res => {
        dispatch(fetchEpicsListSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchEpicFailure(errorMessage));
        throw error;
      });
  };
}

export function fetchEpic(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchEpicRequest());

    return ApiService.get(`/board/${boardId}`)
      .then(res => {
        dispatch(fetchEpicSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchEpicFailure(errorMessage));
        throw error;
      });
  };
}

export function createEpic(boardId: number, epicData) {
  return (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchEpicRequest());

    return ApiService.post(`/board/${boardId}/epics`, { data: epicData })
      .then(res => {
        dispatch(fetchEpicSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchEpicFailure(errorMessage));
        throw error;
      });
  };
}

export function deleteEpic(epicId: number) {
  return (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchEpicRequest());

    return ApiService.del(`/epic/${epicId}`)
      .then(res => {
        dispatch(fetchEpicSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchEpicFailure(errorMessage));
        throw error;
      });
  };
}

export function createSprint(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchEpicRequest());

    const data = {
      name: 'New Sprint',
      capacity: 10,
    };

    return ApiService.post(`/board/${boardId}/sprints`, { data })
      .then(res => {
        dispatch(fetchEpicSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchEpicFailure(errorMessage));
        throw error;
      });
  };
}

export function updateSprint(boardId: number, sprint: ISprint) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchEpicRequest());
    const { id: sprintId } = sprint;
    const data = sprint;

    return ApiService.put(`/board/${boardId}/sprint/${sprintId}`, { data })
      .then(res => {
        dispatch(fetchEpicSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchEpicFailure(errorMessage));
        throw error;
      });
  };
}

export function deleteSprint(boardId: number, sprintId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchEpicRequest());

    return ApiService.del(`/board/${boardId}/sprint/${sprintId}`)
      .then(res => {
        dispatch(fetchEpicSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchEpicFailure(errorMessage));
        throw error;
      });
  };
}

export function createTicket(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchEpicRequest());

    const data = {
      description: 'New Ticket',
      weight: 2,
    };

    return ApiService.post(`/board/${boardId}/tickets`, { data })
      .then(res => {
        dispatch(fetchEpicSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchEpicFailure(errorMessage));
        throw error;
      });
  };
}

export function deleteTicket(boardId: number, ticketId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchEpicRequest());

    return ApiService.del(`/board/${boardId}/ticket/${ticketId}`)
      .then(res => {
        dispatch(fetchEpicSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchEpicFailure(errorMessage));
        throw error;
      });
  };
}

// Interface of actions

export interface IEpicActions extends ActionCreatorsMapObject<any> {
  fetchEpic: typeof fetchEpic;
  fetchEpicsList: typeof fetchEpicsList;
  createEpic: typeof createEpic;
  deleteEpic: typeof deleteEpic;
  createSprint: typeof createSprint;
  updateSprint: typeof updateSprint;
  deleteSprint: typeof deleteSprint;
  createTicket: typeof createTicket;
  deleteTicket: typeof deleteTicket;
  resetEpic: typeof resetEpic;
}

// Expose actions

export function getActions(): IEpicActions {
  return {
    fetchEpic,
    fetchEpicsList,
    createEpic,
    deleteEpic,
    createSprint,
    updateSprint,
    deleteSprint,
    createTicket,
    deleteTicket,
    resetEpic,
  };
}

// Union of all action types

export type ActionTypes =
  | IResetEpic
  | IFetchEpicRequestAction
  | IFetchEpicFailureAction
  | IFetchEpicSuccessAction
  | IFetchEpicsListRequestAction
  | IFetchEpicsListFailureAction
  | IFetchEpicsListSuccessAction
  | IEmptyAction;
