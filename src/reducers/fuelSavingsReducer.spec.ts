import {
  ISaveFuelSavingsAction,
  ICalculateFuelSavingsAction,
  ActionTypeKeys,
} from 'actions/fuelSavingsActions';
import { IEmptyAction } from 'actions/sharedActions';
import reducer from './fuelSavingsReducer';
import { getFormattedDateTime } from '../utils/dates';
import { IFuelSavings } from 'types';

describe('Reducers::FuelSavings', () => {
  interface ISavings {
    annual: number;
    monthly: number;
    threeYear: number;
  }

  interface IAppState {
    dateModified: string;
    displayResults: boolean;
    milesDriven: number | string;
    milesDrivenTimeframe: string;
    necessaryDataIsProvidedToCalculateSavings: boolean;
    newMpg: number;
    newPpg: number;
    savings: ISavings;
    tradeMpg: number;
    tradePpg: number;
  }

  const getInitialState = () => {
    return {
      dateModified: null,
      displayResults: false,
      milesDriven: '',
      milesDrivenTimeframe: 'week',
      necessaryDataIsProvidedToCalculateSavings: false,
      newMpg: '',
      newPpg: '',
      savings: {
        annual: 0,
        monthly: 0,
        threeYear: 0,
      },
      tradeMpg: '',
      tradePpg: '',
    };
  };

  const getAppState = (): IFuelSavings => {
    return {
      dateModified: null,
      displayResults: false,
      milesDriven: 100,
      milesDrivenTimeframe: 'week',
      necessaryDataIsProvidedToCalculateSavings: false,
      newMpg: 20,
      newPpg: 1.5,
      savings: {
        annual: 0,
        monthly: 0,
        threeYear: 0,
      },
      tradeMpg: 10,
      tradePpg: 1.5,
    };
  };
  const dateModified = getFormattedDateTime();

  it('should set initial state by default', () => {
    const action: IEmptyAction = { type: '' };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it('should handle SAVE_FUEL_SAVINGS', () => {
    const action: ISaveFuelSavingsAction = {
      payload: {
        dateModified,
        settings: getAppState(),
      },
      type: ActionTypeKeys.SAVE_FUEL_SAVINGS,
    };
    const expected = (Object as any).assign(getAppState(), { dateModified });

    expect(reducer(getAppState() as IFuelSavings, action)).toEqual(expected);
  });

  it('should handle CALCULATE_FUEL_SAVINGS', () => {
    const action: ICalculateFuelSavingsAction = {
      payload: {
        dateModified,
        fieldName: 'newMpg',
        settings: getAppState() as IFuelSavings,
        value: 30,
      },
      type: ActionTypeKeys.CALCULATE_FUEL_SAVINGS,
    };

    const expectedMpg = 30;
    const expectedSavings = {
      annual: '$519.96',
      monthly: '$43.33',
      threeYear: '$1,559.88',
    };

    expect(reducer(getAppState() as IFuelSavings, action).newMpg).toEqual(expectedMpg);
    expect(reducer(getAppState() as IFuelSavings, action).savings).toEqual(expectedSavings);
  });
});
