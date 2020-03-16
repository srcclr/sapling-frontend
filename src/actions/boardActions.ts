import { IEmptyAction } from 'actions/sharedActions';
import { Action, ActionCreatorsMapObject } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import IStoreState from 'store/IStoreState';
import ApiService from 'utils/ApiService';
import { IBoard, ISprint, ITicket } from 'types';
import { startCSVDownload } from 'utils/Helpers';

// Declare an enum of Action type constants

export enum ActionTypeKeys {
  DELETE_DEPENDENCY = 'DELETE_DEPENDENCY',
  SHOW_DEPENDENCIES = 'SHOW_DEPENDENCIES',
  UPDATE_SPRINT_SUCCESS = 'UPDATE_SPRINT_SUCCESS',
  ADD_DEPENDENCY_START = 'ADD_DEPENDENCY_START',
  ADD_DEPENDENCY_FIRST = 'ADD_DEPENDENCY_FIRST',
  ADD_DEPENDENCY_SECOND = 'ADD_DEPENDENCY_SECOND',
  DELETE_TICKET = 'DELETE_TICKET',
  DELETE_SPRINT = 'DELETE_SPRINT',
  UPDATE_BOARD_REQUEST = 'UPDATE_BOARD_REQUEST',
  UPDATE_BOARD_SUCCESS = 'UPDATE_BOARD_SUCCESS',
  UPDATE_BOARD_FAILURE = 'UPDATE_BOARD_FAILURE',
  ADD_NEW_TICKET_REQUEST = 'ADD_NEW_TICKET_REQUEST',
  ADD_NEW_TICKET_SUCCESS = 'ADD_NEW_TICKET_SUCCESS',
  ADD_NEW_TICKET_FAILURE = 'ADD_NEW_TICKET_FAILURE',
  UPDATE_TICKET_REQUEST = 'UPDATE_TICKET_REQUEST',
  UPDATE_TICKET_SUCCESS = 'UPDATE_TICKET_SUCCESS',
  UPDATE_TICKET_FAILURE = 'UPDATE_TICKET_FAILURE',
  ADD_NEW_SPRINT_REQUEST = 'ADD_NEW_SPRINT_REQUEST',
  ADD_NEW_SPRINT_SUCCESS = 'ADD_NEW_SPRINT_SUCCESS',
  ADD_NEW_SPRINT_FAILURE = 'ADD_NEW_SPRINT_FAILURE',
  FETCH_BOARD_REQUEST = 'FETCH_BOARD_REQUEST',
  FETCH_BOARD_SUCCESS = 'FETCH_BOARD_SUCCESS',
  FETCH_BOARD_FAILURE = 'FETCH_BOARD_FAILURE',
  FETCH_BOARD_LIST_REQUEST = 'FETCH_BOARD_LIST_REQUEST',
  FETCH_BOARD_LIST_SUCCESS = 'FETCH_BOARD_LIST_SUCCESS',
  FETCH_BOARD_LIST_FAILURE = 'FETCH_BOARD_LIST_FAILURE',
  EXPORT_CSV_REQUEST = 'EXPORT_CSV_REQUEST',
  EXPORT_CSV_SUCCESS = 'EXPORT_CSV_SUCCESS',
  EXPORT_CSV_FAILURE = 'EXPORT_CSV_FAILURE',
  RESET_BOARD = 'RESET_BOARD',
}

// Payload interfaces
// Action interfaces

export interface IResetBoard {
  readonly type: ActionTypeKeys.RESET_BOARD;
}

export interface IAddDependencyStart {
  readonly type: ActionTypeKeys.ADD_DEPENDENCY_START;
  readonly payload: {
    cancel: boolean;
  };
}

export interface IAddDependencyFirst {
  readonly type: ActionTypeKeys.ADD_DEPENDENCY_FIRST;
  readonly payload: {
    id: number;
  };
}

export interface IAddDependencySecond {
  readonly type: ActionTypeKeys.ADD_DEPENDENCY_SECOND;
  readonly payload: {
    from: number;
    to: number;
  };
}

export interface IDeleteTicket {
  readonly type: ActionTypeKeys.DELETE_TICKET;
  readonly payload: {
    id: number;
  };
}

export interface IDeleteDependency {
  readonly type: ActionTypeKeys.DELETE_DEPENDENCY;
  readonly payload: {
    from: number;
    to: number;
  };
}

export interface IDeleteSprint {
  readonly type: ActionTypeKeys.DELETE_SPRINT;
  readonly payload: {
    id: number;
  };
}

