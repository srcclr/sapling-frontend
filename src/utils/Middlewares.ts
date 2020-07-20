import { getError } from 'utils/Helpers';

// Borrowed from https://redux.js.org/recipes/reducing-boilerplate
// and tweaked
export const actionsMiddleware = ({ dispatch }) => next => action => {
  const { type, callApi, sendMessage, payload = {} } = action;

  if (!callApi && !sendMessage) {
    // Normal action: pass it on
    return next(action);
  }

  if (callApi && typeof callApi !== 'function') {
    throw new Error('Expected callApi to be a function.');
  }

  dispatch({
    type,
    subType: 'REQUEST',
    payload,
  });

  if (callApi) {
    return callApi()
      .then(response => {
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
      })
      .catch(error => {
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
      });
  } else if (sendMessage) {
    sendMessage();
  }
};
