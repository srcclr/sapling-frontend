import superagent from 'superagent';
import config from './config';
import AuthService from './AuthService';

const methods = ['get', 'post', 'put', 'patch', 'del'];

interface IApiService {
  get: (path: string, requestProps: IRequestProps) => void;
  post: (path: string, requestProps: IRequestProps) => void;
  put: (path: string, requestProps: IRequestProps) => void;
  patch: (path: string, requestProps: IRequestProps) => void;
  del: (path: string, requestProps: IRequestProps) => void;
}

interface IRequestProps {
  params?: any;
  data?: any;
  headers?: any;
}

function formatUrl(path) {
  if (path.startsWith('http')) {
    return path;
  }

  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  const url = config.API_URL;
  return url + adjustedPath;
}

class ApiService implements IApiService {
  public get;
  public post;
  public put;
  public patch;
  public del;

  constructor() {
    methods.forEach(
      method =>
        (this[method] = (
          path?: string,
          { params = {}, data = {}, headers = {} }: IRequestProps = {}
        ) =>
          new Promise((resolve, reject) => {
            const RESPONSE_TOKEN_HEADER = 'access_token';

            const request = superagent[method](formatUrl(path));
            const token = AuthService.getAuthToken();
            const tokenHeader = 'Authorization';
            const { type: requestType } = headers;
            headers = {
              Accept: 'application/json',
              ...headers,
            };

            let theToken;
            // an explicit token value in the headers always wins; q.v. routes.js#198
            if (tokenHeader in headers) {
              theToken = headers[tokenHeader];
            } else if (token) {
              theToken = token;
            }

            const isLoggingIn =
              path.startsWith('/login') ||
              (path.startsWith('http') && path.substr(path.lastIndexOf('/') + 1) === 'login');

            const isRetrievingUserStatus =
              path.substr(path.lastIndexOf('/') + 1).indexOf('user-status') !== -1;

            /**
             * Only set token header aka x-auth-token, when not requesting for platform URL API
             */
            if (theToken) {
              headers[tokenHeader] = `Bearer ${theToken}`;
            }

            if (requestType === 'undefined') {
              request.type('application/json');
            }

            if (params) {
              request.query(params);
            }

            if (data) {
              request.send(data);
            }

            if (headers) {
              request.set(headers);
            }

            request.end((err, res) => {
              let { body = {} } = res || {};

              if (err) {
                if (body && typeof body === 'object') {
                  body.status = err.status;
                }

                reject(body || err);
              } else if (isLoggingIn) {
                resolve(res);
              } else {
                const { text = '' } = res;

                if (isRetrievingUserStatus || isLoggingIn) {
                  if (res.headers && res.headers[RESPONSE_TOKEN_HEADER]) {
                    // if the response contains an x-auth-token, we need to set (or reset) the session token cookie
                    const latestToken = res.headers[RESPONSE_TOKEN_HEADER];

                    AuthService.setAuthToken(latestToken);
                  }

                  // signup and login are special in that we want to redirect in some cases
                  body = body || {};

                  body.authToken = res.headers[RESPONSE_TOKEN_HEADER];
                } else if (text) {
                  body = body || {};
                  body.text = text;
                }
                resolve(body);
              }
            });
          }))
    );
  }
}

export default new ApiService();
