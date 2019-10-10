import { createStore, applyMiddleware, compose, Action } from 'redux';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { createEpicMiddleware } from 'redux-observable';

import createRootReducer, { RootState } from '../reducers';
import rootEpic from '../epics';

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = (initialState?: any) => {
  const epicMiddleware = createEpicMiddleware<
    Action<any>,
    Action<any>,
    RootState,
    {}
  >();
  const middleware = [routerMiddleware(history), epicMiddleware];

  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;

  const enhancers = applyMiddleware(...middleware);

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(enhancers)
  );

  epicMiddleware.run(rootEpic as any);

  if ((module as any).hot) {
    (module as any).hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
};

export default { configureStore, history };
