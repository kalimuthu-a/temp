import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { calculateAge } from 'skyplus-design-system-app/src/functions/utils';
import Checkbox from 'skyplus-design-system-app/dist/des-system/CheckBox';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import { updateMyProfileApi } from '../../../services/myProfile.service';
import { passengerActions } from './PassengerReducer';
import { PassengerContext } from './PassengerContext';
import { getUserCategory } from '../../../utils/utilFunctions';
import './SavedPassengers.scss';

export const RemovePassengers = ({ toggleRemoveMode, selectedPassengers, setSelectedPassengers }) => {
  const { state = {}, dispatch } = useContext(PassengerContext);
  const { filteredCards, isRemoveMode, savedPassengerAemData } = state;
  const editSavedPassenger = savedPassengerAemData?.editPassengerDetailsOptions;
  const imagePresent = false;

  // Function to handle checkbox selection
  const handleSelectPassenger = (index) => {
    setSelectedPassengers((prevSelected) => {
      if (prevSelected.includes(index)) {
        // If already selected, deselect it
        return prevSelected.filter((i) => i !== index);
      }
      // If not selected, add it to the selected list
      return [...prevSelected, index];
    });
  };

  // Handle Remove Passengers
  const handleRemovePassengers = async () => {
    // Map through the filteredCards and mark selected passengers with isDelete: true
    const updatedPassengers = [];
    // filter remove pax .
    filteredCards.forEach((passenger, index) => {
      if (selectedPassengers?.includes(index)) {
        updatedPassengers.push({ ...passenger, isDelete: true });
      }
    });

    // Prepare the payload for the API
    const updatedData = { otp: '', favoriteTravelers: updatedPassengers };
    // const countRemovePassenger = updatedPassengers?.filter((passenger) => passenger.isDelete)?.length;

    try {
      // Call the API to update the profile with the modified passenger list
      const response = await updateMyProfileApi(updatedData);

      if (response?.data?.success) {
        // Dispatch DATA_UPDATED to trigger data refresh
        dispatch({ type: passengerActions.DATA_UPDATED });

        // Show success toast notification
        dispatch({ type: passengerActions.SET_TOAST, payload: true });
        const toastText = savedPassengerAemData?.removePassengerSuccessMessage
          || savedPassengerAemData.removePassengers;
        dispatch({
          type: passengerActions.SET_TOAST_TEXT,
          payload: toastText,
        });

        // Exit remove mode
        dispatch({ type: passengerActions.SET_REMOVE_MODE, payload: false });
      } else {
        // eslint-disable-next-line no-console
        console.log(savedPassengerAemData?.passengerNotRemoved);
        // Optionally, you can dispatch an error toast here
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error removing passengers:', error);
      // Optionally, you can dispatch an error toast here
    }
  };

  const createGenderAgeHTML = (item, age) => {
    let genderValue;

    if (item?.gender === editSavedPassenger?.genderList?.male) {
      genderValue = editSavedPassenger?.genderList?.male;
    } else if (item?.gender === editSavedPassenger?.genderList?.female) {
      genderValue = editSavedPassenger?.genderList?.female;
    } else {
      genderValue = editSavedPassenger?.genderList?.other;
    }

    return `${genderValue} | ${age} ${savedPassengerAemData?.yearLabel}`;
  };

  return (
    <div className="remove-passengers">
      <div className="remove-passenger-header-container">
        <p className="title h5 header">{savedPassengerAemData?.removePassengers}</p>
        <span
          dangerouslySetInnerHTML={{
            __html: savedPassengerAemData?.description?.html,
          }}
        />
      </div>
      <hr />
      <div className="saved-passenger-cards mt-10 ">
        {filteredCards
          && filteredCards?.map((item, index) => {
            const padWithZero = (num) => num.toString().padStart(2, '0');
            const birthDate = `${item?.dobYear}-${padWithZero(item?.dobMonth)}-${padWithZero(item?.dobDay)}`;
            const age = calculateAge(birthDate);

            return (
              <div className="rounded border-1 p-5 border bg-white" key={item.travellerId}>
                <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    {imagePresent ? (
                      <div className="profile-img-avatar">
                        <img src="" alt="Profile" />
                      </div>
                    ) : (
                      <div className="profile-img-avatar">
                        {item?.firstname?.charAt(0).toUpperCase()}
                        {item?.lastname.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="body-medium-regular">{item?.firstname} {item?.lastname}</p>
                      <p className="body-small-regular">
                        {getUserCategory(item, savedPassengerAemData, age)}
                        {createGenderAgeHTML(item, age)}
                      </p>
                    </div>
                  </div>
                  {isRemoveMode && (
                    <div className="removePassengerCb">
                      <Checkbox
                        checked={selectedPassengers.includes(index)}
                        onChangeHandler={() => { handleSelectPassenger(index); }}
                        id={`checkbox-${index}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <div className="remove-passenger-button-container">
        <Button
          variant="outline"
          color="primary"
          size="medium"
          onClick={toggleRemoveMode} // Reset the remove mode and selections
          containerClass="remove-passenger-button"
          classNames="w-100"
        >
          {savedPassengerAemData?.CancelLabel}
        </Button>

        <Button
          variant="filled"
          color="primary"
          size="medium"
          onClick={handleRemovePassengers} // Confirm the removal of selected passengers
          disabled={selectedPassengers.length === 0} // Disable if no passengers are selected
          containerClass="remove-passenger-button"
          classNames="w-100"
        >
          {savedPassengerAemData?.removeLabel}
        </Button>

      </div>
    </div>
  );
};

RemovePassengers.propTypes = {
  toggleRemoveMode: PropTypes.func,
  selectedPassengers: PropTypes.object,
  setSelectedPassengers: PropTypes.func,
};

export default RemovePassengers;