export interface IUpdateBoardRequestAction {
  readonly type: ActionTypeKeys.UPDATE_BOARD_REQUEST;
}

export interface IUpdateBoardSuccessAction {
  readonly type: ActionTypeKeys.UPDATE_BOARD_SUCCESS;
}

export interface IUpdateBoardFailureAction {
  readonly type: ActionTypeKeys.UPDATE_BOARD_FAILURE;
  readonly payload: {
    error: string;
  };
}
export interface IAddNewTicketRequestAction {
  readonly type: ActionTypeKeys.ADD_NEW_TICKET_REQUEST;
}

export interface IAddNewTicketSuccessAction {
  readonly type: ActionTypeKeys.ADD_NEW_TICKET_SUCCESS;
  readonly payload: {
    data: ITicket;
  };
}

export interface IAddNewTicketFailureAction {
  readonly type: ActionTypeKeys.ADD_NEW_TICKET_FAILURE;
  readonly payload: {
    error: string;
  };
}
export interface IUpdateTicketRequestAction {
  readonly type: ActionTypeKeys.UPDATE_TICKET_REQUEST;
}

export interface IUpdateTicketSuccessAction {
  readonly type: ActionTypeKeys.UPDATE_TICKET_SUCCESS;
  readonly payload: {
    data: ITicket;
  };
}

export interface IUpdateTicketFailureAction {
  readonly type: ActionTypeKeys.UPDATE_TICKET_FAILURE;
  readonly payload: {
    error: string;
  };
}

export interface IUpdateSprintSuccessAction {
  readonly type: ActionTypeKeys.UPDATE_SPRINT_SUCCESS;
  readonly payload: {
    data: ISprint;
  };
}

export interface IAddNewSprintRequestAction {
  readonly type: ActionTypeKeys.ADD_NEW_SPRINT_REQUEST;
}

export interface IAddNewSprintSuccessAction {
  readonly type: ActionTypeKeys.ADD_NEW_SPRINT_SUCCESS;
  readonly payload: {
    data: ITicket;
  };
}

export interface IShowDependenciesAction {
  readonly type: ActionTypeKeys.SHOW_DEPENDENCIES;
  readonly payload: {
    data: number[];
  };
}

export interface IAddNewSprintFailureAction {
  readonly type: ActionTypeKeys.ADD_NEW_SPRINT_FAILURE;
  readonly payload: {
    error: string;
  };
}
export interface IFetchBoardRequestAction {
  readonly type: ActionTypeKeys.FETCH_BOARD_REQUEST;
}

export interface IFetchBoardSuccessAction {
  readonly type: ActionTypeKeys.FETCH_BOARD_SUCCESS;
  readonly payload: {
    data: IBoard;
  };
}

export interface IFetchBoardFailureAction {
  readonly type: ActionTypeKeys.FETCH_BOARD_FAILURE;
  readonly payload: {
    error: string;
  };
}
export interface IFetchBoardListRequestAction {
  readonly type: ActionTypeKeys.FETCH_BOARD_LIST_REQUEST;
}

export interface IFetchBoardListSuccessAction {
  readonly type: ActionTypeKeys.FETCH_BOARD_LIST_SUCCESS;
  readonly payload: {
    data: IBoard[];
  };
}

export interface IFetchBoardListFailureAction {
  readonly type: ActionTypeKeys.FETCH_BOARD_LIST_FAILURE;
  readonly payload: {
    error: string;
  };
}

export interface IExportCsvRequestAction {
  readonly type: ActionTypeKeys.EXPORT_CSV_REQUEST;
}

export interface IExportCsvSuccessAction {
  readonly type: ActionTypeKeys.EXPORT_CSV_SUCCESS;
}

export interface IExportCsvFailureAction {
  readonly type: ActionTypeKeys.EXPORT_CSV_FAILURE;
}

// Action creators

export function resetBoard(): IResetBoard {
  return {
    type: ActionTypeKeys.RESET_BOARD,
  };
}

export function addDependencyStart(cancel): IAddDependencyStart {
  return {
    type: ActionTypeKeys.ADD_DEPENDENCY_START,
    payload: { cancel },
  };
}

export function deleteDependency(from, to): IDeleteDependency {
  return {
    type: ActionTypeKeys.DELETE_DEPENDENCY,
    payload: { from, to },
  };
}

export function addDependencyFirst(id: number): IAddDependencyFirst {
  return {
    type: ActionTypeKeys.ADD_DEPENDENCY_FIRST,
    payload: { id },
  };
}

export function addDependencySecond(from, to): IAddDependencySecond {
  return {
    type: ActionTypeKeys.ADD_DEPENDENCY_SECOND,
    payload: { from, to },
  };
}

