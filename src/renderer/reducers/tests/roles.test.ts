import { dropRight } from 'lodash';

import roles, { RolesState } from '../roles';
import {
  copyDriversToNavigators,
  manualNextDriver,
  manualNextNavigator,
  manualSwitchDriverAndNavigator,
  manualUpdateDrivers,
  manualUpdateNavigators,
  timerEnded
} from '../../actions';
import { callReducerRecursively } from '../../utils/testUtils';

describe('roles reducer', () => {
  const someNames = ['Han Solo', 'C3PO', 'Jabba the Hutt'];

  it('should have an initial state', () => {
    const expected: RolesState = {
      drivers: [],
      navigators: [],
      driver: null,
      navigator: null,
      newline: false,
      isValid: false
    };

    const actual = roles(undefined, { type: '' } as any);

    expect(actual).toEqual(expected);
  });

  it('should be able to copy all drivers to navigators', () => {
    const expected: RolesState = {
      drivers: [...someNames],
      navigators: [...someNames],
      driver: 'Han Solo',
      navigator: 'C3PO',
      newline: false,
      isValid: true
    };

    const actual = roles({ ...expected, navigators: [], navigator: null }, copyDriversToNavigators());

    expect(actual).toEqual(expected);
  });

  it('should be able to rotate between all drivers manually except the current navigator', () => {
    const expected = ['Jabba the Hutt', 'Han Solo', 'Jabba the Hutt'];

    const states = [
      roles(
        {
          drivers: [...someNames],
          navigators: [...someNames],
          driver: 'Han Solo',
          navigator: 'C3PO',
          newline: false,
          isValid: true
        },
        manualNextDriver()
      )
    ];
    states.push(roles(states[0], manualNextDriver()));
    states.push(roles(states[1], manualNextDriver()));

    const actual = states.map((s) => s.driver);

    expect(actual).toEqual(expected);
  });

  it("should do nothing when manually skipping driver and there's no drivers", () => {
    const expected: Partial<RolesState> = {
      drivers: [],
      driver: null
    };

    const actual = roles(undefined, manualNextDriver());

    expect(actual).toMatchObject(expected);
  });

  it('should do nothing when manually skipping driver when pair programming', () => {
    const expected: RolesState = {
      drivers: ['Han Solo', 'R2D2'],
      driver: 'Han Solo',
      navigators: ['Han Solo', 'R2D2'],
      navigator: 'R2D2',
      newline: false,
      isValid: true
    };

    const actual = roles(expected, manualNextDriver());

    expect(actual).toBe(expected);
  });

  it('should be able to rotate between all navigators manually except the current navigator', () => {
    const expected = ['Jabba the Hutt', 'C3PO', 'Jabba the Hutt'];

    const states = [
      roles(
        {
          drivers: [...someNames],
          navigators: [...someNames],
          driver: 'Han Solo',
          navigator: 'C3PO',
          newline: false,
          isValid: true
        },
        manualNextNavigator()
      )
    ];
    states.push(roles(states[0], manualNextNavigator()));
    states.push(roles(states[1], manualNextNavigator()));

    const actual = states.map((s) => s.navigator);

    expect(actual).toEqual(expected);
  });

  it("should do nothing when manually skipping navigator and there's no navigators", () => {
    const expected: Partial<RolesState> = {
      navigators: [],
      navigator: null,
      isValid: false
    };

    const actual = roles(undefined, manualNextNavigator());

    expect(actual).toMatchObject(expected);
  });

  it('should do nothing when manually skipping navigator when pair programming', () => {
    const expected: RolesState = {
      drivers: ['Han Solo', 'R2D2'],
      driver: 'Han Solo',
      navigators: ['Han Solo', 'R2D2'],
      navigator: 'R2D2',
      newline: false,
      isValid: true
    };

    const actual = roles(expected, manualNextNavigator());

    expect(actual).toBe(expected);
  });

  it('should be able to manually switch driver and navigator', () => {
    const expected: Partial<RolesState> = {
      driver: 'Han Solo',
      navigator: 'C3PO'
    };

    const actual = roles(
      {
        drivers: someNames,
        navigators: someNames,
        driver: 'C3PO',
        navigator: 'Han Solo',
        newline: false,
        isValid: true
      },
      manualSwitchDriverAndNavigator()
    );

    expect(actual).toMatchObject(expected);
  });

  it("should do nothing when manually switching driver and navigator when the driver doesn't exist in navigators", () => {
    const expected: RolesState = {
      drivers: someNames,
      navigators: ['Han Solo'],
      driver: 'C3PO',
      navigator: 'Han Solo',
      newline: false,
      isValid: false
    };

    const actual = roles(expected, manualSwitchDriverAndNavigator());

    expect(actual).toBe(expected);
  });

  it("should do nothing when manually switching driver and navigator when the navigator doesn't exist in drivers", () => {
    const expected: RolesState = {
      drivers: ['C3PO', 'Jabba the Hutt'],
      navigators: ['Han Solo', 'C3PO'],
      driver: 'C3PO',
      navigator: 'Han Solo',
      newline: false,
      isValid: true
    };

    const actual = roles(expected, manualSwitchDriverAndNavigator());

    expect(actual).toBe(expected);
  });

  it('should be possible to add a driver', () => {
    const expected: RolesState = {
      drivers: ['Han Solo'],
      navigators: [],
      driver: 'Han Solo',
      navigator: null,
      newline: true,
      isValid: false
    };

    const actual = roles(undefined, manualUpdateDrivers('\nHan Solo\n'));

    expect(actual).toEqual(expected);
  });

  it("should not select the newly added driver if it's the current navigator", () => {
    const navigator = 'Han Solo';
    const expected: RolesState[] = [
      {
        drivers: ['Han Sol'],
        navigators: ['C3PO', navigator],
        driver: 'Han Sol',
        navigator,
        newline: false,
        isValid: true
      },
      {
        drivers: ['Han Solo'],
        navigators: ['C3PO', navigator],
        driver: null,
        navigator,
        newline: false,
        isValid: false
      },
      {
        drivers: ['Han Solomon'],
        navigators: ['C3PO', navigator],
        driver: 'Han Solomon',
        navigator,
        newline: true,
        isValid: true
      }
    ];

    const actual = [roles({ ...expected[0], drivers: [] }, manualUpdateDrivers('Han Sol'))];
    actual.push(roles(actual[0], manualUpdateDrivers('Han Solo')));
    actual.push(roles(actual[1], manualUpdateDrivers('Han Solomon\n')));

    expect(actual).toEqual(expected);
  });

  it('should be possible to add a navigator', () => {
    const expected: RolesState = {
      drivers: [],
      navigators: someNames,
      driver: null,
      navigator: 'C3PO',
      newline: false,
      isValid: false
    };

    const actual = roles(
      { ...expected, navigators: dropRight(someNames) },
      manualUpdateNavigators('Han Solo \n  C3PO\n\nJabba the Hutt')
    );

    expect(actual).toEqual(expected);
  });

  it("should update the current driver when it's name is edited", () => {
    const actual = roles(
      {
        drivers: someNames,
        driver: 'C3PO',
        navigators: [],
        navigator: null,
        newline: false,
        isValid: false
      },
      manualUpdateDrivers(' Han Solo\n\nC3\nJabba the Hutt')
    );

    expect(actual.driver).toEqual('C3');
  });

  it("should update the current navigator when it's name is edited", () => {
    const actual = roles(
      {
        drivers: [],
        driver: null,
        navigators: someNames,
        navigator: 'Jabba the Hutt',
        newline: true,
        isValid: false
      },
      manualUpdateNavigators('Han Solo\n\nC3PO\nJabba the Hu\n')
    );

    expect(actual.navigator).toEqual('Jabba the Hu');
  });

  it('should switch around the roles when the round ends', () => {
    const expected = [
      { driver: 'Stormtrooper', navigator: 'Jango Fett', isValid: true },
      { driver: 'Leia', navigator: 'Stormtrooper', isValid: true },
      { driver: 'Amidala', navigator: 'Boba Fett', isValid: true },
      { driver: 'Boba Fett', navigator: 'Jango Fett', isValid: true }
    ].map((x) => expect.objectContaining(x));

    const state: RolesState = {
      drivers: ['Jango Fett', 'Stormtrooper', 'Leia', 'Amidala', 'Boba Fett'],
      navigators: ['Boba Fett', 'Jango Fett', 'Leia', 'Stormtrooper'],
      driver: 'Jango Fett',
      navigator: 'Boba Fett',
      newline: false,
      isValid: true
    };

    const actual = callReducerRecursively(roles, state, timerEnded(), expected.length);

    expect(actual).toEqual(expected);
  });

  it("should rotate the navigators when there's a single driver", () => {
    const expected = [
      { driver: 'Jango Fett', navigator: 'Leia', isValid: true },
      { driver: 'Jango Fett', navigator: 'Boba Fett', isValid: true },
      { driver: 'Jango Fett', navigator: 'Leia', isValid: true }
    ].map((x) => expect.objectContaining(x));

    const state: RolesState = {
      drivers: ['Jango Fett'],
      navigators: ['Boba Fett', 'Jango Fett', 'Leia'],
      driver: 'Jango Fett',
      navigator: 'Boba Fett',
      newline: false,
      isValid: true
    };

    const actual = callReducerRecursively(roles, state, timerEnded(), expected.length);

    expect(actual).toEqual(expected);
  });

  it("should mark the state as invalid when the next navigator can't be resolved", () => {
    const expected: Partial<RolesState> = {
      driver: 'Stormtrooper',
      navigator: null,
      isValid: false
    };

    const state: RolesState = {
      drivers: ['Jango Fett', 'Stormtrooper'],
      navigators: ['Amidala', 'Stormtrooper'],
      driver: 'Jango Fett',
      navigator: 'Amidala',
      newline: false,
      isValid: true
    };

    const actual = roles(state, timerEnded());

    expect(actual).toMatchObject(expected);
  });

  it('should be possible to recover from an invalid state where a navigator is missing', () => {
    const expected: Partial<RolesState> = {
      driver: 'Stormtrooper',
      navigator: 'Amidala',
      isValid: true
    };

    const state: RolesState = {
      drivers: ['Jango Fett', 'Stormtrooper'],
      navigators: ['Amidala', 'Stormtrooper'],
      driver: 'Stormtrooper',
      navigator: null,
      newline: false,
      isValid: false
    };

    const actual = roles(state, manualNextNavigator());

    expect(actual).toMatchObject(expected);
  });

  it('should pick the next person in the the respective list when the round ends and the lists are equal', () => {
    const expected: Partial<RolesState> = {
      driver: someNames[1],
      navigator: someNames[2],
      isValid: true
    };

    const state: RolesState = {
      drivers: someNames,
      navigators: someNames,
      driver: someNames[0],
      navigator: someNames[1],
      newline: false,
      isValid: true
    };

    const actual = roles(state, timerEnded());

    expect(actual).toMatchObject(expected);
  });
});
