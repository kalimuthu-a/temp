/* eslint-disable no-alert */
import React from 'react';
import FlightJourneyTab from './FlightJourneyTab';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Skyplus/FlightJourneyTab',
  component: FlightJourneyTab,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    variant: 'filled',
  },
};

const sectors = [
  {
    origin: 'DEL',
    destination: 'BLR',
    key: 1,
  },
  {
    origin: 'BLR',
    destination: 'DEL',
    key: 2,
  },
  {
    origin: 'DEL',
    destination: 'BLR',
    key: 3,
  },
  {
    origin: 'BLR',
    destination: 'DEL',
    key: 4,
  },
  {
    origin: 'DEL',
    destination: 'BLR',
    key: 5,
  },
];

export const OneWay = () => {
  return <FlightJourneyTab sectors={sectors.slice(0, 1)} />;
};

export const RoundTrip = () => {
  return <FlightJourneyTab sectors={sectors.slice(0, 2)} />;
};

export const MultiCity = () => {
  return (
    <FlightJourneyTab
      sectors={sectors.slice(0, 3)}
      onChangeCallback={() => {}}
    />
  );
};
