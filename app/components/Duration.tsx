import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { incrementDuration, decrementDuration } from '../actions';
import { durationSelector } from '../reducers/selectors';

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
      <button type="button" onClick={decrement}>
        -
      </button>
      <button type="button" onClick={increment}>
        +
      </button>
    </>
  );
};

export default Duration;
