// Action creator modules
type LoginActionCreators = typeof import('./login');
type BoardActionCreators = typeof import('./boardActions');
type BoardListActionCreators = typeof import('./boardListActions');
type EpicsActionCreators = typeof import('./epicsActions');
type DependenciesViewActionCreators = typeof import('./dependenciesViewActions');
type myActionCreators = typeof import('./myActions');

type AsyncPayload<R, S> = {
  request: { data?: R };
  success: { data?: S };
  failure: {
    error: string;
  };
};

interface Action<T, P> {
  type: T;
  payload?: P;
}

export type AsyncSubType = 'REQUEST' | 'SUCCESS' | 'FAILURE';

export interface AsyncAction<T, AsyncPayload> extends Action<T, AsyncPayload> {
  callApi: Function;
  subType?: AsyncSubType;
}

type ActionCreators = LoginActionCreators &
  BoardListActionCreators &
  BoardActionCreators &
  EpicsActionCreators &
  DependenciesViewActionCreators &
  myActionCreators;

export type ActionMapObject = {
  [Name in keyof ActionCreators]: ActionCreators[Name] extends ((...args: any[]) => any)
    ? ReturnType<ActionCreators[Name]>
    : never
};

export type Actions = {
  [Name in keyof ActionMapObject]: ActionMapObject[Name] extends Action<{}, {}>
    ? ActionMapObject[Name] extends AsyncAction<ActionMapObject[Name]['type'], {}>
      ? ActionMapObject[Name] & {
          subType: AsyncSubType;
          payload?: AsyncPayload<{}, {}>;
        }
      : ActionMapObject[Name]
    : never
}[keyof ActionCreators];

// This is what helps us type check in places like the reducer
export type ActionTypes = Actions['type'];

/**
 * We define the following BoundActionsObjectMap type
 * such that we expect a Promise or an object to be returned.
 */
export type BoundActionsObjectMap = {
  [Name in keyof ActionCreators]: ReturnType<ActionCreators[Name]> extends AsyncAction<{}, {}>
    ? (...args: Parameters<ActionCreators[Name]>) => Promise<any>
    : ActionCreators[Name]
};
