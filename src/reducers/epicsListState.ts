import _ from 'lodash';
import { ActionTypes, ActionTypeKeys } from 'actions/epicsActions';
import { IEpicsListState } from 'store/IStoreState';
import produce from 'immer';

const initialState = {
  isFetchingEpicsList: false,
  data: [],
  errorMessage: '',
};

const epicsListState = (state: IEpicsListState = initialState, action: ActionTypes) =>
  produce(state, draft => {
    let payload;
    switch (action.type) {
      case ActionTypeKeys.RESET_BOARD: {
        draft.data = [];
        draft.isFetchingEpicsList = false;
        return;
      }
      case ActionTypeKeys.FETCH_EPICS_LIST_REQUEST: {
        draft.isFetchingEpicsList = true;
        return;
      }
      case ActionTypeKeys.FETCH_EPICS_LIST_SUCCESS: {
        payload = action.payload;
        const { data } = payload;
        draft.errorMessage = '';
        draft.data = data || {};
        draft.isFetchingEpicsList = false;
        return;
      }
      case ActionTypeKeys.FETCH_EPICS_LIST_FAILURE: {
        draft.errorMessage = '';
        draft.isFetchingEpicsList = false;
        return;
      }
      default:
        return state;
    }
  });

export default epicsListState;
