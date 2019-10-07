import roles, { RolesState } from '../roles';
import {
  copyDriversToNavigators,
  manualNextDriver,
  manualNextNavigator
} from '../../actions';

describe('roles reducer', () => {
  const someNames = ['Han Solo', 'C3PO', 'Jabba the Hutt'];

  it('should have an initial state', () => {
    const expected: RolesState = {
      drivers: [],
      navigators: [],
      driver: null,
      navigator: null
    };

    const actual = roles(undefined, { type: '' } as any);

    expect(actual).toEqual(expected);
  });

  it('should be able to copy all drivers to navigators', () => {
    const expected: RolesState = {
      drivers: [...someNames],
      navigators: [...someNames],
      driver: 'Han Solo',
      navigator: 'C3PO'
    };

    const actual = roles(
      { ...expected, navigators: [], navigator: null },
      copyDriversToNavigators()
    );

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
          navigator: 'C3PO'
        },
        manualNextDriver()
      )
    ];
    states.push(roles(states[0], manualNextDriver()));
    states.push(roles(states[1], manualNextDriver()));

    const actual = states.map(s => s.driver);

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
      navigator: 'R2D2'
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
          navigator: 'C3PO'
        },
        manualNextNavigator()
      )
    ];
    states.push(roles(states[0], manualNextNavigator()));
    states.push(roles(states[1], manualNextNavigator()));

    const actual = states.map(s => s.navigator);

    expect(actual).toEqual(expected);
  });

  it("should do nothing when manually skipping navigator and there's no navigators", () => {
    const expected: Partial<RolesState> = {
      navigators: [],
      navigator: null
    };

    const actual = roles(undefined, manualNextNavigator());

    expect(actual).toMatchObject(expected);
  });

  it('should do nothing when manually skipping navigator when pair programming', () => {
    const expected: RolesState = {
      drivers: ['Han Solo', 'R2D2'],
      driver: 'Han Solo',
      navigators: ['Han Solo', 'R2D2'],
      navigator: 'R2D2'
    };

    const actual = roles(expected, manualNextNavigator());

    expect(actual).toBe(expected);
  });
});
