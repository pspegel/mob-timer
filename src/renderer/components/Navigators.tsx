import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { navigatorsAsTextSelector } from '../reducers/selectors';
import { manualUpdateNavigators } from '../actions';

const Navigators: React.FunctionComponent<{}> = () => {
  const navigators = useSelector(navigatorsAsTextSelector);
  const dispatch = useDispatch();
  const updateNavigators = React.useCallback((e) => dispatch(manualUpdateNavigators(e.target.value)), [dispatch]);
  return (
    <div className="inner-wrap">
      <h2>Navigators</h2>
      <textarea
        placeholder="Write a navigators name on each line"
        rows={6}
        cols={40}
        value={navigators}
        onChange={updateNavigators}
        />
    </div>
  );
};

export default Navigators;
