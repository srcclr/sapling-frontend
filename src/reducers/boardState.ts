import _ from 'lodash';
import { ActionTypes, ActionTypeKeys } from 'actions/boardActions';
import { IBoardState } from 'store/IStoreState';
import produce from 'immer';
import {
  mutateTicket,
  deleteTicket,
  mutateSprint,
  deleteSprint,
  deleteDependency,
  addDependency,
} from 'types/utility';

const initialState = {
  isFetchingBoard: false,
  isUpdatingBoard: false,
  data: { sprints: [], unassigned: [] },
  errorMessage: '',
  shownDependencies: [],
  dependant: null,
  isAddingDependency: false,
};

const boardState = (state: IBoardState = initialState, action: ActionTypes) =>
  produce(state, draft => {
    let payload;
    switch (action.type) {
      case ActionTypeKeys.RESET_BOARD: {
        draft.data = {};
        draft.isFetchingBoard = false;
        return;
      }
      case ActionTypeKeys.DELETE_TICKET: {
        deleteTicket(draft.data, action.payload.id);
        draft.isFetchingBoard = false;
        return;
      }
      case ActionTypeKeys.DELETE_SPRINT: {
        deleteSprint(draft.data, action.payload.id);
        draft.isFetchingBoard = false;
        return;
      }
      case ActionTypeKeys.DELETE_DEPENDENCY: {
        deleteDependency(draft.data, action.payload.from, action.payload.to);
        draft.isUpdatingBoard = false;
        return;
      }
      case ActionTypeKeys.ADD_DEPENDENCY_START: {
        draft.isAddingDependency = !action.payload.cancel;
        return;
      }
      case ActionTypeKeys.ADD_DEPENDENCY_FIRST: {
        draft.dependant = action.payload.id;
        return;
      }
      case ActionTypeKeys.ADD_DEPENDENCY_SECOND: {
        draft.isAddingDependency = false;
        draft.dependant = null;
        addDependency(draft.data, action.payload.from, action.payload.to);
        return;
      }
      case ActionTypeKeys.SHOW_DEPENDENCIES: {
        draft.shownDependencies = action.payload.data;
        return;
      }
      case ActionTypeKeys.UPDATE_BOARD_REQUEST: {
        draft.isUpdatingBoard = true;
        return;
      }
      case ActionTypeKeys.FETCH_BOARD_REQUEST: {
        draft.isFetchingBoard = true;
        return;
      }
      case ActionTypeKeys.FETCH_BOARD_SUCCESS: {
        payload = action.payload;
        const { data } = payload;
        draft.errorMessage = '';
        draft.data = data || {};
        draft.isFetchingBoard = false;
        draft.isUpdatingBoard = false;
        return;
      }
      case ActionTypeKeys.FETCH_BOARD_FAILURE: {
        draft.errorMessage = '';
        draft.isFetchingBoard = false;
        return;
      }
      case ActionTypeKeys.ADD_NEW_TICKET_REQUEST: {
        draft.isUpdatingBoard = true;
        return;
      }
      case ActionTypeKeys.ADD_NEW_TICKET_SUCCESS: {
        payload = action.payload;
        const { data } = payload;
        draft.errorMessage = '';
        draft.data.unassigned = [...draft.data.unassigned, data];
        draft.isFetchingBoard = false;
        draft.isUpdatingBoard = false;
        return;
      }
      case ActionTypeKeys.ADD_NEW_TICKET_FAILURE: {
        draft.errorMessage = '';
        draft.isFetchingBoard = false;
        return;
      }
      case ActionTypeKeys.ADD_NEW_SPRINT_REQUEST: {
        draft.isUpdatingBoard = true;
        return;
      }
      case ActionTypeKeys.ADD_NEW_SPRINT_SUCCESS: {
        payload = action.payload;
        const { data } = payload;
        draft.errorMessage = '';
        draft.data.sprints = [...draft.data.sprints, data];
        draft.isFetchingBoard = false;
        draft.isUpdatingBoard = false;
        return;
      }
      case ActionTypeKeys.ADD_NEW_SPRINT_FAILURE: {
        draft.errorMessage = '';
        draft.isFetchingBoard = false;
        return;
      }
      case ActionTypeKeys.UPDATE_TICKET_REQUEST: {
        draft.isUpdatingBoard = true;
        return;
      }
      case ActionTypeKeys.UPDATE_TICKET_SUCCESS: {
        draft.isFetchingBoard = false;
        draft.isUpdatingBoard = false;
        let ticket = action.payload.data;
        let board = draft.data;
        mutateTicket(board, ticket);
        return;
      }
      case ActionTypeKeys.UPDATE_TICKET_FAILURE: {
        draft.errorMessage = '';
        draft.isUpdatingBoard = false;
        return;
      }
      case ActionTypeKeys.UPDATE_SPRINT_SUCCESS: {
        draft.isFetchingBoard = false;
        draft.isUpdatingBoard = false;
        let sprint = action.payload.data;
        let board = draft.data;
        mutateSprint(board, sprint);
        return;
      }
      case ActionTypeKeys.UPDATE_BOARD_SUCCESS: {
        draft.errorMessage = '';
        draft.isUpdatingBoard = false;
        return;
      }
      case ActionTypeKeys.UPDATE_BOARD_FAILURE: {
        draft.errorMessage = '';
        draft.isUpdatingBoard = false;
        return;
      }
      case ActionTypeKeys.EXPORT_CSV_REQUEST: {
        draft.errorMessage = '';
        draft.isExportingCsv = true;
        return;
      }
      case ActionTypeKeys.EXPORT_CSV_SUCCESS: {
        draft.errorMessage = '';
        draft.isExportingCsv = false;
        return;
      }
      case ActionTypeKeys.EXPORT_CSV_FAILURE: {
        const { error } = action.payload;
        draft.errorMessage = error;
        draft.isExportingCsv = false;
        return;
      }
      default:
        return state;
    }
  });

export default boardState;
