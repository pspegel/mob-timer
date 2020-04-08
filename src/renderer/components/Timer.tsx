import * as React from 'react';
import { useSelector } from 'react-redux';

import { timeSelector } from '../reducers/selectors';

const Timer: React.FunctionComponent<{}> = () => {
    const time = useSelector(timeSelector);
    return <div className="timer">{time}</div>;
};

export default Timer;
