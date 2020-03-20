import { combineReducers } from 'redux';
import boardState from './boardState';
// import newBoardState from './newBoardState';
import boardListState from './boardListState';
import dependenciesViewState from './dependenciesViewState';
import epicsListState from './epicsListState';
import loginState from './loginState';
import myState from './myState';
import IStoreState from '../store/IStoreState';
import { connectRouter } from 'connected-react-router';

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    // newBoardState,
    boardState,
    boardListState,
    dependenciesViewState,
    epicsListState,
    loginState,
    myState,
  });

export default rootReducer;
