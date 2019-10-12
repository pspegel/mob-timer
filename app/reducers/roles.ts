import { getType } from 'typesafe-actions';

import {
  RoleAction,
  copyDriversToNavigators,
  manualNextDriver,
  manualNextNavigator,
  manualSwitchDriverAndNavigator,
  manualUpdateDrivers,
  manualUpdateNavigators,
  ManualUpdateDriversAction,
  ManualUpdateNavigatorsAction,
  timerEnded
} from '../actions';

export type RolesState = Readonly<{
  drivers: string[];
  navigators: string[];
  driver: string;
  navigator: string;
  newline: boolean;
  isValid: boolean;
}>;

const initialState: RolesState = {
  drivers: [],
  navigators: [],
  driver: null,
  navigator: null,
  newline: false,
  isValid: false
};

const getNextExcept = (list: string[], current: string, except?: string) => {
  const allExcept = list.filter(x => x !== except);

  const currentIndex = current ? allExcept.findIndex(x => x === current) : -1;

  const extendedList = [...allExcept, ...allExcept];

  const next = extendedList[currentIndex + 1];

  if (!next || next === current) {
    return null;
  }

  return next;
};

const textToList = (text: string) => ({
  list: text
    .split('\n')
    .map(x => x.trim())
    .filter(x => !!x),
  newline: text.match(/\n+[ ]*$/) !== null
});

const handleCopyDriversToNavigators = (state: RolesState) => ({
  ...state,
  navigators: state.drivers,
  navigator: getNextExcept(state.drivers, null, state.driver)
});

const handleManualNextDriver = (state: RolesState) => {
  const nextDriver = getNextExcept(
    state.drivers,
    state.driver,
    state.navigator
  );

  if (!nextDriver) {
    return state;
  }

  return {
    ...state,
    driver: nextDriver
  };
};

const handleManualNextNavigator = (state: RolesState) => {
  const nextNavigator = getNextExcept(
    state.navigators,
    state.navigator,
    state.driver
  );

  if (!nextNavigator) {
    return state;
  }

  return {
    ...state,
    navigator: nextNavigator
  };
};

const handleManualSwitchDriverAndNavigator = (state: RolesState) => {
  const driverIndexInNavigators = state.navigators.findIndex(
    n => n === state.driver
  );
  const navigatorIndexInDrivers = state.drivers.findIndex(
    d => d === state.navigator
  );

  if (driverIndexInNavigators < 0 || navigatorIndexInDrivers < 0) {
    return state;
  }

  return {
    ...state,
    driver: state.navigator,
    navigator: state.driver
  };
};

const manualUpdateHelper = (
  list: string[],
  nextList: string[],
  current: string,
  counterpart: string
) => {
  current = current || '';
  counterpart = counterpart || '';

  const oldIndex = list.findIndex(x => x === current);

  let next = nextList[oldIndex] || '';

  const leastCommonLength = Math.min(current.length, next.length);

  if (
    leastCommonLength === 0 ||
    current.substring(0, leastCommonLength) !==
      next.substring(0, leastCommonLength) ||
    next === counterpart
  ) {
    next =
      nextList.findIndex(d => d === current) === -1
        ? nextList.length > 0
          ? getNextExcept(nextList, null, counterpart)
          : null
        : current;
  }

  return next;
};

const handleManualUpdateDrivers = (
  state: RolesState,
  action: ManualUpdateDriversAction
) => {
  const { list: nextDrivers, newline } = textToList(action.payload);

  const nextDriver = manualUpdateHelper(
    state.drivers,
    nextDrivers,
    state.driver,
    state.navigator
  );

  return {
    ...state,
    drivers: nextDrivers,
    driver: nextDriver,
    newline
  };
};

const handleManualUpdateNavigators = (
  state: RolesState,
  action: ManualUpdateNavigatorsAction
) => {
  const { list: nextNavigators, newline } = textToList(action.payload);

  let nextNavigator = manualUpdateHelper(
    state.navigators,
    nextNavigators,
    state.navigator,
    state.driver
  );

  return {
    ...state,
    navigators: nextNavigators,
    navigator: nextNavigator,
    newline
  };
};

const handleTimerEnded = (state: RolesState) => {
  const nextDriver =
    state.drivers.length === 1
      ? state.driver
      : getNextExcept(state.drivers, state.driver);

  const nextNavigator = getNextExcept(
    state.navigators,
    state.navigator,
    nextDriver
  );

  return {
    ...state,
    driver: nextDriver,
    navigator: nextNavigator
  };
};

const innerReducer = (state: RolesState, action: RoleAction) => {
  switch (action.type) {
    case getType(copyDriversToNavigators):
      return handleCopyDriversToNavigators(state);

    case getType(manualNextDriver):
      return handleManualNextDriver(state);

    case getType(manualNextNavigator):
      return handleManualNextNavigator(state);

    case getType(manualSwitchDriverAndNavigator):
      return handleManualSwitchDriverAndNavigator(state);

    case getType(manualUpdateDrivers):
      return handleManualUpdateDrivers(state, action);

    case getType(manualUpdateNavigators):
      return handleManualUpdateNavigators(state, action);

    case getType(timerEnded):
      return handleTimerEnded(state);

    default:
      return state;
  }
};

const validate = (state: RolesState) => {
  const isValid =
    state.drivers.length >= 1 &&
    state.navigators.length >= 2 &&
    !!state.driver &&
    !!state.navigator;

  return {
    ...state,
    isValid
  };
};

export default (state: RolesState = initialState, action: RoleAction) => {
  const nextState = innerReducer(state, action);
  if (nextState !== state) {
    return validate(nextState);
  }

  return state;
};
