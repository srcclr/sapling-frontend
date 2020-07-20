import _ from 'lodash';
import { Actions } from 'actions/actionTypes';
import { IBoardState } from '../store/IStoreState';
import produce from 'immer';
import { asyncActionReducer, asyncActionReducerById } from 'utils/Helpers';
import { addDependency, deleteDependency } from 'types/utility';

const initialState = {
  data: {},
  clients: [],
  isSolving: false,
  isInitialLoad: true,
  isFetching: false,
  isUpdatingBoard: false,
  isAddingDependency: false,
  isDeletingDependency: false,
  isExportingCsv: false,
  isCreatingSprint: false,
  isUploadingCsv: false,
  sprintAsyncCallStateById: {
    // Tracks isLoading, isSuccess, isFailure status by sprint id
    // for example, 4: { isSuccess: false, isLoading: true, isFailure: false}
    // Affords us some fanciness
  },
  storyAsyncCallStateById: {
    // Tracks isLoading, isSuccess, isFailure status by sprint id
    // for example, 4: { isSuccess: false, isLoading: true, isFailure: false}
    // Affords us some fanciness
  },
};

const boardState = (state: IBoardState = initialState, action: Actions) =>
  produce(state, draft => {
    switch (action.type) {
      case 'UPDATE_BOARD_IS_INITIAL_LOAD': {
        const { payload } = action;
        const { isInitialLoad: newIsInitialLoad } = payload;
        draft.isInitialLoad = newIsInitialLoad;
        return;
      }
      case 'OPENED_BOARD': {
        asyncActionReducer(draft, action, ['isFetching'], () => {
          const { board, clients } = action.payload.success;
          draft.data = board;
          draft.clients = clients;
          draft.isInitialLoad = false;
        });
        return;
      }
      case 'SOLVE': {
        asyncActionReducer(draft, action, ['isSolving'], () => {
          const { data } = action.payload.success;
          draft.data = data;
        });
        return;
      }
      case 'FETCH_BOARD': {
        draft.data = action.payload;
        return;
      }
      case 'DELETE_BOARD': {
        asyncActionReducer(draft, action, ['isDeleting'], () => {
          const { data } = action.payload.success;
          draft.data = data;
        });
        return;
      }
      case 'CREATE_SPRINT': {
        asyncActionReducer(draft, action, ['isCreatingSprint']);
        return;
      }
      case 'DELETE_SPRINT': {
        return;
      }
      case 'UPDATE_SPRINT': {
        return;
      }
      case 'CREATE_STORY': {
        asyncActionReducer(draft, action, ['isCreatingStory']);
        return;
      }
      case 'UPDATE_STORY': {
        return;
      }
      case 'ADD_DEPENDENCY': {
        return;
      }
      case 'DELETE_DEPENDENCY': {
        return;
      }
      case 'DELETE_STORY': {
        return;
      }
      case 'UPLOAD_CSV': {
        asyncActionReducer(draft, action, ['isUploadingCsv']);
        return;
      }
      default:
        return state;
    }
  });

export default boardState;
