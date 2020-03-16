import { Action, ActionCreatorsMapObject } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import _ from 'lodash';

import IStoreState from 'store/IStoreState';
import { ILoginParams } from 'types';
import { IEmptyAction } from 'actions/sharedActions';
import ApiService from 'utils/ApiService';
import config from 'utils/config';
import AuthService from 'utils/AuthService';

// Declare an enum of Action type constants

export enum ActionTypeKeys {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT_REQUEST = 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE = 'LOGOUT_FAILURE',
}

// Payload interfaces

// Action interfaces

export interface ILoginRequestAction {
  readonly type: ActionTypeKeys.LOGIN_REQUEST;
  readonly payload?: {
    isLoggingIn?: boolean;
  };
}

export interface ILogoutRequestAction {
  readonly type: ActionTypeKeys.LOGOUT_REQUEST;
}

export interface ILoginFailureAction {
  readonly type: ActionTypeKeys.LOGIN_FAILURE;
  readonly payload: {
    errorMessage: string;
  };
}

// Action creators

export function logoutRequest(): ILogoutRequestAction {
  return {
    type: ActionTypeKeys.LOGOUT_REQUEST,
  };
}

export function loginRequest(isLoggingIn?: boolean): ILoginRequestAction {
  return {
    type: ActionTypeKeys.LOGIN_REQUEST,
    payload: {
      isLoggingIn,
    },
  };
}

export function loginFailure(error: any): ILoginFailureAction {
  return {
    type: ActionTypeKeys.LOGIN_FAILURE,
    payload: {
      errorMessage: error.message || 'An error has occurred while logging you in, please try again',
    },
  };
}

// Action thunks

// We are performing two login requests first to platform api then to research-backend

export const loginWithUsername = params => dispatch => {
  const endpoint = `${config.API_URL}/login`;
  dispatch(loginRequest(true));

  return ApiService.post(endpoint, { data: params })
    .then(
      res => {
        const { header } = res;
        const { ['access_token']: authToken } = header;
        // console.log(authToken);
        if (authToken) {
          // if (window && window.location && window.location.search) {
          //   window.location = `/login#session=${authToken}` as any;
          // } else {
          //   window.location = `/login#session=${authToken}` as any;
          //   window.location.reload();
          // }

          AuthService.setAuthToken(authToken);
          window.location = `/boards` as any;
        }
      },
      error => {
        dispatch(loginFailure(error));
        return { isLoginSuccessful: false };
      }
    )
    .catch(error => {
      dispatch(loginFailure(error));
      return { isLoginSuccessful: false };
    });
};

// A hackery
export type MyThunkResult<T> = ThunkAction<T, IStoreState, void, Action>;

export function loginTokenSwap(sessionToken: string, history) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>, getState) => {
    const redirectPath = '/entries';

    const params = {
      authToken: sessionToken,
    };

    const headerProps = {
      type: 'application/json',
    };

    dispatch(loginRequest(true));

    AuthService.setAuthToken();
    return ApiService.post('/login', { data: params, headers: headerProps })
      .then(res => {
        const { header } = res;
        const { ['x-auth-token']: researchAuthToken } = header;
        AuthService.setAuthToken(researchAuthToken);
        dispatch(loginRequest(false));
        window.location = redirectPath as any;
        window.location.reload();
      })
      .catch(error => {
        dispatch(loginRequest(false));
        dispatch(loginFailure(error));
        return {};
      });
  };
}

export function logout() {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    return AuthService.logout();
  };
}

// Interface of actions

export interface ILoginActions extends ActionCreatorsMapObject<any> {
  loginWithUsername: typeof loginWithUsername;
  logout: typeof logout;
}

// Expose actions

export function getActions(): ILoginActions {
  return {
    loginWithUsername,
    loginTokenSwap,
    logout,
  };
}

// Union of all action types

export type LoginActionTypes = ILoginRequestAction | ILoginFailureAction | IEmptyAction;
