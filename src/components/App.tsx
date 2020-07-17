/* eslint-disable import/no-named-as-default */
import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader';

import { Route, Switch, withRouter, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators, ActionCreatorsMapObject } from 'redux';
import { toast } from 'react-toastify';
import IStoreState, { IMyState } from 'store/IStoreState';

import Login from 'components/Login';
import SignUp from 'components/SignUp';
import BoardList from 'components/BoardList';
import DependenciesView from 'components/DependenciesView';

import { checkUserStatus } from 'actions/appLoad';
import Board from 'components/Board';
import { SquareSpinner } from 'styles/ThemeComponents';
import WebSocketsService from 'utils/WebSocketsService';

toast.configure({ hideProgressBar: true });

const messageTypeToActionTypeMap = {
  Board: 'OPENED_BOARD',
  BoardList: 'OPENED_BOARD_LIST',
};

const createReceiveWsAction = (type, data) => ({
  type,
  subType: 'SUCCESS',
  payload: { success: data },
});

export function App() {
  const myState = useSelector<IStoreState, IMyState>(state => state.myState);
  const history = useHistory();
  const dispatch = useDispatch();
  const actions = bindActionCreators<{}, ActionCreatorsMapObject>({ checkUserStatus }, dispatch);

  const onMessageCallback = event => {
    const data = JSON.parse(event.data);
    const type = messageTypeToActionTypeMap[data.type];
    dispatch(createReceiveWsAction(type, data));
  };

  useEffect(() => {
    actions.checkUserStatus(history).then(() => {
      WebSocketsService.handleMessage(onMessageCallback);
      WebSocketsService.initWebSocketConnection();
    });
  }, []);

  const { isFetchingMe = false } = myState;

  return (
    <div className="flex flex-col items-stretch relative ">
      {isFetchingMe ? (
        <div className="flex items-stretch h-screen border-4 ">
          <div className="mx-auto w-1/12 self-center pb-16">
            <SquareSpinner className="mt-20" />
          </div>
        </div>
      ) : (
        <Switch>
          <Redirect exact path="/" to={'/login'} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/boards" component={BoardList} />
          <Route exact path="/boards/dependencies" component={DependenciesView} />
          <Route exact path="/boards/:boardId" component={Board} />
        </Switch>
      )}
    </div>
  );
}

export default hot(module)(withRouter(App));
