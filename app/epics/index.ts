import { combineEpics } from 'redux-observable';

import timer from './timer';

export default combineEpics(timer);
