import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import roles, { RolesState } from './roles';

export type RootState = Readonly<{
  router: any;
  roles: RolesState;
}>;

export default (history: History) =>
  combineReducers({
    router: connectRouter(history),
    roles
  });
