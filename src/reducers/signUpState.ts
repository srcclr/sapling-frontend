import _ from 'lodash';
import { Actions } from 'actions/actionTypes';
import { ISignUpState } from '../store/IStoreState';
import produce from 'immer';
import { asyncActionReducer } from 'utils/Helpers';
const initialState = {
  isSigningUp: false,
  error: {},
};

const signupState = (state: ISignUpState = initialState, action: Actions) =>
  produce(state, draft => {
    switch (action.type) {
      case 'SIGN_UP': {
        asyncActionReducer(draft, action, ['isSigningUp']);
        return;
      }
      default:
        return state;
    }
  });

export default signupState;
