import { IBoard, IEpic, IError, ICrossDeps, ISignUpParams } from '../types';
import { FormStateMap } from 'redux-form';
export default interface IStoreState {
  readonly form: FormStateMap;
  readonly epicsListState: IEpicsListState;
  readonly boardListState: IBoardListState;
  readonly dependenciesViewState: IDependenciesViewState;
  readonly boardState: IBoardState;
  readonly newBoardState: IBoardState;
  readonly loginState: ILoginState;
  readonly signUpState: ISignUpState;
  readonly myState: IMyState;
}

export interface IDependenciesViewState {
  data?: ICrossDeps;
  isFetching?: boolean;
  errorMessage?: string;
}

export interface IBoardListState {
  data?: IBoardListItem[];
  isInitialLoad?: boolean;
  isFetching?: boolean;
  errorMessage?: string;
}

export interface IBoardListItem {
  id: number;
  name: string;
  owner: string;
}

export interface IEpicsListState {
  data: IEpic[];
  isCreatingEpic: boolean;
  isFetchingEpicsList: boolean;
  errorMessage: string;
  epicAsyncCallStateById?: {
    [id: string]: {
      isLoading?: boolean;
      isSuccess?: boolean;
      isFailure?: boolean;
    };
  };
}

export interface IBoardState {
  data?: IBoard;
  isInitialLoad?: boolean;
  isSolving?: boolean;
  isFetching?: boolean;
  isUpdatingBoard?: boolean;
  isAddingDependency?: boolean;
  isDeletingDependency?: boolean;
  isCreatingSprint?: boolean;
  isExportingCsv?: boolean;
  isUploadingCsv?: boolean;
  dependant?: number;
  shownDependencies?: number[];
  errorMessage?: string;
  sprintAsyncCallStateById?: {
    [id: string]: {
      isLoading?: boolean;
      isSuccess?: boolean;
      isFailure?: boolean;
    };
  };
  storyAsyncCallStateById?: {
    [id: string]: {
      isLoading?: boolean;
      isSuccess?: boolean;
      isFailure?: boolean;
    };
  };
}

export interface ILoginState {
  isLoggingIn?: boolean;
  isFetchingToken?: boolean;
  query?: string;
  error?: IError;
}

export interface ISignUpState {
  isSigningUp?: boolean;
  isFetchingToken?: boolean;
  error?: IError;
}

export interface IMyState {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  isFetchingMe: boolean;
}
