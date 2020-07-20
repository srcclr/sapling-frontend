import _ from 'lodash';
import { Actions } from 'actions/actionTypes';
import { IEpicsListState } from '../store/IStoreState';
import produce from 'immer';
import { asyncActionReducer, asyncActionReducerById } from 'utils/Helpers';

const initialState = {
  isFetchingEpicsList: false,
  isCreatingEpic: false,
  data: [],
  errorMessage: '',
  epicAsyncCallStateById: {},
};

const epicsListState = (state: IEpicsListState = initialState, action: Actions) =>
  produce(state, draft => {
    switch (action.type) {
      case 'CREATE_EPIC': {
        asyncActionReducer(draft, action, ['isCreatingEpic'], () => {
          const { data: newEpic } = action.payload.success;
          draft.data = [...draft.data, newEpic];
        });
        return;
      }
      case 'DELETE_EPIC': {
        const { data } = action.payload.request;
        const { epicId } = data;
        asyncActionReducerById(draft, action, epicId, ['epicAsyncCallStateById'], () => {
          draft.data = draft.data && draft.data.filter(epic => epic.id !== epicId);
        });
        return;
      }
      default:
        return state;
    }
  });

export default epicsListState;
