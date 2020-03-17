import React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import AuthService from 'utils/AuthService';
import { bindActionCreators } from 'redux';
import { getLoginErrorMessage } from 'utils/Helpers';
import { loginWithUserName } from 'actions/login';
import { BoundActionsObjectMap } from 'actions/actionTypes';
import IStoreState, { ILoginState, IMyState } from 'store/IStoreState';
import { SquareSpinner } from 'styles/ThemeComponents';
import { ILoginParams } from '../types';
import Loader from 'react-loader-spinner';

function Login() {
  const state = useSelector<IStoreState, { loginState: ILoginState; myState: IMyState }>(state => ({
    loginState: state.loginState,
    myState: state.myState,
  }));
  const { loginState, myState } = state;
  const dispatch = useDispatch();
  const actions = bindActionCreators<{}, BoundActionsObjectMap>({ loginWithUserName }, dispatch);
  const loginWithUsername = e => {
    e.preventDefault();

    const { target = {} } = e;
    const { username, password } = target;

    const params: ILoginParams = {
      email: username.value,
      password: password.value,
    };

    actions.loginWithUserName(params).then(res => {
      const { data } = res;
      const { header } = data;
      const { ['access_token']: authToken } = header;
      if (authToken) {
        AuthService.setAuthToken(authToken);
        window.location = `/boards` as any;
      }
    });
  };

  const { isFetchingToken, query = {}, error = {}, isLoggingIn } = loginState;
  const { isFetchingMe = false } = myState;
  const errorMessage = getLoginErrorMessage(error);

  return (
    <div className="flex items-stretch h-screen">
      {isFetchingMe ? (
        <div className="mx-auto w-1/12 self-center pb-16">
          <SquareSpinner className="mt-20" />
        </div>
      ) : (
        <div className="flex-1 max-w-md self-center mx-auto pb-16">
          <h1 className="md:w-2/3 ml-auto font-extrabold mb-6 text-2xl text-teal-500">SAPLING.</h1>
          {!isLoggingIn &&
            errorMessage && (
              <div className="text-sm mb-6">
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold mr-2">Oops</strong>
                  <span className="block sm:inline">{errorMessage}</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3" />
                </div>
              </div>
            )}
          <form className="" onSubmit={loginWithUsername}>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Email
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  autoComplete={'username email'}
                  type="email"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
                  name="username"
                  placeholder="Email"
                  required={true}
                  autoFocus
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Password
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  autoComplete={'current-password'}
                  type="password"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
                  name="password"
                  placeholder="Password"
                  required={true}
                />
              </div>
            </div>
            <div className="md:flex md:items-center">
              <div className="md:w-1/3" />
              <div className="md:w-2/3">
                <button className="btn btn-primary inline-block" type="submit">
                  {isLoggingIn ? (
                    <Loader type="ThreeDots" color="#ffffff" width={20} height={20} />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
