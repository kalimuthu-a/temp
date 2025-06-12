/* eslint-disable sonarjs/cognitive-complexity */
import React, { useContext, useEffect, useState } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import { calculateAge } from 'skyplus-design-system-app/src/functions/utils';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import EditSavedPassenger from './EditSavedPassengers';
import { PassengerContext } from './PassengerContext';
import { passengerActions } from './PassengerReducer';
import {
  getMyProfileApi,
  getCountryList,
} from '../../../services/myProfile.service';
import { getSavedPassengerAemData } from '../../../services/savedPassenger.service';
import regexConstant from '../../../constants/regex';
import { RemovePassengers } from './RemovePassengers';
import Loader from '../../../components/common/Loader/Loader';
import { capitalize, dobMinMaxDate, getUserCategory } from '../../../utils/utilFunctions';

export const SavedPassengers = () => {
  const { state = {}, dispatch } = useContext(PassengerContext);
  const {
    isOpenedSidebar,
    savedPassengerAemData,
    filteredCards,
    searchTerm,
    showToast,
    toastText,
    isRemoveMode,
    dataVersion,
  } = state;
  const [selectedPassengers, setSelectedPassengers] = useState([]); // Track selected passengers
  const [loader, setLoader] = useState(false);
  const editSavedPassenger = savedPassengerAemData?.editPassengerDetailsOptions;
  const addPassengerText = savedPassengerAemData?.addPassengerText;

  const validateField = (field, value) => {
    let errorText = '';

    switch (field) {
      case 'firstname':
      case 'lastname':
      case 'name':
      case 'GSTName':
        if (value && !value.match(regexConstant.NAME_ONLY_ALPHABET_SPACE_NEW)) {
          errorText = `${capitalize(field)} ${savedPassengerAemData?.alphabetsSpaces}`;
        }
        break;
      case 'dateOfBirth':
      case 'expiryDate':
        if (value) {
          const inputDateParts = value.split('-');
          const [day, month, year] = inputDateParts;
          // Check if the date is in the correct format and is valid (DD-MM-YYYY)
          if (!regexConstant.INPUT_DATE_DDMMYYYY.test(value)) {
            errorText = `${capitalize(field)} ${savedPassengerAemData?.datePatternText}`;
            break;
          }
          // Convert to number and check if the day, month, and year are valid numbers
          const dayNum = parseInt(day, 10);
          const monthNum = parseInt(month, 10) - 1;
          const yearNum = parseInt(year, 10);
          // Validate the month
          if (monthNum < 0 || monthNum > 11) {
            errorText = `${savedPassengerAemData?.invalidDateLabel}`;
            break;
          }
          // convert into valid date
          const dateObj = new Date(yearNum, monthNum, dayNum);
          // Check if the day is valid for the given month (e.g., February 30 is invalid)
          if (dateObj.getDate() !== dayNum) {
            errorText = `${savedPassengerAemData?.invalidDateLabel}`;
            break;
          }
          // Check for invalid date range (min/max validation)
          const { minDate, maxDate } = dobMinMaxDate();
          const inputNewDate = new Date(yearNum, monthNum, dayNum);
          if (inputNewDate < minDate || inputNewDate > maxDate) {
            errorText = `${savedPassengerAemData?.invalidDateLabel}`;
          }
        }
        break;
      case 'phone':
      case 'number':
        if (value && !value.match(regexConstant.PHONE)) {
          errorText = savedPassengerAemData?.validPhoneNumber;
        }
        break;
      case 'passportNumber':
      case 'GSTNumber':
        if (value && !value.match(regexConstant.ALPHA_NUMERIC)) {
          errorText = `${field} ${savedPassengerAemData?.alphanumericText} `;
        }
        break;
      case 'email':
      case 'GSTEmail':
        if (value && !value.match(regexConstant.EMAIL)) {
          errorText = savedPassengerAemData?.validEmailAddress;
        }
        break;
      default:
        break;
    }

    dispatch({
      type: passengerActions.SET_ERRORS,
      payload: { [field]: errorText },
    });
    return errorText;
  };

  const editSavedPassengerProps = { validateField };

  const imagePresent = false;
  const handleCardClick = (card, index) => {
    const data = { ...card, index };
    dispatch({ type: passengerActions.SET_SELECTED_CARD, payload: data });
    dispatch({ type: passengerActions.SET_IS_OPENED_SIDEBAR, payload: true });
    dispatch({ type: passengerActions.SET_MODE, payload: 'edit' }); // set mode to "edit"
    dispatch({ type: passengerActions.SET_FORM_STATE, payload: card }); // Set form state to selected card
  };

  const onCloseHandler = () => {
    dispatch({ type: passengerActions.SET_IS_OPENED_SIDEBAR, payload: false });
    dispatch({ type: passengerActions.SET_REMOVE_MODE, payload: false });
    dispatch({ type: passengerActions.SET_SELECTED_CARD, payload: null });
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    dispatch({ type: passengerActions.SET_SEARCH_TERM, payload: value.replace(/[^a-zA-Z0-9\s]/g, '') });
    dispatch({ type: passengerActions.FILTER_CARDS });
  };
  const fetchProfileData = async () => {
    setLoader(true);
    const data = await getMyProfileApi();
    dispatch({ type: passengerActions.SET_PROFILE_DATA, payload: data?.data });
    dispatch({
      type: passengerActions.SET_ORIGINAL_PROFILE_DATA,
      payload: data?.data,
    });
    dispatch({ type: passengerActions.SET_SEARCH_TERM, payload: '' });
    dispatch({ type: passengerActions.FILTER_CARDS });
    const countryList = await getCountryList();
    dispatch({ type: passengerActions.SET_COUNTRY_LIST, payload: countryList });
    const savedPassengerAemlabels = await getSavedPassengerAemData();
    dispatch({
      type: passengerActions.SET_SAVED_PASSENGER_AEM_DATA,
      payload: savedPassengerAemlabels,
    });
    setLoader(false);
  };
  useEffect(() => {
    fetchProfileData();
  }, [dataVersion]);

  const handleAddPassenger = () => {
    // Initialize a new passenger object with default/empty values
    const newPassenger = {
      travellerId: 0,
      gender: '',
      firstname: '',
      lastname: '',
      dobYear: '',
      dobMonth: '',
      dobDay: '',
      isDelete: false,
    };

    dispatch({ type: passengerActions.SET_FORM_STATE, payload: newPassenger });
    dispatch({ type: passengerActions.SET_SELECTED_CARD, payload: null });
    dispatch({ type: passengerActions.SET_MODE, payload: 'add' }); // Set mode to "add"
    dispatch({ type: passengerActions.SET_IS_OPENED_SIDEBAR, payload: true });
  };

  // Toggle Remove Mode
  const toggleRemoveMode = () => {
    dispatch({
      type: passengerActions.SET_REMOVE_MODE,
      payload: !isRemoveMode,
    });
    setSelectedPassengers([]); // Reset selected passengers
  };

  return (
    <div className="saved-passengers mb-20">
      {loader ? <Loader /> : null}
      <div className="saved-passengers-title">
        <h4 className="h4 mb-20 header">{savedPassengerAemData?.title}</h4>
      </div>
      <div className="skyplus-addon-filter__search rounded-pill p-5 border bg-color">
        <i className="icon-search me-5  position-absolute" />
        <input
          type="text"
          name={savedPassengerAemData?.searchLabel}
          autoComplete="off"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="d-block w-100 ps-12"
        />
      </div>

      <div className="saved-passenger-cards mt-10">
        {filteredCards
          && filteredCards.map((item, index) => {
            const padWithZero = (num) => num.toString().padStart(2, '0');
            const birthDate = `${item?.dobYear}-${padWithZero(item?.dobMonth)}-${padWithZero(item?.dobDay)}`;
            // handle NAN for options dates
            const age = new Date(birthDate)?.toString() !== 'Invalid Date' ? calculateAge(birthDate) : '';

            const gender = item?.gender;
            let genderText = '';

            if (gender === editSavedPassenger?.genderList?.male) {
              genderText = editSavedPassenger?.genderList?.male;
            } else if (gender === editSavedPassenger?.genderList?.female) {
              genderText = editSavedPassenger?.genderList?.female;
            } else {
              genderText = editSavedPassenger?.genderList?.other;
            }

            return (
              <div className="rounded border-1 p-5 border passenger-card" key={item?.travellerId}>
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
                      <p className="body-medium-regular">
                        {item?.firstname} {item?.lastname}
                      </p>
                      <p className="body-small-regular card-sub-heading">
                        {age && getUserCategory(item, savedPassengerAemData, age)}
                        {genderText} {' '}
                        {age && `| ${age} ${savedPassengerAemData?.yearLabel}`}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className="edit-link"
                      onClick={() => handleCardClick(item, index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleCardClick(item, index);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                    >
                      EDIT
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {isOpenedSidebar && (
        <OffCanvas onClose={onCloseHandler}>
          <EditSavedPassenger {...editSavedPassengerProps} />
        </OffCanvas>
      )}
      {isRemoveMode && (
        <OffCanvas onClose={onCloseHandler} containerClassName="slide-from-bottom">
          <RemovePassengers
            toggleRemoveMode={toggleRemoveMode}
            selectedPassengers={selectedPassengers}
            setSelectedPassengers={setSelectedPassengers}
          />
        </OffCanvas>
      )}

      {showToast && (
        <div className="compact-toast-wrapper">
          <Toast
            variation="notifi-variation--Success"
            containerClass="compact-toast"
            description={toastText}
            autoDismissTimeer={5000}
            infoIconClass="icon-check text-forest-green"
            onClose={() => dispatch({ type: passengerActions.SET_TOAST, payload: false })}
          />
        </div>
      )}

      <div className="skyplus-remove-passenger__button-container">
        {filteredCards?.length > 0 && (
          <Button
            variant="outline"
            color="primary"
            size="medium"
            onClick={toggleRemoveMode} // Enter remove mode
            containerClass="skyplus-remove-passenger__button"
          >
            {savedPassengerAemData?.removePassengers}
          </Button>
        )}
      </div>

      {!isRemoveMode && (
        <div className="skyplus-add-passenger__button">
          <Button
            variant="filled"
            color="primary"
            size="medium"
            onClick={handleAddPassenger}
          >
            {addPassengerText}{' '}
          </Button>
        </div>
      )}
    </div>
  );
};
SavedPassengers.propTypes = {};
export default SavedPassengers;
