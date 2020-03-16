import _ from 'lodash';
import { ActionTypeKeys, ActionTypes } from 'actions/myActions';
import { IMyState } from 'store/IStoreState';
import produce from 'immer';

const initialState = {
  email: '',
  firstName: '',
  id: null,
  lastName: '',
  orgSlug: '',
  researcher: false,
  roles: [],
  username: '',
  fetchResolved: false,
  isFetchingMe: false,
};

const myState = (state: IMyState = initialState, action: ActionTypes) =>
  produce(state, draft => {
    switch (action.type) {
      case ActionTypeKeys.UPDATE_ME: {
        const {
          email,
          firstName,
          id,
          lastName,
          orgSlug,
          researcher,
          roles,
          username,
        } = action.payload;

        draft.email = email;
        draft.firstName = firstName;
        draft.lastName = lastName;
        draft.orgSlug = orgSlug;
        draft.researcher = researcher;
        draft.roles = roles;
        draft.username = username;
        draft.id = id;
        draft.fetchResolved = true;
        draft.isFetchingMe = false;
        return;
      }
      case ActionTypeKeys.UPDATE_FETCH_ME_REQUEST: {
        draft.isFetchingMe = true;
        return;
      }
      case ActionTypeKeys.UPDATE_FETCH_ME_FAILURE: {
        draft.isFetchingMe = false;
        draft.fetchResolved = true;
        return;
      }
      default:
        return state;
    }
  });

export default myState;
