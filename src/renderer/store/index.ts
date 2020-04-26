import { applyMiddleware, createStore, Store, Action } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHashHistory } from 'history';

import createRootReducer, { RootState } from '../reducers';
import rootEpic from '../epics';

export const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = (): Store<RootState | undefined> => {
  const epicMiddleware = createEpicMiddleware<Action<any>, Action<any>, RootState, {}>();
  const middlewares: any[] = [epicMiddleware];
  const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
  const s = createStore(rootReducer, {}, enhancer);

  epicMiddleware.run(rootEpic);

  return s;
};

const store = configureStore();

if (typeof module.hot !== 'undefined') {
  module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').rootReducer));
}

export default store;
