import _ from 'lodash';
import { Actions } from 'actions/actionTypes';
import { IBoardListState } from '../store/IStoreState';
import produce from 'immer';
import { asyncActionReducer } from 'utils/Helpers';
const initialState = {
  data: [],
  isFetching: false,
  isCreating: false,
  errorMessage: '',
};

const boardListState = (state: IBoardListState = initialState, action: Actions) =>
  produce(state, draft => {
    switch (action.type) {
      case 'FETCH_BOARD_LIST': {
        const { data } = action.payload.success;
        draft.data = data;
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