export function updateBoardRequest(): IUpdateBoardRequestAction {
  return {
    type: ActionTypeKeys.UPDATE_BOARD_REQUEST,
  };
}

export function updateBoardSuccess(): IUpdateBoardSuccessAction {
  return {
    type: ActionTypeKeys.UPDATE_BOARD_SUCCESS,
  };
}

export function updateBoardFailure(error): IUpdateBoardFailureAction {
  return {
    type: ActionTypeKeys.UPDATE_BOARD_FAILURE,
    payload: { error },
  };
}

export function addNewTicketRequest(): IAddNewTicketRequestAction {
  return {
    type: ActionTypeKeys.ADD_NEW_TICKET_REQUEST,
  };
}

export function addNewTicketSuccess(res: IBoard): IAddNewTicketSuccessAction {
  return {
    type: ActionTypeKeys.ADD_NEW_TICKET_SUCCESS,
    payload: {
      data: res,
    },
  };
}

export function addNewTicketFailure(error): IAddNewTicketFailureAction {
  return {
    type: ActionTypeKeys.ADD_NEW_TICKET_FAILURE,
    payload: { error },
  };
}
export function updateTicketRequest(): IUpdateTicketRequestAction {
  return {
    type: ActionTypeKeys.UPDATE_TICKET_REQUEST,
  };
}

export function updateTicketSuccess(res: ITicket): IUpdateTicketSuccessAction {
  return {
    type: ActionTypeKeys.UPDATE_TICKET_SUCCESS,
    payload: {
      data: res,
    },
  };
}

export function updateSprintSuccess(res: ISprint): IUpdateSprintSuccessAction {
  return {
    type: ActionTypeKeys.UPDATE_SPRINT_SUCCESS,
    payload: {
      data: res,
    },
  };
}

export function updateTicketFailure(error): IUpdateTicketFailureAction {
  return {
    type: ActionTypeKeys.UPDATE_TICKET_FAILURE,
    payload: { error },
  };
}

export function updateBoardDeleteTicket(id): IDeleteTicket {
  return {
    type: ActionTypeKeys.DELETE_TICKET,
    payload: { id },
  };
}

export function updateBoardDeleteSprint(id): IDeleteSprint {
  return {
    type: ActionTypeKeys.DELETE_SPRINT,
    payload: { id },
  };
}

export function addNewSprintRequest(): IAddNewSprintRequestAction {
  return {
    type: ActionTypeKeys.ADD_NEW_SPRINT_REQUEST,
  };
}

export function addNewSprintSuccess(res: IBoard): IAddNewSprintSuccessAction {
  return {
    type: ActionTypeKeys.ADD_NEW_SPRINT_SUCCESS,
    payload: {
      data: res,
    },
  };
}

export function showDependencies1(deps: number[]): IShowDependenciesAction {
  return {
    type: ActionTypeKeys.SHOW_DEPENDENCIES,
    payload: {
      data: deps,
    },
  };
}

export function addNewSprintFailure(error): IAddNewSprintFailureAction {
  return {
    type: ActionTypeKeys.ADD_NEW_SPRINT_FAILURE,
    payload: { error },
  };
}

export function fetchBoardRequest(): IFetchBoardRequestAction {
  return {
    type: ActionTypeKeys.FETCH_BOARD_REQUEST,
  };
}

export function fetchBoardSuccess(res: IBoard): IFetchBoardSuccessAction {
  return {
    type: ActionTypeKeys.FETCH_BOARD_SUCCESS,
    payload: {
      data: res,
    },
  };
}

export function fetchBoardFailure(error): IFetchBoardFailureAction {
  return {
    type: ActionTypeKeys.FETCH_BOARD_FAILURE,
    payload: { error },
  };
}

export function fetchBoardListRequest(): IFetchBoardListRequestAction {
  return {
    type: ActionTypeKeys.FETCH_BOARD_LIST_REQUEST,
  };
}

export function fetchBoardListSuccess(res: IBoard[]): IFetchBoardListSuccessAction {
  return {
    type: ActionTypeKeys.FETCH_BOARD_LIST_SUCCESS,
    payload: {
      data: res,
    },
  };
}

export function fetchBoardListFailure(error): IFetchBoardListFailureAction {
  return {
    type: ActionTypeKeys.FETCH_BOARD_LIST_FAILURE,
    payload: { error },
  };
}

export function exportCsvRequest(): IExportCsvRequest {
  return {
    type: ActionTypeKeys.EXPORT_CSV_REQUEST,
  };
}

