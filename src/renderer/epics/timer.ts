import { ipcRenderer } from 'electron';
import { interval } from 'rxjs';
import { filter, exhaustMap, map, takeWhile, endWith, startWith, tap, finalize } from 'rxjs/operators';
import { Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';

import { timerStart, timerTick, timerEnded, RootAction } from '../actions';
import { RootState } from '../reducers';
import { durationSelector, secondsPerMinuteSelector } from '../reducers/selectors';

const epic: Epic<RootAction, RootAction, RootState, {}> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(timerStart)),
    tap(() => {
      ipcRenderer.send('timer-started');
    }),
    exhaustMap(() => {
      const duration = durationSelector(state$.value);
      return interval(1000).pipe(
        map((seconds) => seconds + 1), // Interval starts at 0
        map((seconds) => timerTick(duration * secondsPerMinuteSelector(state$.value) - seconds)),
        takeWhile(({ payload: secondsLeft }) => secondsLeft >= 0),
        startWith(timerTick(duration * secondsPerMinuteSelector(state$.value))),
        endWith(timerEnded()),
        finalize(() => {
          ipcRenderer.send('timer-ended');
        })
      );
    })
  );

export default epic;
