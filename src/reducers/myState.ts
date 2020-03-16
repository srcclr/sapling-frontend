import _ from 'lodash';
import { IMyState } from '../store/IStoreState';
import produce from 'immer';
import { Actions } from 'actions/actionTypes';

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

const myState = (state: IMyState = initialState, action: Actions) =>
  produce(state, draft => {
    switch (action.type) {
      case 'UPDATE_ME': {
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
      default:
        return state;
    }
  });

export default myState;
