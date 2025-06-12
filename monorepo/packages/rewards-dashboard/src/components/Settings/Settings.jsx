import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Switch from 'skyplus-design-system-app/dist/des-system/Switch';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import FlightJourneyTab from 'skyplus-design-system-app/dist/des-system/FlightJourneyTab';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';

import Card from '../common/Card/Card';
import { SCREEN_TYPE } from '../../constants';

function Settings({ setActiveScreen }) {
  const [tripNotification, setTripNotification] = useState(true);
  const [offerNotification, setOfferNotification] = useState(true);
  const [priceAlertNotification, setPriceAlertNotification] = useState(true);
  const [newLauncesNotification, setNewLauncesNotification] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const sectors = [
    {
      origin: 'SMS',
      destination: null,
      key: 1,
    },
    {
      origin: 'Email',
      destination: null,
      key: 2,
    },
    {
      origin: 'On App',
      destination: null,
      key: 3,
    },
  ];

  function onCloseHandler() {
    setShowPopup(false);
  }

  return (
    <div className="revamp-user-profile-settings user-profile-right-frame ">
      <Heading containerClass="revamp-user-profile-settings-primary-heading h4 text-center">
        Settings
      </Heading>
      <Heading containerClass="revamp-user-profile-settings-secondary-heading h5">
        General settings
      </Heading>
      <Card className="revamp-user-profile-settings-card">
        <FlightJourneyTab
          containerClass="revamp-user-profile-settings-card-tab"
          sectors={sectors}
          onChangeCallback={(i) => {}}
        />
        <div className="revamp-user-profile-settings-row">
          <Text variation="sh7">Trip Notifications</Text>
          <Switch
            checked={tripNotification}
            onChange={() => {
              setTripNotification((prev) => !prev);
            }}
          />
        </div>
        <div className="revamp-user-profile-settings-row">
          <Text variation="sh7">Offer Notification</Text>
          <Switch
            checked={offerNotification}
            onChange={() => {
              setOfferNotification((prev) => !prev);
            }}
          />
        </div>
        <div className="revamp-user-profile-settings-row">
          <Text variation="sh7">Price Alert</Text>
          <Switch
            checked={priceAlertNotification}
            onChange={() => {
              setPriceAlertNotification((prev) => !prev);
            }}
          />
        </div>
        <div className="revamp-user-profile-settings-row">
          <Text variation="sh7">New launches & destinations</Text>
          <Switch
            checked={newLauncesNotification}
            onChange={() => {
              setNewLauncesNotification((prev) => !prev);
            }}
          />
        </div>
      </Card>
      <Card className="revamp-user-profile-settings-card">
        <a href="#" className="revamp-user-profile-settings-blue-link">
          Change password
        </a>
      </Card>
      <Button
        containerClass="logout-button align-center"
        color="primary"
        variant="filled"
        block
      >
        logout
      </Button>

      <a
        href="#"
        className="revamp-user-profile-settings-black-link align-center"
        onClick={() => setShowPopup(true)}
      >
        Delete Account
      </a>

      {showPopup && (
        <PopupModalWithContent
          className="revamp-user-profile-settings-delete"
          onCloseHandler={onCloseHandler}
          modalTitle="Purging of your Personal Data"
        >
          We respect your privacy. While we have implemented appropriate
          technical and organizational measures, you may seek to delete your 6E
          member account at any point of time by exercising such option in the
          6E desktop website or mobile application. ﻿﻿If you are an existing 6E
          Rewards User, your 6E Rewards balance will not be recoverable upon the
          deletion of the account.For any assistance on 6E Rewards, reach out .
          to our 24*7 customer care at 0124-6173838 ﻿﻿If you are an existing 6E
          Rewards User, your 6E Rewards balance will not be recoverable upon the
          deletion of the account. For any assistance on 6E Rewards, reach out .
          to our 24*7 customer care at 0124-6173838 Upon you exercising such
          option, your personal information shall not, in future, be available
          for bookings by you. However, please note that Indigo shall be
          required to retain your Personal/ Booking Data for its legitimate use
          or for such period as required by law, after which the same shall be
          destroyed by IndiGo.
          <Button
            onClick={() => setActiveScreen(SCREEN_TYPE.DELETE)}
            {...{ size: 'large', variant: 'outline', color: 'primary' }}
          >
            Agree
          </Button>
        </PopupModalWithContent>
      )}
    </div>
  );
}

Settings.propTypes = {
  setActiveScreen: PropTypes.func,
};

export default Settings;
