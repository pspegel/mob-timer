import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { incrementDuration, decrementDuration } from '../actions';
import { durationSelector } from '../reducers/selectors';
import { MAX_DURATION, MIN_DURATION } from '../reducers/timer';

const Duration: React.FunctionComponent<{}> = () => {
  const duration = useSelector(durationSelector);
  const dispatch = useDispatch();
  const increment = useCallback(() => dispatch(incrementDuration()), [
    dispatch
  ]);
  const decrement = useCallback(() => dispatch(decrementDuration()), [
    dispatch
  ]);
  return (
    <>
      <h2>Duration</h2>
      <input type="text" value={duration} />
      <button
        type="button"
        onClick={decrement}
        disabled={duration <= MIN_DURATION}
      >
        -
      </button>
      <button
        type="button"
        onClick={increment}
        disabled={duration >= MAX_DURATION}
      >
        +
      </button>
    </>
  );
};

export default Duration;
