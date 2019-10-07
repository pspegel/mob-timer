import { getType } from 'typesafe-actions';

import {
  RoleActions,
  copyDriversToNavigators,
  manualNextDriver,
  manualNextNavigator
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
  const driversExceptNavigator = list.filter(d => d !== except);

  const currentDriverIndex = driversExceptNavigator.findIndex(
    d => d === current
  );

  const extendedDrivers = [
    ...driversExceptNavigator,
    ...driversExceptNavigator
  ];

  return extendedDrivers[currentDriverIndex + 1];
};

export default (state: RolesState = initialState, action: RoleActions) => {
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

    case getType(manualNextNavigator):
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

    default:
      return state;
  }
};
