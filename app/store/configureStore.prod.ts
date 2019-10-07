import { createStore, applyMiddleware } from 'redux';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from '../reducers';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(router);

function configureStore(initialState?: any) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
