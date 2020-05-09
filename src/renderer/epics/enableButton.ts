import { timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';

import { timerEnded, RootAction, enableButton } from '../actions';
import { RootState } from '../reducers';

const epic: Epic<RootAction, RootAction, RootState, {}> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(timerEnded)),
    switchMap(() => timer(3000).pipe(map(() => enableButton())))
  );

export default epic;
