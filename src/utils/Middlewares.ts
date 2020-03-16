import { getError } from 'utils/Helpers';

// Borrowed from https://redux.js.org/recipes/reducing-boilerplate
// and tweaked
export const actionsMiddleware = ({ dispatch }) => next => action => {
  const { type, callApi, payload = {} } = action;

  if (!callApi) {
    // Normal action: pass it on
    return next(action);
  }

  if (typeof callApi !== 'function') {
    throw new Error('Expected callApi to be a function.');
  }

  dispatch({
    type,
    subType: 'REQUEST',
    payload,
  });

  return callApi().then(
    response => {
      dispatch({
        type,
        subType: 'SUCCESS',
        payload: {
          ...payload,
          success: {
            data: response,
          },
        },
      });

      return {
        data: response,
      };
    },
    error => {
      const errorMessage = getError(error);

      dispatch({
        type,
        subType: 'FAILURE',
        payload: {
          ...payload,
          failure: {
            error: errorMessage,
          },
        },
      });

      throw errorMessage;
    }
  );
};
