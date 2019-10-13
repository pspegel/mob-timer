import { TestScheduler } from 'rxjs/testing';
import { ipcRenderer } from 'electron';

import timer from '../timer';
import { timerStart, timerTick, timerEnded } from 'app/actions';
import { TimerState } from 'app/reducers/timer';

jest.mock('electron');

const secondsPerMinute = 1; // To reduce the number of emitted actions in the test

describe('timer epic', () => {
  it('should emit a tick every second and end with a timer ended action', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
      expect(ipcRenderer.send).toHaveBeenNthCalledWith(1, 'timer-started');
      expect(ipcRenderer.send).toHaveBeenNthCalledWith(2, 'timer-ended');
      expect(ipcRenderer.send).toHaveBeenCalledTimes(2);
    });

    testScheduler.run(({ hot, expectObservable }) => {
      const action$ = hot('s', {
        s: timerStart()
      });

      const timerState: Partial<TimerState> = {
        duration: 2,
        secondsPerMinute
      };

      const store$ = {
        value: {
          timer: timerState,
          roles: {
            isValid: true
          }
        }
      } as any;

      const output$ = timer(action$ as any, store$, null);

      expectObservable(output$).toBe('a 999ms b 999ms c 999ms e', {
        a: timerTick(2),
        b: timerTick(1),
        c: timerTick(0),
        e: timerEnded()
      });
    });
  });

  it('should do nothing when the roles are invalid', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run(({ hot, expectObservable }) => {
      const action$ = hot('s', {
        s: timerStart()
      });

      const timerState: Partial<TimerState> = {
        duration: 2,
        secondsPerMinute
      };

      const store$ = {
        value: {
          timer: timerState,
          roles: {
            isValid: false
          }
        }
      } as any;

      const output$ = timer(action$ as any, store$, null);

      expectObservable(output$).toBe('');
    });
  });
});
