import _ from 'lodash';
import { Actions } from 'actions/actionTypes';
import { IDependenciesViewState } from '../store/IStoreState';
import produce from 'immer';
import { asyncActionReducer } from 'utils/Helpers';

const initialState = {
  data: { deps: [], maxSprint: 0 },
  isFetching: true,
  errorMessage: '',
};

const boardListState = (state: IDependenciesViewState = initialState, action: Actions) =>
  produce(state, draft => {
    switch (action.type) {
      case 'FETCH_CROSS_BOARD_DEPENDENCIES': {
        asyncActionReducer(draft, action, ['isFetching'], () => {
          const { data } = action.payload.success;
          draft.data = data;
        });
        return;
      }
      default:
        return state;
    }
  });

export default boardListState;
