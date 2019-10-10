import { getType } from 'typesafe-actions';

import { TimerAction, timerTick } from '../actions';

export type TimerState = Readonly<{
  duration: number;
  secondsLeft: number;
}>;

const DEFAULT_DURATION = 7;

const initialState: TimerState = {
  duration: DEFAULT_DURATION,
  secondsLeft: 0
};

export default (state: TimerState = initialState, action: TimerAction) => {
  switch (action.type) {
    case getType(timerTick):
      return {
        ...state,
        secondsLeft: action.payload
      };

    default:
      return state;
  }
};
