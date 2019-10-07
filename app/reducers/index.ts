import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import roles from './roles';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    roles
  });
}
