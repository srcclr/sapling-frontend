import React, { Component, ObjectHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import App from 'components/App';

interface IRootProps {
  store: Store;
  history: History;
}

export default class Root extends Component<IRootProps> {
  public render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );
  }
}
