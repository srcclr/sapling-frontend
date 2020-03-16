import React, { Component } from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
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
