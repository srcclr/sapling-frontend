import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import fuelSavings from './fuelSavingsReducer';
import boardState from './boardState';
import boardListState from './boardListState';
import epicsListState from './epicsListState';
import loginState from './loginState';
import myState from './myState';
import IStoreState from 'store/IStoreState';

const rootReducer = combineReducers<IStoreState>({
  form,
  fuelSavings,
  boardState,
  boardListState,
  epicsListState,
  loginState,
  myState,
});

export default rootReducer;
