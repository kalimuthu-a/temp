import React, { useState, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import cloneDeep from 'lodash/cloneDeep';
import { AppContext } from '../../../context/appContext';
import SavedPassengersSlider from './SavedPassengersSlider';
import SavedPassengersSideBar from './SavedPassengersSideBar';
import './SavedPassengers.scss';
import passengerEditActions from '../../../context/actions';
import {
  PASSENGER_TYPE,
} from '../../../constants/constants';
import { isValidAndNotFutureDate } from '../../../functions/checkFutureOrValidDate';
import { padNumber } from '../../../helpers';

function SavedPassengers(props) {
  const {
    state: { isAuthenticated,
      loggedInUser,
      savedPassengers,
      paxData,
    },
    dispatch,
  } = useContext(AppContext);

  const { loyaltyMemberInfo } = loggedInUser || {};
  const configurations = paxData?.configurations;

  const { getValues } = useFormContext();

  // const paxUserFieldData = getValues();
  // const userFieldsData = cloneDeep(paxUserFieldData?.userFields);

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { SELECT_SAVED_PASSENGERS } = passengerEditActions;

  const selectPassengers = (selectedFavPax) => {
    dispatch({
      type: SELECT_SAVED_PASSENGERS,
      payload: { selectedFavPax },
    });
  };

  const whichFieldToFill = (userFieldsData, type, isSrct, isSelected, userFieldIndex) => {
    if (isSelected) return userFieldIndex;
    return userFieldsData?.findIndex((pax) => {
      if (isSrct && configurations?.srctCount) {
        return (
          pax?.passengerTypeCode === type
          && pax?.discountCode === PASSENGER_TYPE.SENIOUR
          && !pax?.isFromFavList
        );
      }
      return pax?.passengerTypeCode === type && !pax?.isFromFavList;
    });
  };

  // This function will decide if the saved pax should be disabled or not
  const shouldUserTypeDisabled = (arr, type, isSrct, isSelected) => {
    if (isSelected) return false;
    const { adultCount, childCount, infantCount, srctCount } = paxData?.configurations || {};
    const typePaxLen = arr.filter(
      (item) => item.type === type && !item.isSrct && item.isSelected,
    ).length;
    const srctTypePaxLen = arr.filter(
      (item) => item.type === type && item.isSrct && item.isSelected,
    ).length;

    if (type === PASSENGER_TYPE.ADULT && isSrct && srctTypePaxLen >= srctCount && srctCount) return true;
    if (type === PASSENGER_TYPE.ADULT && !isSrct && typePaxLen >= adultCount) return true;
    if (type === PASSENGER_TYPE.CHILD && typePaxLen >= childCount) return true;
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (type === PASSENGER_TYPE.INFANT && typePaxLen >= infantCount) return true;
    return false;
  };

  // This function will get call on click of any of the saved passenger
  const clickIt = async (index, e, fname, lname) => {
    e.stopPropagation();
    const paxUserFieldData = getValues();
    const userFieldsData = cloneDeep(paxUserFieldData?.userFields);
    // const card = e.target.closest('.sp-slider__input-container');
    // if (!card) return;

    let conditionMet = false;
    // here we are adding isSelected flag to the savedpassenenger object in context to select unselect
    // We are adding userFieldIndex from which we will identify which userField object to set and unset
    let updatedSavedPassengers = savedPassengers.map((pax) => {
      if (pax.firstname === fname && pax.lastname === lname && !conditionMet) {
        const userFieldIndex = whichFieldToFill(
          userFieldsData,
          pax?.type,
          pax?.isSrct,
          pax?.isSelected,
          pax?.userFieldIndex,
        );
        conditionMet = true;
        return {
          ...pax,
          isSelected: !pax?.isSelected,
          userFieldIndex,
        };
      }
      return pax;
    });

    // In saved passenger we are adding isDisabled flag if selected saved passengers are equal to the passenger length
    const selectedPaxList = updatedSavedPassengers.filter((pax) => pax.isSelected === true);
    if (selectedPaxList.length === userFieldsData?.length) {
      updatedSavedPassengers = updatedSavedPassengers.map((pax) => {
        return {
          ...pax,
          isDisabled: !pax.isSelected,
        };
      });
    } else {
      updatedSavedPassengers = updatedSavedPassengers.map((pax, i, arr) => {
        return {
          ...pax,
          isDisabled: shouldUserTypeDisabled(arr, pax.type, pax.isSrct, pax.isSelected) || false,
        };
      });
    }

    // We are getting details for the selected saved passenger which we will update to the user field
    const selectedSavedPax = updatedSavedPassengers[index];

    // const selectedUserFieldIndex = selectedSavedPax.userFieldIndex;

    // Here we are updating the userFields. We are mapping userFieldIndex from selectedSavedPax and
    // updating userField on that index from getValues()
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const updatedPassengers = userFieldsData.map((pax, i) => {
      const newPax = pax;
      if (selectedSavedPax.userFieldIndex === i && selectedSavedPax.isSelected === false) {
        newPax.isFromFavList = false;
        newPax.name.first = '';
        newPax.name.last = '';
        newPax.name.middle = '';
        newPax.gender = '';
        newPax.info.dateOfBirth = '';
        newPax.loyaltyInfo.selfTravel = false;
        newPax.loyaltyInfo.isNominee = false;
        newPax.loyaltyInfo.NomineeId = '';
        if (selectedSavedPax?.isLoggedInUser) {
          newPax.loyaltyInfo.FFN = '';
        }
        return newPax;
      }
      if (selectedSavedPax.userFieldIndex === i) {
        newPax.loyaltyInfo.optLoyaltySignup = false;
        newPax.loyaltyInfo.selfTravel = Boolean(selectedSavedPax?.isLoggedInUser);
        newPax.loyaltyInfo.isNominee = !selectedSavedPax?.isLoggedInUser && Boolean(selectedSavedPax?.nomineeId);
        newPax.loyaltyInfo.NomineeId = !selectedSavedPax?.isLoggedInUser ? selectedSavedPax?.nomineeId : '';
        newPax.loyaltyInfo.FFN = selectedSavedPax?.isLoggedInUser ? loyaltyMemberInfo?.FFN : null;
        newPax.isFromFavList = true;
        newPax.name.first = selectedSavedPax?.firstname || '';
        newPax.name.last = selectedSavedPax?.lastname || '';
        // newPax.name.middle = selectedSavedPax?.title?.toUpperCase() || 'MR';
        newPax.gender = selectedSavedPax?.title.toUpperCase() === 'MR' ? 'Male' : 'Female';
        // eslint-disable-next-line max-len
        const date = `${padNumber(selectedSavedPax?.dobDay)}-${padNumber(selectedSavedPax?.dobMonth)}-${padNumber(selectedSavedPax?.dobYear, 4)}`;
        newPax.info.dateOfBirth = isValidAndNotFutureDate(date) ? date : '';
        newPax.info.gender = selectedSavedPax?.title.toUpperCase() === 'MR' ? 1 : 2;
        return newPax;
      }
      return newPax;
    });

    // dispatching the booking contacts to restore it
    dispatch({
      type: passengerEditActions.SET_BOOKING_CONTACT,
      payload: {
        MobilePhoneCountryCode: paxUserFieldData.countryCode,
        MobilePhone: paxUserFieldData.primaryContact,
        OtherPhoneCountryCode: paxUserFieldData.altCountryCode,
        OtherPhone: paxUserFieldData.altContact,
        isWhatsAppSubscribed: paxUserFieldData.isWhatsAppSubscribed,
        emailAddress: paxUserFieldData.email,
      },
    });

    // setting the updated saved passenger
    dispatch({
      type: passengerEditActions.SET_SAVED_PASSENGERS,
      payload: updatedSavedPassengers,
    });

    // here updating the passenger array in context
    dispatch({
      type: passengerEditActions.SET_PASSENGERS,
      payload: updatedPassengers,
    });

    const selectedFavPax = updatedPassengers.filter((pax) => pax?.isSelected);
    selectPassengers(selectedFavPax);
  };

  return (
    <div className="saved-passengers">
      {isAuthenticated && savedPassengers?.length > 0 ? (
        <>
          <SavedPassengersSlider
            {...props}
            onClickShow={() => setIsSideBarOpen(true)}
            clickIt={clickIt}
          />
          {isSideBarOpen && (
            <SavedPassengersSideBar
              {...props}
              onCloseClick={() => setIsSideBarOpen(false)}
              clickIt={clickIt}
            />
          )}
        </>
      ) : null}
      {/* REMOVING THE BELOW COMPONENT ON REQEST OF INDIGO */}
      {/* {!isAuthenticated && <SavedPassengersBanner {...props} />}  */}
    </div>
  );
}

export default SavedPassengers;
