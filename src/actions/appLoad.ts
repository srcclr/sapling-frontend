import { Action, ActionCreatorsMapObject } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import AuthService from 'utils/AuthService';
import IStoreState from 'store/IStoreState';
import { SESSION_ID_HASH_RE } from 'constants/index';
import { IEmptyAction } from 'actions/sharedActions';

import { getActions as getMyActions } from 'actions/myActions';

const myActions = getMyActions();

export function checkUserStatus(history) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    const { location } = history;
    const { pathname, search } = location;
    const hash = window && window.location && window.location.hash;

    const hashMatch = SESSION_ID_HASH_RE.exec(hash);
    // Perform a fetch of user profile to check if logged in
    dispatch(myActions.fetchMe()).then(res => {
      const { id } = res;
      const isLoggedIn = !!id;

      // If you have researcher role you are logged in
      if (isLoggedIn) {
        dispatch(myActions.updateMe(res));

        // If a logged-in user is trying to access /login, redirect to /entries
        if (pathname.indexOf('/login') !== -1) {
          history.replace(`/boards`);
        } else {
          history.replace(`${pathname}${search}`);
        }
      } else if (hashMatch && hashMatch.length) {
        // You're not logged in but a hash exists indicating attempt to login
        const sessionToken = hashMatch[1] || '';
        AuthService.setAuthToken(sessionToken);
        history.replace(`/boards`);
      } else {
        history.push('/login');
      }
    });
  };
}

// Interface of actions

export interface IAppLoadActions extends ActionCreatorsMapObject<any> {
  checkUserStatus: typeof checkUserStatus;
}

// Expose actions

export function getActions(): IAppLoadActions {
  return {
    checkUserStatus,
  };
}

// Union of all action types

export type AppLoadActionTypes = IAppLoadActions | IEmptyAction;
