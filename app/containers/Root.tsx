import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import { Switch, Route } from 'react-router';

import Settings from './Settings';

type RootProps = {
  store: any;
  history: History<any>;
};

const Root: React.FunctionComponent<RootProps> = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={Settings} />
      </Switch>
    </ConnectedRouter>
  </Provider>
);

export default Root;
