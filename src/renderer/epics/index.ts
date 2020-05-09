import { combineEpics } from 'redux-observable';

import timer from './timer';
import enableButton from './enableButton';

export default combineEpics(timer, enableButton);
