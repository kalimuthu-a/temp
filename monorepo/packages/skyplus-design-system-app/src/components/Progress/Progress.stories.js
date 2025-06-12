import React from 'react';
import Progress from './Progress';

export default {
  title: 'Skyplus/Progress',
  component: Progress,
};

export const ProgressElem = () => {
  return (
    <div>
      <Progress
        allSteps={['pe', 'add on', 'seat', 'payment']}
        titlePos="top"
        currentStep="seat"
        title="Progress title"
      />
      <br />
      <Progress
        allSteps={['pe', 'add on', 'seat', 'payment']}
        currentStep="add on"
        titlePos="bottom"
      />
    </div>
  );
};
