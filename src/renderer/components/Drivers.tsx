import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { driversAsTextSelector } from '../reducers/selectors';
import { manualUpdateDrivers, copyDriversToNavigators } from '../actions';

const Drivers: React.FunctionComponent<{}> = () => {
  const roles = useSelector(driversAsTextSelector);
  const dispatch = useDispatch();
  const updateDrivers = React.useCallback((e) => dispatch(manualUpdateDrivers(e.target.value)), [dispatch]);
  const copy = React.useCallback(() => dispatch(copyDriversToNavigators()), [dispatch]);
  return (
    <>
      <div className="inner-wrap">
        <h2>Drivers</h2>
        <textarea
          placeholder="Write a drivers name on each line"
          rows={6}
          cols={40}
          value={roles}
          onChange={updateDrivers}
          />
      </div>
      <button type="button" onClick={copy}>
        Copy drivers to navigators
      </button>
    </>
  );
};

export default Drivers;
