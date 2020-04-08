import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router';

import { history } from '../store';
import Settings from './Settings';

const Application: React.FunctionComponent<{}> = () => (
    <ConnectedRouter history={history}>
        <Switch>
            <Route path="/" component={Settings} />
        </Switch>
    </ConnectedRouter>
);

export default hot(Application);
