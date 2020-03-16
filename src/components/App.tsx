/* eslint-disable import/no-named-as-default */
import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from 'containers/Board';
import BoardList from 'containers/BoardList';
import Login from 'containers/Login';

import { IMyState } from 'store/IStoreState';
import { getActions } from 'actions/appLoad';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

interface IAppProps {
  history: any;
  myState: IMyState;
}

class App extends React.Component<IAppProps & ReturnType<typeof mapDispatchToProps>> {
  public componentDidMount() {
    const { history } = this.props;

    this.props.actions.checkUserStatus(history);
  }

  public render() {
    const activeStyle = { color: 'blue' };
    return (
      <div className="col-12">
        <div>
          <Switch>
            <Redirect exact path="/" to={'/login'} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/boards/:boardId" component={Board} />
            <Route exact path="/boards" component={BoardList} />
          </Switch>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {};
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(getActions(), dispatch),
  };
}

export default hot(module)(
  withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
  )(App) as any)
);
