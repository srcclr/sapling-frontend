import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import config from 'utils/config';

import { getActions, ILoginActions } from 'actions/login';
import IStoreState, { ILoginState, ImyState } from 'store/IStoreState';
import { ILoginParams } from 'types';
import ContentWrapper from 'components/ContentWrapper';

interface ILoginProps {
  loginState: ILoginState;
  myState: ImyState;
  actions: ILoginActions;
  history: any;
}

export class Login extends React.Component<ILoginProps> {
  private delayedHandleSearch;

  constructor(props) {
    super(props);
  }

  public componentWillUpdate(props) {
    const { myState, history } = props;
    const { roles = [] } = myState;
    const isLoggedIn = roles.includes('SC_RESEARCHER');

    if (isLoggedIn) {
      history.replace('/artifacts');
    }
  }

  public handleUpdateField = (field: string, value: string) => {
    this.props.actions.updateField(field, value);
  };

  public loginWithUsername = e => {
    e.preventDefault();
    // const twoFactor = AuthService.getTwoFactor();
    const rememberComputerToken = false; // TODO: twoFactor ? `?rememberComputerToken=${twoFactor}` : '';
    const { target = {} } = e;
    const { username, password } = target;

    const params: ILoginParams = {
      email: username.value,
      password: password.value,
    };

    this.props.actions.loginWithUsername(params, rememberComputerToken);
  };

  public render() {
    const { loginState, myState } = this.props;
    const {
      isFetchingToken,
      query = {},
      errorMessage: loginErrorMessage,
      isLoggingIn,
    } = loginState;

    return (
      <div className="lg-col-4 md-col-7 sm-col-7 xs-col-7 mx-auto mt4 pt4">
        <form method="POST" onSubmit={this.loginWithUsername} className=" flex flex-column mx-auto">
          <div className="bp3-form-group">
            <label className="bp3-label label">Username</label>

            <input
              autoComplete={'username email'}
              type="email"
              className="bp3-input mb1 bp3-large bp3-round"
              name="username"
              placeholder="Email"
              required={true}
              autoFocus
            />
          </div>
          <div className="bp3-form-group">
            <label className="bp3-label label">PASSWORD</label>
            <input
              autoComplete={'current-password'}
              type="password"
              className="mt- bp3-input bp3-large bp3-round"
              name="password"
              placeholder="Password"
              required={true}
            />
          </div>
          {loginErrorMessage && <div className="mt1 center"> {loginErrorMessage} </div>}
          <button
            className="bp3-button bp3-intent-primary bp3-large mt2 pv- bp3-round"
            type="submit"
            disabled={isLoggingIn}
          >
            <ContentWrapper
              isLoading={isLoggingIn}
              loaderProps={{ size: 20 }}
              loaderClassName="m0 p0"
            >
              Sign in{' '}
            </ContentWrapper>
          </button>
          <div className="center mt2">
            <a href={`/forgot-password`} className="center">
              Forgot password
            </a>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    loginState: state.loginState,
    myState: state.myState,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(getActions(), dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
