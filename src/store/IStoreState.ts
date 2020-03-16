import { IFuelSavings, IBoard, IEpic } from 'types';
import { FormStateMap } from 'redux-form';
export default interface IStoreState {
  readonly form: FormStateMap;
  readonly fuelSavings: IFuelSavings;
  readonly epicsListState: IEpicsListState;
  readonly boardListState: IBoardListState;
  readonly boardState: IBoardState;
  readonly loginState: ILoginState;
  readonly myState: IMyState;
}

export interface IBoardListState {
  data: IBoard[];
  isFetchingBoardList: boolean;
  errorMessage: string;
}

export interface IEpicsListState {
  data: IEpic[];
  isFetchingEpicsList: boolean;
  errorMessage: string;
}

export interface IBoardState {
  data?: IBoard;
  isFetchingBoard?: boolean;
  isUpdatingBoard?: boolean;
  isAddingDependency?: boolean;
  isExportingCsv?: boolean;
  dependant?: number;
  shownDependencies?: number[];
  errorMessage?: string;
}

export interface ILoginState {
  isLoggingIn?: boolean;
  isFetchingToken?: boolean;
  query?: string;
  errorMessage?: string;
}

export interface IMyState {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  orgSlug: string;
  researcher: boolean;
  roles: string[];
  username: string;
  fetchResolved: boolean;
  isFetchingMe: boolean;
}
