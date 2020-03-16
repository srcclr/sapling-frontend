import _ from 'lodash';
import { ActionTypeKeys, LoginActionTypes } from 'actions/login';
import { ILoginState } from 'store/IStoreState';
import produce from 'immer';

const initialState = {
  isLoggingIn: false,
  errorMessage: '',
};

const loginState = (state: ILoginState = initialState, action: LoginActionTypes) =>
  produce(state, draft => {
    // let newState;
    // let payload;

    switch (action.type) {
      case ActionTypeKeys.LOGIN_REQUEST: {
        const { isLoggingIn = true } = action.payload;
        draft.isLoggingIn = isLoggingIn;
        draft.errorMessage = '';
        return;
      }
      case ActionTypeKeys.LOGIN_FAILURE: {
        const { errorMessage } = action.payload;
        draft.errorMessage = errorMessage;
        draft.isLoggingIn = false;

        return;
      }
      default:
        return state;
    }
  });

export default loginState;
