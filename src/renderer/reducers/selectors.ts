import { createSelector } from 'reselect';

import { RootState } from '.';

const driversSelector = (state: RootState) => state.roles.drivers;
const navigatorsSelector = (state: RootState) => state.roles.navigators;
const newlineSelector = (state: RootState) => state.roles.newline;

const textWithTrailingNewline = (list: string[], newline: boolean) =>
    list.join('\n') + (newline ? '\n' : '');

export const driversAsTextSelector = createSelector<RootState, string[], boolean, string>(
    driversSelector,
    newlineSelector,
    textWithTrailingNewline
);

export const navigatorsAsTextSelector = createSelector<RootState, string[], boolean, string>(
    navigatorsSelector,
    newlineSelector,
    textWithTrailingNewline
);

export const driverSelector = (state: RootState) => state.roles.driver;
export const navigatorSelector = (state: RootState) => state.roles.navigator;

export const durationSelector = (state: RootState) => state.timer.duration;

const secondsLeftSelector = (state: RootState) => state.timer.secondsLeft;

export const timeSelector = createSelector<RootState, number, string>(
    secondsLeftSelector,
    secondsLeft => {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft - minutes * 60;

        return `${`${minutes}`.padStart(2, '0')  }:${  `${seconds}`.padStart(2, '0')}`;
    }
);

export const secondsPerMinuteSelector = (state: RootState) => state.timer.secondsPerMinute; // For test

export const isValidSelector = (state: RootState) => state.roles.isValid;
