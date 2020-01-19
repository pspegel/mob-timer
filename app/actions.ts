import { Action } from 'redux';
import { createStandardAction, ActionType } from 'typesafe-actions';

export type RootAction = Action;

export const shortenDuration = createStandardAction(
  'mob-timer/SHORTEN_DURATION'
)<void>();
export const extendDuration = createStandardAction('mob-timer/EXTEND_DURATION')<
  void
>();

export const manualNextDriver = createStandardAction(
  'mob-timer/MANUAL_NEXT_DRIVER'
)<void>();
export const manualNextNavigator = createStandardAction(
  'mob-timer/MANUAL_NEXT_NAVIGATOR'
)<void>();
export const manualSwitchDriverAndNavigator = createStandardAction(
  'mob-timer/MANUAL_SWITCH_DRIVER_AND_NAVIGATOR'
)<void>();

export const copyDriversToNavigators = createStandardAction(
  'mob-timer/COPY_DRIVERS_TO_NAVIGATORS'
)<void>();

export const manualUpdateDrivers = createStandardAction(
  'mob-timer/MANUAL_UPDATE_DRIVERS'
)<string>();

export const manualUpdateNavigators = createStandardAction(
  'mob-timer/MANUAL_UPDATE_NAVIGATORS'
)<string>();

export type RoleAction = ActionType<
  | typeof manualNextDriver
  | typeof manualNextNavigator
  | typeof manualSwitchDriverAndNavigator
  | typeof copyDriversToNavigators
  | typeof manualUpdateDrivers
  | typeof manualUpdateNavigators
  | typeof timerEnded
>;

export type ManualUpdateDriversAction = ActionType<typeof manualUpdateDrivers>;
export type ManualUpdateNavigatorsAction = ActionType<
  typeof manualUpdateNavigators
>;

export const incrementDuration = createStandardAction(
  'mob-timer/INCREMENT_DURATION'
)<void>();
export const decrementDuration = createStandardAction(
  'mob-timer/DECREMENT_DURATION'
)<void>();
export const timerStart = createStandardAction('mob-timer/TIMER_START')<void>();
export const timerTick = createStandardAction('mob-timer/TIMER_TICK')<number>();
export const timerEnded = createStandardAction('mob-timer/TIMER_ENDED')<void>();

export type TimerAction = ActionType<
  | typeof incrementDuration
  | typeof decrementDuration
  | typeof timerStart
  | typeof timerTick
  | typeof timerEnded
>;
