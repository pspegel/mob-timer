import { getType } from 'typesafe-actions';

import {
  RoleActions,
  copyDriversToNavigators,
  manualNextDriver,
  manualNextNavigator,
  manualSwitchDriverAndNavigator,
  manualUpdateDrivers,
  manualUpdateNavigators,
  ManualUpdateDriversAction,
  ManualUpdateNavigatorsAction
} from '../actions';

export type RolesState = Readonly<{
  drivers: string[];
  navigators: string[];
  driver: string;
  navigator: string;
  newline: boolean;
}>;

const initialState: RolesState = {
  drivers: [],
  navigators: [],
  driver: null,
  navigator: null,
  newline: false
};

const getNextExcept = (list: string[], current: string, except: string) => {
  const allExcept = list.filter(x => x !== except);

  const currentIndex = current ? allExcept.findIndex(x => x === current) : -1;

  const extendedList = [...allExcept, ...allExcept];

  return extendedList[currentIndex + 1] || null;
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
  if (!state.driver) {
    return state;
  }

  const nextDriver = getNextExcept(
    state.drivers,
    state.driver,
    state.navigator
  );

  if (nextDriver === state.driver) {
    return state;
  }

  return {
    ...state,
    driver: nextDriver
  };
};

const handleManualNextNavigator = (state: RolesState) => {
  if (!state.navigator) {
    return state;
  }

  const nextNavigator = getNextExcept(
    state.navigators,
    state.navigator,
    state.driver
  );

  if (nextNavigator === state.navigator) {
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

  const nextNavigator = manualUpdateHelper(
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

export default (state: RolesState = initialState, action: RoleActions) => {
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

    default:
      return state;
  }
};
