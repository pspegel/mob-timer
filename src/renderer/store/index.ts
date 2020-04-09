import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHashHistory } from 'history';

import createRootReducer, { RootState } from '../reducers';

export const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = (): Store<RootState | undefined> => {
  const middlewares: any[] = [];
  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
  return createStore(rootReducer, {}, enhancer);
};

const store = configureStore();

if (typeof module.hot !== 'undefined') {
  module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').rootReducer));
}

export default store;