export function exportCsvSuccess(): IExportCsvSuccess {
  return {
    type: ActionTypeKeys.EXPORT_CSV_SUCCESS,
  };
}

export function exportCsvFailure(error): IExportCsvFailure {
  return {
    type: ActionTypeKeys.EXPORT_CSV_FAILURE,
    payload: {
      error,
    },
  };
}

// Action thunks

export function fetchBoardList() {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchBoardListRequest());

    return ApiService.get(`/boards`)
      .then(res => {
        dispatch(fetchBoardListSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchBoardFailure(errorMessage));
        throw error;
      });
  };
}

export function fetchBoard(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(fetchBoardRequest());

    return ApiService.get(`/board/${boardId}`)
      .then(res => {
        dispatch(fetchBoardSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchBoardFailure(errorMessage));
        throw error;
      });
  };
}

export function createBoard(boardName: string) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>, getState) => {
    const { myState } = getState();
    const { id } = myState;
    const data = {
      name: boardName,
      owner: id,
    };
    return ApiService.post(`/boards`, { data })
      .then(res => {
        dispatch(fetchBoardSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(fetchBoardFailure(errorMessage));
        throw error;
      });
  };
}

export function updateBoard(boardId: number, boardDetails: { name: string }) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>, getState) => {
    const { name } = boardDetails;
    const data = {
      name,
    };
    return ApiService.put(`/boards/${boardId}`, { data })
      .then(res => {
        dispatch(fetchBoardSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(updateBoardFailure(errorMessage));
        throw error;
      });
  };
}

export function solve(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>, getState) => {
    dispatch(updateBoardRequest());
    return ApiService.post(`/board/${boardId}`)
      .then(res => {
        dispatch(fetchBoardSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(updateBoardFailure(errorMessage));
        throw error;
      });
  };
}

export function deleteBoard(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>, getState) => {
    const { myState } = getState();
    const { id } = myState;

    return ApiService.del(`/board/${boardId}`)
      .then(res => {
        dispatch(fetchBoardSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(updateBoardFailure(errorMessage));
        throw error;
      });
  };
}

export function showDependencies(deps: number[]) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>, getState) => {
    dispatch(showDependencies1(deps));
  };
}

export function createSprint(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(addNewSprintRequest());

    const data = {
      name: 'New Sprint',
      capacity: 10,
    };

    return ApiService.post(`/board/${boardId}/sprints`, { data })
      .then(res => {
        dispatch(addNewSprintSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(addNewSprintFailure(errorMessage));
        throw error;
      });
  };
}

export function deleteDependency1(board, from, to) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(updateTicketRequest()); // shared with tickets
    return ApiService.del(`/board/${board}/dependencies`, {
      data: { fromTicketId: from, toTicketId: to },
    })
      .then(_ => {
        dispatch(deleteDependency(from, to));
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(updateTicketFailure(errorMessage)); // shared with tickets
        throw error;
      });
  };
}

export function startAddingDependencies() {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(addDependencyStart(false));
  };
}

export function addDependency1(ticketId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(addDependencyFirst(ticketId));
  };
}

export function addDependency2(boardId: number, fromTicketId: number, toTicketId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(updateBoardRequest());

    return ApiService.post(`/board/${boardId}/dependencies`, { data: { fromTicketId, toTicketId } })
      .then(res => {
        dispatch(updateBoardSuccess());
        dispatch(addDependencySecond(fromTicketId, toTicketId));
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(updateBoardFailure(errorMessage));
        throw error;
      });
  };
}

export function updateSprint(sprint: ISprint) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(updateTicketRequest()); // shared with tickets
    const { id: sprintId } = sprint;
    const data = sprint;

    return ApiService.put(`/sprint/${sprintId}`, { data })
      .then(_ => {
        dispatch(updateSprintSuccess(sprint));
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(updateTicketFailure(errorMessage)); // shared with tickets
        throw error;
      });
  };
}

export function updateTicket(boardId: number, ticket: ITicket) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    // TODO this shows the old state of the form while the request is pending the because our state hasn't been updated
    dispatch(updateTicketRequest());
    const { id: ticketId, epic, pin } = ticket;

    let changePin = () =>
      pin
        ? ApiService.post(`/board/${boardId}/pins`, { data: { ticketId, sprintId: pin } })
        : ApiService.del(`/board/${boardId}/pins`, { data: { ticketId } });

    return Promise.all([
      ApiService.put(`/ticket/${ticketId}`, { data: ticket }),
      ApiService.put(`/epic/${epic}/ticket/${ticketId}`),
      changePin(),
    ])
      .then(_ => {
        dispatch(updateTicketSuccess(ticket));
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(updateTicketFailure(errorMessage));
        throw error;
      });
  };
}

