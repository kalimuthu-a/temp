/* eslint-disable no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import BasicDetails from './BasicDetails';
import { PassengerContext } from './PassengerContext';
import { passengerActions } from './PassengerReducer';
import { updateMyProfileApi } from '../../../services/myProfile.service';

function EditSavedPassenger({ validateField }) {
  const { state, dispatch } = useContext(PassengerContext);
  const {
    profileData,
    userType,
    isButtonDisabled,
    mode,
    selectedCard,
    formData,
    savedPassengerAemData,
  } = state;
  const [buttonLoader, setButtonLoader] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const fieldsToCheck = [
    'dobDay',
    'dobMonth',
    'dobYear',
    'firstname',
    'gender',
    'lastname',
  ];

  const trimStrings = (obj) => {
    if (isArray(obj)) {
      return obj.map(trimStrings);
    }
    if (isObject(obj) && obj !== null) {
      return mapValues(obj, trimStrings);
    }
    if (isString(obj)) {
      return obj.trim();
    }
    return obj;
  };

  const isDuplicateInAddMode = (formData, favoriteTravelers, fields) => {
    return favoriteTravelers?.some((existingPassenger) => {
      const existingSpecifiedFields = pick(
        trimStrings(existingPassenger),
        fields,
      );
      const formSpecifiedFields = pick(trimStrings(formData), fields);
      return isEqual(existingSpecifiedFields, formSpecifiedFields);
    });
  };

  const isDuplicateInEditMode = (
    formData,
    favoriteTravelers,
    fields,
    selectedIndex,
  ) => {
    return favoriteTravelers?.some((existingPassenger, index) => {
      if (index === selectedIndex) return false; // Exclude the passenger being edited
      const existingSpecifiedFields = pick(
        trimStrings(existingPassenger),
        fields,
      );
      const formSpecifiedFields = pick(trimStrings(formData), fields);
      return isEqual(existingSpecifiedFields, formSpecifiedFields);
    });
  };

  const hasNonEmptyFields = (formData, fields) => {
    return fields.some((field) => {
      const value = formData[field];
      return typeof value === 'string'
        ? value !== ''
        : value !== null && value !== undefined;
    });
  };

  useEffect(() => {
    let originalData = {};

    if (mode === 'edit') {
      // Get the original data of the selected passenger
      originalData = profileData?.FavoriteTraveler[selectedCard?.index] || {};
    } else if (mode === 'add') {
      // For add mode, there's no original data to compare with
      originalData = {};
    }

    // Normalize both original and form data by trimming strings
    const normalizedOriginal = trimStrings(originalData);
    const normalizedForm = trimStrings(formData);

    if (mode === 'add') {
      // **Add Mode**: Check for duplicates among all existing passengers based on specified fields
      const isDuplicate = isDuplicateInAddMode(
        normalizedForm,
        profileData?.FavoriteTraveler,
        fieldsToCheck,
      );

      // Check if the specified fields have any non-empty values
      const hasFields = hasNonEmptyFields(normalizedForm, fieldsToCheck);

      // **Disable** the button if:
      // - The new passenger data matches an existing passenger (isDuplicate)
      // - There are no non-empty specified fields in the form (!hasFields)
      setIsSaveButtonDisabled(isDuplicate || !hasFields);
    } else if (mode === 'edit') {
      // **Edit Mode**: Check if form data has changed from original
      const isEqualData = isEqual(normalizedOriginal, normalizedForm);

      // **Edit Mode**: Check for duplicates among all existing passengers excluding the one being edited
      const isDuplicate = isDuplicateInEditMode(
        normalizedForm,
        profileData?.FavoriteTraveler,
        fieldsToCheck,
        selectedCard?.index,
      );

      // **Disable** the button if:
      // - No changes are made to the form data (isEqualData)
      // - The updated specified fields match another passenger's data (isDuplicate)
      setIsSaveButtonDisabled(isEqualData || isDuplicate);
    }
  }, [formData, profileData, mode, selectedCard?.index]);

  // Function to handle form changes
  const handleChange = (field, subfield, value) => {
    if (typeof value === 'object' && value !== null) {
      // Batched update
      const updatedFormData = { ...state.formData, ...value };
      dispatch({
        type: passengerActions.SET_FORM_STATE,
        payload: updatedFormData,
      });
    } else {
      // Single field update
      const updatedFormData = { ...state.formData, [field]: value };
      dispatch({
        type: passengerActions.SET_FORM_STATE,
        payload: updatedFormData,
      });
    }

    // Call validateField for each field in batched updates
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((key) => {
        validateField(key, value[key]);
      });
    } else {
      validateField(field, value);
    }
  };

  const addPassenger = async () => {
    // Handle Add Passenger
    const newPassenger = state.formData;
    if (newPassenger && Object.keys(newPassenger).length > 0) {
      if (newPassenger?.gender === savedPassengerAemData?.editPassengerDetailsOptions?.genderList?.male) {
        newPassenger.title = savedPassengerAemData?.mrMsLabel?.mr;
      } else if (newPassenger?.gender === savedPassengerAemData?.editPassengerDetailsOptions?.genderList?.female) {
        newPassenger.title = savedPassengerAemData?.mrMsLabel?.mrs;
      }
      // Prepare the updated passengers array
      const updatedPassengers = [
        newPassenger,
      ];
      // Prepare the payload for the API
      const payload = {
        otp: '',
        favoriteTravelers: updatedPassengers,
      };

      try {
        const response = await updateMyProfileApi(payload);
        if (response?.data?.success) {
          dispatch({
            type: passengerActions.SET_IS_OPENED_SIDEBAR,
            payload: false,
          });
          dispatch({ type: passengerActions.SET_TOAST, payload: true });
          dispatch({
            type: passengerActions.SET_TOAST_TEXT,
            payload: savedPassengerAemData?.passengerAdded,
          });

          // Dispatch DATA_UPDATED to trigger data refresh
          dispatch({ type: passengerActions.DATA_UPDATED });
        } else {
          // eslint-disable-next-line no-console
          console.log(savedPassengerAemData?.passengerNotAdded);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(savedPassengerAemData?.noChangesInForm);
    }
  };

  const editPassenger = async () => {
    // Handle Edit Passenger
    const updatedPassenger = state.formData;
    if (updatedPassenger && Object.keys(updatedPassenger).length > 0) {
      if (updatedPassenger?.gender === savedPassengerAemData?.editPassengerDetailsOptions?.genderList?.male) {
        updatedPassenger.title = savedPassengerAemData?.mrMsLabel?.mr;
      } else if (updatedPassenger?.gender === savedPassengerAemData?.editPassengerDetailsOptions?.genderList?.female) {
        updatedPassenger.title = savedPassengerAemData?.mrMsLabel?.mrs;
      }
      // Prepare the payload for the API
      const payload = {
        otp: '',
        favoriteTravelers: [updatedPassenger],
      };

      try {
        const response = await updateMyProfileApi(payload);
        if (response?.data?.success) {
          dispatch({
            type: passengerActions.SET_IS_OPENED_SIDEBAR,
            payload: false,
          });
          dispatch({ type: passengerActions.SET_TOAST, payload: true });
          dispatch({
            type: passengerActions.SET_TOAST_TEXT,
            payload: savedPassengerAemData?.passengerUpdated,
          });

          // Dispatch DATA_UPDATED to trigger data refresh
          dispatch({ type: passengerActions.DATA_UPDATED });
        } else {
          // eslint-disable-next-line no-console
          console.log(savedPassengerAemData?.passengerNotUpdated);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(savedPassengerAemData?.noChangesInForm);
    }
  };

  const handleButtonClick = async () => {
    setButtonLoader(true);
    if (mode === 'add') {
      await addPassenger();
    } else {
      await editPassenger();
    }
    setButtonLoader(false);
  };

  const basicDetailsProps = { userType };
  // const contactProps = { userType };

  useEffect(() => {
    const { dobDay, dobMonth, dobYear, firstname, lastname, gender } = state?.formData || {};

    // Validation for dobDay, dobMonth, dobYear
    const isDobFieldsFilled = dobDay || dobMonth || dobYear;

    // Validate if any one of them has a value
    const areDobFieldsValid = isDobFieldsFilled
      ? dobDay && dobMonth && dobYear && dobYear.length === 4
      : true; // No validation on DOB fields if they are not filled

    // Validate other fields (firstname, lastname, gender) if DOB fields are not involved
    const areOtherFieldsValid = firstname && lastname && gender;

    // If only DOB fields are filled and the other fields are empty, disable the save button
    // If DOB fields are involved, validate them, otherwise validate the other fields only
    const shouldDisableSaveButton = (isDobFieldsFilled && (firstname === '' || lastname === '' || gender === ''))
      || (isDobFieldsFilled ? !areDobFieldsValid : !areOtherFieldsValid);

    setIsSaveButtonDisabled(shouldDisableSaveButton);
  }, [state?.formData]);

  return (
    <div className="edit-saved-passengers">
      <div className="my-profile1">
        <p className="h5 header mt-12">
          {mode === 'add'
            ? savedPassengerAemData?.addPassengerDetails
            : savedPassengerAemData?.editPassengerDetails}
        </p>
      </div>
      <BasicDetails
        {...basicDetailsProps}
        onChange={handleChange}
        data={state?.formData}
        validateField={validateField}
        setButtonDisable={setButtonDisable}
      />
      {/* PLEASE DO NOT REMOVE THIS CODE, CURRENTLY API DOES NOT INCLUDE THESE FIELDS SO THEY ARE COMMENTED */}
      {/* <ContactDetails {...contactProps} onChange={handleChange}
        data={state?.formData} validateField={validateField} s /> */}
      <div className="save-button-container">
        <Button
          containerClass="save-button"
          onClick={handleButtonClick}
          disabled={isButtonDisabled || isSaveButtonDisabled || buttonDisable}
          variant="filled"
          color="primary"
          loading={buttonLoader}
          classNames="w-100"
        >
          {savedPassengerAemData?.editPassengerDetailsOptions?.saveChangesLabel}
        </Button>
      </div>
    </div>
  );
}
EditSavedPassenger.propTypes = {
  validateField: PropTypes.func.isRequired,
};
export default EditSavedPassenger;
