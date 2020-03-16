import { Action, ActionCreatorsMapObject } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import _ from 'lodash';

import IStoreState from 'store/IStoreState';
import { IEmptyAction } from 'actions/sharedActions';
import ApiService from 'utils/ApiService';
import config from 'utils/config';

// Declare an enum of Action type constants

export enum ActionTypeKeys {
  UPDATE_IS_LOGGED_IN = 'UPDATE_IS_LOGGED_IN',
  UPDATE_ME = 'UPDATE_ME',
  UPDATE_FETCH_ME_REQUEST = 'UPDATE_FETCH_ME_REQUEST',
  UPDATE_FETCH_ME_FAILURE = 'UPDATE_FETCH_ME_FAILURE',
}

// Payload interfaces

interface IMyPayload {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  orgSlug: string;
  researcher: boolean;
  roles: string[];
  username: string;
}

// Action interfaces

export interface IUpdateFetchMeRequestAction {
  readonly type: ActionTypeKeys.UPDATE_FETCH_ME_REQUEST;
}

export interface IUpdateFetchMeFailureAction {
  readonly type: ActionTypeKeys.UPDATE_FETCH_ME_FAILURE;
  readonly payload: {
    error: string;
  };
}

export interface IUpdateIsLoggedInAction {
  readonly type: ActionTypeKeys.UPDATE_IS_LOGGED_IN;
  readonly payload: {
    isLoggedIn: boolean;
  };
}

export interface IUpdateMeAction {
  readonly type: ActionTypeKeys.UPDATE_ME;
  readonly payload: IMyPayload;
}

// Action creators

export function updateMe(data: IMyPayload): IUpdateMeAction {
  return {
    type: ActionTypeKeys.UPDATE_ME,
    payload: data,
  };
}

export function updateIsLoggedIn(isLoggedIn: boolean): IUpdateIsLoggedInAction {
  return {
    type: ActionTypeKeys.UPDATE_IS_LOGGED_IN,
    payload: {
      isLoggedIn,
    },
  };
}

export function updateFetchMeRequest(): IUpdateFetchMeRequestAction {
  return {
    type: ActionTypeKeys.UPDATE_FETCH_ME_REQUEST,
  };
}

export function updateFetchMeFailure(error): IUpdateFetchMeFailureAction {
  return {
    type: ActionTypeKeys.UPDATE_FETCH_ME_FAILURE,
    payload: {
      error: error && error.message,
    },
  };
}

// Action thunks

export function fetchMe() {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>, getState) => {
    dispatch(updateFetchMeRequest());
    return ApiService.get(`/me`)
      .then(res => {
        return res;
      })
      .catch(error => {
        dispatch(updateFetchMeFailure(error));
        return {};
      });
  };
}

// Interface of actions

export type MyThunkResult<T> = ThunkAction<T, IStoreState, void, Action>;

export interface IMyActions extends ActionCreatorsMapObject<any> {
  updateIsLoggedIn: typeof updateIsLoggedIn;
  updateMe: typeof updateMe;
  updateFetchMeRequest: typeof updateFetchMeRequest;
  fetchMe: typeof fetchMe;
}

// Expose actions

export function getActions(): IMyActions {
  return {
    updateIsLoggedIn,
    updateMe,
    updateFetchMeRequest,
    fetchMe,
  };
}

// Union of all action types

export type ActionTypes =
  | IUpdateIsLoggedInAction
  | IUpdateMeAction
  | IUpdateFetchMeFailureAction
  | IUpdateFetchMeRequestAction
  | IEmptyAction;
