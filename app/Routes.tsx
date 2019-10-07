import * as React from 'react';
import { Switch, Route } from 'react-router';

import App from './containers/App';
import Settings from './containers/Settings';

export default () => (
  <App>
    <Switch>
      <Route path="/" component={Settings} />
    </Switch>
  </App>
);
