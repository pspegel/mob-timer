import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';

import Timer from 'app/components/Timer';
import CurrentRoles from 'app/components/CurrentRoles';
import Duration from 'app/components/Duration';
import Drivers from 'app/components/Drivers';
import Navigators from 'app/components/Navigators';

const Settings: React.FunctionComponent<{}> = () => {
  useEffect(() => {
    window.addEventListener('load', () => {
      ipcRenderer.send('react-app-loaded');
    });
  });
  return (
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
};

export default Settings;
