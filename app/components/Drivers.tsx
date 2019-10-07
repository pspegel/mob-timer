import React from 'react';

const Drivers: React.FunctionComponent<{}> = () => (
  <>
    <div className="inner-wrap">
      <h2>Drivers</h2>
      <textarea
        placeholder="Write a drivers name on each line"
        rows={6}
        cols={40}
      />
    </div>
    <button type="button">Copy drivers to navigators</button>
  </>
);

export default Drivers;
