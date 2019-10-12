import React from 'react';

import Timer from '../components/Timer';
import CurrentRoles from '../components/CurrentRoles';
import Duration from '../components/Duration';
import Drivers from '../components/Drivers';
import Navigators from '../components/Navigators';

const Settings: React.FunctionComponent<{}> = () => (
  <div className="settings">
    <div className="settings-timesup">
      <span>Time's up!</span>
    </div>
    <div className="settings-content">
      <h1>Mob timer</h1>
      <Timer />
      <CurrentRoles />
      <Duration />
      <Drivers />
      <Navigators />
    </div>
  </div>
);

export default Settings;
