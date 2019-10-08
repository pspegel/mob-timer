import { createSelector } from 'reselect';

import { RootState } from '.';

const driversSelector = (state: RootState) => state.roles.drivers;
const navigatorsSelector = (state: RootState) => state.roles.navigators;
const newlineSelector = (state: RootState) => state.roles.newline;

const textWithTrailingNewline = (list: string[], newline: boolean) =>
  list.join('\n') + (newline ? '\n' : '');

export const driversAsTextSelector = createSelector<
  RootState,
  string[],
  boolean,
  string
>(
  driversSelector,
  newlineSelector,
  textWithTrailingNewline
);

export const navigatorsAsTextSelector = createSelector<
  RootState,
  string[],
  boolean,
  string
>(
  navigatorsSelector,
  newlineSelector,
  textWithTrailingNewline
);
