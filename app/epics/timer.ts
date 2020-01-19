import { interval } from 'rxjs';
import {
  filter,
  exhaustMap,
  map,
  takeWhile,
  endWith,
  startWith,
  tap,
  finalize
} from 'rxjs/operators';
import { Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';

import { timerStart, timerTick, timerEnded, RootAction } from 'app/actions';
import { RootState } from 'app/reducers';
import {
  durationSelector,
  secondsPerMinuteSelector,
  isValidSelector
} from 'app/reducers/selectors';
import { ipcRenderer } from 'electron';

const epic: Epic<RootAction, RootAction, RootState, {}> = (action$, store$) =>
  action$.pipe(
    filter(isActionOf(timerStart)),
    filter(() => isValidSelector(store$.value)),
    tap(() => {
      ipcRenderer.send('timer-started');
    }),
    exhaustMap(() => {
      const duration = durationSelector(store$.value);
      return interval(1000).pipe(
        map(seconds => seconds + 1), // Interval starts at 0
        map(seconds =>
          timerTick(duration * secondsPerMinuteSelector(store$.value) - seconds)
        ),
        takeWhile(({ payload: secondsLeft }) => secondsLeft >= 0),
        startWith(timerTick(duration * secondsPerMinuteSelector(store$.value))),
        endWith(timerEnded()),
        finalize(() => {
          ipcRenderer.send('timer-ended');
        })
      );
    })
  );

export default epic;
