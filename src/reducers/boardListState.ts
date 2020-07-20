import _ from 'lodash';
import { Actions } from 'actions/actionTypes';
import { IBoardListState } from '../store/IStoreState';
import produce from 'immer';
import { asyncActionReducer } from 'utils/Helpers';
const initialState = {
  data: [],
  isInitialLoad: true,
  isFetching: false,
  isCreating: false,
  errorMessage: '',
};

const boardListState = (state: IBoardListState = initialState, action: Actions) =>
  produce(state, draft => {
    switch (action.type) {
      case 'UPDATE_BOARD_LIST_IS_INITIAL_LOAD': {
        const { payload } = action;
        const { isInitialLoad: newIsInitialLoad } = payload;
        draft.isInitialLoad = newIsInitialLoad;
        return;
      }
      case 'FETCH_BOARD_LIST': {
        const { data } = action.payload.success;
        draft.data = data;
        return;
      }
      case 'OPENED_BOARD_LIST': {
        asyncActionReducer(draft, action, ['isFetching'], () => {
          const { payload } = action;
          const { success } = payload;
          const { boards } = success;
          draft.data = boards;
          draft.isInitialLoad = false;
        });
        return;
      }
      case 'CREATE_BOARD': {
        asyncActionReducer(draft, action, ['isCreating']);
        return;
      }
      default:
        return state;
    }
  });

export default boardListState;
