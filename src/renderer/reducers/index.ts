import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import roles, { RolesState } from './roles';
import timer, { TimerState } from './timer';

export type RootState = Readonly<{
    router: any;
    roles: RolesState;
    timer: TimerState;
}>;

export default (history: History) =>
    combineReducers({
        router: connectRouter(history),
        roles,
        timer
    });
