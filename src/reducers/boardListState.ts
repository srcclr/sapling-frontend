import _ from 'lodash';
import { ActionTypes, ActionTypeKeys } from 'actions/boardActions';
import { IBoardListState } from 'store/IStoreState';
import produce from 'immer';

const initialState = {
  isFetchingBoardList: false,
  data: [],
  errorMessage: '',
};

const boardListState = (state: IBoardListState = initialState, action: ActionTypes) =>
  produce(state, draft => {
    let payload;
    switch (action.type) {
      case ActionTypeKeys.RESET_BOARD: {
        draft.data = [];
        draft.isFetchingBoardList = false;
        return;
      }
      case ActionTypeKeys.FETCH_BOARD_LIST_REQUEST: {
        draft.isFetchingBoardList = true;
        return;
      }
      case ActionTypeKeys.FETCH_BOARD_LIST_SUCCESS: {
        payload = action.payload;
        const { data } = payload;
        draft.errorMessage = '';
        draft.data = data || {};
        draft.isFetchingBoardList = false;
        return;
      }
      case ActionTypeKeys.FETCH_BOARD_LIST_FAILURE: {
        draft.errorMessage = '';
        draft.isFetchingBoardList = false;
        return;
      }
      default:
        return state;
    }
  });

export default boardListState;
