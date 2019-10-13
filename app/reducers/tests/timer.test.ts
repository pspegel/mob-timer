import { fill } from 'lodash';

import timer, { TimerState } from '../timer';
import { timerTick, incrementDuration, decrementDuration } from 'app/actions';

describe('timer reducer', () => {
  it('should have an initial state', () => {
    const expected: TimerState = {
      duration: 7,
      secondsLeft: 0,
      secondsPerMinute: 60
    };

    const actual = timer(undefined, { type: '' } as any);

    expect(actual).toEqual(expected);
  });

  it('should be able to update the number of seconds left', () => {
    const expected: TimerState = {
      duration: 7,
      secondsLeft: 155,
      secondsPerMinute: 60
    };

    const actual = timer(
      { ...expected, secondsLeft: 156 },
      timerTick(expected.secondsLeft)
    );

    expect(actual).toEqual(expected);
  });

  it('should be possible to increase the duration by one minute', () => {
    const expected: TimerState = {
      duration: 8,
      secondsLeft: 0,
      secondsPerMinute: 60
    };

    const actual = timer(undefined, incrementDuration());

    expect(actual).toEqual(expected);
  });

  it('should be possible to reduce the duration by one minute', () => {
    const expected: TimerState = {
      duration: 6,
      secondsLeft: 0,
      secondsPerMinute: 60
    };

    const actual = timer(undefined, decrementDuration());

    expect(actual).toEqual(expected);
  });

  it('should not be possible to set a duration longer than one hour', () => {
    const expected = fill(Array(2), expect.objectContaining({ duration: 60 }));

    const actual = [
      timer(
        { duration: 59, secondsLeft: 0, secondsPerMinute: 60 },
        incrementDuration()
      )
    ];
    actual.push(timer(actual[0], incrementDuration()));

    expect(actual).toEqual(expected);
  });

  it('should not be possible to set a duration shorter than one minute', () => {
    const expected = fill(Array(2), expect.objectContaining({ duration: 1 }));

    const actual = [
      timer(
        { duration: 2, secondsLeft: 0, secondsPerMinute: 60 },
        decrementDuration()
      )
    ];
    actual.push(timer(actual[0], decrementDuration()));

    expect(actual).toEqual(expected);
  });
});
