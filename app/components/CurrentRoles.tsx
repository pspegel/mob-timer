import React from 'react';
import { useSelector } from 'react-redux';

import { driverSelector, navigatorSelector } from '../reducers/selectors';

const CurrentRoles: React.FunctionComponent<{}> = () => {
  const driver = useSelector(driverSelector);
  const navigator = useSelector(navigatorSelector);
  return (
    <div className="current-roles inner-wrap">
      <div className="name-wrap">Driver: {driver}</div>
      <div className="name-wrap">Navigator: {navigator}</div>
      <div className="button-wrap">
        <button type="button" id="run" disabled>
          Go!
        </button>
        <button type="button" id="skipDriver">
          Skip driver
        </button>
        <button type="button" id="skipNavigator">
          Skip navigator
        </button>
      </div>
    </div>
  );
};
export default CurrentRoles;
