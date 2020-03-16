import FileSaver from 'file-saver';
import { AsyncSubType } from 'actions/actionTypes';
import { IError } from 'types';
import _ from 'lodash';

export const startCSVDownload = (fileName, data) => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
  FileSaver.saveAs(blob, `${fileName}.csv`);
};

export const getError = (error: { message?: string; error?: string; status?: number } | string) => {
  let formattedErrorMessage = '';
  const errorObj = {};

  if (typeof error === 'string') {
    formattedErrorMessage = error;
    errorObj['error'] = error;
    errorObj['message'] = error;
    errorObj['status'] = null;
  }

  if (typeof error === 'object') {
    const { message, status, error: errorContent } = error;
    if (message) {
      formattedErrorMessage = `${status} ${message}`;
    } else if (errorContent) {
      formattedErrorMessage = errorContent;
    } else {
      formattedErrorMessage = 'Error processing your request.';
    }
  }

  return { error, formattedErrorMessage } as IError;
};

export const getLoginErrorMessage = (errorObj: IError) => {
  if (!errorObj || _.isEmpty(errorObj)) {
    return null;
  }

  const { error = {} } = errorObj;
  const { status } = error;

  if (status === 401) {
    return 'Login failed: Either user or password is incorrect';
  }

  return 'Unable to login. Please contact your admin.';
};
/**
 * This is a reducer for an async action
 * mainly to handle the REQUEST, SUCCESS and FAILURE states
 */

export const asyncActionReducer = (
  draft,
  action,
  loaderStateFields,
  successCallback?: () => void,
  failureCallback?: () => void
) => {
  const { subType }: { subType: AsyncSubType } = action;

  switch (subType) {
    case 'REQUEST': {
      loaderStateFields.forEach(field => (draft[field] = true));
      return;
    }
    case 'SUCCESS': {
      loaderStateFields.forEach(field => (draft[field] = false));
      if (successCallback) {
        successCallback();
      }
      return;
    }
    case 'FAILURE': {
      loaderStateFields.forEach(field => (draft[field] = false));
      if (failureCallback) {
        failureCallback();
      } else {
        const { error } = action.payload.failure;
        draft.error = error;
      }
      return;
    }
  }
};

/**
 * This is a reducer for an async action
 * REQUEST, SUCCESS and FAILURE states
 * by id. With this we are tracking loading states
 * of list items or table rows and handle accordingly.
 */

export const asyncActionReducerById = (
  draft,
  action,
  id,
  idLoaderState,
  successCallback?: () => void,
  failureCallback?: () => void
) => {
  const { subType }: { subType: AsyncSubType } = action;

  draft[idLoaderState][id] = {
    isLoading: false,
    isSuccess: false,
    isFailure: false,
  };

  switch (subType) {
    case 'REQUEST': {
      draft[idLoaderState][id] = {
        isLoading: true,
      };

      return;
    }
    case 'SUCCESS': {
      draft[idLoaderState][id] = {
        isSuccess: true,
      };

      if (successCallback) {
        successCallback();
      }
      return;
    }
    case 'FAILURE': {
      draft[idLoaderState][id] = {
        isFailure: true,
      };
      if (failureCallback) {
        failureCallback();
      } else {
        const { error } = action.payload.failure;
        draft.error = error;
      }
      return;
    }
  }
};

export const countsPhrase = (word = '', items = []) => {
  const count = items ? items.length : 0;
  const normalizedWord = word.toLowerCase();

  switch (normalizedWord) {
    case 'epic': {
      return `${count} epic${count === 1 ? '' : 's'}`;
    }
    case 'sprint': {
      return `${count} sprint${count === 1 ? '' : 's'}`;
    }
    case 'story': {
      return `${count} stor${count === 1 ? 'y' : 'ies'}`;
    }
  }
};

export const getNumberValue = maybeANumber => {
  if (typeof maybeANumber === 'number') {
    return maybeANumber;
  } else if (!isNaN(maybeANumber)) {
    return parseInt(maybeANumber);
  } else {
    return undefined;
  }
};
