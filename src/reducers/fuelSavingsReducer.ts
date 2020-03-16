import {
  FuelSavingsActionTypes,
  ActionTypeKeys,
  ISaveFuelSavingsPayload,
  ICalculateFuelSavingsPayload,
} from 'actions/fuelSavingsActions';
import { necessaryDataIsProvidedToCalculateSavings, calculateSavings } from 'utils/fuelSavings';
import objectAssign from 'object-assign';
import initialState from './initialState';
import { IFuelSavings } from 'types';

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function fuelSavingsReducer(
  state: IFuelSavings = initialState.fuelSavings,
  action: FuelSavingsActionTypes
) {
  let newState;
  let payload;

  switch (action.type) {
    case ActionTypeKeys.SAVE_FUEL_SAVINGS: {
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js
      payload = action.payload as ISaveFuelSavingsPayload;

      return objectAssign({}, state, { dateModified: payload.dateModified });
    }
    case ActionTypeKeys.CALCULATE_FUEL_SAVINGS:
      payload = action.payload as ICalculateFuelSavingsPayload;

      newState = objectAssign({}, state);
      newState[payload.fieldName] = payload.value;
      newState.necessaryDataIsProvidedToCalculateSavings = necessaryDataIsProvidedToCalculateSavings(
        newState
      );
      newState.dateModified = payload.dateModified;

      if (newState.necessaryDataIsProvidedToCalculateSavings) {
        newState.savings = calculateSavings(newState);
      }

      return newState;

    default:
      return state;
  }
}
