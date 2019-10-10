import timer, { TimerState } from '../timer';
import { timerTick } from '../../actions';

describe('timer reducer', () => {
  it('should have an initial state', () => {
    const expected: TimerState = {
      duration: 7,
      secondsLeft: 0
    };

    const actual = timer(undefined, { type: '' } as any);

    expect(actual).toEqual(expected);
  });

  it('should be able to update the number of seconds left', () => {
    const expected: TimerState = {
      duration: 7,
      secondsLeft: 155
    };

    const actual = timer(
      { ...expected, secondsLeft: 156 },
      timerTick(expected.secondsLeft)
    );

    expect(actual).toEqual(expected);
  });
});
