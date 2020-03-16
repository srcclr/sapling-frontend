/* eslint-disable import/no-named-as-default */
import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, withRouter, Redirect, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { bindActionCreators, ActionCreatorsMapObject } from 'redux';
import { toast } from 'react-toastify';

import Login from 'components/Login';
import BoardList from 'components/BoardList';

import { checkUserStatus } from 'actions/appLoad';
import Board from 'components/Board';

toast.configure({ hideProgressBar: true });

export function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const actions = bindActionCreators<{}, ActionCreatorsMapObject>({ checkUserStatus }, dispatch);
  useEffect(() => {
    actions.checkUserStatus(history);
  }, []);
  return (
    <div className="flex flex-col items-stretch relative">
      <Switch>
        <Redirect exact path="/" to={'/login'} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/boards" component={BoardList} />
        <Route exact path="/boards/:boardId" component={Board} />
      </Switch>
    </div>
  );
}

export default hot(module)(withRouter(App));
