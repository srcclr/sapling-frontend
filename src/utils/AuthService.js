import Cookies from 'universal-cookie';
import ApiService from './ApiService';

const SESSION_COOKIE_KEY = 'session-token';
const TWO_FACTOR_COOKIE_KEY = 'auth-2fa';

const AuthService = function() {
  const cookies = new Cookies();

  const setSessionToken = sessionToken => {
    cookies.set(SESSION_COOKIE_KEY, sessionToken);
  };

  const clearSessionToken = () => {
    cookies.remove(SESSION_COOKIE_KEY);
  };

  /**
   * Sets bearer token for user with an expiry time.
   * @param {String} authToken the API token for the current session, or <tt>null</tt> to <b>CLEAR</b> the session.
   */
  const setAuthToken = authToken => {
    return new Promise(resolve => {
      if (authToken) {
        setSessionToken(authToken);
      } else {
        clearSessionToken();
      }
      resolve();
    });
  };

  /**
   * Sets bearer token for user with an expiry time.
   * @param {String} authToken the API token for the current session, or <tt>null</tt> to <b>CLEAR</b> the session.
   */
  const resetAuthToken = authToken => {
    clearSessionToken();
    setSessionToken(authToken);
  };

  const logout = () => {
    const tokenHeader = getAuthToken();
    return ApiService.post('/logout', { headers: { 'x-auth-token': tokenHeader } })
      .then(
        () => {
          setAuthToken(null);
        },
        () => {
          setAuthToken(null);
        }
      )
      .catch(() => {
        setAuthToken(null);
      });
  };

  const getAuthToken = () => {
    return cookies.get(SESSION_COOKIE_KEY);
  };

  const setTwoFactor = value => {
    if (value) {
      cookies.save(TWO_FACTOR_COOKIE_KEY, value);
    } else {
      cookies.remove(TWO_FACTOR_COOKIE_KEY);
    }
  };

  const getTwoFactor = () => {
    return cookies.get(TWO_FACTOR_COOKIE_KEY);
  };

  return {
    getAuthToken,
    setAuthToken,
    logout,
    resetAuthToken,
    setTwoFactor,
    getTwoFactor,
  };
};

export default new AuthService();
