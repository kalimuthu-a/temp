import React, { useContext, useEffect, useState } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import { deleteAccountApi, getSettingsAemData } from '../../../services/deleteAccount.service';
import SettingsContext from './SettingsContext';
import { settingsActions } from './SettingsReducer';
import profileBtnClickAnalytics from '../../../functions/profileBtnClickAnalytics';

function Settings() {
  const { state, dispatch } = useContext(SettingsContext);
  const { showPopup, userType, settingsAemData } = state;
  const popupData = settingsAemData?.deleteAccountPopupMessage;

  const fetchSettingsData = async () => {
    const settingsAemData = await getSettingsAemData(userType);
    dispatch({ type: settingsActions.SET_SETTINGS_AEM_DATA, payload: settingsAemData });
  };
  useEffect(() => {
    fetchSettingsData();
  }, []);

  function onCloseHandler() {
    dispatch({ type: settingsActions.TOGGLE_POPUP, payload: false });
  }
  function onClickHandler() {
    dispatch({ type: settingsActions.TOGGLE_POPUP, payload: true });
  }

  return (
    <div className="revamp-user-profile-settings user-profile-right-frame">
      <Heading containerClass="revamp-user-profile-settings-primary-heading h4 text-center d-none d-md-block">
        {settingsAemData?.title}
      </Heading>
      <Button
        containerClass="logout-button align-center mt-10"
        color="primary"
        variant="filled"
        onClick={() => {
          profileBtnClickAnalytics(settingsAemData?.logoutLabel, 'Settings');
          document.dispatchEvent(new CustomEvent('logoutSuccessEvent'));
        }}
        block
      >
        {settingsAemData?.logoutLabel}
      </Button>

      <a
        href="#"
        aria-label="button"
        className="revamp-user-profile-settings-blue-link align-center delete-account"
        onClick={(e) => {
          e.preventDefault(); // Prevent page navigation
          onClickHandler();
        }}
      >
        {settingsAemData?.deleteAccountLabel}
      </a>

      {showPopup && (
        <PopupModalWithContent
          className="revamp-user-profile-settings-delete"
          onCloseHandler={onCloseHandler}
          modalTitle={popupData?.heading}
        >
          <div dangerouslySetInnerHTML={{ __html: popupData?.description?.html }} />
          <Button
            classNames="w-100"
            containerClass="mt-10"
            onClick={() => {
              deleteAccountApi(); // Make sure no auto redirection occurs
            }}
            {...{ size: 'large', variant: 'outline', color: 'primary' }}
          >
            {popupData?.ctaLabel}
          </Button>
        </PopupModalWithContent>
      )}

    </div>
  );
}

Settings.propTypes = {};

export default Settings;
