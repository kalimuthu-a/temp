import React from 'react';
import Button from '../Button/Button';
import Strip from './Strip';

export default {
  title: 'Skyplus/Strip',
  component: Strip,
};

export const Default = () => {
  return (
    <Strip
      data={{
        giftIcon: {
          _publishUrl: 'http://localhost:4503/content/dam/s6web/in/en/assets/itinerary/gift-ZqdXFQtW70.png',
        },
        scratchCardLabel: {
          html: '<p>Congratulations!<b> You have won a scratch card.</b></p>\n',
        },
        reedem: 'Redeem',
        backgroundColor: {
          color: 'Linear Gradient & Percentage',
          gradient: [
            {
              color: '#E0FED7',
              percentage: '0%',
            },
            {
              color: '#C1EDC1',
              percentage: '100%',
            },
          ],
        },
      }}
      ButtonComponent={Button}
    />
  );
};
