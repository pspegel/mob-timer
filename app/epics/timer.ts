import { interval } from 'rxjs';
import {
  filter,
  exhaustMap,
  map,
  takeWhile,
  endWith,
  startWith
} from 'rxjs/operators';
import { Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';

import { timerStart, timerTick, timerEnded, RootAction } from '../actions';
import { RootState } from '../reducers';
import { durationSelector } from '../reducers/selectors';

const epic: Epic<RootAction, RootAction, RootState, {}> = (action$, store$) =>
  action$.pipe(
    filter(isActionOf(timerStart)),
    exhaustMap(() => {
      const duration = durationSelector(store$.value);
      return interval(1000).pipe(
        map(seconds => seconds + 1), // Interval starts at 0
        map(seconds => timerTick(duration * 1 - seconds)),
        takeWhile(({ payload: secondsLeft }) => secondsLeft >= 0),
        startWith(timerTick(duration * 1)),
        endWith(timerEnded())
      );
    })
  );

export default epic;
