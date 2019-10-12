import { getType } from 'typesafe-actions';

import {
  TimerAction,
  timerTick,
  incrementDuration,
  decrementDuration
} from 'app/actions';

export type TimerState = Readonly<{
  duration: number;
  secondsLeft: number;
  secondsPerMinute: number;
}>;

const DEFAULT_DURATION = 7;
export const MAX_DURATION = 60;
export const MIN_DURATION = 1;
const SECONDS_PER_MINUTE = 1; // To make it easier to test.

const initialState: TimerState = {
  duration: DEFAULT_DURATION,
  secondsLeft: 0,
  secondsPerMinute: SECONDS_PER_MINUTE
};

export default (state: TimerState = initialState, action: TimerAction) => {
  switch (action.type) {
    case getType(timerTick):
      return {
        ...state,
        secondsLeft: action.payload
      };

    case getType(incrementDuration):
      return {
        ...state,
        duration: Math.min(state.duration + 1, MAX_DURATION)
      };

    case getType(decrementDuration):
      return {
        ...state,
        duration: Math.max(state.duration - 1, MIN_DURATION)
      };

    default:
      return state;
  }
};