export function deleteSprint(sprintId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(updateBoardRequest());
    return ApiService.del(`/sprint/${sprintId}`)
      .then(_ => {
        dispatch(updateBoardSuccess());
        dispatch(updateBoardDeleteSprint(sprintId));
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(updateBoardFailure(errorMessage));
        throw error;
      });
  };
}

export function createTicket(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>, getState) => {
    dispatch(addNewTicketRequest());

    const { epicsListState } = getState() as IStoreState;
    const { data: epicListStateData } = epicsListState;
    const { id: epicId } = epicListStateData[0];

    const data = {
      description: 'New Story',
      weight: 2,
    };

    return ApiService.post(`/board/${boardId}/epic/${epicId}/tickets`, { data })
      .then(res => {
        dispatch(addNewTicketSuccess(res));
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(addNewTicketFailure(errorMessage));
        throw error;
      });
  };
}

export function deleteTicket(ticketId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(updateBoardRequest());

    return ApiService.del(`/ticket/${ticketId}`)
      .then(res => {
        dispatch(updateBoardSuccess());
        dispatch(updateBoardDeleteTicket(ticketId));
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(updateBoardFailure(errorMessage));
        throw error;
      });
  };
}

export function exportCsv(boardId: number) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(exportCsvRequest());

    return ApiService.get(`/board/${boardId}/csv`, { headers: { Accept: 'text/csv' } })
      .then(res => {
        const { text: csvText } = res;
        dispatch(exportCsvSuccess());
        startCSVDownload(`board-${boardId}`, csvText);
        return {
          success: true,
          data: res,
        };
      })
      .catch(error => {
        const errorMessage = error && error.message;
        dispatch(exportCsvFailure(errorMessage));
        throw error;
      });
  };
}

// Interface of actions
export type MyThunkResult<T> = ThunkAction<T, IStoreState, void, Action<T>> | Promise<T>;

export interface IBoardActions extends ActionCreatorsMapObject<any> {
  solve: typeof solve;
  exportCsv: typeof exportCsv;
  fetchBoard: typeof fetchBoard;
  fetchBoardList: typeof fetchBoardList;
  createBoard: typeof createBoard;
  addDependencyStart: typeof addDependencyStart;
  deleteDependency1: typeof deleteDependency1;
  showDependencies: typeof showDependencies;
  addDependency1: typeof addDependency1;
  addDependency2: typeof addDependency2;
  updateBoard: typeof updateBoard;
  deleteBoard: typeof deleteBoard;
  createSprint: typeof createSprint;
  updateTicket: typeof updateTicket;
  updateSprint: typeof updateSprint;
  deleteSprint: typeof deleteSprint;
  createTicket: typeof createTicket;
  deleteTicket: typeof deleteTicket;
  resetBoard: typeof resetBoard;
}

// Expose actions

export function getActions(): IBoardActions {
  return {
    solve,
    exportCsv,
    fetchBoard,
    fetchBoardList,
    createBoard,
    addDependencyStart,
    showDependencies,
    deleteDependency1,
    addDependency1,
    addDependency2,
    updateBoard,
    deleteBoard,
    createSprint,
    updateTicket,
    updateSprint,
    deleteSprint,
    createTicket,
    deleteTicket,
    resetBoard,
  };
}

// Union of all action types

export type ActionTypes =
  | IResetBoard
  | IDeleteTicket
  | IDeleteSprint
  | IDeleteDependency
  | IAddDependencyStart
  | IShowDependencies
  | IAddDependencyFirst
  | IAddDependencySecond
  | IUpdateBoardRequestAction
  | IUpdateBoardFailureAction
  | IUpdateBoardSuccessAction
  | IAddNewTicketRequestAction
  | IAddNewTicketFailureAction
  | IAddNewTicketSuccessAction
  | IUpdateTicketRequestAction
  | IUpdateTicketFailureAction
  | IUpdateTicketSuccessAction
  | IUpdateSprintSuccessAction
  | IAddNewSprintRequestAction
  | IAddNewSprintFailureAction
  | IAddNewSprintSuccessAction
  | IFetchBoardRequestAction
  | IFetchBoardFailureAction
  | IFetchBoardSuccessAction
  | IFetchBoardListRequestAction
  | IFetchBoardListFailureAction
  | IFetchBoardListSuccessAction
  | IExportCsvRequestAction
  | IExportCsvFailureAction
  | IExportCsvSuccessAction
  | IEmptyAction;
