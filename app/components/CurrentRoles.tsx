import React from 'react';

const CurrentRoles: React.FunctionComponent<{}> = () => (
  <div className="current-roles inner-wrap">
    <div className="name-wrap">
      Driver: <span id="driver"></span>
    </div>
    <div className="name-wrap">
      Navigator: <span id="navigator"></span>
    </div>
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

export default CurrentRoles;
