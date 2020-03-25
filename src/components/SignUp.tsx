import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import Loader from 'react-loader-spinner';

// TODO
function SignUp() {
  const errorMessage = '';
  const isSigningUp = false;

  const { register, errors, handleSubmit, watch } = useForm();

  const onSubmit = values => {};

  return (
    <div className="flex items-stretch h-screen">
      <div className="flex-1 max-w-md self-center mx-auto pb-16">
        <h1 className="md:w-2/3 ml-auto font-extrabold mb-6 text-2xl text-teal-500">SAPLING.</h1>
        {!isSigningUp &&
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
        <form className="" onSubmit={handleSubmit(onSubmit)}>
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
                ref={register({ required: true })}
                autoFocus
              />
              <div className="text-sm text-red-300">
                {errors && errors['username'] && errors['username']['type'] === 'required'
                  ? 'Required'
                  : ''}
              </div>
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
                name="password"
                placeholder="Password"
                ref={register({ required: true })}
              />
              <div className="text-sm text-red-300">
                {errors && errors['password'] && errors['password']['type'] === 'required'
                  ? 'Required'
                  : ''}
              </div>
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Confirm password
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                type="password"
                name="confirmPassword"
                ref={register({
                  validate: value => value === watch('password'),
                  required: true,
                })}
                placeholder="Confirm password"
              />
              <div className="text-sm text-red-300">
                {errors &&
                errors['confirmPassword'] &&
                errors['confirmPassword']['type'] === 'validate'
                  ? 'Does not match password'
                  : ''}
              </div>
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-1/3" />
            <div className="md:w-2/3">
              <button className="btn btn-primary inline-block" type="submit">
                {isSigningUp ? (
                  <Loader type="ThreeDots" color="#ffffff" width={20} height={20} />
                ) : (
                  'Sign up'
                )}
              </button>{' '}
              or <Link to="/login">Login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
