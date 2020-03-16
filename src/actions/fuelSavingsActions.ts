import { Action, Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getFormattedDateTime } from 'utils/dates';
import IStoreState from 'store/IStoreState';
import { IFuelSavings } from 'types';
import { IEmptyAction } from 'actions/sharedActions';

export enum ActionTypeKeys {
  SAVE_FUEL_SAVINGS = 'SAVE_FUEL_SAVINGS',
  CALCULATE_FUEL_SAVINGS = 'CALCULATE_FUEL_SAVINGS',
}

export interface ISaveFuelSavingsPayload {
  dateModified: string;
  settings: IFuelSavings;
}

export interface ICalculateFuelSavingsPayload {
  dateModified: string;
  fieldName: string;
  settings: IFuelSavings;
  value: number;
}

export interface ISaveFuelSavingsAction {
  readonly type: ActionTypeKeys.SAVE_FUEL_SAVINGS;
  readonly payload: ISaveFuelSavingsPayload;
}

export interface ICalculateFuelSavingsAction {
  readonly type: ActionTypeKeys.CALCULATE_FUEL_SAVINGS;
  readonly payload: ICalculateFuelSavingsPayload;
}

export type FuelSavingsActionTypes =
  | ICalculateFuelSavingsAction
  | ISaveFuelSavingsAction
  | IEmptyAction;

// example of a thunk using the redux-thunk middleware
export function saveFuelSavings(settings: IFuelSavings) {
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    dispatch(saveFuelSavingsAction(settings));
  };
}

export function saveFuelSavingsAction(settings: IFuelSavings): ISaveFuelSavingsAction {
  return {
    type: ActionTypeKeys.SAVE_FUEL_SAVINGS,
    payload: {
      dateModified: getFormattedDateTime(),
      settings,
    },
  };
}

export function calculateFuelSavings(
  settings: IFuelSavings,
  fieldName: string,
  value: number
): ICalculateFuelSavingsAction {
  return {
    type: ActionTypeKeys.CALCULATE_FUEL_SAVINGS,
    payload: {
      dateModified: getFormattedDateTime(),
      fieldName,
      settings,
      value,
    },
  };
}

export interface IFuelSavingActions {
  calculateFuelSavings: () => void;
  saveFuelSavings: () => void;
}
