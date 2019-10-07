import React from 'react';

import Timer from '../components/Timer';
import CurrentRoles from '../components/CurrentRoles';
import Duration from '../components/Duration';
import Drivers from '../components/Drivers';
import Navigators from '../components/Navigators';

const Settings: React.FunctionComponent<{}> = () => (
  <div className="settings">
    <h1>Mob timer</h1>
    <Timer />
    <CurrentRoles />
    <Duration />
    <Drivers />
    <Navigators />
  </div>
);

export default Settings;
