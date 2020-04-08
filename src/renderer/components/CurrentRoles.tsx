import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { driverSelector, navigatorSelector, isValidSelector } from '../reducers/selectors';
import {
    manualNextDriver,
    manualNextNavigator,
    manualSwitchDriverAndNavigator,
    timerStart
} from '../actions';

const CurrentRoles: React.FunctionComponent<{}> = () => {
    const driver = useSelector(driverSelector);
    const navigator = useSelector(navigatorSelector);
    const isValid = useSelector(isValidSelector);
    const dispatch = useDispatch();
    const startTimer = React.useCallback(() => dispatch(timerStart()), [dispatch]);
    const nextDriver = React.useCallback(() => dispatch(manualNextDriver()), [dispatch]);
    const nextNavigator = React.useCallback(() => dispatch(manualNextNavigator()), [dispatch]);
    const swapRoles = React.useCallback(() => dispatch(manualSwitchDriverAndNavigator()), [
        dispatch
    ]);

    return (
        <div className="current-roles inner-wrap">
            <div className="name-wrap">
                Driver: <span>{driver}</span>
            </div>
            <div className="name-wrap">
                Navigator: <span>{navigator}</span>
            </div>
            <div className="button-wrap">
                <button
                    type="button"
                    onClick={startTimer}
                    disabled={!isValid}
                    className="go-button">
                    Go!
                </button>
                <div className="form-group">
                    <button type="button" onClick={nextDriver}>
                        Skip driver
                    </button>
                    <button type="button" onClick={nextNavigator}>
                        Skip navigator
                    </button>
                </div>
                <button type="button" onClick={swapRoles}>
                    Switch driver/navigator
                </button>
            </div>
        </div>
    );
};
export default CurrentRoles;
