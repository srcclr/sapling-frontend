import _ from 'lodash';
import { Actions } from 'actions/actionTypes';
import { IBoardState } from '../store/IStoreState';
import produce from 'immer';
import { asyncActionReducer, asyncActionReducerById } from 'utils/Helpers';
import { addDependency, deleteDependency } from 'types/utility';

const initialState = {
  data: {},
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
          const { board } = action.payload.success;
          draft.data = board;
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
        const { data } = action.payload.request;
        const { id } = data;
        asyncActionReducerById(draft, action, id, ['sprintAsyncCallStateById']);
        return;
      }
      case 'UPDATE_SPRINT': {
        const { data } = action.payload.request;
        const { sprint } = data;
        const { id } = sprint;
        asyncActionReducerById(draft, action, id, ['sprintAsyncCallStateById']);
        return;
      }
      case 'CREATE_STORY': {
        asyncActionReducer(draft, action, ['isCreatingStory']);
        return;
      }
      case 'UPDATE_STORY': {
        const { data } = action.payload.request;
        const { story } = data;

        const { id: storyId } = story;
        asyncActionReducerById(draft, action, storyId, ['storyAsyncCallStateById']);
        return;
      }
      case 'ADD_DEPENDENCY': {
        const { data } = action.payload.request;
        const { fromStoryId, toStoryId } = data;
        asyncActionReducer(draft, action, ['isAddingDependency'], () => {
          addDependency(draft.data, fromStoryId, toStoryId);
        });
        return;
      }
      case 'DELETE_DEPENDENCY': {
        const { data } = action.payload.request;
        const { fromStoryId, toStoryId } = data;
        asyncActionReducer(draft, action, ['isDeletingDependency'], () => {
          deleteDependency(draft.data, fromStoryId, toStoryId);
        });
        return;
      }
      case 'DELETE_STORY': {
        const { data } = action.payload.request;
        const { storyId, sprintId } = data;

        asyncActionReducerById(draft, action, storyId, ['sprintAsyncCallStateById'], () => {
          if (!sprintId) {
            draft.data.unassigned = draft.data.unassigned.filter(story => story.id !== storyId);
          } else {
            const i = draft.data.sprints.findIndex(sprint => sprint.id === sprintId);

            if (i >= 0) {
              draft.data.sprints[i].tickets = draft.data.sprints[i].tickets.filter(
                story => story.id !== storyId
              );
            }
          }
        });
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
