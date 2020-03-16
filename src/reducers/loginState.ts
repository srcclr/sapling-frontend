import _ from 'lodash';
import { Actions } from 'actions/actionTypes';
import { ILoginState } from '../store/IStoreState';
import produce from 'immer';
import { asyncActionReducer } from 'utils/Helpers';
const initialState = {
  isLoggingIn: false,
  error: {},
};

const loginState = (state: ILoginState = initialState, action: Actions) =>
  produce(state, draft => {
    switch (action.type) {
      case 'LOGIN_WITH_USERNAME': {
        asyncActionReducer(draft, action, ['isLoggingIn']);
        return;
      }
      default:
        return state;
    }
  });

export default loginState;
