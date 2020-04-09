import * as React from 'react';
import { ipcRenderer } from 'electron';

import Timer from './Timer';
import CurrentRoles from './CurrentRoles';
import Duration from './Duration';
import Drivers from './Drivers';
import Navigators from './Navigators';

const Settings: React.FunctionComponent<{}> = () => {
  React.useEffect(() => {
    window.addEventListener('load', () => {
      ipcRenderer.send('react-app-loaded');
    });
  });
  return (
    <div className="settings">
      <div className="settings-timesup">
        <span>Time&apos;s up!</span>
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
