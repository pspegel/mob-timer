import { getType } from 'typesafe-actions';

import {
  RoleActions,
  copyDriversToNavigators,
  manualNextDriver,
  manualNextNavigator,
  manualSwitchDriverAndNavigator,
  manualUpdateDrivers,
  manualUpdateNavigators
} from '../actions';

export type RolesState = Readonly<{
  drivers: string[];
  navigators: string[];
  driver: string;
  navigator: string;
}>;

const initialState: RolesState = {
  drivers: [],
  navigators: [],
  driver: null,
  navigator: null
};

const getNextExcept = (list: string[], current: string, except: string) => {
  const allExcept = list.filter(x => x !== except);

  const currentIndex = current ? allExcept.findIndex(x => x === current) : -1;

  const extendedList = [...allExcept, ...allExcept];

  return extendedList[currentIndex + 1] || null;
};

const textToList = (text: string) =>
  text
    .split('\n')
    .map(x => x.trim())
    .filter(x => !!x);

export default (state: RolesState = initialState, action: RoleActions) => {
  let nextDriver: string;
  let nextNavigator: string;

  switch (action.type) {
    case getType(copyDriversToNavigators):
      return {
        ...state,
        navigators: state.drivers,
        navigator: getNextExcept(state.drivers, null, state.driver)
      };

    case getType(manualNextDriver):
      if (!state.driver) {
        return state;
      }

      nextDriver = getNextExcept(state.drivers, state.driver, state.navigator);

      if (nextDriver === state.driver) {
        return state;
      }

      return {
        ...state,
        driver: nextDriver
      };

    case getType(manualNextNavigator):
      if (!state.navigator) {
        return state;
      }

      nextNavigator = getNextExcept(
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

    case getType(manualSwitchDriverAndNavigator):
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

    case getType(manualUpdateDrivers):
      const nextDrivers = textToList(action.payload);

      nextDriver =
        nextDrivers.findIndex(d => d === state.driver) === -1
          ? nextDrivers.length > 0
            ? getNextExcept(nextDrivers, null, state.navigator)
            : null
          : state.driver;

      return {
        ...state,
        drivers: nextDrivers,
        driver: nextDriver
      };

    case getType(manualUpdateNavigators):
      const nextNavigators = textToList(action.payload);

      nextNavigator =
        nextNavigators.findIndex(d => d === state.navigator) === -1
          ? nextNavigators.length > 0
            ? getNextExcept(nextNavigators, null, state.driver)
            : null
          : state.navigator;

      return {
        ...state,
        navigators: nextNavigators,
        navigator: nextNavigator
      };

    default:
      return state;
  }
};
