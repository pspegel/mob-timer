import { TestScheduler } from 'rxjs/testing';
import { ipcRenderer } from 'electron';

import timer from '../timer';
import { timerStart, timerTick, timerEnded } from '../../actions';
import { TimerState } from '../../reducers/timer';

jest.mock('electron');

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
        secondsPerMinute: 2
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

      expectObservable(output$).toBe('s 999ms a 999ms b 999ms c 999ms d 999ms e', {
        s: timerTick(4),
        a: timerTick(3),
        b: timerTick(2),
        c: timerTick(1),
        d: timerTick(0),
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
        secondsPerMinute: 1
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
