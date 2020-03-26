import { Action, ActionCreatorsMapObject } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import IStoreState from 'store/IStoreState';
import { updateMe, fetchMe } from 'actions/myActions';

export function checkUserStatus(history) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    const { location } = history;
    const { pathname, search } = location;
    const hash = window && window.location && window.location.hash;
    const publicPathnames = ['/login', '/signup'];

    // Perform a fetch of user profile to check if logged in
    dispatch(fetchMe())
      .then(res => {
        const { data } = res;
        const { id } = data;
        const isLoggedIn = !!id;

        // If you have researcher role you are logged in
        if (isLoggedIn) {
          dispatch(updateMe(data));

          // If a logged-in user is trying to access /login, redirect to /boards
          if (pathname.indexOf('/login') !== -1) {
            history.replace(`/boards`);
          } else {
            history.replace(`${pathname}${search}`);
          }
        } else {
          history.push('/login');
        }
      })
      .catch(() => {
        if (publicPathnames.includes(pathname)) {
          history.push(pathname);
        } else {
          history.push('/login');
        }
      });
  };
}
